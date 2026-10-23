"""Daily résumé report: every application received in a date range, as one ZIP folder
(all résumés + an Excel-friendly report) or as the report alone.

Days are Indian Standard Time days, because that is how the firm counts a "day".
"""
import csv
import io
import re
import zipfile
from collections import OrderedDict
from datetime import date, datetime, time, timedelta, timezone
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from app.controllers.cookie_consent import csv_safe
from app.controllers.career import APPLICATIONS_COLLECTION, RESUME_BUCKET, _object_id, get_database

IST = timezone(timedelta(hours=5, minutes=30))
MAX_RESUMES_PER_DOWNLOAD = 400


class ExportError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


def parse_day(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        raise ExportError(422, "Dates must look like 2026-10-23")


def _range_utc(day_from: Optional[date], day_to: Optional[date]):
    start = datetime.combine(day_from, time.min, tzinfo=IST).astimezone(timezone.utc) if day_from else None
    end = datetime.combine(day_to + timedelta(days=1), time.min, tzinfo=IST).astimezone(timezone.utc) if day_to else None
    return start, end


def _ist(dt: Optional[datetime]) -> Optional[datetime]:
    if dt is None:
        return None
    return (dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt).astimezone(IST)


def _safe(text: str, limit: int = 40) -> str:
    text = re.sub(r"[^A-Za-z0-9]+", "_", str(text or "")).strip("_")
    return (text or "NA")[:limit]


async def load_applications(day_from: Optional[date], day_to: Optional[date], job_id: Optional[str]) -> list[dict]:
    """Applications received in the range, oldest first (one folder per day reads best that way)."""
    if day_from and day_to and day_to < day_from:
        raise ExportError(422, "The 'to' date is before the 'from' date")
    query: dict = {}
    start, end = _range_utc(day_from, day_to)
    if start or end:
        query["created_at"] = {}
        if start:
            query["created_at"]["$gte"] = start
        if end:
            query["created_at"]["$lt"] = end
    if job_id == "general":
        query["$or"] = [{"job_id": None}, {"job_id": ""}, {"job_id": {"$exists": False}}]
    elif job_id and job_id != "all":
        query["job_id"] = job_id
    docs = [d async for d in get_database()[APPLICATIONS_COLLECTION].find(query)]
    docs.sort(key=lambda d: d.get("created_at") or datetime.min)
    return docs


REPORT_COLUMNS = [
    "Sr. No", "Date (IST)", "Time (IST)", "Candidate name", "Email", "Phone", "Position applied for", "Place of residence",
    "Highest qualification", "Profile", "Current CTC", "Expected CTC", "How they heard about JHS",
    "Resume match score (%)", "Resume match result", "Application status", "Resume file in this folder",
]


def _row(n: int, d: dict, resume_name: str) -> list:
    when = _ist(d.get("created_at"))
    qual = d.get("highest_qualification") or ""
    if d.get("highest_qualification_other"):
        qual = f"{qual} - {d['highest_qualification_other']}"
    prof = d.get("profile") or ""
    if d.get("profile_other"):
        prof = f"{prof} - {d['profile_other']}"
    heard = d.get("how_heard") or ""
    if d.get("how_heard_detail"):
        heard = f"{heard} - {d['how_heard_detail']}"
    return [
        n, when.strftime("%d-%m-%Y") if when else "", when.strftime("%I:%M %p") if when else "",
        d.get("full_name", ""), d.get("email", ""), d.get("phone", ""), d.get("job_title") or "General application",
        d.get("place_of_residence") or d.get("current_location") or "", qual, prof, d.get("current_ctc") or "",
        d.get("expected_ctc") or "", heard, d.get("ats_score") if d.get("ats_score") is not None else "",
        d.get("ats_status") or "", d.get("status") or "", resume_name,
    ]


def _csv_bytes(header: list, rows: list[list]) -> bytes:
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(header)
    for r in rows:
        w.writerow([csv_safe(c) for c in r])
    return ("﻿" + buf.getvalue()).encode("utf-8")   # BOM so Excel shows every character correctly


def daily_summary(docs: list[dict]) -> list[list]:
    by_day: "OrderedDict[str, list[dict]]" = OrderedDict()
    for d in docs:
        when = _ist(d.get("created_at"))
        by_day.setdefault(when.strftime("%d-%m-%Y") if when else "Unknown", []).append(d)
    rows = []
    for day, items in by_day.items():
        rows.append([day, len(items), sum(1 for i in items if i.get("ats_status") == "matched"),
                     sum(1 for i in items if i.get("resume_file_id"))])
    return rows


def label_for(day_from: Optional[date], day_to: Optional[date]) -> str:
    if day_from and day_to and day_from == day_to:
        return day_from.strftime("%d-%m-%Y")
    if day_from or day_to:
        return f"{day_from.strftime('%d-%m-%Y') if day_from else 'start'}_to_{day_to.strftime('%d-%m-%Y') if day_to else 'today'}"
    return "all_dates"


async def report_csv(docs: list[dict]) -> bytes:
    return _csv_bytes(REPORT_COLUMNS, [_row(i, d, "") for i, d in enumerate(docs, 1)])


async def build_zip(docs: list[dict], label: str) -> bytes:
    """Folder 'JHS_Resumes_<label>' with Resumes/, Report.csv and Daily_Summary.csv."""
    if len(docs) > MAX_RESUMES_PER_DOWNLOAD:
        raise ExportError(400, f"{len(docs)} applications is too many for one download. Please choose fewer days (limit {MAX_RESUMES_PER_DOWNLOAD}).")
    root = f"JHS_Resumes_{label}"
    db = get_database()
    bucket = AsyncIOMotorGridFSBucket(db, bucket_name=RESUME_BUCKET)
    out = io.BytesIO()
    rows, missing = [], 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for n, d in enumerate(docs, 1):
            when = _ist(d.get("created_at"))
            name = ""
            fid = d.get("resume_file_id")
            if fid:
                try:
                    stream = await bucket.open_download_stream(_object_id(fid))
                    data = await stream.read()
                    name = f"{n:03d}_{_safe(d.get('full_name'))}_{_safe(d.get('job_title') or 'General')}.pdf"
                    day = when.strftime("%d-%m-%Y") if when else "Unknown"
                    z.writestr(f"{root}/Resumes/{day}/{name}", data)
                    name = f"Resumes/{day}/{name}"
                except Exception:   # a missing or unreadable file must not stop the whole download
                    name = "(resume file could not be read)"
                    missing += 1
            else:
                name = "(no resume file)"
            rows.append(_row(n, d, name))
        z.writestr(f"{root}/Report.csv", _csv_bytes(REPORT_COLUMNS, rows))
        z.writestr(f"{root}/Daily_Summary.csv", _csv_bytes(
            ["Date (IST)", "Applications received", "Good resume matches", "Resumes attached"], daily_summary(docs)))
        total = len(docs)
        z.writestr(f"{root}/READ_ME.txt",
                   f"JHS & Associates LLP - resumes received through the website\n"
                   f"Period: {label.replace('_', ' ')} (Indian Standard Time)\n"
                   f"Applications: {total}   Resumes in this folder: {total - missing}\n\n"
                   "Report.csv         - one line per candidate (open in Excel)\n"
                   "Daily_Summary.csv  - how many applications came on each day\n"
                   "Resumes/<date>/    - the resumes, one folder per day\n"
                   "Personal data: please handle and delete according to the JHS Privacy Policy.\n")
    return out.getvalue()
