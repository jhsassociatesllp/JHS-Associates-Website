"""Run: python tests/test_hr_application_email.py (no network or database needed).

The HR "new job application" mail: goes to the configured HR inbox(es), its result is saved on the application,
HR/Super Admin can resend it, and Super Admin can send a sample from the admin panel.
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import timedelta

from bson import ObjectId
from fastapi.testclient import TestClient

from app.auth import deps
from app.auth.security import create_access_token
from app.controllers import career as career_ctrl
from app.main import app
from app.services import email_service as es

ok = True


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


# ── recipients ──
check("one address", es._split_recipients("hr@jhsassociates.in") == ["hr@jhsassociates.in"])
check("several, with commas / semicolons / spaces, no repeats", es._split_recipients("hr@a.com, backup@a.com;HR@a.com  third@a.com") == ["hr@a.com", "backup@a.com", "third@a.com"])
check("junk without @ is ignored", es._split_recipients("hr, , none") == [])
es.HR_EMAIL = ""
check("empty setting falls back to hr@jhsassociates.in", es.hr_recipients() == ["hr@jhsassociates.in"])
es.HR_EMAIL = "hr@jhsassociates.in, backup@jhsassociates.in"
check("two HR inboxes configured", es.hr_recipients() == ["hr@jhsassociates.in", "backup@jhsassociates.in"])

# ── sending + recording ──
sent, saved = [], {}
fail_for = set()


async def fake_one(to, name, subject, html, headers=None):
    sent.append((to, subject, html))
    es.last_method, es.last_error = ("graph", "") if to not in fail_for else ("", f"Graph refused {to}")
    return to not in fail_for


class Col:
    async def update_one(self, q, upd):
        saved["id"], saved["set"] = q["_id"], upd["$set"]


es._send_email_one = fake_one
import app.database.connection as conn  # noqa: E402

conn.get_database = lambda: {"career_applications": Col()}

app_doc = {"_id": ObjectId(), "full_name": "Asha Rao", "email": "asha@x.com", "phone": "9876543210", "profile": "Fresher", "job_title": "Auditor"}
status = asyncio.run(es.send_hr_application_email(app_doc, "Auditor"))
check("HR mail goes to every HR inbox", [s[0] for s in sent] == ["hr@jhsassociates.in", "backup@jhsassociates.in"] and status["ok"] is True)
check("the mail carries the candidate's details", "Asha Rao" in sent[0][2] and "Fresher" in sent[0][2] and sent[0][1] == "New Job Application: Asha Rao for Auditor")
check("how it went is saved on the application", saved["id"] == app_doc["_id"] and saved["set"]["hr_email_status"]["ok"] is True and saved["set"]["hr_email_status"]["results"][0]["method"] == "graph")

sent.clear(); saved.clear(); fail_for.add("backup@jhsassociates.in")
status = asyncio.run(es.send_hr_application_email(app_doc, "Auditor"))
check("one inbox failing is reported, the other still got it", status["ok"] is False and len(sent) == 2 and [r["ok"] for r in status["results"]] == [True, False] and "Graph refused" in status["results"][1]["error"], status["results"])
check("the failure reason is saved for the admin panel", saved["set"]["hr_email_status"]["ok"] is False)

sent.clear(); fail_for.clear()
asyncio.run(es.send_hr_application_email(app_doc, "Auditor", record=False, test=True))
check("test mail is labelled TEST", sent[0][1].startswith("TEST – ") and "hr@jhsassociates.in" == sent[0][0])


async def full_flow():
    sent.clear(); saved.clear()
    await es.notify_hr_new_application(dict(app_doc), "Auditor")
    await asyncio.sleep(0.2)


asyncio.run(full_flow())
tos = sorted(s[0] for s in sent)
check("a new application mails HR and the candidate", "hr@jhsassociates.in" in tos and "asha@x.com" in tos and "backup@jhsassociates.in" in tos, tos)

# ── admin routes ──
async def fake_admin(email):
    role = {"boss@x.com": "super_admin", "hr@x.com": "hr_admin", "editor@x.com": "admin"}[email]
    return {"_id": "a1", "email": email, "password": "x", "role": role, "name": "Team"}


deps.find_admin_by_email = fake_admin
deps.get_database = lambda: {}
c = TestClient(app, raise_server_exceptions=False)


def tok(email, role):
    return {"Authorization": "Bearer " + create_access_token({"sub": email, "role": role, "type": "admin"}, expires_delta=timedelta(hours=1))}


boss, hr, editor = tok("boss@x.com", "super_admin"), tok("hr@x.com", "hr_admin"), tok("editor@x.com", "admin")
aid = str(app_doc["_id"])


async def fake_resend(application_id):
    if application_id == "bad":
        raise ValueError("bad")
    if application_id != aid:
        return None
    return await es.send_hr_application_email(app_doc, "Auditor", record=False)


career_ctrl.resend_hr_email = fake_resend
U = f"/api/careers/admin/applications/{aid}/resend-hr-email"
check("resend: no login -> 401", c.post(U).status_code == 401)
check("resend: content admin -> 403", c.post(U, headers=editor).status_code == 403)
sent.clear()
r = c.post(U, headers=hr)
check("resend: HR admin can resend, gets the result per inbox", r.status_code == 200 and r.json()["ok"] is True and len(r.json()["results"]) == 2, r.status_code)
check("resend: bad id -> 400, unknown -> 404", c.post("/api/careers/admin/applications/bad/resend-hr-email", headers=hr).status_code == 400 and c.post(f"/api/careers/admin/applications/{ObjectId()}/resend-hr-email", headers=hr).status_code == 404)

T = "/api/admin/email-health/test-hr"
check("sample test: no login -> 401, HR admin -> 403 (Super Admin only)", c.post(T).status_code == 401 and c.post(T, headers=hr).status_code == 403)
sent.clear()
from app.routes import email_health as eh  # noqa: E402

eh._last_test.clear()
r = c.post(T, headers=boss)
check("sample test: Super Admin sends the sample to every HR inbox", r.status_code == 200 and r.json()["ok"] is True and [s[0] for s in sent] == ["hr@jhsassociates.in", "backup@jhsassociates.in"] and sent[0][1].startswith("TEST"), r.status_code)
check("sample test: pressing again straight away -> 429", c.post(T, headers=boss).status_code == 429)
h = c.get("/api/admin/email-health", headers=boss).json()
check("email check shows the HR inboxes", h["inboxes"]["hr"] == "hr@jhsassociates.in, backup@jhsassociates.in", h["inboxes"]["hr"])
print("ALL PASS" if ok else "SOME FAILED")
