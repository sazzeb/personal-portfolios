import io
import json
import smtplib
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch
from uuid import uuid4

from server.app import create_app
from server.database import connect
from server.models import ContactError, ContactMessage
from server.mailer import forward_message
from server.service import ContactService, SUCCESS_MESSAGE
from server.settings import Settings


class ContactTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.settings = Settings(
            database_path=Path(self.directory.name) / "messages.sqlite3",
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

    def count_messages(self):
        connection = connect(self.settings.database_path)
        try:
            return connection.execute("SELECT COUNT(*) FROM contact_messages").fetchone()[0]
        finally:
            connection.close()

    @patch("server.service.forward_message")
    def test_forward_happens_before_insert_and_success_is_persisted(self, forward):
        def verify_order(*args):
            self.assertEqual(self.count_messages(), 0)
        forward.side_effect = verify_order
        result = self.service.submit(self.message, self.request_id)
        self.assertEqual(result, {"success": True, "message": SUCCESS_MESSAGE})
        self.assertEqual(self.count_messages(), 1)
        connection = connect(self.settings.database_path)
        self.addCleanup(connection.close)
        row = connection.execute("SELECT * FROM contact_messages").fetchone()
        self.assertEqual(row["message"], self.message.message)
        self.assertTrue(row["forwarded_at"])

    @patch("server.service.forward_message", side_effect=smtplib.SMTPException("Rejected"))
    def test_mail_failure_does_not_save_or_report_success(self, forward):
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, self.request_id)
        self.assertEqual(failure.exception.status, 502)
        self.assertEqual(self.count_messages(), 0)

    @patch("server.service.forward_message")
    def test_retry_after_success_does_not_send_twice(self, forward):
        self.service.submit(self.message, self.request_id)
        self.service.submit(self.message, self.request_id)
        forward.assert_called_once()
        self.assertEqual(self.count_messages(), 1)

    @patch("server.service.forward_message")
    def test_reused_identifier_with_changed_message_is_rejected(self, forward):
        self.service.submit(self.message, self.request_id)
        changed = ContactMessage.parse({**self.payload, "message": "Different content"})
        with self.assertRaises(ContactError) as failure:
            self.service.submit(changed, self.request_id)
        self.assertEqual(failure.exception.status, 409)
        forward.assert_called_once()

    @patch("server.service.forward_message")
    def test_storage_failure_after_forward_does_not_claim_complete_success(self, forward):
        connection = connect(self.settings.database_path)
        wrapped = MagicMock(wraps=connection)
        def execute(statement, *args):
            if statement.startswith("INSERT"):
                raise sqlite3.OperationalError("Simulated disk failure")
            return connection.execute(statement, *args)
        wrapped.execute.side_effect = execute
        with patch("server.service.connect", return_value=wrapped):
            with self.assertRaises(ContactError) as failure:
                self.service.submit(self.message, self.request_id)
        self.assertEqual(failure.exception.code, "forwarded_not_stored")
        forward.assert_called_once()
        self.assertEqual(self.count_messages(), 0)

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
        for _ in range(5):
            self.service.submit(self.message, str(uuid4()))
        with self.assertRaises(ContactError) as failure:
            self.service.submit(self.message, str(uuid4()))
        self.assertEqual(failure.exception.status, 429)
        self.assertEqual(forward.call_count, 5)


if __name__ == "__main__":
    unittest.main()
