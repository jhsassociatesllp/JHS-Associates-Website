"""Daily résumé report: every application received in a date range, as one ZIP folder
(all résumés + an Excel-friendly report) or as the report alone.

Days are Indian Standard Time days, because that is how the firm counts a "day".
"""
import io
import re
import zipfile
from collections import OrderedDict
from datetime import date, datetime, time, timedelta, timezone
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

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


NAVY = "0F2340"
HEAD_FILL = PatternFill("solid", fgColor=NAVY)
BAND_FILL = PatternFill("solid", fgColor="EAF0FA")


def _count_by(docs: list[dict], key) -> list[tuple]:
    counts: dict = {}
    for d in docs:
        k = key(d) or "Not given"
        counts[k] = counts.get(k, 0) + 1
    return sorted(counts.items(), key=lambda kv: (-kv[1], str(kv[0])))


def _put_table(ws, row: int, title: str, headers: list[str], rows: list[list]) -> int:
    ws.cell(row=row, column=1, value=title).font = Font(bold=True, size=12, color=NAVY)
    row += 1
    for c, h in enumerate(headers, 1):
        cell = ws.cell(row=row, column=c, value=h)
        cell.font, cell.fill = Font(bold=True, color="FFFFFF"), HEAD_FILL
    for r in rows:
        row += 1
        for c, v in enumerate(r, 1):
            ws.cell(row=row, column=c, value=csv_safe(v) if isinstance(v, str) else v)
    return row + 2


def build_workbook(docs: list[dict], label: str, resume_names: Optional[list[str]] = None) -> bytes:
    """Tracker.xlsx: a Summary sheet (totals, by day / profile / position / source) and the Tracker sheet (one line per candidate)."""
    wb = Workbook()
    ws = wb.active
    ws.title = "Summary"
    ws["A1"] = "JHS & Associates LLP - Resumes received through the website"
    ws["A1"].font = Font(bold=True, size=15, color=NAVY)
    ws["A2"] = f"Period: {label.replace('_', ' ')} (Indian Standard Time)"
    ws["A3"] = f"Total applications: {len(docs)}"
    ws["A3"].font = Font(bold=True, size=12)
    ws["A4"] = f"Resumes attached: {sum(1 for d in docs if d.get('resume_file_id'))}     Good resume matches: {sum(1 for d in docs if d.get('ats_status') == 'matched')}"
    row = 6
    row = _put_table(ws, row, "Day-wise", ["Date", "Applications", "Good matches", "Resumes attached"], daily_summary(docs))
    row = _put_table(ws, row, "By profile (who applied)", ["Profile", "Applications"], [list(x) for x in _count_by(docs, lambda d: d.get("profile"))])
    row = _put_table(ws, row, "By position applied for", ["Position", "Applications"], [list(x) for x in _count_by(docs, lambda d: d.get("job_title") or "General application")])
    row = _put_table(ws, row, "By highest qualification", ["Qualification", "Applications"], [list(x) for x in _count_by(docs, lambda d: d.get("highest_qualification"))])
    row = _put_table(ws, row, "How they heard about JHS", ["Source", "Applications"], [list(x) for x in _count_by(docs, lambda d: d.get("how_heard"))])
    ws.column_dimensions["A"].width = 44
    for col in "BCD":
        ws.column_dimensions[col].width = 20

    tr = wb.create_sheet("Tracker")
    header = REPORT_COLUMNS + ["HR remarks"]
    tr.append(header)
    for c in range(1, len(header) + 1):
        cell = tr.cell(row=1, column=c)
        cell.font, cell.fill, cell.alignment = Font(bold=True, color="FFFFFF"), HEAD_FILL, Alignment(vertical="center", wrap_text=True)
    for i, d in enumerate(docs, 1):
        r = _row(i, d, (resume_names[i - 1] if resume_names else ""))
        tr.append([csv_safe(v) if isinstance(v, str) else v for v in r] + [""])
        if i % 2 == 0:
            for c in range(1, len(header) + 1):
                tr.cell(row=i + 1, column=c).fill = BAND_FILL
    tr.freeze_panes = "E2"
    tr.auto_filter.ref = f"A1:{get_column_letter(len(header))}{max(len(docs) + 1, 2)}"
    for c, w in enumerate([7, 12, 10, 26, 30, 15, 28, 22, 22, 22, 14, 14, 24, 12, 14, 14, 44, 30], 1):
        tr.column_dimensions[get_column_letter(c)].width = w
    out = io.BytesIO()
    wb.save(out)
    return out.getvalue()


async def report_xlsx(docs: list[dict], label: str) -> bytes:
    return build_workbook(docs, label)


async def build_zip(docs: list[dict], label: str) -> bytes:
    """Folder 'JHS_Resumes_<label>' with Resumes/ and Tracker.xlsx."""
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
        z.writestr(f"{root}/Tracker.xlsx", build_workbook(docs, label, [r[-1] for r in rows]))
        total = len(docs)
        z.writestr(f"{root}/READ_ME.txt",
                   f"JHS & Associates LLP - resumes received through the website\n"
                   f"Period: {label.replace('_', ' ')} (Indian Standard Time)\n"
                   f"Applications: {total}   Resumes in this folder: {total - missing}\n\n"
                   "Tracker.xlsx       - open in Excel. 'Summary' sheet: totals, day-wise, by profile, by position, by source.\n"
                   "                     'Tracker' sheet: one line per candidate (filterable, with an HR remarks column)\n"
                   "Resumes/<date>/    - the resumes, one folder per day\n"
                   "Personal data: please handle and delete according to the JHS Privacy Policy.\n")
    return out.getvalue()
