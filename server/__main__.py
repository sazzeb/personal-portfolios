"""Local development entry point: python -m server."""

import os
from socketserver import ThreadingMixIn
from wsgiref.simple_server import make_server, WSGIServer

from .app import create_app
from .settings import load_root_environment


class DevelopmentServer(ThreadingMixIn, WSGIServer):
    daemon_threads = True

if __name__ == "__main__":
    load_root_environment()
    port = int(os.environ.get("PORT", "8000"))
    with make_server("127.0.0.1", port, create_app(), server_class=DevelopmentServer) as server:
        print("Contact API listening on http://127.0.0.1:" + str(port))
        server.serve_forever()
