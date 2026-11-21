"""Explicit local operator command to grant administrator access to an existing account."""
import argparse
from .auth_security import email_address
from .database import connect
from .settings import Settings


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--email', required=True)
    args = parser.parse_args()
    email = email_address({'email': args.email})
    with connect(Settings.from_environment().database_url) as connection:
        row = connection.execute("UPDATE auth_users SET role='admin' WHERE email=%s RETURNING id", (email,)).fetchone()
        if not row:
            raise SystemExit('No existing account matches that email. No access was changed.')
    print('Administrator access updated for the selected existing account.')


if __name__ == '__main__':
    main()
