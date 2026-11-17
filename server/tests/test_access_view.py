"""Browser warning must never interfere with API requests or readiness checks."""

import json
import unittest
from html.parser import HTMLParser
from types import SimpleNamespace
from unittest.mock import Mock, patch

from server.access_view import HTML, is_browser_navigation
from server.app import app, create_app


class ElementCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.attributes = []

    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        self.attributes.extend(attrs)


class AccessViewTests(unittest.TestCase):
    def test_browser_navigation_returns_warning_without_loading_credentials(self):
        respond = Mock()
        request = {"PATH_INFO": "/", "REQUEST_METHOD": "GET", "HTTP_ACCEPT": "text/html"}
        with patch("server.app._configured_application") as configure:
            body = b"".join(app(request, respond))
        configure.assert_not_called()
        self.assertEqual(respond.call_args.args[0], "403 Forbidden")
        headers = dict(respond.call_args.args[1])
        self.assertIn("text/html", headers["Content-Type"])
        self.assertEqual(headers["Cache-Control"], "no-store")
        self.assertIn("Unauthorized page access", body.decode())
        self.assertIn("frame-ancestors 'none'", headers["Content-Security-Policy"])

    def test_no_interactive_elements_links_or_redirects(self):
        parser = ElementCollector()
        parser.feed(HTML)
        self.assertFalse(set(parser.tags) & {"a", "button", "form", "input", "select", "textarea"})
        self.assertFalse(any(name in {"href", "onclick", "tabindex"}
                             for name, _ in parser.attributes))
        self.assertNotIn("location.href", HTML)
        self.assertNotIn("location.replace", HTML)

    def test_health_remains_json_even_for_browser_accept_header(self):
        respond = Mock()
        application = create_app(SimpleNamespace(api_key="test-key"))
        body = b"".join(application({
            "PATH_INFO": "/health", "REQUEST_METHOD": "GET", "HTTP_ACCEPT": "text/html",
        }, respond))
        self.assertEqual(respond.call_args.args[0], "200 OK")
        self.assertEqual(json.loads(body), {"status": "ok"})

    def test_post_keeps_authentication_even_when_accepting_html(self):
        respond = Mock()
        application = create_app(SimpleNamespace(api_key="test-key"))
        body = b"".join(application({
            "PATH_INFO": "/api/contact", "REQUEST_METHOD": "POST", "HTTP_ACCEPT": "text/html",
        }, respond))
        self.assertEqual(respond.call_args.args[0], "401 Unauthorized")
        self.assertFalse(json.loads(body)["success"])

    def test_head_returns_headers_without_html_body(self):
        respond = Mock()
        result = app({"PATH_INFO": "/", "REQUEST_METHOD": "HEAD", "HTTP_ACCEPT": "text/html"}, respond)
        self.assertEqual(result, [])
        self.assertGreater(int(dict(respond.call_args.args[1])["Content-Length"]), 0)

    def test_non_browser_requests_do_not_show_warning(self):
        self.assertFalse(is_browser_navigation({"PATH_INFO": "/", "HTTP_ACCEPT": "application/json"}))
