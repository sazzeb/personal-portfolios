"""Environment-only configuration; credentials never reach the browser."""

import os
from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def load_root_environment() -> None:
    """Share Next.js's root .env; deployment variables retain precedence."""
    load_dotenv(PROJECT_ROOT / ".env", override=False)


@dataclass(frozen=True)
class Settings:
    database_path: Path
    api_key: str
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    smtp_from: str
    smtp_security: str = "starttls"
    recipient: str = "info@ekosamuel.com"

    @classmethod
    def from_environment(cls) -> "Settings":
        load_root_environment()
        required = ["CONTACT_API_KEY", "SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"]
        missing = [key for key in required if not os.environ.get(key)]
        if missing:
            raise ValueError("Missing server configuration: " + ", ".join(missing))
        security = os.environ.get("SMTP_SECURITY", "starttls")
        if security not in {"starttls", "ssl"}:
            raise ValueError("SMTP_SECURITY must be starttls or ssl")
        if len(os.environ["CONTACT_API_KEY"]) < 32:
            raise ValueError("CONTACT_API_KEY must contain at least 32 characters")
        sender = os.environ["SMTP_FROM"]
        if "\r" in sender or "\n" in sender or "@" not in sender:
            raise ValueError("SMTP_FROM must be a valid sender address")
        return cls(
            database_path=PROJECT_ROOT / Path(os.environ.get("SQLITE_PATH", "server/data/contact.sqlite3")),
            api_key=os.environ["CONTACT_API_KEY"],
            smtp_host=os.environ["SMTP_HOST"],
            smtp_port=int(os.environ.get("SMTP_PORT", "465" if security == "ssl" else "587")),
            smtp_username=os.environ["SMTP_USERNAME"],
            smtp_password=os.environ["SMTP_PASSWORD"],
            smtp_from=sender,
            smtp_security=security,
        )
