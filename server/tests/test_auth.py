"""Authentication boundaries and password/token handling without external services."""

import io
import json
import secrets
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch

from server.app import create_app
from server.auth_security import PASSWORD_HASHER, new_password, token_hash, valid_token, verify_password
from server.models import ContactError


class AuthTests(unittest.TestCase):
    def test_passwords_are_salted_argon2id_and_verify(self):
        password = "a long unique passphrase"
        encoded = PASSWORD_HASHER.hash(password)
        self.assertTrue(encoded.startswith("$argon2id$"))
        self.assertNotEqual(encoded, PASSWORD_HASHER.hash(password))
        self.assertNotIn(password, encoded)
        self.assertTrue(verify_password(encoded, password))
        self.assertFalse(verify_password(encoded, "wrong password"))

    def test_password_policy_and_tokens(self):
        for password in ("short", "x" * 129, "bad\x00password"):
            with self.assertRaises(ContactError):
                new_password({"password": password})
        token = secrets.token_urlsafe(32)
        self.assertTrue(valid_token(token))
        self.assertFalse(valid_token("invalid"))
        self.assertNotEqual(token_hash(token), token)

    def test_api_key_required_before_account_processing(self):
        body = json.dumps({"email": "test@example.com", "password": "long passphrase"}).encode()
        environment = {
            "PATH_INFO": "/api/auth/login", "REQUEST_METHOD": "POST",
            "CONTENT_TYPE": "application/json", "CONTENT_LENGTH": str(len(body)),
            "wsgi.input": io.BytesIO(body),
        }
        respond = Mock()
        with patch("server.auth_http.AuthService") as service:
            result = b"".join(create_app(SimpleNamespace(api_key="test-key"))(environment, respond))
        self.assertEqual(respond.call_args.args[0], "401 Unauthorized")
        self.assertFalse(json.loads(result)["success"])
        service.assert_not_called()

    def test_authorized_json_dispatches_without_contact_idempotency_header(self):
        raw = b'{"email":"test@example.com","password":"long passphrase"}'
        respond = Mock()
        environment = {
            "PATH_INFO": "/api/auth/login", "REQUEST_METHOD": "POST",
            "CONTENT_TYPE": "application/json", "CONTENT_LENGTH": str(len(raw)),
            "HTTP_X_CONTACT_API_KEY": "test-key", "wsgi.input": io.BytesIO(raw),
        }
        with patch("server.auth_http.AuthService") as service:
            service.return_value.dispatch.return_value = {"success": True}
            result = b"".join(create_app(SimpleNamespace(api_key="test-key"))(environment, respond))
        self.assertEqual(respond.call_args.args[0], "200 OK")
        self.assertTrue(json.loads(result)["success"])
        self.assertEqual(service.return_value.dispatch.call_args.args[0], "login")

class ValidationTests(unittest.TestCase):
    def test_name_validation_and_unicode_normalization(self):
        from server.auth_security import full_name
        self.assertEqual(full_name({'name': "  José  O’Neil  "}), "José O’Neil")
        for value in ('', '1', 'A', '<script>', 'John\nDoe', 'User123'):
            with self.subTest(value=value), self.assertRaises(ContactError):
                full_name({'name': value})

    def test_email_normalization_and_invalid_formats(self):
        from server.auth_security import email_address
        self.assertEqual(email_address({'email': '  Person+tag@EXAMPLE.com  '}), 'person+tag@example.com')
        for value in ('a..b@example.com', 'person@localhost', 'a@example.invalid', 'a@', 'a b@example.com', 'a\n@example.com', 'é@example.com'):
            with self.subTest(value=value), self.assertRaises(ContactError):
                email_address({'email': value})

    def test_common_and_repeated_passwords_are_rejected(self):
        for value in ('Password123456789!', 'aaaaaaaaaaaaaaaaaaaa', '12345678901234567890', 'correct horse battery staple'):
            with self.subTest(value=value), self.assertRaises(ContactError):
                new_password({'password':value, 'confirmPassword':value})

    def test_unique_passphrase_and_confirmation(self):
        value = 'Velvet! orbital canoe 92 quartz'
        self.assertEqual(new_password({'password':value,'confirmPassword':value}), value)
        for confirmation in ('different', ''):
            with self.assertRaises(ContactError):
                new_password({'password':value,'confirmPassword':confirmation})

    def test_code_digest_is_bound_to_link_and_server_secret(self):
        from server.auth_security import reset_code_hash
        digest = reset_code_hash('token', '123456', 'secret')
        self.assertNotIn('123456', digest)
        self.assertNotEqual(digest, reset_code_hash('other', '123456', 'secret'))
        self.assertNotEqual(digest, reset_code_hash('token', '123456', 'other'))

class SessionPolicyTests(unittest.TestCase):
    def test_missing_session_never_opens_database(self):
        from server.auth_service import AuthService
        with patch('server.auth_service.connect') as storage:
            for action in ('session', 'dashboard', 'activity'):
                with self.assertRaises(ContactError):
                    AuthService(SimpleNamespace()).dispatch(action, 'POST' if action == 'activity' else 'GET', {}, '', 'test')
            storage.assert_not_called()

    def setUp(self):
        from server.auth_service import AuthService
        self.service = AuthService(SimpleNamespace())

    def test_malformed_session_is_rejected_before_storage(self):
        connection = Mock()
        with self.assertRaises(ContactError):
            self.service.session_details(connection, 'bad-token')
        connection.execute.assert_not_called()

    def test_expired_sessions_cannot_be_read_or_renewed(self):
        for touch in (False, True):
            connection = Mock()
            connection.execute.return_value.fetchone.return_value = None
            with self.assertRaises(ContactError) as failure:
                self.service.session_details(connection, secrets.token_urlsafe(32), touch)
            self.assertEqual(failure.exception.status, 401)
            sql = connection.execute.call_args.args[0]
            self.assertIn("s.expires_at > NOW()", sql)
            self.assertIn("INTERVAL '15 minutes'", sql)
            self.assertIn("INTERVAL '8 hours'", sql)

    def test_passive_checks_do_not_extend_session(self):
        from datetime import datetime, timezone, timedelta
        now = datetime.now(timezone.utc)
        connection = Mock()
        connection.execute.return_value.fetchone.return_value = {
            'id':'user','name':'Test','email':'person@example.com',
            'created_at':now-timedelta(hours=1), 'last_seen_at':now-timedelta(minutes=5),
            'expires_at':now+timedelta(hours=7), 'server_time':now.timestamp(),
        }
        user, timing = self.service.session_details(connection, secrets.token_urlsafe(32))
        self.assertEqual(user['id'], 'user')
        self.assertAlmostEqual(timing['idle_seconds_remaining'], 600)
        self.assertNotIn('UPDATE', connection.execute.call_args.args[0])
        self.assertNotIn('token', timing)
