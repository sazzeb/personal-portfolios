"""Trusted frontend-to-backend authentication endpoint boundary."""

import hmac
import json
from urllib.parse import parse_qs

from .auth_service import AuthService
from .models import ContactError


def handle_auth(environ: dict, settings) -> dict:
    supplied = environ.get("HTTP_X_CONTACT_API_KEY", "")
    if not hmac.compare_digest(supplied.encode(), settings.api_key.encode()):
        raise ContactError(401, "Unauthorized request.")
    action = environ.get("PATH_INFO", "").removeprefix("/api/auth/")
    method = environ.get("REQUEST_METHOD", "GET")
    payload = {}
    if method == 'GET' and action in {'inbox', 'users'}:
        try:
            query = parse_qs(environ.get('QUERY_STRING', ''), max_num_fields=10)
        except ValueError:
            raise ContactError(400, 'Invalid query.')
        payload = {key: values[0] for key, values in query.items() if key in {'page', 'search'}}
    if method == "POST":
        if environ.get("CONTENT_TYPE", "").split(";")[0] != "application/json":
            raise ContactError(415, "Submit JSON data.")
        try:
            length = int(environ.get("CONTENT_LENGTH") or 0)
            if length <= 0 or length > 16384:
                raise ContactError(413, "Request is too large or empty.")
            payload = json.loads(environ["wsgi.input"].read(length))
        except (ValueError, UnicodeDecodeError):
            raise ContactError(400, "Invalid JSON request.")
        if not isinstance(payload, dict):
            raise ContactError(400, "Submit a valid form.")
    return AuthService(settings).dispatch(
        action, method, payload, environ.get("HTTP_X_AUTH_SESSION", ""),
        environ.get("HTTP_X_AUTH_CLIENT", "unknown")[:200],
    )
