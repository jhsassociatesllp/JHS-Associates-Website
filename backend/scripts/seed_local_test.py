"""Fills a LOCAL test database (Docker, port 27018) with one admin login and a few sample proposal requests,
so the admin panel can be tried on a computer that cannot reach the real database.

Run (from the backend folder):   python scripts/seed_local_test.py

It refuses to run against anything that is not on this computer, so it can never touch real data.

Local test login (works only against this local database):
    Email   : maaz.quraishi@jhsassociates.in      (so the "Email Check" test mail lands in your own inbox)
    Password: LocalTest@2026
    Role    : Super Admin
"""
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pymongo import MongoClient

URL = os.environ.get("LOCAL_MONGODB_URL", "mongodb://localhost:27018/")
DB = os.environ.get("LOCAL_DATABASE_NAME", "JHS_local_test")

if not any(h in URL for h in ("localhost", "127.0.0.1")):
    sys.exit("Refusing to run: this script only works on a MongoDB on this computer, never the real one.")

from app.auth.security import get_password_hash  # noqa: E402

db = MongoClient(URL, serverSelectionTimeoutMS=8000)[DB]
now = datetime.now(timezone.utc)

db["admins"].delete_many({"email": "maaz.quraishi@jhsassociates.in"})
db["admins"].insert_one({
    "email": "maaz.quraishi@jhsassociates.in", "password": get_password_hash("LocalTest@2026"),
    "role": "super_admin", "name": "Maaz (local test)", "created_at": now.isoformat(),
})

db["proposals"].delete_many({"_seed": True})


def proposal(first, last, email, phone, reason, subject, message, ago_hours, **extra):
    return {"_seed": True, "first_name": first, "last_name": last, "email": email, "phone": phone, "inquiry_reason": reason,
            "subject": subject, "message": message, "user_id": "local", "created_at": now - timedelta(hours=ago_hours), **extra}


db["proposals"].insert_many([
    proposal("Asha", "Rao", "asha@example.com", "9876543210", "Request for services", "Statutory audit for FY 2026-27",
             "We are a Pune based manufacturing company and need a proposal for statutory audit and GST compliance.", 2),
    proposal("Bilal", "Khan", "bilal@example.com", "9123456780", "Partnership opportunity", "Partnership with your tax team",
             "Looking to partner on cross-border tax advisory.", 26, status="in_review", admin_note="Called on 27 Oct. Waiting for the NDA.",
             handled_by="maaz.quraishi@jhsassociates.in", updated_at=now - timedelta(hours=20)),
    proposal("Chitra", "Nair", "chitra@example.com", None, "General inquiry", "Fees for virtual CFO services",
             "Please share your fee structure.", 100, status="proposal_sent", handled_by="maaz.quraishi@jhsassociates.in", updated_at=now - timedelta(hours=70)),
    proposal("Dev", "Patel", "dev@example.com", "9000000001", "Other", "Startup compliance package",
             "Need the start-up compliance listing.", 220, status="closed"),
    proposal("Esha", "Mehta", "esha@example.com", "9000000002", "Request for services", "GST registration for a new firm",
             "An older request saved before statuses existed (it has no status field).", 400),
])
print(f"Seeded {URL}{DB}: 1 admin login, {db['proposals'].count_documents({})} proposal requests.")
