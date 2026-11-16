"""Forward portfolio enquiries through an authenticated TLS SMTP server."""

import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr, formatdate

from .models import ContactMessage
from .settings import Settings


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
    if settings.smtp_security == "ssl":
        client = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10, context=context)
    else:
        client = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10)
    # Do not treat a later QUIT failure as a failed send after DATA was accepted.
    try:
        if settings.smtp_security == "starttls":
            client.ehlo()
            client.starttls(context=context)
            client.ehlo()
        client.login(settings.smtp_username, settings.smtp_password)
        refused = client.send_message(email, from_addr=settings.smtp_from, to_addrs=[settings.recipient])
        if refused:
            raise smtplib.SMTPRecipientsRefused(refused)
    finally:
        client.close()
