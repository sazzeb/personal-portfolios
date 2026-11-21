"""Read-only, paginated administrator views. Call only after role authorization."""
from .auth_security import text
from .models import ContactError

PAGE_SIZE = 20


def list_records(connection, action: str, payload: dict) -> dict:
    page_text = str(payload.get('page', '1'))
    if len(page_text) > 7 or not page_text.isascii() or not page_text.isdigit() or not 1 <= int(page_text) <= 1_000_000:
        raise ContactError(400, 'Invalid page number.', 'validation_error')
    page = int(page_text)
    search = text(payload, 'search', 100)
    # All SQL fragments come from these fixed choices, never user-provided identifiers.
    if action == 'inbox':
        table = 'contact_messages'
        fields = 'id, name, email, subject, message, created_at, forwarded_at'
        where = "name ILIKE %s OR email ILIKE %s OR subject ILIKE %s OR message ILIKE %s"
        copies = 4
    elif action == 'users':
        table = 'auth_users'
        fields = 'id, name, email, role, created_at'
        where = 'name ILIKE %s OR email ILIKE %s'
        copies = 2
    else:
        raise ContactError(404, 'Endpoint not found.')
    pattern = '%' + search.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_') + '%'
    parameters = (pattern,) * copies
    total = connection.execute('SELECT COUNT(*) AS total FROM ' + table + ' WHERE ' + where, parameters).fetchone()['total']
    rows = connection.execute('SELECT ' + fields + ' FROM ' + table + ' WHERE ' + where +
                              ' ORDER BY created_at DESC, id DESC LIMIT %s OFFSET %s',
                              (*parameters, PAGE_SIZE, (page - 1) * PAGE_SIZE)).fetchall()
    records = []
    for row in rows:
        item = dict(row)
        item['id'] = str(item['id'])
        for key in ('created_at', 'forwarded_at'):
            if key in item:
                item[key] = item[key].isoformat()
        records.append(item)
    return {'success': True, 'records': records, 'total': total, 'page': page, 'page_size': PAGE_SIZE}
