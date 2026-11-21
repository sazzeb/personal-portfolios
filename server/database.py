"""TLS PostgreSQL connections and idempotent contact schema initialization."""

import psycopg
from threading import Lock
from psycopg.conninfo import conninfo_to_dict
from psycopg.rows import dict_row

# Increment when SCHEMA_STATEMENTS changes. The database marker coordinates
# independent workers; the process cache avoids repeating initialization checks.
SCHEMA_VERSION = '2026-11-admin-directory-v1'
_schema_ready = set()
_schema_lock = Lock()

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
    """CREATE TABLE IF NOT EXISTS auth_users (
        id UUID PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )""",
    """CREATE TABLE IF NOT EXISTS auth_sessions (
        token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )""",
    "ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member'",
    "CREATE INDEX IF NOT EXISTS auth_sessions_user ON auth_sessions(user_id)",
    "ALTER TABLE auth_sessions ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    """CREATE TABLE IF NOT EXISTS auth_password_resets (
        token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )""",
    "CREATE INDEX IF NOT EXISTS auth_resets_user ON auth_password_resets(user_id)",
    "ALTER TABLE auth_password_resets ADD COLUMN IF NOT EXISTS code_hash TEXT",
    "ALTER TABLE auth_password_resets ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0",
    """CREATE TABLE IF NOT EXISTS auth_rate_limits (
        key_hash TEXT PRIMARY KEY, window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        attempts INTEGER NOT NULL DEFAULT 1
    )""",
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
        with _schema_lock:
            if database_url not in _schema_ready:
                with connection.transaction():
                    connection.execute("SET LOCAL lock_timeout = '10s'")
                    connection.execute(
                        "SELECT pg_advisory_xact_lock(hashtextextended(%s, 0))",
                        ("sammy:contact:schema:v1",),
                    )
                    connection.execute('CREATE TABLE IF NOT EXISTS portfolio_schema_versions (version TEXT PRIMARY KEY)')
                    installed = connection.execute('SELECT version FROM portfolio_schema_versions WHERE version=%s', (SCHEMA_VERSION,)).fetchone()
                    if not installed:
                        for statement in SCHEMA_STATEMENTS:
                            connection.execute(statement)
                        connection.execute('INSERT INTO portfolio_schema_versions (version) VALUES (%s)', (SCHEMA_VERSION,))
                _schema_ready.add(database_url)
    except Exception:
        connection.close()
        raise
    return connection
