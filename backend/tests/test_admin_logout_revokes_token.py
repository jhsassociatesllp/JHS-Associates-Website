"""Run: python tests/test_admin_logout_revokes_token.py (no database needed).

An admin token must stop working the moment the admin signs out (VAPT: "zero token revocation").
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import timedelta

from fastapi.testclient import TestClient

from app.auth import deps
from app.auth.security import create_access_token
from app.main import app
from app.routes import admin as ra


class Col:
    def __init__(self):
        self.rows = {}

    async def find_one(self, q, proj=None):
        return self.rows.get(q.get("jti"))

    async def create_index(self, *a, **k):
        return None

    async def update_one(self, q, upd, upsert=False):
        self.rows[q["jti"]] = upd["$set"]


class DB(dict):
    def __getitem__(self, k):
        return self.setdefault(k, Col())


db = DB()
deps.get_database = lambda: db
ra.get_database = lambda: db


async def fake_admin(email):
    return {"_id": "a1", "email": email, "password": "x", "role": "super_admin", "name": "Admin"}


deps.find_admin_by_email = fake_admin

c = TestClient(app)
tok = create_access_token({"sub": "admin@x.com", "role": "super_admin", "type": "admin"}, expires_delta=timedelta(hours=1))
h = {"Authorization": f"Bearer {tok}"}
r1 = c.get("/api/admin/me", headers=h)
r2 = c.post("/api/admin/logout", headers=h)
r3 = c.get("/api/admin/me", headers=h)
print("me before logout:", r1.status_code, "| logout:", r2.status_code, "| me after logout:", r3.status_code)
print("ALL PASS" if (r1.status_code, r2.status_code, r3.status_code) == (200, 204, 401) else "FAILED")
