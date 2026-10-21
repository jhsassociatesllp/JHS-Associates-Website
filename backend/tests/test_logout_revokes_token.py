"""Run: python tests/test_logout_revokes_token.py (no database needed; the controllers are mocked)."""
import sys
sys.path.insert(0, r'F:\Maaz\JHS-Associates-Website\backend')
from datetime import timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.auth import deps
from app.routes import auth as ra
from app.auth.security import create_access_token

class Col:
    def __init__(self): self.rows = {}
    async def find_one(self, q, proj=None): return self.rows.get(q.get("jti"))
    async def create_index(self, *a, **k): return None
    async def update_one(self, q, upd, upsert=False): self.rows[q["jti"]] = upd["$set"]

class DB(dict):
    def __getitem__(self, k): return self.setdefault(k, Col())

db = DB()
deps.get_database = lambda: db
ra.get_database = lambda: db
import app.controllers.user as uc
async def fake_user(uid): return {"id": uid, "email": "u@x.com", "status": "active", "name": "U", "first_name": "U", "last_name": "", "is_verified": True, "auth_provider": "password", "created_at": "2026-01-01T00:00:00Z"}
uc.get_user_by_id = fake_user

c = TestClient(app)
tok = create_access_token({"sub": "u@x.com", "uid": "u1", "type": "site_user"}, expires_delta=timedelta(hours=1))
h = {"Authorization": f"Bearer {tok}"}
r1 = c.get("/api/auth/me", headers=h); print("me before logout:", r1.status_code)
r2 = c.post("/api/auth/logout", headers=h); print("logout:", r2.status_code)
r3 = c.get("/api/auth/me", headers=h); print("me after logout:", r3.status_code)
ok = r1.status_code == 200 and r2.status_code == 204 and r3.status_code == 401
print("ALL PASS" if ok else "FAILED")
