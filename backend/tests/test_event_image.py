"""Run: python tests/test_event_image.py (no database needed).

Event thumbnail pictures: admin-only upload, re-encoded to WebP, public read, replace and remove.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import datetime, timedelta, timezone
from io import BytesIO

from bson import ObjectId
from fastapi.testclient import TestClient
from PIL import Image

from app.auth import deps
from app.auth.security import create_access_token
from app.controllers import event as ctrl
from app.main import app


class Cursor:
    def __init__(self, rows):
        self.rows = rows

    def __aiter__(self):
        self._it = iter(self.rows)
        return self

    async def __anext__(self):
        try:
            return next(self._it)
        except StopIteration:
            raise StopAsyncIteration


def matches(doc, q):
    for k, v in q.items():
        if isinstance(v, dict) and "$in" in v:
            if doc.get(k) not in v["$in"]:
                return False
        elif doc.get(k) != v:
            return False
    return True


class Col:
    def __init__(self):
        self.rows = {}

    async def find_one(self, q, proj=None):
        for d in self.rows.values():
            if matches(d, q):
                return dict(d)
        return None

    def find(self, q=None):
        return Cursor([dict(d) for d in self.rows.values() if matches(d, q or {})])

    async def insert_one(self, doc):
        doc = dict(doc)
        doc.setdefault("_id", ObjectId())
        self.rows[doc["_id"]] = doc

        class R:
            inserted_id = doc["_id"]
        return R

    async def update_one(self, q, upd):
        for d in self.rows.values():
            if matches(d, q):
                d.update(upd.get("$set", {}))
                for k in upd.get("$unset", {}):
                    d.pop(k, None)

                class R:
                    matched_count = 1
                return R

        class R0:
            matched_count = 0
        return R0

    async def delete_one(self, q):
        for k, d in list(self.rows.items()):
            if matches(d, q):
                del self.rows[k]

                class R:
                    deleted_count = 1
                return R

        class R0:
            deleted_count = 0
        return R0

    async def create_index(self, *a, **k):
        return None


class DB(dict):
    def __getitem__(self, k):
        return self.setdefault(k, Col())


db = DB()
ctrl.get_database = lambda: db
deps.get_database = lambda: db


async def fake_admin(email):
    return {"_id": "a1", "email": email, "password": "x", "role": "super_admin", "name": "Admin"}


deps.find_admin_by_email = fake_admin

now = datetime.now(timezone.utc)
event_id = ObjectId()
db["events"].rows[event_id] = {"_id": event_id, "title": "Test event", "start_at": now + timedelta(days=3), "status": "published", "registered": 0, "capacity": 0}

c = TestClient(app, raise_server_exceptions=False)
admin = {"Authorization": "Bearer " + create_access_token({"sub": "a@x.com", "role": "super_admin", "type": "admin"}, expires_delta=timedelta(hours=1))}
visitor = {"Authorization": "Bearer " + create_access_token({"sub": "v@x.com", "uid": "u", "type": "site_user"}, expires_delta=timedelta(hours=1))}

ok = True


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


def png(size=(2400, 1200)):
    buf = BytesIO()
    Image.new("RGB", size, (200, 30, 60)).save(buf, format="PNG")
    return buf.getvalue()


url = f"/api/events/admin/{event_id}/image"
check("no login -> 401", c.post(url, files={"image": ("a.png", png(), "image/png")}).status_code == 401)
check("visitor login -> 401", c.post(url, files={"image": ("a.png", png(), "image/png")}, headers=visitor).status_code == 401)
check("HTML disguised as picture -> 400", c.post(url, files={"image": ("a.png", b"<script>alert(1)</script>", "image/png")}, headers=admin).status_code == 400)
check("over 5 MB -> 400", c.post(url, files={"image": ("a.png", b"0" * (5 * 1024 * 1024 + 10), "image/png")}, headers=admin).status_code == 400)

r = c.post(url, files={"image": ("a.png", png(), "image/png")}, headers=admin)
check("admin upload ok", r.status_code == 200 and r.json().get("image_id"), r.text[:100])
first = r.json().get("image_id")
g = c.get(f"/api/events/image/{first}")
img = Image.open(BytesIO(g.content)) if g.status_code == 200 else None
check("public can read it as WebP, at most 1600 px wide", g.status_code == 200 and g.headers["content-type"] == "image/webp" and img.format == "WEBP" and img.width == 1600, (g.status_code, img and img.size))
check("sandbox header on the picture", "sandbox" in g.headers.get("content-security-policy", ""))

r2 = c.post(url, files={"image": ("b.png", png((800, 400)), "image/png")}, headers=admin)
second = r2.json().get("image_id")
check("replace gives a new id and removes the old file", second and second != first and c.get(f"/api/events/image/{first}").status_code == 404 and c.get(f"/api/events/image/{second}").status_code == 200)
check("listing shows image_id", any(e.get("image_id") == second for e in c.get("/api/events/").json()))

check("unknown picture -> 404", c.get(f"/api/events/image/{ObjectId()}").status_code == 404)
check("bad id -> 404", c.get("/api/events/image/not-an-id").status_code == 404)

check("remove needs admin", c.delete(url).status_code == 401)
r3 = c.delete(url, headers=admin)
check("admin remove ok", r3.status_code == 200 and not r3.json().get("image_id") and c.get(f"/api/events/image/{second}").status_code == 404)
print("ALL PASS" if ok else "SOME FAILED")
