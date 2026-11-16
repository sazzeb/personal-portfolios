"""Small WSGI JSON API, runnable with Gunicorn in production."""

import hmac
import json
import logging
from http import HTTPStatus
from uuid import UUID

from .models import ContactError, ContactMessage
from .service import ContactService
from .settings import Settings

MAX_BODY_BYTES = 32768
logger = logging.getLogger(__name__)


def create_app(settings=None):
    configuration = settings or Settings.from_environment()
    service = ContactService(configuration)

    def application(environ, start_response):
        status = 200
        try:
            path = environ.get("PATH_INFO", "")
            method = environ.get("REQUEST_METHOD", "GET")
            if path == "/health" and method == "GET":
                payload = {"status": "ok"}
            elif path != "/api/contact":
                raise ContactError(404, "Endpoint not found.")
            elif method != "POST":
                raise ContactError(405, "Use POST to submit a message.")
            else:
                token = environ.get("HTTP_X_CONTACT_API_KEY", "")
                if not hmac.compare_digest(token.encode(), configuration.api_key.encode()):
                    raise ContactError(401, "Unauthorized request.")
                if environ.get("CONTENT_TYPE", "").split(";")[0] != "application/json":
                    raise ContactError(415, "Submit the contact form as JSON.")
                try:
                    length = int(environ.get("CONTENT_LENGTH") or 0)
                except ValueError:
                    raise ContactError(400, "Invalid request length.")
                if length <= 0 or length > MAX_BODY_BYTES:
                    raise ContactError(413, "The message is too large or empty.")
                try:
                    request_id = str(UUID(environ.get("HTTP_IDEMPOTENCY_KEY", "")))
                except ValueError:
                    raise ContactError(400, "A valid message identifier is required.")
                try:
                    data = json.loads(environ["wsgi.input"].read(length))
                except (ValueError, UnicodeDecodeError):
                    raise ContactError(400, "Invalid JSON request.")
                message = ContactMessage.parse(data)
                payload = service.submit(message, request_id)
        except ContactError as error:
            status = error.status
            payload = {"success": False, "message": error.message, "code": error.code}
        except Exception:
            logger.exception("Unhandled contact request failure")
            status = 500
            payload = {"success": False, "message": "Your message could not be processed. Please try again later."}
        body = json.dumps(payload).encode("utf-8")
        start_response(
            str(status) + " " + HTTPStatus(status).phrase,
            [("Content-Type", "application/json; charset=utf-8"),
             ("Content-Length", str(len(body))), ("Cache-Control", "no-store")],
        )
        return [body]

    return application
