"""TLS PostgreSQL connections and idempotent contact schema initialization."""

import psycopg
from psycopg.conninfo import conninfo_to_dict
from psycopg.rows import dict_row

SCHEMA_STATEMENTS = (
    """
    CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY,
        fingerprint TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        forwarded_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    """,
    "CREATE INDEX IF NOT EXISTS contact_email_time "
    "ON contact_messages (lower(email), created_at)",
)


def connect(database_url: str) -> psycopg.Connection:
    """Use Neon's pooler without session state or prepared statements."""
    parameters = conninfo_to_dict(database_url)
    parameters.setdefault("sslmode", "require")
    if parameters["sslmode"] not in {"require", "verify-ca", "verify-full"}:
        raise ValueError("DATABASE_URL must require TLS")
    parameters["connect_timeout"] = 10
    connection = psycopg.connect(**parameters, row_factory=dict_row, prepare_threshold=None)
    try:
        # Serialize first-deploy DDL across independent Vercel instances.
        with connection.transaction():
            connection.execute("SET LOCAL lock_timeout = '10s'")
            connection.execute(
                "SELECT pg_advisory_xact_lock(hashtextextended(%s, 0))",
                ("sammy:contact:schema:v1",),
            )
            for statement in SCHEMA_STATEMENTS:
                connection.execute(statement)
    except Exception:
        connection.close()
        raise
    return connection
