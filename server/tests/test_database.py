"""Verify TLS, pooler compatibility, and atomic schema initialization."""

import unittest
from unittest.mock import patch

import psycopg

from server.database import connect


class DatabaseTests(unittest.TestCase):
    @patch("server.database.psycopg.connect")
    def test_secure_connection_and_transaction_scoped_schema_lock(self, driver):
        connection = driver.return_value
        result = connect("postgresql://user:secret@host.test/neondb")
        self.assertIs(result, connection)
        self.assertEqual(driver.call_args.kwargs["sslmode"], "require")
        self.assertIsNone(driver.call_args.kwargs["prepare_threshold"])
        self.assertEqual(driver.call_args.kwargs["connect_timeout"], 10)
        connection.transaction.assert_called_once()
        statements = [call.args[0] for call in connection.execute.call_args_list]
        self.assertIn("pg_advisory_xact_lock", statements[1])
        self.assertIn("TIMESTAMPTZ", statements[2])
        connection.close.assert_not_called()

    @patch("server.database.psycopg.connect")
    def test_schema_failure_closes_connection(self, driver):
        connection = driver.return_value
        connection.execute.side_effect = psycopg.OperationalError("Unavailable")
        with self.assertRaises(psycopg.OperationalError):
            connect("postgresql://user:secret@host.test/neondb?sslmode=require")
        connection.close.assert_called_once()

    @patch("server.database.psycopg.connect")
    def test_rejects_insecure_connections(self, driver):
        with self.assertRaises(ValueError):
            connect("postgresql://user:secret@host.test/neondb?sslmode=disable")
        driver.assert_not_called()
