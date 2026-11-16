import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from server.settings import Settings


class SharedEnvironmentTests(unittest.TestCase):
    def test_loads_root_env_and_resolves_storage_from_root(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / ".env").write_text(
                "CONTACT_API_KEY=" + "test-key" * 5 + "\n"
                "SMTP_HOST=smtp.example.test\nSMTP_USERNAME=test-user\n"
                "SMTP_PASSWORD='password with spaces # preserved'\n"
                "SMTP_FROM=info@ekosamuel.com\nSQLITE_PATH=server/data/contact.sqlite3\n",
                encoding="utf-8",
            )
            with patch.dict(os.environ, {"SMTP_HOST": "hosting.example.test"}, clear=True):
                with patch("server.settings.PROJECT_ROOT", root):
                    settings = Settings.from_environment()
            self.assertEqual(settings.smtp_host, "hosting.example.test")
            self.assertEqual(settings.smtp_password, "password with spaces # preserved")
            self.assertEqual(settings.database_path, root / "server/data/contact.sqlite3")


if __name__ == "__main__":
    unittest.main()
