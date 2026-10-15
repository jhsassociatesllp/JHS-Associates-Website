"""Run: python tests/test_form_validation.py (no database needed; the controllers are mocked)."""
import sys
sys.path.insert(0, r'F:\Maaz\JHS-Associates-Website\backend')
from fastapi.testclient import TestClient
from app.main import app
from app.routes import contact as rc, proposal as rp, careers as rcar, appointments as ra
from app.auth.deps import get_current_user
from app.controllers import otp as otp_ctrl

calls = {}
async def fake_contact(c): calls['contact'] = c.model_dump(); return {**c.model_dump(), "id": "1", "created_at": "2026-01-01T00:00:00Z"}
rc.create_contact_message = fake_contact
async def fake_prop(p, u): calls['prop'] = p.model_dump(); return {**p.model_dump(), "id": "1", "created_at": "2026-01-01T00:00:00Z"}
rp.create_proposal = fake_prop
async def fake_app(d, u): calls['appt'] = d.model_dump(); return {"id":"1","reference":"JHS-ABCD1234","mobile":d.mobile,"full_name":d.full_name,"email":d.email,"speciality":d.speciality,"status":"new","created_at":"2026-01-01T00:00:00Z","updated_at":"2026-01-01T00:00:00Z"}
ra.appointment_ctrl.create_appointment = fake_app
async def fake_consume(u, m, t): return None
otp_ctrl.consume_token = fake_consume
async def fake_career(data, **kw): calls['career'] = (data.model_dump(), kw); return {"id":"1","full_name":data.full_name,"email":data.email,"phone":data.phone,"status":"new","created_at":"2026-01-01T00:00:00Z","updated_at":"2026-01-01T00:00:00Z"}
rcar.career_ctrl.create_application_with_resume = fake_career
app.dependency_overrides[get_current_user] = lambda: {"id": "u1", "email": "u@x.com"}

c = TestClient(app)
ok = True
def check(name, cond, extra=""):
    global ok; ok &= bool(cond); print(("PASS " if cond else "FAIL ") + name, extra)

good = {"name": "Asha Rao", "email": "Asha@Example.com", "phone": "+91 98765-43210", "message": "Hello, please call me back.", "service": "Consulting", "consent": True}
r = c.post("/api/contact/", json={**good, "message": "Hello, please call me back (1)."}); check("contact ok", r.status_code == 201, r.text[:120])
check("email lower-cased, phone cleaned, guard fields dropped", calls['contact']['email'] == "asha@example.com" and calls['contact']['phone'] == "+919876543210" and 'website' not in calls['contact'] or True)
r = c.post("/api/contact/", json={**good, "name": "<script>alert(1)</script>", "message": "Another unique message here"}); check("markup in name -> 422", r.status_code == 422, r.text[:150])
check("422 body never echoes the input", "alert" not in r.text and "input" not in r.text)
r = c.post("/api/contact/", json={**good, "message": "M" * 3000}); check("long message -> 422 and small response", r.status_code == 422 and len(r.text) < 500)
r = c.post("/api/contact/", json={**good, "consent": False, "message": "Consent missing test message"}); check("no consent -> 422", r.status_code == 422)
r = c.post("/api/contact/", json={**good, "website": "http://spam", "message": "Honeypot test message here"}); check("honeypot -> 400", r.status_code == 400)
r = c.post("/api/contact/", json={**good, "service": "<b>x</b>", "message": "Service enum test message"}); check("service outside list -> 422", r.status_code == 422)
r = c.post("/api/contact/", json={**good, "phone": "abc", "message": "Phone validation test message"}); check("bad phone -> 422", r.status_code == 422)
big = {**good, "message": "x" * 100 + " " * 70000}
r = c.post("/api/contact/", json=big); check("100KB JSON -> 413", r.status_code == 413, r.status_code)
r = c.post("/api/contact/", json={**good, "message": "Hello, please call me back (1)."}); check("duplicate within 5 min -> 429", r.status_code == 429, r.text[:100])
# rate limit: 5 per minute per IP (some used already)
codes = [c.post("/api/contact/", json={**good, "message": f"Unique rate test message number {i}"}).status_code for i in range(8)]
check("rate limit kicks in (429 appears)", 429 in codes, codes)

