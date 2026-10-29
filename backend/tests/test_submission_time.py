"""Run: python tests/test_submission_time.py (no database or mail server needed).

Every form stores the exact moment it was submitted: `created_at` (UTC) and `submitted_at_ist` (readable Indian time).
"""
import asyncio
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import datetime, timedelta, timezone

from app.controllers import alumni as alumni_ctrl
from app.controllers import contact as contact_ctrl
from app.controllers import proposal as proposal_ctrl
from app.schemas.alumni import AlumniCreate
from app.schemas.contact import ContactCreate
from app.schemas.proposal import ProposalCreate
from app.utils.timestamps import IST, submitted_at_ist

saved = {}


class Col:
    def __init__(self, name):
        self.name = name

    async def insert_one(self, doc):
        saved[self.name] = dict(doc)

        class R:
            inserted_id = "id1"
        return R()


class DB(dict):
    def __getitem__(self, k):
        return Col(k)


async def noop(*a, **k):
    return None


for mod in (alumni_ctrl, contact_ctrl, proposal_ctrl):
    mod.get_database = lambda: DB()
alumni_ctrl.notify_hr_new_alumni = contact_ctrl.notify_hr_new_contact = proposal_ctrl.notify_hr_new_proposal = noop

ok = True


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


# the readable stamp
fixed = datetime(2026, 10, 29, 10, 12, 30, tzinfo=timezone.utc)
check("UTC 10:12:30 reads as 03:42:30 PM IST", submitted_at_ist(fixed) == "29-10-2026 03:42:30 PM IST", submitted_at_ist(fixed))
check("just after Indian midnight is the next Indian day", submitted_at_ist(datetime(2026, 10, 28, 18, 31, 0, tzinfo=timezone.utc)) == "29-10-2026 12:01:00 AM IST")
check("a time with no zone is read as UTC", submitted_at_ist(datetime(2026, 10, 29, 10, 12, 30)) == "29-10-2026 03:42:30 PM IST")


def stamp_ok(doc):
    created = doc["created_at"]
    ist_text = doc["submitted_at_ist"]
    same_moment = created.astimezone(IST).strftime("%d-%m-%Y %I:%M:%S %p IST") == ist_text
    recent = abs((datetime.now(timezone.utc) - created).total_seconds()) < 30
    return same_moment and recent and re.fullmatch(r"\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} (AM|PM) IST", ist_text) is not None


asyncio.run(contact_ctrl.create_contact_message(ContactCreate(name="Asha Rao", email="asha@x.com", message="Hello, I need a proposal please.")))
check("Contact form: created_at + submitted_at_ist stored, same moment", stamp_ok(saved["contact_us"]), saved["contact_us"]["submitted_at_ist"])

asyncio.run(alumni_ctrl.create_alumni_registration(AlumniCreate(first_name="Bilal", last_name="Khan", email="bilal@x.com", company="Acme", designation="Manager", tenure="2019-2022", last_role="Senior Auditor")))
check("Alumni form: both stored, same moment", stamp_ok(saved["alumni"]), saved["alumni"]["submitted_at_ist"])

asyncio.run(proposal_ctrl.create_proposal(ProposalCreate(first_name="Chitra", last_name="Nair", email="chitra@x.com", inquiry_reason="General inquiry", subject="Fees question", message="Please share your fees."), {"id": "u1"}))
check("Request for Proposal: both stored, same moment", stamp_ok(saved["proposals"]), saved["proposals"]["submitted_at_ist"])
print("ALL PASS" if ok else "SOME FAILED")
