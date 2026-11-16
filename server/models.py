"""Validation shared by the HTTP and message-processing layers."""

import hashlib
import json
import re
from dataclasses import asdict, dataclass


class ContactError(Exception):
    def __init__(self, status: int, message: str, code: str = "request_failed") -> None:
        super().__init__(message)
        self.status = status
        self.message = message
        self.code = code


@dataclass(frozen=True)
class ContactMessage:
    name: str
    email: str
    subject: str
    message: str

    @classmethod
    def parse(cls, payload: object) -> "ContactMessage":
        if not isinstance(payload, dict):
            raise ContactError(400, "Please submit a valid contact form.")
        values = {}
        for field, maximum in [("name", 200), ("email", 200), ("subject", 200), ("message", 5000)]:
            value = payload.get(field, "")
            if not isinstance(value, str) or len(value) > maximum:
                raise ContactError(400, "Please check the length and format of your " + field + ".")
            value = value.strip()
            if field != "subject" and not value:
                raise ContactError(400, "Please provide your " + field + ".")
            if "\x00" in value or (field != "message" and ("\r" in value or "\n" in value)):
                raise ContactError(400, "Please remove invalid characters from your " + field + ".")
            values[field] = value
        if not re.fullmatch(r"[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+", values["email"]):
            raise ContactError(400, "Please provide a valid email address.")
        values["subject"] = values["subject"] or "Portfolio project enquiry"
        return cls(**values)

    def fingerprint(self) -> str:
        serialized = json.dumps(asdict(self), sort_keys=True, ensure_ascii=True)
        return hashlib.sha256(serialized.encode()).hexdigest()
