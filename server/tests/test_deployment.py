"""Exercise backend-only deployments without the repository's parent package."""

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from server.app import app


class DeploymentTests(unittest.TestCase):
    def test_backend_imports_without_enclosing_server_package(self):
        source = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as directory:
            for module in source.glob("*.py"):
                shutil.copy2(module, Path(directory) / module.name)
            environment = {
                **os.environ,
                "CONTACT_API_KEY": "test-only-" * 4,
                "SMTP_HOST": "smtp.example.test",
                "SMTP_USERNAME": "test",
                "SMTP_PASSWORD": "test-only",
                "SMTP_FROM": "info@ekosamuel.com",
                "SMTP_PORT": "465",
                "SMTP_SECURITY": "ssl",
            }
            environment.pop("PYTHONPATH", None)
            script = (
                "import app, json\n"
                "def respond(status, headers):\n"
                "    assert status == '200 OK', status\n"
                "for path in ('/', '/health'):\n"
                "    body = b''.join(app.app(\n"
                "        {'PATH_INFO': path, 'REQUEST_METHOD': 'GET'}, respond))\n"
                "    assert json.loads(body) == {'status': 'ok'}\n"
            )
            result = subprocess.run(
                [sys.executable, "-c", script], cwd=directory,
                env=environment, capture_output=True, text=True, timeout=15,
            )
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_bad_configuration_returns_json_instead_of_crashing_function(self):
        respond = Mock()
        with patch("server.app._configured_application", side_effect=ValueError("Missing configuration")):
            with self.assertLogs("server.app", level="ERROR"):
                body = b"".join(app({}, respond))
        self.assertEqual(respond.call_args.args[0], "503 Service Unavailable")
        self.assertEqual(json.loads(body)["code"], "configuration_error")
        self.assertNotIn("Missing configuration", body.decode())
