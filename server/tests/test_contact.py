import io
import json
import smtplib
import psycopg
import unittest
from unittest.mock import MagicMock, patch
from uuid import uuid4

from server.app import app, create_app
from server.models import ContactError, ContactMessage
from server.mailer import forward_message
from server.service import ContactService, SUCCESS_MESSAGE
from server.settings import Settings


class ContactTests(unittest.TestCase):
    def setUp(self):
        self.settings = Settings(
            database_url="postgresql://test:test@example.test/neondb?sslmode=require",
            api_key="test-secret-" * 4,
            smtp_host="smtp.example.test",
            smtp_port=587,
            smtp_username="test",
            smtp_password="test-only",
            smtp_from="sender@example.test",
        )
        self.payload = {"name": "Alex", "email": "alex@example.test", "subject": "AI project", "message": "Can we discuss an engineering project?"}
        self.message = ContactMessage.parse(self.payload)
        self.service = ContactService(self.settings)
        self.request_id = str(uuid4())
        self.connection = MagicMock()
        self.existing = None
        self.recent_count = 0
        def execute(statement, *args):
            cursor = MagicMock()
            if "SELECT fingerprint" in statement:
                cursor.fetchone.return_value = self.existing
            elif "SELECT COUNT" in statement:
                cursor.fetchone.return_value = {"count": self.recent_count}
            return cursor
        self.connection.execute.side_effect = execute
        self.connect_patch = patch("server.service.connect", return_value=self.connection)
        self.connect_mock = self.connect_patch.start()
        self.addCleanup(self.connect_patch.stop)

    def inserts(self):
        return [call for call in self.connection.execute.call_args_list
                if call.args[0].startswith("INSERT")]

    def test_deployment_entrypoint_delegates_to_configured_wsgi_app(self):
        application = MagicMock(return_value=[b"ok"])
        start_response = MagicMock()
        with patch("server.app._configured_application", return_value=application):
            result = app({"PATH_INFO": "/health"}, start_response)
        self.assertEqual(result, [b"ok"])
        application.assert_called_once_with({"PATH_INFO": "/health"}, start_response)

    @patch("server.service.forward_message")
    def test_forward_happens_before_insert_and_success_is_persisted(self, forward):
        def verify_order(*args):
            self.assertEqual(self.inserts(), [])
            self.connection.commit.assert_not_called()
        forward.side_effect = verify_order
        result = self.service.submit(self.message, self.request_id)
        self.assertEqual(result, {"success": True, "message": SUCCESS_MESSAGE})
        self.assertEqual(len(self.inserts()), 1)
        self.assertEqual(self.inserts()[0].args[1][5], self.message.message)
        self.connection.commit.assert_called_once()
        self.connection.close.assert_called_once()
        locks = [call.args[1][0] for call in self.connection.execute.call_args_list
                 if "pg_advisory_xact_lock" in call.args[0]]
        self.assertEqual(locks, ["request:" + self.request_id, "email:" + self.message.email])

    @patch("server.service.forward_message", side_effect=smtplib.SMTPException("Rejected"))
    def test_mail_failure_does_not_save_or_report_success(self, forward):
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, self.request_id)
        self.assertEqual(failure.exception.status, 502)
        self.assertEqual(self.inserts(), [])
        self.connection.commit.assert_not_called()

    @patch("server.service.forward_message")
    def test_retry_after_success_does_not_send_twice(self, forward):
        self.service.submit(self.message, self.request_id)
        self.existing = {"fingerprint": self.message.fingerprint()}
        self.service.submit(self.message, self.request_id)
        forward.assert_called_once()
        self.assertEqual(len(self.inserts()), 1)

    @patch("server.service.forward_message")
    def test_reused_identifier_with_changed_message_is_rejected(self, forward):
        self.service.submit(self.message, self.request_id)
        self.existing = {"fingerprint": self.message.fingerprint()}
        changed = ContactMessage.parse({**self.payload, "message": "Different content"})
        with self.assertRaises(ContactError) as failure:
            self.service.submit(changed, self.request_id)
        self.assertEqual(failure.exception.status, 409)
        forward.assert_called_once()

    @patch("server.service.forward_message")
    def test_storage_failure_after_forward_does_not_claim_complete_success(self, forward):
        execute_before = self.connection.execute.side_effect
        def execute(statement, *args):
            if statement.startswith("INSERT"):
                raise psycopg.OperationalError("Simulated database failure")
            return execute_before(statement, *args)
        self.connection.execute.side_effect = execute
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, self.request_id)
        self.assertEqual(failure.exception.code, "forwarded_not_stored")
        forward.assert_called_once()
        self.connection.commit.assert_not_called()
        self.connection.close.assert_called_once()

    @patch("server.service.forward_message")
    def test_database_failure_before_forward_never_sends_email(self, forward):
        self.connect_mock.side_effect = psycopg.OperationalError("Unavailable")
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, self.request_id)
        self.assertEqual(failure.exception.status, 503)
        forward.assert_not_called()

    @patch("server.service.forward_message")
    def test_commit_failure_after_forward_never_reports_success(self, forward):
        self.connection.commit.side_effect = psycopg.OperationalError("Connection lost")
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, self.request_id)
        self.assertEqual(failure.exception.code, "forwarded_not_stored")
        forward.assert_called_once()
        self.connection.close.assert_called_once()

    def test_validation_rejects_headers_bad_email_and_blank_messages(self):
        for change in [{"name": "Alex\nBcc: someone"}, {"email": "bad"}, {"message": "  "}, {"message": "x" * 5001}]:
            with self.subTest(change=list(change)):
                with self.assertRaises(ContactError):
                    ContactMessage.parse({**self.payload, **change})

    @patch("server.mailer.smtplib.SMTP")
    def test_smtp_uses_tls_fixed_recipient_and_visitor_reply_to(self, smtp):
        client = smtp.return_value
        client.send_message.return_value = {}
        forward_message(self.message, self.request_id, self.settings)
        client.starttls.assert_called_once()
        client.login.assert_called_once_with("test", "test-only")
        email = client.send_message.call_args.args[0]
        self.assertEqual(email["To"], "info@ekosamuel.com")
        self.assertEqual(email["Reply-To"], self.message.email)
        self.assertEqual(client.send_message.call_args.kwargs["to_addrs"], ["info@ekosamuel.com"])
        client.close.assert_called_once()

    def request(self, body=None, api_key=None):
        raw = json.dumps(self.payload if body is None else body).encode()
        environment = {
            "PATH_INFO": "/api/contact", "REQUEST_METHOD": "POST",
            "CONTENT_TYPE": "application/json", "CONTENT_LENGTH": str(len(raw)),
            "HTTP_X_CONTACT_API_KEY": self.settings.api_key if api_key is None else api_key,
            "HTTP_IDEMPOTENCY_KEY": self.request_id, "wsgi.input": io.BytesIO(raw),
        }
        response = {}
        def start_response(status, headers):
            response["status"] = int(status.split()[0])
        response["body"] = json.loads(b"".join(create_app(self.settings)(environment, start_response)))
        return response

    @patch("server.service.forward_message")
    def test_api_success_and_authentication(self, forward):
        self.assertEqual(self.request(api_key="wrong")["status"], 401)
        forward.assert_not_called()
        response = self.request()
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["body"]["message"], SUCCESS_MESSAGE)

    @patch("server.service.forward_message")
    def test_api_validation_never_forwards(self, forward):
        self.assertEqual(self.request({**self.payload, "email": "invalid"})["status"], 400)
        forward.assert_not_called()

    @patch("server.service.forward_message")
    def test_rate_limit_after_five_successful_submissions(self, forward):
        self.recent_count = 5
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, str(uuid4()))
        self.assertEqual(failure.exception.status, 429)
        forward.assert_not_called()


if __name__ == "__main__":
    unittest.main()
