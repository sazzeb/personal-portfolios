"""Administrator read permissions and safe pagination/query handling."""
import secrets
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import MagicMock, patch
from server.admin_service import list_records
from server.auth_service import AuthService
from server.models import ContactError


class AdministratorTests(unittest.TestCase):
    def test_members_cannot_query_global_records(self):
        service = AuthService(SimpleNamespace(database_url='unused'))
        connection = MagicMock()
        connection.__enter__.return_value = connection
        with patch('server.auth_service.connect', return_value=connection), patch.object(service, 'session_details', return_value=({'id':'member','role':'member'}, {})):
            for action in ('inbox', 'users'):
                with self.assertRaises(ContactError) as error:
                    service.dispatch(action, 'GET', {}, secrets.token_urlsafe(32), 'test')
                self.assertEqual(error.exception.status, 403)
            connection.execute.assert_not_called()

    def test_missing_session_never_opens_storage(self):
        with patch('server.auth_service.connect') as connection:
            for action in ('inbox', 'users'):
                with self.assertRaises(ContactError) as error:
                    AuthService(SimpleNamespace()).dispatch(action, 'GET', {}, '', 'test')
                self.assertEqual(error.exception.status, 401)
            connection.assert_not_called()

    def test_invalid_pages_are_rejected_before_query(self):
        for page in ('0', '-1', '1; DROP TABLE auth_users', '1000001', '9'*5000):
            connection = MagicMock()
            with self.assertRaises(ContactError):
                list_records(connection, 'users', {'page':page})
            connection.execute.assert_not_called()

    def test_search_is_parameterized_and_users_exclude_secrets(self):
        connection = MagicMock()
        connection.execute.return_value.fetchone.return_value = {'total':1}
        connection.execute.return_value.fetchall.return_value = [{'id':'user','name':'Alex','email':'alex@example.com','role':'member','created_at':datetime.now(timezone.utc)}]
        attack = "x' OR 1=1 -- %_"
        result = list_records(connection, 'users', {'page':'2', 'search':attack})
        sql, parameters = connection.execute.call_args.args
        self.assertNotIn(attack, sql)
        self.assertNotIn('password_hash', sql)
        self.assertNotIn('token_hash', sql)
        self.assertEqual(parameters[-2:], (20,20))
        self.assertEqual(result['total'], 1)
        self.assertIsInstance(result['records'][0]['created_at'], str)
        self.assertNotIn('password_hash', result['records'][0])
