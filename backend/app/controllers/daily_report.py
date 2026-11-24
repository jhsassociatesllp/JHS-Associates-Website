"""Daily report for the Founder: everything that came in through the website yesterday, by email.

Every morning (10:00 AM Indian time by default) one email goes to the recipients in DAILY_REPORT_RECIPIENTS with:
  * a summary table (résumés, contact messages, requests for proposal, appointments, client feedback, ...),
  * the details of each new item in the email itself,
  * JHS_Daily_Report_<date>.xlsx  - one Excel file, one sheet per kind of submission,
  * JHS_Resumes_<date>.zip        - the résumés received that day, with the HR tracker.

"Yesterday" is a full Indian Standard Time day (00:00 to 24:00 IST), the same way the firm counts a day.
A day is sent once only: the send is recorded in `app_meta`, so a restart or a second server cannot send it twice.
"""
import asyncio
import logging
from datetime import date, datetime, time, timedelta, timezone
from html import escape as esc

from app.config.settings import settings
from app.controllers import career_export as cx
from app.database.connection import get_database
from app.utils.excel_export import build_xlsx, ist_parts
from app.utils.timestamps import IST

logger = logging.getLogger("daily_report")

META = "app_meta"
MAX_ZIP_BYTES = 18 * 1024 * 1024   # larger than this is not attached (mail servers refuse ~20-25 MB); the Excel file still is
SHOWN_IN_EMAIL = 8                 # items listed in the email body per section; the Excel file has all of them
CHECK_MINUTES = 5                  # how often the loop looks at the clock
RETRY_MINUTES = 30                 # if a send fails, try again this much later


def yesterday_ist() -> date:
    return (datetime.now(IST) - timedelta(days=1)).date()


def _window(day: date):
    start = datetime.combine(day, time.min, tzinfo=IST).astimezone(timezone.utc)
    end = datetime.combine(day + timedelta(days=1), time.min, tzinfo=IST).astimezone(timezone.utc)
    return start, end


async def _fetch(collection: str, day: date) -> list[dict]:
    start, end = _window(day)
    docs = [d async for d in get_database()[collection].find({"created_at": {"$gte": start, "$lt": end}})]
    docs.sort(key=lambda d: d.get("created_at") or datetime.min.replace(tzinfo=timezone.utc))
    return docs


def _s(value) -> str:
    return "" if value is None else str(value)


# Each section: key, title, collection, Excel headers, row builder, one-line description for the email.
def _name(d: dict) -> str:
    return " ".join(x for x in (d.get("first_name"), d.get("last_name")) if x) or _s(d.get("name") or d.get("full_name"))


