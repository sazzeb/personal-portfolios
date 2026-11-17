"""A self-contained, non-interactive warning for direct browser navigation."""

import base64
import hashlib

STYLE = """
:root{color-scheme:dark;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
background:#06090c;color:#eff9fc;font-synthesis:none}
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;
padding:28px;overflow-x:hidden;background:radial-gradient(ellipse at 50% 35%,#12313a80,transparent 65%)}
body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.25;
background-image:linear-gradient(#37d6f00d 1px,transparent 1px),
linear-gradient(90deg,#37d6f00d 1px,transparent 1px);background-size:52px 52px;
mask-image:radial-gradient(ellipse,#000,transparent 80%);animation:grid-drift 20s linear infinite}
.shell{position:relative;width:min(100%,1040px);isolation:isolate;animation:arrive .8s ease-out}
.topline,.bottomline{display:flex;justify-content:space-between;gap:20px;align-items:center;
font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8fa7b0}
.brand{font-weight:700;color:#e5f6fb}.status{display:flex;align-items:center;gap:9px}
.dot{width:6px;height:6px;background:#ffb65b;border-radius:50%;box-shadow:0 0 18px #ffb65b;
animation:signal 2s ease-in-out infinite}
.panel{position:relative;margin:24px 0;border:1px solid #4ad9f02b;border-radius:28px;
padding:clamp(28px,6vw,70px);overflow:hidden;background:linear-gradient(135deg,#10222ccf,#090e15f2 65%);
box-shadow:0 30px 100px #0008}
.panel:before{content:"";position:absolute;inset:0;pointer-events:none;
background:linear-gradient(110deg,transparent 30%,#76e4ff08 48%,transparent 66%);
transform:translateX(-100%);animation:sweep 6s ease-in-out infinite}
.layout{position:relative;display:grid;grid-template-columns:1fr 250px;gap:38px;align-items:center}
.eyebrow{color:#ffbd71;font-size:11px;letter-spacing:.22em;text-transform:uppercase;
display:flex;align-items:center;gap:10px;margin:0 0 24px}
.eyebrow:before{content:"";width:24px;height:1px;background:currentColor}
h1{font-size:clamp(38px,5.8vw,66px);font-weight:650;line-height:1.05;letter-spacing:-.055em;
margin:0 0 24px;max-width:640px}h1 span{display:block;color:#61def1}
.description{font-size:15px;line-height:1.8;color:#a7bbc4;max-width:490px;margin:0}
.notice{margin-top:28px;border-left:2px solid #ffb65b;padding:10px 0 10px 18px;
font-size:12px;line-height:1.8;color:#d4dde2;max-width:440px}
.visual{position:relative;display:grid;place-items:center;aspect-ratio:1}
.orbit{position:absolute;inset:0;border:1px solid #64d9f027;border-radius:50%;
animation:rotate 24s linear infinite}.orbit:before{content:"";position:absolute;top:50%;left:-4px;
width:7px;height:7px;background:#5ae0f3;box-shadow:0 0 16px #5ae0f3;border-radius:50%}
.orbit.second{inset:22px;border-style:dashed;animation-direction:reverse;animation-duration:40s;
border-color:#ffbd7133}.orbit.second:before{background:#ffbd71;box-shadow:0 0 15px #ffbd71}
.core{position:relative;width:148px;height:148px;border-radius:50%;display:grid;place-items:center;
background:radial-gradient(circle,#193743,#10202d 65%);box-shadow:0 0 60px #43d6ee16;
border:1px solid #6be4f333;animation:breathe 4s ease-in-out infinite}
.shield{width:62px;height:72px;fill:none;stroke:#75e6f4;stroke-width:1.3}
.code{position:absolute;bottom:-34px;font:10px ui-monospace,monospace;letter-spacing:.18em;color:#79a7b6}
.divider{height:1px;background:linear-gradient(90deg,#4ad9f030,transparent);margin:40px 0 26px}
.timer-row{display:flex;align-items:center;justify-content:space-between;gap:20px}
.timer-label{font-size:11px;color:#9fb6c1;letter-spacing:.13em;text-transform:uppercase}
.count{font:24px ui-monospace,monospace;color:#e8fbff;white-space:nowrap}
.track{margin-top:16px;height:3px;border-radius:9px;background:#ffffff0b;overflow:hidden}
.progress{height:100%;width:100%;background:linear-gradient(90deg,#34d4ee,#ffbc74);
transform-origin:left;animation:countdown 15s linear forwards}
.bottomline{font-size:9px;line-height:1.7}.closed{text-align:center;max-width:620px}
.closed p{color:#a7bbc4;line-height:1.8}.closed h1{margin:20px auto}
[hidden]{display:none!important}body[data-expired] *{animation:none!important}
@keyframes arrive{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes signal{50%{opacity:.4}}@keyframes rotate{to{transform:rotate(360deg)}}
@keyframes breathe{50%{box-shadow:0 0 85px #43d6ee2b;transform:scale(1.035)}}
@keyframes sweep{45%,100%{transform:translateX(100%)}}
@keyframes grid-drift{to{background-position:52px 52px}}
@keyframes countdown{to{transform:scaleX(0)}}
@media(max-width:680px){body{padding:22px}.layout{grid-template-columns:1fr;gap:30px}
.visual{width:180px;margin:8px auto 28px;grid-row:1}.core{width:112px;height:112px}
.shield{width:48px;height:56px}.topline,.bottomline{font-size:9px;letter-spacing:.1em}
.topline{align-items:flex-start}.panel{border-radius:20px}.divider{margin:28px 0 22px}
.timer-label{max-width:220px;line-height:1.8}.bottomline{align-items:flex-start}}
@media(prefers-reduced-motion:reduce){*,body:before{animation:none!important}
.progress{background:#65dff1}}
"""

