"""Coordinate forwarding, durable storage, and duplicate-request handling."""

import logging
import smtplib
import ssl
import psycopg
from datetime import datetime, timezone

from .database import connect
from .mailer import forward_message
from .models import ContactError, ContactMessage
from .settings import Settings

SUCCESS_MESSAGE = "Your thought has been sent, Eko Samuel will reach out to you"
logger = logging.getLogger(__name__)


class ContactService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def submit(self, message: ContactMessage, request_id: str) -> dict:
        forwarded = False
        connection = None
        try:
            connection = connect(self.settings.database_url)
            connection.execute("SET LOCAL lock_timeout = '10s'")
            # Transaction locks work with Neon's transaction-mode pooler.
            for lock_key in ("request:" + request_id, "email:" + message.email.lower()):
                connection.execute(
                    "SELECT pg_advisory_xact_lock(hashtextextended(%s, 0))", (lock_key,)
                )
            existing = connection.execute(
                "SELECT fingerprint FROM contact_messages WHERE id = %s", (request_id,)
            ).fetchone()
            if existing:
                if existing["fingerprint"] != message.fingerprint():
                    raise ContactError(409, "Please submit the updated message again.", "id_conflict")
                return {"success": True, "message": SUCCESS_MESSAGE}
            recent = connection.execute(
                "SELECT COUNT(*) AS count FROM contact_messages WHERE lower(email) = lower(%s) "
                "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '10 minutes'",
                (message.email,),
            ).fetchone()["count"]
            if recent >= 5:
                raise ContactError(429, "Please wait a few minutes before sending another message.")
            forward_message(message, request_id, self.settings)
            forwarded = True
            connection.execute(
                "INSERT INTO contact_messages "
                "(id, fingerprint, name, email, subject, message, forwarded_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (request_id, message.fingerprint(), message.name, message.email,
                 message.subject, message.message, datetime.now(timezone.utc)),
            )
            connection.commit()
            return {"success": True, "message": SUCCESS_MESSAGE}
        except (smtplib.SMTPException, OSError) as error:
            if isinstance(error, smtplib.SMTPAuthenticationError):
                code = "smtp_authentication_failed"
            elif isinstance(error, TimeoutError):
                code = "smtp_timeout"
            elif isinstance(error, ssl.SSLError):
                code = "smtp_tls_failed"
            else:
                code = "smtp_unavailable"
            logger.warning(
                "Contact forwarding failed: %s code=%s smtp_status=%s errno=%s",
                type(error).__name__, code, getattr(error, "smtp_code", None),
                getattr(error, "errno", None),
            )
            raise ContactError(
                502, "Your message could not be sent. Please try again later.", code,
            ) from error
        except psycopg.Error as error:
            logger.error("Contact storage failed after_forward=%s error_type=%s sqlstate=%s",
                         forwarded, type(error).__name__, error.sqlstate)
            if forwarded:
                raise ContactError(
                    503,
                    "Your email was forwarded, but storage is temporarily unavailable. Please do not resend it.",
                    "forwarded_not_stored",
                ) from error
            raise ContactError(503, "The contact service is temporarily unavailable. Please try again later.") from error
        finally:
            if connection is not None:
                connection.close()
