"""Run Next.js and the contact API together with `yarn dev`."""

import os
import shutil
import signal
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.parse import urlsplit
from urllib.request import urlopen

from .settings import PROJECT_ROOT, Settings


def is_healthy(url: str) -> bool:
    try:
        with urlopen(url.rstrip("/") + "/health", timeout=1) as response:
            return response.status == 200
    except (URLError, OSError):
        return False


def main() -> int:
    Settings.from_environment()
    backend_url = os.environ.get("CONTACT_SERVER_URL", "http://127.0.0.1:8000")
    target = urlsplit(backend_url)
    children = []

    def stop(*_args):
        for child in children:
            if child.poll() is None:
                child.terminate()

    signal.signal(signal.SIGTERM, stop)
    try:
        if target.hostname in {"127.0.0.1", "localhost"} and not is_healthy(backend_url):
            environment = dict(os.environ, PORT=str(target.port or 8000))
            backend = subprocess.Popen(
                [sys.executable, "-m", "server"], cwd=PROJECT_ROOT, env=environment,
            )
            children.append(backend)
            for _ in range(40):
                if is_healthy(backend_url):
                    break
                if backend.poll() is not None:
                    raise RuntimeError("Contact API failed to start. Check the server configuration.")
                time.sleep(0.25)
            else:
                raise RuntimeError("Contact API did not become ready on " + backend_url)
        frontend = subprocess.Popen(
            [shutil.which("yarn") or "yarn", "dev:web", *sys.argv[1:]], cwd=PROJECT_ROOT,
        )
        children.append(frontend)
        while all(child.poll() is None for child in children):
            time.sleep(0.25)
        return next((child.returncode for child in children if child.returncode is not None), 0)
    except KeyboardInterrupt:
        return 0
    finally:
        stop()
        for child in children:
            try:
                child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()


if __name__ == "__main__":
    raise SystemExit(main())
