import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from server.settings import Settings


class SharedEnvironmentTests(unittest.TestCase):
    def test_loads_database_url_from_shared_root_env(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / ".env").write_text(
                "CONTACT_API_KEY=" + "test-key" * 5 + "\n"
                "SMTP_HOST=smtp.example.test\nSMTP_USERNAME=test-user\n"
                "SMTP_PASSWORD='password with spaces # preserved'\n"
                "SMTP_FROM=info@ekosamuel.com\n"
                "DATABASE_URL=postgresql://user:secret@host.test/neondb?sslmode=require\n",
                encoding="utf-8",
            )
            with patch.dict(os.environ, {"SMTP_HOST": "hosting.example.test"}, clear=True):
                with patch("server.settings.PROJECT_ROOT", root):
                    settings = Settings.from_environment()
            self.assertEqual(settings.smtp_host, "hosting.example.test")
            self.assertEqual(settings.smtp_password, "password with spaces # preserved")
            self.assertEqual(settings.database_url,
                             "postgresql://user:secret@host.test/neondb?sslmode=require")

    def test_rejects_missing_invalid_or_insecure_database_url(self):
        values = {
            "CONTACT_API_KEY": "test-key" * 5, "SMTP_HOST": "smtp.example.test",
            "SMTP_USERNAME": "test", "SMTP_PASSWORD": "test",
            "SMTP_FROM": "info@ekosamuel.com",
        }
        for url in ("", "not-a-url", "postgresql://host/db?sslmode=disable"):
            with self.subTest(url=url), patch.dict(os.environ, {**values, "DATABASE_URL": url}, clear=True):
                with patch("server.settings.load_root_environment"), self.assertRaises(ValueError):
                    Settings.from_environment()


if __name__ == "__main__":
    unittest.main()