SECTIONS = [
    {
        "key": "resumes", "title": "Resumes / career applications", "collection": "career_applications",
        "headers": ["Sr. No", "Time (IST)", "Candidate", "Email", "Phone", "Position", "Profile", "Qualification", "Current CTC", "Expected CTC", "Resume match %"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _s(d.get("full_name")), _s(d.get("email")), _s(d.get("phone")),
                          _s(d.get("job_title") or "General application"), _s(d.get("profile")), _s(d.get("highest_qualification")),
                          _s(d.get("current_ctc")), _s(d.get("expected_ctc")), d.get("ats_score") if d.get("ats_score") is not None else ""],
        "line": lambda d: f"{_s(d.get('full_name'))} - {_s(d.get('job_title') or 'General application')} ({_s(d.get('email'))}, {_s(d.get('phone'))})",
    },
    {
        "key": "contacts", "title": "Contact Us messages", "collection": "contact_us",
        "headers": ["Sr. No", "Time (IST)", "Name", "Email", "Phone", "Company", "Service", "Message"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _s(d.get("name")), _s(d.get("email")), _s(d.get("phone")),
                          _s(d.get("company")), _s(d.get("service")), _s(d.get("message"))],
        "line": lambda d: f"{_s(d.get('name'))} ({_s(d.get('email'))}, {_s(d.get('phone'))}) - {_s(d.get('service')) or 'General'}: {_s(d.get('message'))[:140]}",
    },
    {
        "key": "proposals", "title": "Requests for Proposal", "collection": "proposals",
        "headers": ["Sr. No", "Time (IST)", "Name", "Email", "Phone", "Inquiry reason", "Subject", "Details"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _name(d), _s(d.get("email")), _s(d.get("phone")),
                          _s(d.get("inquiry_reason")), _s(d.get("subject")), _s(d.get("message"))],
        "line": lambda d: f"{_name(d)} ({_s(d.get('email'))}, {_s(d.get('phone'))}) - {_s(d.get('inquiry_reason'))}: {_s(d.get('subject'))}",
    },
    {
        "key": "appointments", "title": "Appointments booked", "collection": "appointments",
        "headers": ["Sr. No", "Time (IST)", "Name", "Mobile", "Email", "City", "Speciality", "Partner", "Message", "Reference"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _s(d.get("full_name")), _s(d.get("mobile")), _s(d.get("email")),
                          _s(d.get("city")), _s(d.get("speciality")), _s(d.get("partner")), _s(d.get("message")), _s(d.get("reference"))],
        "line": lambda d: f"{_s(d.get('full_name'))} ({_s(d.get('mobile'))}, {_s(d.get('email'))}) - {_s(d.get('speciality'))}"
                          + (f" with {_s(d.get('partner'))}" if d.get("partner") else ""),
    },
    {
        "key": "consultations", "title": "Consultation requests (partner / service cards)", "collection": "consultation_requests",
        "headers": ["Sr. No", "Time (IST)", "Name", "Email", "Partner", "Location", "Type", "Message"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _s(d.get("user_name")), _s(d.get("user_email")), _s(d.get("partner_name")),
                          _s(d.get("partner_location")), _s(d.get("appointment_type")), _s(d.get("message"))],
        "line": lambda d: f"{_s(d.get('user_name'))} ({_s(d.get('user_email'))}) - {_s(d.get('appointment_type'))} with {_s(d.get('partner_name'))}",
    },
    {
        "key": "feedback", "title": "Client feedback", "collection": "feedback",
        "headers": ["Sr. No", "Time (IST)", "Client", "Submitted by", "Designation", "Assignment", "Overall rating", "Would refer", "Testimonial"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _s(d.get("client_name")), _s(d.get("name")), _s(d.get("designation")),
                          _s(d.get("nature_of_assignment")), _s(d.get("overall")), _s(d.get("would_refer")), _s(d.get("testimonial"))],
        "line": lambda d: f"{_s(d.get('client_name'))} - by {_s(d.get('name'))}, overall rating {_s(d.get('overall')) or 'n/a'}",
    },
    {
        "key": "alumni", "title": "Alumni registrations", "collection": "alumni",
        "headers": ["Sr. No", "Time (IST)", "Name", "Email", "Phone", "Company", "Designation", "Tenure", "Message"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _name(d), _s(d.get("email")), _s(d.get("phone")), _s(d.get("company")),
                          _s(d.get("designation")), _s(d.get("tenure")), _s(d.get("message"))],
        "line": lambda d: f"{_name(d)} ({_s(d.get('email'))}) - {_s(d.get('designation'))}, {_s(d.get('company'))}",
    },
    {
        "key": "users", "title": "New website sign-ups", "collection": "users",
        "headers": ["Sr. No", "Time (IST)", "Name", "Email"],
        "row": lambda d: [ist_parts(d.get("created_at"))[1], _s(d.get("name") or _name(d)), _s(d.get("email"))],
        "line": lambda d: f"{_s(d.get('name') or _name(d))} ({_s(d.get('email'))})",
    },
]


async def collect(day: date) -> dict:
    """{section key: [documents]} for one IST day. If the database cannot be read this RAISES: a report that wrongly says
    "nothing came in" is worse than no report, so nothing is sent and the loop tries again later."""
    data: dict = {}
    for sec in SECTIONS:
        data[sec["key"]] = await _fetch(sec["collection"], day)
    return data


def build_excel(day: date, data: dict) -> bytes:
    """One workbook: a Summary sheet, then one sheet per kind of submission."""
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment
    from openpyxl.utils import get_column_letter
    from app.controllers.cookie_consent import csv_safe

    navy = PatternFill("solid", fgColor="0F2340")
    wb = Workbook()
    ws = wb.active
    ws.title = "Summary"
    ws["A1"] = "JHS & Associates LLP - Website daily report"
    ws["A1"].font = Font(bold=True, size=15, color="0F2340")
    ws["A2"] = f"Day: {day.strftime('%d-%m-%Y')} (Indian Standard Time, 12:00 AM to 12:00 AM)"
    ws.append([])
    ws.append(["What came in", "Count"])
    for c in (1, 2):
        cell = ws.cell(row=4, column=c)
        cell.font, cell.fill = Font(bold=True, color="FFFFFF"), navy
    for sec in SECTIONS:
        ws.append([sec["title"], len(data[sec["key"]])])
    ws.column_dimensions["A"].width = 52
    ws.column_dimensions["B"].width = 12

    for sec in SECTIONS:
        docs = data[sec["key"]]
        sheet = wb.create_sheet(sec["title"][:31].replace("/", "-"))
        sheet.append(sec["headers"])
        for c in range(1, len(sec["headers"]) + 1):
            cell = sheet.cell(row=1, column=c)
            cell.font, cell.fill, cell.alignment = Font(bold=True, color="FFFFFF"), navy, Alignment(vertical="center", wrap_text=True)
            sheet.column_dimensions[get_column_letter(c)].width = 40 if sec["headers"][c - 1] in ("Message", "Details", "Testimonial") else 22
        for i, d in enumerate(docs, 1):
            sheet.append([i] + [csv_safe(v) if isinstance(v, str) else v for v in sec["row"](d)])
        sheet.freeze_panes = "A2"
    import io
    out = io.BytesIO()
    wb.save(out)
    return out.getvalue()


