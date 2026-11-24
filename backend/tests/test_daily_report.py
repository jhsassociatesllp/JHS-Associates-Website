"""Run: python tests/test_daily_report.py   (no database, no email needed)

Founder's daily report: counts yesterday's IST day only, builds the Excel + résumés ZIP, sends once a day.
Also writes a preview of the email to tests/_daily_report_preview/ so it can be opened in a browser.
"""
import asyncio
import io
import os
import sys
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

from bson import ObjectId
from mongomock_motor import AsyncMongoMockClient
from openpyxl import load_workbook

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.controllers import career, career_export as cx, daily_report as dr
from app.services import email_service as es

IST = timezone(timedelta(hours=5, minutes=30))
DAY = dr.yesterday_ist()


def at(day, h, mi):
    return datetime(day.year, day.month, day.day, h, mi, tzinfo=IST).astimezone(timezone.utc)


FILES = {}
db = AsyncMongoMockClient()["t"]
dr.get_database = lambda: db
cx.get_database = lambda: db
career.get_database = lambda: db


class FakeBucket:
    def __init__(self, d, bucket_name=None): pass
    async def open_download_stream(self, oid):
        data = FILES[str(oid)]
        class S:
            async def read(s): return data
        return S()


cx.AsyncIOMotorGridFSBucket = FakeBucket
sent = []


async def fake_send(to, name, subject, html, headers=None, attachments=None):
    sent.append({"to": to, "subject": subject, "html": html, "attachments": attachments})
    return True


es._send_email_one = fake_send


async def seed():
    two_days_ago, today = DAY - timedelta(days=1), DAY + timedelta(days=1)
    for who, when in (("Asha Rao", at(DAY, 9, 5)), ("Bilal Khan", at(DAY, 23, 59)), ("Old One", at(two_days_ago, 23, 59)), ("Today One", at(today, 0, 1))):
        fid = ObjectId()
        FILES[str(fid)] = b"%PDF-1.4 " + who.encode()
        await db["career_applications"].insert_one({"full_name": who, "email": who.split()[0].lower() + "@x.com", "phone": "9876543210", "job_title": "Senior Auditor",
                                                    "created_at": when, "resume_file_id": str(fid), "ats_score": 70, "ats_status": "matched", "profile": "Fresher"})
    for i, when in enumerate((at(DAY, 10, 0), at(DAY, 11, 0), at(DAY, 12, 0), at(two_days_ago, 12, 0))):
        await db["contact_us"].insert_one({"name": f"Contact {i}", "email": f"c{i}@x.com", "phone": "9000000000", "service": "Tax", "message": "Need help with GST", "created_at": when})
    await db["proposals"].insert_one({"first_name": "Ravi", "last_name": "Shah", "email": "r@x.com", "inquiry_reason": "Audit", "subject": "Statutory audit", "message": "Please send a proposal", "created_at": at(DAY, 14, 0)})
    await db["appointments"].insert_one({"full_name": "Meena", "mobile": "9876500000", "email": "m@x.com", "speciality": "Tax", "partner": "Mumbai Partner", "reference": "APT-1", "created_at": at(DAY, 15, 0)})
    await db["consultation_requests"].insert_one({"user_name": "Imran", "user_email": "i@x.com", "partner_name": "Hyderabad Partner", "appointment_type": "Advisory", "created_at": at(DAY, 16, 0)})
    await db["feedback"].insert_one({"client_name": "Acme Ltd", "name": "Sunil", "designation": "CFO", "overall": 5, "created_at": at(DAY, 17, 0)})


async def main():
    await seed()
    data = await dr.collect(DAY)
    counts = {k: len(v) for k, v in data.items()}
    assert counts["resumes"] == 2, counts      # only yesterday (IST): 23:59 in, 00:01 next day out
    assert counts["contacts"] == 3 and counts["proposals"] == 1 and counts["appointments"] == 1 and counts["consultations"] == 1 and counts["feedback"] == 1, counts

    result = await dr.send_report(DAY, "test@example.com, second@example.com")
    assert result["sent"] and result["recipients"] == ["test@example.com", "second@example.com"] and len(sent) == 2, result
    assert [r["ok"] for r in result["results"]] == [True, True]
    sent.pop()
    mail = sent[-1]
    names = [a[0] for a in mail["attachments"]]
    assert names == [f"JHS_Daily_Report_{DAY.strftime('%d-%m-%Y')}.xlsx", f"JHS_Resumes_{DAY.strftime('%d-%m-%Y')}.zip"], names
    wb = load_workbook(io.BytesIO(mail["attachments"][0][1]))
    assert wb["Summary"]["B5"].value == 2 and "Contact Us messages" in wb.sheetnames
    assert wb["Contact Us messages"].max_row == 4
    z = zipfile.ZipFile(io.BytesIO(mail["attachments"][1][1]))
    pdfs = [n for n in z.namelist() if n.endswith(".pdf")]
    assert len(pdfs) == 2 and any(n.endswith("Tracker.xlsx") for n in z.namelist()), z.namelist()
    assert "Asha Rao" in mail["html"] and "Old One" not in mail["html"] and "Today One" not in mail["html"]
    assert "3 contacts" in mail["subject"] and "2 resumes" in mail["subject"], mail["subject"]

    # sent once a day: first call claims and sends, second finds the mark
    dr.settings.daily_report_hour = 0
    sent.clear()
    assert await dr.run_once() is True and len(sent) == 1
    assert await dr.run_once() is True and len(sent) == 1, "must not send twice"
    # a failed send releases the claim so it is retried
    await db["app_meta"].delete_many({})
    async def failing(*a, **k): return False
    es._send_email_one = failing
    assert await dr.run_once() is False
    assert not await db["app_meta"].find_one({"_id": f"daily_report_{DAY.isoformat()}"})

    # quiet day
    quiet = await dr.build_report(DAY - timedelta(days=30))
    assert "Nothing new came in" in quiet["html"] and quiet["counts"]["resumes"] == 0 and len(quiet["attachments"]) == 1

    out = Path(__file__).parent / "_daily_report_preview"
    out.mkdir(exist_ok=True)
    (out / "index.html").write_text(mail["html"], encoding="utf-8")
    for name, data_, _ in mail["attachments"]:
        (out / name).write_bytes(data_)
    print("daily report tests passed; preview in", out)


asyncio.run(main())
