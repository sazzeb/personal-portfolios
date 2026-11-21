"""Prepare or remove only explicitly named, isolated browser-test records."""
import re
import sys
from uuid import uuid4
from server.database import connect
from server.settings import Settings

if __name__ == '__main__':
    email = sys.argv[1]
    if not re.fullmatch(r'workspace-e2e-[a-f0-9]{32}@example\.com', email):
        raise ValueError('Only isolated workspace test accounts may be changed')
    action = sys.argv[2] if len(sys.argv) > 2 else 'cleanup'
    with connect(Settings.from_environment().database_url) as connection:
        if action == 'seed-admin':
            row = connection.execute("UPDATE auth_users SET role='admin' WHERE email=%s RETURNING id", (email,)).fetchone()
            if not row:
                raise ValueError('The isolated test account must already exist')
            connection.execute('INSERT INTO contact_messages (id,fingerprint,name,email,subject,message,forwarded_at) VALUES (%s,%s,%s,%s,%s,%s,NOW())', (str(uuid4()),email,'Workspace Inbox Test',email,'Workspace inbox verification','A test message.\n<script>window.__inboxExecuted=true</script>'))
        elif action == 'cleanup':
            connection.execute('DELETE FROM contact_messages WHERE email=%s', (email,))
            connection.execute('DELETE FROM auth_users WHERE email=%s', (email,))
        else:
            raise ValueError('Unknown test action')
