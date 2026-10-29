"""Run: python tests/test_email_health.py (no network, no database needed).

The admin "Email check": Super Admin only, never shows secrets, reports how a test mail went.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import timedelta

from fastapi.testclient import TestClient

from app.auth import deps
from app.auth.security import create_access_token
from app.main import app
from app.routes import email_health as eh
from app.services import email_service as es

SECRET = "very-secret-client-value-999"
es.GRAPH_TENANT_ID, es.GRAPH_CLIENT_ID, es.GRAPH_CLIENT_SECRET, es.GRAPH_SENDER = "tenant-1", "client-1", SECRET, "connect@jhsassociates.in"
es.SMTP_USERNAME, es.SMTP_PASSWORD = "maaz@jhsassociates.in", "smtp-pass-123"


async def fake_admin(email):
    role = "super_admin" if email == "boss@x.com" else "hr_admin"
    return {"_id": "a1", "email": email, "password": "x", "role": role, "name": "Team"}


deps.find_admin_by_email = fake_admin
c = TestClient(app, raise_server_exceptions=False)


def tok(email, role):
    return {"Authorization": "Bearer " + create_access_token({"sub": email, "role": role, "type": "admin"}, expires_delta=timedelta(hours=1))}


boss, hr = tok("boss@x.com", "super_admin"), tok("hr@x.com", "hr_admin")
ok = True


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


U = "/api/admin/email-health"
check("no login -> 401 (view and test)", c.get(U).status_code == 401 and c.post(U + "/test").status_code == 401)
check("HR admin -> 403 (Super Admin only)", c.get(U, headers=hr).status_code == 403 and c.post(U + "/test", headers=hr).status_code == 403)

r = c.get(U, headers=boss)
body = r.text
check("Super Admin sees the set-up", r.status_code == 200 and r.json()["graph"]["configured"] is True and r.json()["graph"]["sender"] == "connect@jhsassociates.in" and "Graph" in r.json()["will_use"])
check("no secret value is ever returned", SECRET not in body and "smtp-pass-123" not in body and "tenant-1" not in body and "client-1" not in body, r.json()["graph"])

sent = []


async def graph_ok(to, name, subject, html, headers=None):
    sent.append(("graph", to))
    return True


es._send_via_graph = graph_ok
eh._last_test.clear()
r = c.post(U + "/test", headers=boss)
check("test mail via Graph -> ok, sent to the logged-in admin only", r.json()["ok"] is True and r.json()["method"] == "Microsoft Graph" and sent == [("graph", "boss@x.com")], r.json())
check("pressing again straight away -> 429", c.post(U + "/test", headers=boss).status_code == 429)


async def graph_bad(to, name, subject, html, headers=None):
    raise es.GraphError("Graph refused to send as that mailbox. [HTTP 403]")


async def smtp_ok(to, name, subject, html, headers=None):
    return True


es._send_via_graph, es._send_via_smtp = graph_bad, smtp_ok
eh._last_test.clear()
r = c.post(U + "/test", headers=boss)
check("Graph fails, SMTP works -> ok via SMTP, Graph reason shown", r.json()["ok"] is True and r.json()["method"] == "SMTP" and "403" in r.json()["graph_error"], r.json())


async def smtp_bad(to, name, subject, html, headers=None):
    es.last_error = "Microsoft refused the login."
    return False


es._send_via_smtp = smtp_bad
eh._last_test.clear()
r = c.post(U + "/test", headers=boss)
check("both fail -> not ok, both reasons shown", r.json()["ok"] is False and r.json()["graph_error"] and "refused the login" in r.json()["smtp_error"], r.json())
print("ALL PASS" if ok else "SOME FAILED")