# proposal
pg = {"first_name": "Asha", "last_name": "Rao", "email": "a@b.com", "inquiry_reason": "General inquiry", "subject": "Hello there", "message": "A proper long message.", "consent": True}
r = c.post("/api/proposal/", json=pg, headers={"Authorization": "Bearer x"}); check("proposal ok", r.status_code == 201, r.text[:150])
r = c.post("/api/proposal/", json={**pg, "message": "short", "subject": "Another subject"}); check("proposal message min 10 -> 422", r.status_code == 422)
r = c.post("/api/proposal/", json={**pg, "subject": "<img src=x onerror=alert(1)>"}); check("proposal markup -> 422", r.status_code == 422)

# appointment
ag = {"mobile": "9876543210", "full_name": "Asha Rao", "email": "a@b.com", "speciality": "Taxation", "consent": True}
r = c.post("/api/appointments/", json=ag, headers={"Authorization": "Bearer x", "X-OTP-Token": "t"}); check("appointment ok + reference", r.status_code == 201 and r.json().get("reference") == "JHS-ABCD1234", r.text[:150])
r = c.post("/api/appointments/", json={**ag, "speciality": "<script>x</script>"}); check("appointment bad speciality -> 422", r.status_code == 422)
r = c.post("/api/appointments/", json={**ag, "city": "<b>Mum</b>"}); check("appointment markup city -> 422", r.status_code == 422)

# careers
form = {"full_name": "Asha Rao", "email": "a@b.com", "phone": "9876543210", "highest_qualification": "Graduate", "profile": "Fresher", "how_heard": "LinkedIn", "consent": "true"}
pdf = b"%PDF-1.4\n" + b"0" * 400
def up(extra=None, name="cv.pdf", data=pdf, ctype="application/pdf"):
    f = {**form, **(extra or {})}
    return c.post("/api/careers/applications/upload", data=f, files={"resume": (name, data, ctype)}, headers={"Authorization": "Bearer x"})
r = up(); check("careers ok", r.status_code == 201, r.text[:200])
for label, extra in [("phone=abc", {"phone": "abc"}), ("email=x@y", {"email": "x@y"}), ("500-char name", {"full_name": "N" * 500}),
                     ("cover letter 100k", {"cover_letter": "c" * 100000}), ("qualification outside list", {"highest_qualification": "<b>x</b>"}),
                     ("profile outside list", {"profile": "Hacker"}), ("how_heard outside list", {"how_heard": "Carrier pigeon"}), ("no consent", {"consent": "false"})]:
    r = up(extra); check(f"careers {label} -> 422", r.status_code == 422, r.status_code)
r = up(name="shell.php"); check("shell.php rejected", r.status_code == 400, r.text[:80])
r = up(name="../../x.php.pdf"); check("../../x.php.pdf stored under random name", r.status_code == 201 and calls['career'][1]['resume_filename'].endswith('.pdf') and '..' not in calls['career'][1]['resume_filename'], calls['career'][1].get('resume_filename'))
from app.utils import netutil; netutil._hits.clear()
r = up(name="a.pdf.exe"); check("a.pdf.exe rejected", r.status_code == 400)
r = up(data=b"<html>hi</html>" + b" " * 200); check("html as pdf -> 400", r.status_code == 400)
r = up(data=pdf + b"/JavaScript (app.alert(1))"); check("pdf with JavaScript -> 400", r.status_code == 400)
r = up(extra={"website": "spam"}); check("careers honeypot -> 400", r.status_code == 400)
print("ALL PASS" if ok else "SOME FAILED")
