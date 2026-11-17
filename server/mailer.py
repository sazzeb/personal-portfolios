"""Forward portfolio enquiries through an authenticated TLS SMTP server."""

import smtplib
import ssl
import logging
from email.message import EmailMessage
from email.utils import formataddr, formatdate

from .models import ContactMessage
from .settings import Settings

logger = logging.getLogger(__name__)


def forward_message(message: ContactMessage, request_id: str, settings: Settings) -> None:
    email = EmailMessage()
    email["From"] = formataddr(("Eko Samuel Portfolio", settings.smtp_from))
    email["To"] = settings.recipient
    email["Reply-To"] = message.email
    email["Subject"] = "Portfolio enquiry: " + message.subject
    email["Date"] = formatdate(localtime=False)
    email["Message-ID"] = "<" + request_id + "@ekosamuel.com>"
    email.set_content(
        "Name: " + message.name + "\nEmail: " + message.email
        + "\nSubject: " + message.subject + "\n\n" + message.message
    )
    context = ssl.create_default_context()
    client = None
    stage = "connect"
    # Do not treat a later QUIT failure as a failed send after DATA was accepted.
    try:
        if settings.smtp_security == "ssl":
            client = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10, context=context)
        else:
            client = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10)
        if settings.smtp_security == "starttls":
            stage = "starttls"
            client.ehlo()
            client.starttls(context=context)
            client.ehlo()
        stage = "authenticate"
        client.login(settings.smtp_username, settings.smtp_password)
        stage = "send"
        refused = client.send_message(email, from_addr=settings.smtp_from, to_addrs=[settings.recipient])
        if refused:
            raise smtplib.SMTPRecipientsRefused(refused)
    except (smtplib.SMTPException, OSError) as error:
        logger.warning(
            "SMTP failure stage=%s host=%s port=%s security=%s error_type=%s",
            stage, settings.smtp_host, settings.smtp_port, settings.smtp_security,
            type(error).__name__,
        )
        raise
    finally:
        if client is not None:
            client.close()
