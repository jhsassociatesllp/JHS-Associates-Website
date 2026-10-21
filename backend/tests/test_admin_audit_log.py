"""Run: python tests/test_admin_audit_log.py (no database needed).

Admin writes and admin sign-in attempts must be recorded; visitors' form posts and plain reads must not be.
"""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import timedelta

from fastapi.testclient import TestClient

import app.main as m
from app.auth.security import create_access_token

captured = []


class _Col:
    async def find_one(self, *a, **k):
        return None


class _DB(dict):
    def __getitem__(self, k):
        return _Col()


from app.auth import deps
from app.routes import admin as ra

deps.get_database = lambda: _DB()
ra.get_database = lambda: _DB()


async def fake_write(entry):
    captured.append(entry)


m._write_audit = fake_write
c = TestClient(m.app, raise_server_exceptions=False)
admin = create_access_token({"sub": "admin@x.com", "role": "super_admin", "type": "admin"}, expires_delta=timedelta(hours=1))
visitor = create_access_token({"sub": "v@x.com", "uid": "u1", "type": "site_user"}, expires_delta=timedelta(hours=1))

c.delete("/api/articles/64b7f0c2a1b2c3d4e5f60718", headers={"Authorization": f"Bearer {admin}"})
c.post("/api/admin/login", json={"email": "someone@x.com", "password": "wrong-password"})
c.get("/api/articles/", headers={"Authorization": f"Bearer {admin}"})
c.delete("/api/articles/64b7f0c2a1b2c3d4e5f60718", headers={"Authorization": f"Bearer {visitor}"})
c.post("/api/contact/", json={"name": "A"})
time.sleep(0.3)

kinds = [(e["kind"], e["method"], e["actor"]) for e in captured]
print(kinds)
ok = (
    ("change", "DELETE", "admin@x.com") in kinds       # an admin change is recorded with who did it
    and any(k[0] == "login" for k in kinds)             # a sign-in attempt is recorded
    and len(captured) == 2                              # reads, visitor tokens and public forms are not
)
print("ALL PASS" if ok else "FAILED")
