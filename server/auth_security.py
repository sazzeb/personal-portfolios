"""Credential validation, Argon2id hashes, and opaque session tokens."""

import hashlib
import hmac
import re
import secrets
import unicodedata

from email_validator import validate_email, EmailNotValidError
from zxcvbn import zxcvbn

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

from .models import ContactError

PASSWORD_HASHER = PasswordHasher()
DUMMY_HASH = PASSWORD_HASHER.hash(secrets.token_urlsafe(32))


def text(payload: dict, field: str, maximum: int, trim: bool = True) -> str:
    value = payload.get(field, "")
    if not isinstance(value, str) or len(value) > maximum or "\x00" in value:
        raise ContactError(400, "Please check your " + field + ".", "validation_error")
    return value.strip() if trim else value


def email_address(payload: dict) -> str:
    try:
        return validate_email(text(payload, "email", 254), check_deliverability=False,
                              allow_smtputf8=False).ascii_email.lower()
    except EmailNotValidError:
        raise ContactError(400, "Please enter a valid email address.", "validation_error")


def full_name(payload: dict) -> str:
    raw = text(payload, "name", 100)
    name = unicodedata.normalize("NFC", raw)
    if (sum(c.isalpha() for c in name) < 2 or any(
        not (unicodedata.category(c)[0] in {"L", "M"} or c in " '-.’") for c in name
    )):
        raise ContactError(400, "Enter your name using at least two letters, spaces, apostrophes or hyphens.", "validation_error")
    return " ".join(name.split())


def new_password(payload: dict, user_inputs=()) -> str:
    password = text(payload, "password", 128, trim=False)
    if len(password) < 15:
        raise ContactError(400, "Use a password with at least 15 characters.", "validation_error")
    if (re.search(r'password|p[a@]ssw[o0]rd|qwerty|letmein|welcome|changeme', password.casefold())
            or password.casefold().strip() == "correct horse battery staple"
            or zxcvbn(password, user_inputs=list(user_inputs))["score"] < 3):
        raise ContactError(400, "This password is too predictable. Avoid common passwords, names and repeated patterns.", "validation_error")
    if text(payload, "confirmPassword", 128, trim=False) != password:
        raise ContactError(400, "Your passwords do not match.", "validation_error")
    return password


def reset_code_hash(token: str, code: str, secret: str) -> str:
    return hmac.new(secret.encode(), (token + ":" + code).encode(), hashlib.sha256).hexdigest()


def verify_password(encoded: str, password: str) -> bool:
    try:
        return PASSWORD_HASHER.verify(encoded, password)
    except (VerificationError, InvalidHashError):
        return False


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def valid_token(token: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9_-]{43}", token))
