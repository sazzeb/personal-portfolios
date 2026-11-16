"""Coordinate forwarding, durable storage, and duplicate-request handling."""

import logging
import smtplib
import sqlite3
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
            connection = connect(self.settings.database_path)
            # Reserve the writer so concurrent retries cannot send the same request twice.
            connection.execute("BEGIN IMMEDIATE")
            existing = connection.execute(
                "SELECT fingerprint FROM contact_messages WHERE id = ?", (request_id,)
            ).fetchone()
            if existing:
                if existing["fingerprint"] != message.fingerprint():
                    raise ContactError(409, "Please submit the updated message again.", "id_conflict")
                return {"success": True, "message": SUCCESS_MESSAGE}
            recent = connection.execute(
                "SELECT COUNT(*) FROM contact_messages WHERE lower(email) = lower(?) "
                "AND created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-10 minutes')",
                (message.email,),
            ).fetchone()[0]
            if recent >= 5:
                raise ContactError(429, "Please wait a few minutes before sending another message.")
            forward_message(message, request_id, self.settings)
            forwarded = True
            connection.execute(
                "INSERT INTO contact_messages "
                "(id, fingerprint, name, email, subject, message, forwarded_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (request_id, message.fingerprint(), message.name, message.email,
                 message.subject, message.message, datetime.now(timezone.utc).isoformat()),
            )
            connection.commit()
            return {"success": True, "message": SUCCESS_MESSAGE}
        except (smtplib.SMTPException, OSError) as error:
            logger.warning("Contact forwarding failed: %s", type(error).__name__)
            raise ContactError(502, "Your message could not be sent. Please try again later.") from error
        except sqlite3.Error as error:
            logger.error("Contact storage failed after_forward=%s", forwarded)
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
