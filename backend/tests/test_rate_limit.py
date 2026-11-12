"""Run: python tests/test_rate_limit.py (no database needed).

Rate limits on the API and the admin panel: per visitor, per admin account, changes, downloads, and repeated refusals.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import timedelta

from fastapi.testclient import TestClient

from app.auth import deps
from app.auth.security import create_access_token
from app.main import app
from app.utils import ratelimit as rl

ok = True


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


async def fake_admin(email):
    role = {"a@x.com": "super_admin", "b@x.com": "super_admin", "hr@x.com": "hr_admin"}[email]
    return {"_id": "x", "email": email, "password": "x", "role": role, "name": "Team"}


deps.find_admin_by_email = fake_admin
deps.get_database = lambda: {}
c = TestClient(app, raise_server_exceptions=False)


def tok(email, role="super_admin"):
    return {"Authorization": "Bearer " + create_access_token({"sub": email, "role": role, "type": "admin"}, expires_delta=timedelta(hours=1))}


a, b = tok("a@x.com"), tok("b@x.com")


def fresh(**limits):
    rl.reset()
    rl.LIMITS.update({"enabled": True, "ip_per_min": 900, "admin_per_min": 300, "admin_write_per_min": 120, "export_per_5min": 12, "refused_per_5min": 60})
    rl.LIMITS.update(limits)


# ── per admin account ──
fresh(admin_per_min=5)
codes = [c.get("/api/admin/me", headers=a).status_code for _ in range(8)]
check("an admin over the per-minute limit gets 429 (the first 5 go through)", codes[:5] == [200] * 5 and codes[5:] == [429] * 3, codes)
r = c.get("/api/admin/me", headers=a)
check("the 429 says how long to wait and keeps the security headers", int(r.headers["retry-after"]) >= 1 and r.headers.get("x-content-type-options") == "nosniff" and "Too many requests" in r.json()["detail"], r.headers.get("retry-after"))
check("a different admin account still has its own budget", c.get("/api/admin/me", headers=b).status_code == 200)

# ── normal use is not slowed ──
fresh()
codes = {c.get("/api/admin/me", headers=a).status_code for _ in range(60)}
check("60 calls in a minute (a busy admin) are fine with the default limits", codes == {200}, codes)

# ── changes are limited harder than reads ──
fresh(admin_write_per_min=3)
codes = [c.patch("/api/proposal/not-an-id/status", json={"status": "closed"}, headers=a).status_code for _ in range(6)]
check("changes (PATCH) over the tighter limit are refused (first 3 reach the route)", 429 not in codes[:3] and codes[3:] == [429] * 3, codes)
check("reads still work while changes are limited", c.get("/api/admin/me", headers=a).status_code == 200)

# ── downloads (Excel / ZIP) ──
fresh(export_per_5min=2)
codes = [c.get("/api/export/contacts", headers=a).status_code for _ in range(4)]
check("downloads over the limit are refused (first 2 allowed through to the next check)", codes[2:] == [429, 429] and 429 not in codes[:2], codes)
check("a different export URL shares the same download budget", c.get("/api/proposal/export", headers=a).status_code == 429)
check("the other admin can still download", c.get("/api/export/contacts", headers=b).status_code != 429)

# ── per visitor ──
fresh(ip_per_min=4)
codes = [c.get("/api/articles/").status_code for _ in range(7)]
check("one address over the per-visitor limit gets 429", codes[4:] == [429] * 3 and 429 not in codes[:4], codes)

# ── repeated refusals ──
fresh(refused_per_5min=5)
codes = [c.get("/api/admin/contacts").status_code for _ in range(9)]
check("an address that keeps being refused (401) is paused", codes[:5] == [401] * 5 and set(codes[5:]) == {429}, codes)
check("...and even a valid login from that address waits", c.get("/api/admin/me", headers=a).status_code == 429)

# ── other behaviour ──
fresh(ip_per_min=1)
check("CORS pre-flight (OPTIONS) is never counted", all(c.options("/api/articles/", headers={"Origin": "https://jhsassociates.in", "Access-Control-Request-Method": "GET"}).status_code != 429 for _ in range(5)))
check("pages that are not under /api/ are not counted", all(c.get("/docs").status_code != 429 for _ in range(5)))
fresh(ip_per_min=1, enabled=False)
check("the switch RATE_LIMIT_ENABLED=false turns it off", all(c.get("/api/articles/").status_code != 429 for _ in range(5)))

# ── the identity comes from a signed token only ──
fresh()
check("a forged token is not treated as an admin account", rl.admin_account("Bearer not.a.token") is None and rl.admin_account("") is None)
site_user = "Bearer " + create_access_token({"sub": "v@x.com", "uid": "u", "type": "site_user"}, expires_delta=timedelta(hours=1))
check("a visitor token is not treated as an admin account", rl.admin_account(site_user) is None)
check("an admin token gives the lower-case account name", rl.admin_account(a["Authorization"]) == "a@x.com")

fresh()
rl.reset()
print("ALL PASS" if ok else "SOME FAILED")
