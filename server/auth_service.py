"""PostgreSQL-backed accounts, revocable sessions, and one-use password resets."""

import logging
import hmac
import re
import secrets
import smtplib
from email.message import EmailMessage
from uuid import uuid4

import psycopg

from .auth_security import (
    DUMMY_HASH, PASSWORD_HASHER, email_address, new_password,
    text, token_hash, valid_token, verify_password, full_name, reset_code_hash,
)
from .database import connect
from .mailer import send_email
from .models import ContactError
from .settings import Settings

logger = logging.getLogger(__name__)
RESET_MESSAGE = "If an account exists for that email, a password reset link will be sent."
SESSION_SECONDS = 60 * 60 * 8
IDLE_SECONDS = 60 * 15


class AuthService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def rate_limit(self, connection, scope: str, identifier: str, limit: int) -> None:
        row = connection.execute(
            """INSERT INTO auth_rate_limits (key_hash) VALUES (%s)
            ON CONFLICT (key_hash) DO UPDATE SET
              attempts = CASE WHEN auth_rate_limits.window_start < NOW() - INTERVAL '15 minutes'
                THEN 1 ELSE auth_rate_limits.attempts + 1 END,
              window_start = CASE WHEN auth_rate_limits.window_start < NOW() - INTERVAL '15 minutes'
                THEN NOW() ELSE auth_rate_limits.window_start END
            RETURNING attempts""", (token_hash(scope + ":" + identifier),),
        ).fetchone()
        connection.commit()
        if row["attempts"] > limit:
            raise ContactError(429, "Too many attempts. Please try again in 15 minutes.", "rate_limited")

    @staticmethod
    def public_user(row: dict) -> dict:
        return {"id": str(row["id"]), "name": row["name"], "email": row["email"], "role": row.get("role", "member")}

    def dispatch(self, action: str, method: str, payload: dict, session: str, client: str) -> dict:
        actions = {"register", "login", "forgot-password", "reset-password", "session", "logout", "activity", "dashboard", "inbox", "users"}
        if action not in actions:
            raise ContactError(404, "Endpoint not found.")
        if method != ("GET" if action in {"session", "dashboard", "inbox", "users"} else "POST"):
            raise ContactError(405, "Unsupported request method.")
        if action in {"session", "dashboard", "activity", "inbox", "users"} and not valid_token(session):
            raise ContactError(401, "Please sign in to continue.", "unauthenticated")
        try:
            with connect(self.settings.database_url) as connection:
                if action in {"inbox", "users"}:
                    user, timing = self.session_details(connection, session)
                    if user['role'] != 'admin':
                        raise ContactError(403, "Administrator access is required.", "forbidden")
                    from .admin_service import list_records
                    return list_records(connection, action, payload)
                if action in {"session", "dashboard", "activity"}:
                    user, timing = self.session_details(connection, session, touch=action == "activity")
                    result = {"success": True, "user": user, "session": timing}
                    if action == "dashboard":
                        row = connection.execute(
                            """SELECT COUNT(*) AS total FROM auth_sessions WHERE user_id = %s
                            AND expires_at > NOW() AND created_at > NOW() - INTERVAL '8 hours'
                            AND last_seen_at > NOW() - INTERVAL '15 minutes'""", (user['id'],),
                        ).fetchone()
                        result['active_sessions'] = row['total']
                    return result
                if action == "logout":
                    connection.execute("DELETE FROM auth_sessions WHERE token_hash = %s", (token_hash(session),))
                    return {"success": True, "message": "You have been signed out."}
                self.rate_limit(connection, "ip:" + action, client, 30)
                if action == "register":
                    return self.register(connection, payload)
                if action == "reset-password":
                    return self.reset_password(connection, payload)
                email = email_address(payload)
                self.rate_limit(connection, action, email, 5 if action == "forgot-password" else 10)
                if action == "login":
                    return self.login(connection, payload, email)
                return self.forgot_password(connection, email)
        except psycopg.Error as error:
            logger.error("Authentication storage failure type=%s sqlstate=%s", type(error).__name__, error.sqlstate)
            raise ContactError(503, "Account services are temporarily unavailable. Please try again later.") from error

    def register(self, connection, payload: dict) -> dict:
        email = email_address(payload)
        name = full_name(payload)
        encoded = PASSWORD_HASHER.hash(new_password(payload, (name, email, email.split('@')[0], 'Eko Samuel')))
        row = connection.execute(
            """INSERT INTO auth_users (id, name, email, password_hash) VALUES (%s, %s, %s, %s)
            ON CONFLICT (email) DO NOTHING RETURNING id""",
            (str(uuid4()), name, email, encoded),
        ).fetchone()
        if not row:
            raise ContactError(409, "Unable to register with these details. Try signing in or resetting your password.")
        return {"success": True, "message": "Your account has been created. You can now sign in."}

    def login(self, connection, payload: dict, email: str) -> dict:
        password = text(payload, "password", 128, trim=False)
        user = connection.execute("SELECT * FROM auth_users WHERE email = %s FOR UPDATE", (email,)).fetchone()
        matched = verify_password(user["password_hash"] if user else DUMMY_HASH, password)
        if not user or not matched:
            raise ContactError(401, "Email or password is incorrect.", "invalid_credentials")
        if PASSWORD_HASHER.check_needs_rehash(user["password_hash"]):
            connection.execute("UPDATE auth_users SET password_hash = %s WHERE id = %s",
                               (PASSWORD_HASHER.hash(password), user["id"]))
        connection.execute("DELETE FROM auth_sessions WHERE user_id = %s AND expires_at <= NOW()", (user["id"],))
        token = secrets.token_urlsafe(32)
        connection.execute(
            "INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (%s, %s, NOW() + INTERVAL '8 hours')",
            (token_hash(token), user["id"]),
        )
        return {"success": True, "user": self.public_user(user), "session_token": token}

    def session_user(self, connection, token: str) -> dict:
        return self.session_details(connection, token)[0]

    def session_details(self, connection, token: str, touch: bool = False):
        if not valid_token(token):
            raise ContactError(401, "Please sign in to continue.", "unauthenticated")
        conditions = """s.token_hash = %s AND s.expires_at > NOW()
            AND s.created_at > NOW() - INTERVAL '8 hours'
            AND s.last_seen_at > NOW() - INTERVAL '15 minutes'"""
        fields = """u.id, u.name, u.email, u.role, s.created_at, s.last_seen_at,
            LEAST(s.expires_at, s.created_at + INTERVAL '8 hours') AS expires_at,
            EXTRACT(EPOCH FROM NOW()) AS server_time"""
        # Atomic predicate on UPDATE prevents an expired session being revived.
        statement = (
            "UPDATE auth_sessions s SET last_seen_at = NOW() FROM auth_users u "
            "WHERE s.user_id = u.id AND " + conditions + " RETURNING " + fields
            if touch else
            "SELECT " + fields + " FROM auth_sessions s JOIN auth_users u ON u.id = s.user_id WHERE " + conditions
        )
        user = connection.execute(statement, (token_hash(token),)).fetchone()
        if not user:
            raise ContactError(401, "Your session has expired. Please sign in again.", "unauthenticated")
        now = float(user['server_time'])
        return self.public_user(user), {
            'created_at': user['created_at'].isoformat(),
            'idle_seconds_remaining': max(0, user['last_seen_at'].timestamp() + IDLE_SECONDS - now),
            'absolute_seconds_remaining': max(0, user['expires_at'].timestamp() - now),
            'idle_timeout_seconds': IDLE_SECONDS,
            'absolute_timeout_seconds': SESSION_SECONDS,
        }

    def forgot_password(self, connection, email: str) -> dict:
        user = connection.execute("SELECT id FROM auth_users WHERE email = %s FOR UPDATE", (email,)).fetchone()
        if not user:
            return {"success": True, "message": RESET_MESSAGE}
        token = secrets.token_urlsafe(32)
        code = str(secrets.randbelow(1_000_000)).zfill(6)
        connection.execute("DELETE FROM auth_password_resets WHERE user_id = %s", (user["id"],))
        connection.execute(
            "INSERT INTO auth_password_resets (token_hash, user_id, code_hash, expires_at) VALUES (%s, %s, %s, NOW() + INTERVAL '15 minutes')",
            (token_hash(token), user["id"], reset_code_hash(token, code, self.settings.api_key)),
        )
        connection.commit()
        email_message = EmailMessage()
        email_message["From"] = self.settings.smtp_from
        email_message["To"] = email
        email_message["Subject"] = "Reset your Eko Samuel account password"
        link = self.settings.auth_public_url + "/protected/reset-password#token=" + token
        email_message.set_content(
            "A password reset was requested for your Eko Samuel account.\n\n" + link
            + "\n\nVerification code: " + code
            + "\n\nOpen the link, enter the code and choose your new password. "
            + "The link and code expire in 15 minutes and can be used once. "
            "If you did not request this, you can ignore this email."
        )
        email_message.add_alternative(
            '<html><body style="background:#081116;color:#e8f4f7;font-family:Arial;padding:32px">'
            '<main style="max-width:520px;margin:auto;border:1px solid #155666;padding:32px;border-radius:20px">'
            '<p style="color:#22d3ee;letter-spacing:3px">EKO SAMUEL · ACCOUNT SECURITY</p>'
            '<h1>Reset your password</h1><p>Use the secure link below, then enter your verification code.</p>'
            '<p style="font-size:32px;letter-spacing:8px;color:#22d3ee">' + code + '</p>'
            '<p><a style="color:#22d3ee" href="' + link + '">Create a new password</a></p>'
            '<p>This link and code expire in 15 minutes. Never share them with anyone.</p>'
            '<p>If you did not request this, ignore this email. Your password has not changed.</p>'
            '</main></body></html>', subtype='html',
        )
        try:
            send_email(email_message, self.settings)
        except (smtplib.SMTPException, OSError) as error:
            # A failed provider must not reveal whether an account exists.
            logger.warning("Password reset delivery failed type=%s", type(error).__name__)
        return {"success": True, "message": RESET_MESSAGE}

    def reset_password(self, connection, payload: dict) -> dict:
        token = text(payload, "token", 128)
        if not valid_token(token):
            raise ContactError(400, "This reset link is invalid or expired. Request a new one.", "invalid_reset")
        # Lock the user first, matching login and reset issuance lock order.
        user = connection.execute(
            """SELECT u.id, u.name, u.email, r.code_hash, r.attempts FROM auth_users u JOIN auth_password_resets r ON r.user_id = u.id
            WHERE r.token_hash = %s AND r.expires_at > NOW() FOR UPDATE OF u""", (token_hash(token),),
        ).fetchone()
        if not user or not user['code_hash'] or user['attempts'] >= 5:
            raise ContactError(400, "This reset link is invalid or expired. Request a new one.", "invalid_reset")
        code = text(payload, 'code', 6)
        if not re.fullmatch(r'[0-9]{6}', code) or not hmac.compare_digest(
            user['code_hash'], reset_code_hash(token, code, self.settings.api_key)
        ):
            connection.execute('UPDATE auth_password_resets SET attempts = attempts + 1 WHERE token_hash = %s', (token_hash(token),))
            connection.commit()
            raise ContactError(400, 'The verification code is incorrect. After five attempts, request a new link.', 'invalid_reset')
        encoded = PASSWORD_HASHER.hash(new_password(payload, (user['name'], user['email'], user['email'].split('@')[0], 'Eko Samuel')))
        consumed = connection.execute(
            "DELETE FROM auth_password_resets WHERE token_hash = %s AND expires_at > NOW() RETURNING user_id",
            (token_hash(token),),
        ).fetchone()
        if not consumed:
            raise ContactError(400, "This reset link has already been used.", "invalid_reset")
        connection.execute("UPDATE auth_users SET password_hash = %s WHERE id = %s", (encoded, user["id"]))
        connection.execute("DELETE FROM auth_sessions WHERE user_id = %s", (user["id"],))
        connection.execute("DELETE FROM auth_password_resets WHERE user_id = %s", (user["id"],))
        return {"success": True, "message": "Your password has been updated. Please sign in again."}