def build_email_html(day: date, data: dict, notes: list[str]) -> str:
    """The email body: summary table first, then the newest items in each section."""
    from app.services.email_service import _wrap_html, NAVY, CRIMSON

    total = sum(len(v) for v in data.values())
    rows = ""
    for sec in SECTIONS:
        n = len(data[sec["key"]])
        weight = "700" if n else "400"
        colour = CRIMSON if n else "#7b869a"
        rows += (f'<tr><td style="padding:8px 12px;border-bottom:1px solid #edf0f5;color:#1f2a3d;">{esc(sec["title"])}</td>'
                 f'<td align="right" style="padding:8px 12px;border-bottom:1px solid #edf0f5;font-weight:{weight};color:{colour};">{n}</td></tr>')
    body = (f'<tr><td style="padding:0 0 14px;line-height:1.6;">Good morning,<br>Here is everything that came in through the JHS website on '
            f'<strong>{day.strftime("%A, %d %B %Y")}</strong>. In all: <strong>{total}</strong> new '
            f'{"item" if total == 1 else "items"}.</td></tr>'
            f'<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #d9dde6;font-size:14px;">'
            f'<tr style="background:{NAVY};"><td style="padding:8px 12px;color:#fff;font-weight:700;">Summary</td>'
            f'<td align="right" style="padding:8px 12px;color:#fff;font-weight:700;">Count</td></tr>{rows}</table></td></tr>')
    for sec in SECTIONS:
        docs = data[sec["key"]]
        if not docs:
            continue
        items = "".join(f'<li style="margin:0 0 5px;">{esc(sec["line"](d))}</li>' for d in docs[:SHOWN_IN_EMAIL])
        more = f'<div style="color:#7b869a;font-size:12px;">...and {len(docs) - SHOWN_IN_EMAIL} more, see the Excel file.</div>' if len(docs) > SHOWN_IN_EMAIL else ""
        body += (f'<tr><td style="padding:20px 0 4px;"><strong style="color:{NAVY};font-size:15px;">{esc(sec["title"])} ({len(docs)})</strong>'
                 f'<ul style="margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.5;color:#2b3445;">{items}</ul>{more}</td></tr>')
    if total == 0:
        body += '<tr><td style="padding:16px 0;color:#44506a;">Nothing new came in that day.</td></tr>'
    for note in notes:
        body += f'<tr><td style="padding:12px 0 0;color:#8a5a00;font-size:13px;">Note: {esc(note)}</td></tr>'
    body += ('<tr><td style="padding:18px 0 0;font-size:12px;color:#7b869a;line-height:1.6;">Attached: the full details in Excel'
             + (', and the resumes received (with the HR tracker) as a ZIP' if data["resumes"] else "")
             + '. This report is sent automatically every morning. It contains personal data: please handle it as per the JHS Privacy Policy.</td></tr>')
    return _wrap_html(f"Website daily report - {day.strftime('%d %B %Y')}", body)


