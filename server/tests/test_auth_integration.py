"""Opt-in Neon lifecycle test; creates and removes one isolated test account."""

import os
import re
import unittest
from dataclasses import replace
from unittest.mock import patch
from uuid import uuid4

from server.auth_security import token_hash
from server.auth_service import AuthService, RESET_MESSAGE
from server.database import connect
from server.models import ContactError
from server.settings import Settings


@unittest.skipUnless(os.environ.get("RUN_AUTH_INTEGRATION") == "1", "Opt-in Neon integration test")
class AuthIntegrationTests(unittest.TestCase):
    def test_register_login_reset_and_logout_with_real_postgres(self):
        settings = replace(Settings.from_environment(), auth_public_url="http://localhost:3000")
        service = AuthService(settings)
        identifier = uuid4().hex
        email = "auth-check-" + identifier + "@example.com"
        client = "auth-check-" + identifier
        password = "Original secure passphrase " + identifier
        updated = "Updated secure passphrase " + identifier
        def call(action, payload=None, session=""):
            return service.dispatch(action, "GET" if action in {"session", "dashboard"} else "POST",
                                    payload or {}, session, client)
        try:
            self.assertTrue(call("register", {"name": "Auth verification", "email": email,
                                               "password": password, "confirmPassword": password})["success"])
            with connect(settings.database_url) as connection:
                user = connection.execute("SELECT * FROM auth_users WHERE email = %s", (email,)).fetchone()
                self.assertTrue(user["password_hash"].startswith("$argon2id$"))
                self.assertNotEqual(user["password_hash"], password)
            with self.assertRaises(ContactError) as bad_login:
                call("login", {"email": email, "password": "incorrect"})
            self.assertEqual(bad_login.exception.status, 401)
            logged_in = call("login", {"email": email, "password": password})
            session = logged_in["session_token"]
            self.assertEqual(call("session", session=session)["user"]["email"], email)
            with connect(settings.database_url) as connection:
                row = connection.execute("SELECT token_hash FROM auth_sessions WHERE user_id = %s", (user["id"],)).fetchone()
                self.assertEqual(row["token_hash"], token_hash(session))
            with patch("server.auth_service.send_email") as sender:
                self.assertEqual(call("forgot-password", {"email": email})["message"], RESET_MESSAGE)
                sender.assert_called_once()
                delivered = sender.call_args.args[0]
                self.assertEqual(delivered["To"], email)
                token = delivered.get_body(preferencelist=("plain",)).get_content().split("#token=")[1].split()[0]
                code = re.search(r"Verification code: ([0-9]{6})", delivered.get_body(preferencelist=("plain",)).get_content()).group(1)
                self.assertIn("/protected/reset-password#token=", delivered.get_body(preferencelist=("plain",)).get_content())
                self.assertIsNotNone(delivered.get_body(preferencelist=("html",)))
                with self.assertRaises(ContactError):
                    call("reset-password", {"token": token, "code": "wrong", "password": updated, "confirmPassword": updated})
                result = call("reset-password", {"token": token, "code": code, "password": updated, "confirmPassword": updated})
                self.assertTrue(result["success"])
                with self.assertRaises(ContactError):
                    call("reset-password", {"token": token, "code": code, "password": password, "confirmPassword": password})
                # A new code is locked after five guesses and cannot reset the password.
                call("forgot-password", {"email": email})
                next_mail = sender.call_args.args[0].get_body(preferencelist=("plain",)).get_content()
                next_token = next_mail.split("#token=")[1].split()[0]
                next_code = re.search(r"Verification code: ([0-9]{6})", next_mail).group(1)
                wrong_code = "000000" if next_code != "000000" else "111111"
                for _ in range(5):
                    with self.assertRaises(ContactError):
                        call("reset-password", {"token":next_token,"code":wrong_code,"password":password,"confirmPassword":password})
                with self.assertRaises(ContactError):
                    call("reset-password", {"token":next_token,"code":next_code,"password":password,"confirmPassword":password})
                # Expired links fail even with the right code.
                call("forgot-password", {"email": email})
                expired_mail = sender.call_args.args[0].get_body(preferencelist=("plain",)).get_content()
                expired_token = expired_mail.split("#token=")[1].split()[0]
                expired_code = re.search(r"Verification code: ([0-9]{6})", expired_mail).group(1)
                with connect(settings.database_url) as connection:
                    connection.execute("UPDATE auth_password_resets SET expires_at=NOW()-INTERVAL '1 second' WHERE token_hash=%s", (token_hash(expired_token),))
                with self.assertRaises(ContactError):
                    call("reset-password", {"token":expired_token,"code":expired_code,"password":password,"confirmPassword":password})
                sender.reset_mock()
                self.assertEqual(call("forgot-password", {"email": "missing-" + email})["message"], RESET_MESSAGE)
                sender.assert_not_called()
            with self.assertRaises(ContactError):
                call("session", session=session)
            with self.assertRaises(ContactError):
                call("login", {"email": email, "password": password})
            new_session = call("login", {"email": email, "password": updated})["session_token"]
            self.assertTrue(call("logout", session=new_session)["success"])
            with self.assertRaises(ContactError):
                call("session", session=new_session)
            # Server-side session rules also apply without any browser timer.
            active = call("login", {"email": email, "password": updated})["session_token"]
            overview = call("dashboard", session=active)
            self.assertEqual(overview["user"]["email"], email)
            self.assertGreaterEqual(overview["active_sessions"], 1)
            with connect(settings.database_url) as connection:
                connection.execute("UPDATE auth_sessions SET last_seen_at=NOW()-INTERVAL '14 minutes' WHERE token_hash=%s", (token_hash(active),))
            self.assertLess(call("session", session=active)["session"]["idle_seconds_remaining"], 65)
            self.assertGreater(call("activity", session=active)["session"]["idle_seconds_remaining"], 890)
            with connect(settings.database_url) as connection:
                connection.execute("UPDATE auth_sessions SET last_seen_at=NOW()-INTERVAL '16 minutes' WHERE token_hash=%s", (token_hash(active),))
            for action in ("session", "dashboard", "activity"):
                with self.assertRaises(ContactError) as expired:
                    call(action, session=active)
                self.assertEqual(expired.exception.status, 401)
            absolute = call("login", {"email": email, "password": updated})["session_token"]
            with connect(settings.database_url) as connection:
                connection.execute("UPDATE auth_sessions SET created_at=NOW()-INTERVAL '9 hours', expires_at=NOW()+INTERVAL '1 day' WHERE token_hash=%s", (token_hash(absolute),))
            with self.assertRaises(ContactError):
                call("activity", session=absolute)
        finally:
            with connect(settings.database_url) as connection:
                connection.execute("DELETE FROM auth_users WHERE email = %s", (email,))
                keys = [token_hash("ip:" + action + ":" + client) for action in (
                    "register", "login", "forgot-password", "reset-password")]
                keys += [token_hash(action + ":" + value) for action in ("login", "forgot-password")
                         for value in (email, "missing-" + email)]
                connection.execute("DELETE FROM auth_rate_limits WHERE key_hash = ANY(%s)", (keys,))

    def test_admin_directory_and_inbox_require_current_database_role(self):
        settings = Settings.from_environment()
        service = AuthService(settings)
        identifier = uuid4().hex
        email = 'directory-check-' + identifier + '@example.com'
        password = 'Independent! cedar orbital ' + identifier
        message_id = str(uuid4())
        client = 'directory-check-' + identifier
        def call(action, payload=None, session=''):
            return service.dispatch(action, 'GET' if action in {'users','inbox','session'} else 'POST', payload or {}, session, client)
        try:
            call('register', {'name':'Directory Test','email':email,'password':password,'confirmPassword':password,'role':'admin'})
            session = call('login', {'email':email,'password':password})['session_token']
            self.assertEqual(call('session', session=session)['user']['role'], 'member')
            for action in ('inbox','users'):
                with self.assertRaises(ContactError) as denied:
                    call(action, session=session)
                self.assertEqual(denied.exception.status, 403)
            with connect(settings.database_url) as connection:
                connection.execute("UPDATE auth_users SET role='admin' WHERE email=%s", (email,))
                connection.execute("INSERT INTO contact_messages (id,fingerprint,name,email,subject,message,forwarded_at) VALUES (%s,%s,%s,%s,%s,%s,NOW())", (message_id,identifier,'Directory Test',email,'Directory fixture','Literal <script>text</script> '+identifier))
            users = call('users', {'search':identifier}, session)
            self.assertEqual(users['total'], 1)
            self.assertEqual(users['records'][0]['email'], email)
            self.assertNotIn('password_hash', users['records'][0])
            inbox = call('inbox', {'search':identifier}, session)
            self.assertEqual(inbox['total'], 1)
            self.assertEqual(inbox['records'][0]['id'], message_id)
            self.assertIn('<script>', inbox['records'][0]['message'])
            with connect(settings.database_url) as connection:
                connection.execute("UPDATE auth_users SET role='member' WHERE email=%s", (email,))
            with self.assertRaises(ContactError) as revoked:
                call('users', session=session)
            self.assertEqual(revoked.exception.status, 403)
        finally:
            with connect(settings.database_url) as connection:
                connection.execute('DELETE FROM contact_messages WHERE id=%s', (message_id,))
                connection.execute('DELETE FROM auth_users WHERE email=%s', (email,))
                keys = [token_hash('ip:'+action+':'+client) for action in ('register','login')]+[token_hash('login:'+email)]
                connection.execute('DELETE FROM auth_rate_limits WHERE key_hash=ANY(%s)', (keys,))