SCRIPT = """
(() => {
  const duration = 15;
  const deadline = performance.now() + duration * 1000;
  const counter = document.getElementById('count');
  const expire = () => {
    clearInterval(interval);
    document.body.dataset.expired = 'true';
    document.getElementById('warning').hidden = true;
    document.getElementById('closed').hidden = false;
    document.title = 'Access closed | Eko Samuel';
    try { window.close(); } catch (_) { /* Browser may keep manual tabs open. */ }
  };
  const interval = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
    counter.textContent = String(remaining).padStart(2, '0') + ' s';
    if (!remaining) expire();
  }, 200);
})();
"""

HTML = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Restricted access | Eko Samuel</title><style>""" + STYLE + """</style></head>
<body><main id="warning" class="shell">
  <header class="topline"><span class="brand">Eko Samuel</span>
    <span class="status"><span class="dot" aria-hidden="true"></span>Restricted gateway</span></header>
  <section class="panel" aria-labelledby="warning-title">
    <div class="layout"><div>
      <p class="eyebrow">Unauthorized page access</p>
      <h1 id="warning-title">This space is<span>off limits.</span></h1>
      <p class="description">You are accessing a restricted service page.
        This address is reserved for authorized application requests and is not a public website.</p>
      <p class="notice">This view will close automatically. If your browser prevents the tab
        from closing, this page will display an access-closed notice instead.</p>
    </div><div class="visual" aria-hidden="true">
      <div class="orbit"></div><div class="orbit second"></div><div class="core">
      <svg class="shield" viewBox="0 0 64 76"><path d="M32 4 57 15v21c0 17-14 29-25 36C21 65 7 53 7 36V15Z"/>
        <rect x="21" y="32" width="22" height="19" rx="4"/>
        <path d="M25 32v-7a7 7 0 0 1 14 0v7M32 39v5"/></svg>
      <span class="code">403 / ACCESS RESTRICTED</span></div>
    </div></div><div class="divider"></div>
    <div class="timer-row"><span class="timer-label">Automatic view closure in</span>
      <span class="count" id="count" aria-hidden="true">15 s</span></div>
    <p class="sr-notice" hidden>This view closes after 15 seconds.</p>
    <div class="track" aria-hidden="true"><div class="progress"></div></div>
    <noscript><p class="notice">Automatic closure requires JavaScript. This remains a restricted page.</p></noscript>
  </section><footer class="bottomline"><span>Private service / Eko Samuel</span>
    <span>Direct browser access is restricted</span></footer>
</main><section id="closed" class="shell closed" hidden aria-labelledby="closed-title">
  <p class="eyebrow">Restricted gateway</p><h1 id="closed-title">Access closed.</h1>
  <p>This view has expired. This address does not provide public access.</p>
</section><script>""" + SCRIPT + """</script></body></html>"""


def is_browser_navigation(environ: dict) -> bool:
    return (
        environ.get("REQUEST_METHOD", "GET") in {"GET", "HEAD"}
        and environ.get("PATH_INFO", "") != "/health"
        and "text/html" in environ.get("HTTP_ACCEPT", "").lower()
    )


def warning_response(environ: dict, start_response):
    body = HTML.encode("utf-8")
    def digest(content: str) -> str:
        return base64.b64encode(hashlib.sha256(content.encode()).digest()).decode()
    policy = (
        "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; "
        "style-src 'sha256-" + digest(STYLE) + "'; "
        "script-src 'sha256-" + digest(SCRIPT) + "'"
    )
    start_response("403 Forbidden", [
        ("Content-Type", "text/html; charset=utf-8"),
        ("Content-Length", str(len(body))),
        ("Cache-Control", "no-store"),
        ("Vary", "Accept"),
        ("Content-Security-Policy", policy),
        ("X-Content-Type-Options", "nosniff"),
        ("X-Robots-Tag", "noindex, nofollow, noarchive"),
        ("Referrer-Policy", "no-referrer"),
    ])
    return [] if environ.get("REQUEST_METHOD") == "HEAD" else [body]