async def build_report(day: date) -> dict:
    """Everything needed to send one day's report: subject, html, attachments, counts."""
    data = await collect(day)
    stamp = day.strftime("%d-%m-%Y")
    attachments = [(f"JHS_Daily_Report_{stamp}.xlsx", build_excel(day, data),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")]
    notes: list[str] = []
    if data["resumes"]:
        try:
            if len(data["resumes"]) > cx.MAX_RESUMES_PER_DOWNLOAD:
                raise cx.ExportError(400, "too many resumes for one ZIP")
            zipped = await cx.build_zip(data["resumes"], stamp)
            if len(zipped) > MAX_ZIP_BYTES:
                notes.append(f"The resumes ZIP is {len(zipped) // (1024 * 1024)} MB, too large to attach. Download it from the admin panel (Careers > Download resumes).")
            else:
                attachments.append((f"JHS_Resumes_{stamp}.zip", zipped, "application/zip"))
        except Exception:
            logger.exception("Daily report: could not build the resumes ZIP")
            notes.append("The resumes ZIP could not be prepared. Download it from the admin panel (Careers > Download resumes).")
    counts = {k: len(v) for k, v in data.items()}
    total = sum(counts.values())
    subject = f"JHS website daily report - {day.strftime('%d %b %Y')}: {total} new" + (
        f" ({counts['resumes']} resumes, {counts['contacts']} contacts, {counts['proposals']} proposals, "
        f"{counts['appointments'] + counts['consultations']} appointments, {counts['feedback']} feedback)" if total else "")
    return {"subject": subject, "html": build_email_html(day, data, notes), "attachments": attachments, "counts": counts}


def recipients() -> list[str]:
    from app.services.email_service import _split_recipients
    return _split_recipients(settings.daily_report_recipients)


async def send_report(day: date, to: str | None = None) -> dict:
    """Builds and sends the report for `day`. Returns {sent, counts, recipients, attachments}."""
    from app.services import email_service as es
    to_list = es._split_recipients(to) if to else recipients()
    if not to_list:
        return {"sent": False, "error": "No recipient: set DAILY_REPORT_RECIPIENTS", "counts": {}}
    report = await build_report(day)
    results = []
    for address in to_list:   # one mail per person, so one failure never repeats the mail for the others
        sent_files = report["attachments"]
        ok = await es._send_email_one(address, "", report["subject"], report["html"], None, sent_files)
        error = "" if ok else es.last_error
        if not ok:   # attachments can be what the mail server refuses: still get the numbers to the reader
            logger.warning("Daily report: send to %s with attachments failed (%s); retrying with the Excel file only", address, error)
            sent_files = report["attachments"][:1]
            ok = await es._send_email_one(address, "", report["subject"], report["html"], None, sent_files)
            error = "" if ok else es.last_error
        results.append({"to": address, "ok": bool(ok), "method": es.last_method if ok else "", "error": error,
                        "attachments": [a[0] for a in sent_files] if ok else []})
        logger.info("Daily report to %s: %s", address, "sent via " + es.last_method if ok else "FAILED " + error)
    all_ok = all(r["ok"] for r in results)
    first_error = next((r["error"] for r in results if not r["ok"]), "")
    return {"sent": all_ok, "counts": report["counts"], "recipients": to_list, "results": results,
            "attachments": [a[0] for a in report["attachments"]], "error": first_error}


async def _already_sent(day: date) -> bool:
    return bool(await get_database()[META].find_one({"_id": f"daily_report_{day.isoformat()}"}))


async def _claim(day: date) -> bool:
    """True for exactly one caller per day: a second server (or a restart) finds the mark and stays quiet.
    A claim left over from a crash (still 'sending' after 30 minutes) can be taken over."""
    from pymongo.errors import DuplicateKeyError
    col, key, now = get_database()[META], f"daily_report_{day.isoformat()}", datetime.now(timezone.utc)
    try:
        await col.insert_one({"_id": key, "claimed_at": now, "state": "sending"})
        return True
    except DuplicateKeyError:
        stale = await col.update_one({"_id": key, "state": "sending", "claimed_at": {"$lt": now - timedelta(minutes=30)}},
                                     {"$set": {"claimed_at": now}})
        return stale.modified_count == 1


async def run_once() -> bool:
    """Called by the loop: after the send time, sends yesterday's report if it has not gone out yet.
    Returns False only when a send was tried and failed (the loop then waits longer before trying again)."""
    now = datetime.now(IST)
    if now.hour < settings.daily_report_hour:
        return True
    day = yesterday_ist()
    if not await _claim(day):
        return True
    result = await send_report(day)
    col = get_database()[META]
    if result["sent"]:
        await col.update_one({"_id": f"daily_report_{day.isoformat()}"},
                             {"$set": {"state": "sent", "sent_at": datetime.now(timezone.utc), "counts": result["counts"], "recipients": result["recipients"]}})
        logger.info("Daily report for %s sent to %s: %s", day, result["recipients"], result["counts"])
    else:
        # release the claim so the next check (RETRY_MINUTES later) tries again
        await col.delete_one({"_id": f"daily_report_{day.isoformat()}", "state": "sending"})
        logger.error("Daily report for %s was NOT sent: %s", day, result.get("error"))
    return result["sent"]


async def worker_loop() -> None:
    logger.info("Daily report scheduler started: sends at %02d:00 IST to %s", settings.daily_report_hour, recipients())
    while True:
        wait = CHECK_MINUTES
        try:
            if not await run_once():
                wait = RETRY_MINUTES
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("Daily report error")
            wait = RETRY_MINUTES
        await asyncio.sleep(wait * 60)
