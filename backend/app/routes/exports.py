"""Excel downloads for the admin lists (Contacts, Users, Client feedback). Super Admin and HR Admin only."""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth.deps import require_roles
from app.controllers.career_export import ExportError, _range_utc, label_for, parse_day
from app.database.connection import get_database
from app.schemas.admin import AdminInDB, AdminRole
from app.utils.excel_export import build_xlsx, ist_parts, ist_text, xlsx_response

hr_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.HR_ADMIN])

router = APIRouter(prefix="/export", tags=["Excel exports"])


def _date_query(date_from: Optional[str], date_to: Optional[str]) -> tuple[dict, str]:
    try:
        day_from, day_to = parse_day(date_from), parse_day(date_to)
        if day_from and day_to and day_to < day_from:
            raise ExportError(422, "The 'to' date is before the 'from' date")
    except ExportError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail)
    start, end = _range_utc(day_from, day_to)
    query: dict = {}
    if start or end:
        query["created_at"] = {}
        if start:
            query["created_at"]["$gte"] = start
        if end:
            query["created_at"]["$lt"] = end
    return query, label_for(day_from, day_to)


async def _rows(collection: str, query: dict) -> list[dict]:
    docs = [d async for d in get_database()[collection].find(query)]
    docs.sort(key=lambda d: (d["created_at"].replace(tzinfo=None) if d.get("created_at") else datetime.min), reverse=True)   # newest first
    return docs


@router.get("/contacts")
async def export_contacts(
    date_from: Optional[str] = Query(None, max_length=10),
    date_to: Optional[str] = Query(None, max_length=10),
    current_admin: AdminInDB = Depends(hr_access),
):
    query, label = _date_query(date_from, date_to)
    docs = await _rows("contact_us", query)
    headers = ["Sr. No", "Date (IST)", "Time (IST)", "Name", "Email", "Phone", "Company", "Service / subject", "Message"]
    rows = []
    for i, d in enumerate(docs, 1):
        date, time = ist_parts(d.get("created_at"))
        rows.append([i, date, time, d.get("name", ""), d.get("email", ""), d.get("phone") or "", d.get("company") or "", d.get("service") or "", d.get("message", "")])
    body, count = build_xlsx("Contact submissions", headers, rows, [7, 12, 10, 24, 30, 16, 24, 26, 70])
    return xlsx_response(body, count, f"JHS_Contact_Submissions_{label}.xlsx")


@router.get("/users")
async def export_users(
    date_from: Optional[str] = Query(None, max_length=10),
    date_to: Optional[str] = Query(None, max_length=10),
    current_admin: AdminInDB = Depends(hr_access),
):
    query, label = _date_query(date_from, date_to)
    docs = await _rows("users", query)
    headers = ["Sr. No", "Name", "Email", "Sign-in method", "Email verified", "Status", "Joined (IST)", "Last login (IST)"]
    rows = []
    for i, d in enumerate(docs, 1):
        name = d.get("name") or f"{d.get('first_name', '')} {d.get('last_name', '')}".strip()
        method = "Google" if d.get("auth_provider") == "google" else "Email & password"
        rows.append([i, name, d.get("email", ""), method, "Yes" if d.get("is_verified") else "No", d.get("status", "active"),
                     ist_text(d.get("created_at")), ist_text(d.get("last_login"))])
    body, count = build_xlsx("Site users", headers, rows, [7, 26, 34, 18, 14, 12, 22, 22])
    return xlsx_response(body, count, f"JHS_Site_Users_{label}.xlsx")


FEEDBACK_RATINGS = [
    ("onboarding_reason", "On-boarding: reason"), ("competitive_fees", "On-boarding: competitive fees"),
    ("technically_better", "On-boarding: technically better"), ("referred_by_someone", "On-boarding: referred by someone"),
    ("value_for_money", "Fees: value for money"), ("reasonable", "Fees: reasonable"),
    ("delivery", "Quality: delivery"), ("status_review", "Quality: status review"), ("draft_discussions", "Quality: draft discussions"),
    ("reporting", "Quality: reporting"), ("timelines", "Quality: timelines"),
    ("project_team", "Communication: project team"), ("response_time", "Communication: response time"),
    ("overall", "Overall rating"), ("meet_service_objectives", "Overall: met objectives"), ("knowledge", "Overall: knowledge"),
    ("research_publications", "Overall: research publications"),
]


@router.get("/feedback")
async def export_feedback(
    date_from: Optional[str] = Query(None, max_length=10),
    date_to: Optional[str] = Query(None, max_length=10),
    current_admin: AdminInDB = Depends(hr_access),
):
    query, label = _date_query(date_from, date_to)
    docs = await _rows("feedback", query)
    headers = (["Sr. No", "Date (IST)", "Time (IST)", "Client", "Submitted by", "Designation", "Nature of assignment", "Period", "Reporting to", "SPOC"]
               + [title for _, title in FEEDBACK_RATINGS] + ["Would refer", "Delighted by service", "Testimonial", "References"])
    rows = []
    for i, d in enumerate(docs, 1):
        date, time = ist_parts(d.get("created_at"))
        refs = "; ".join(
            ", ".join(x for x in (r.get("name_designation"), r.get("company_name"), r.get("phone"), r.get("email")) if x)
            for r in (d.get("references") or [])
        )
        rows.append([i, date, time, d.get("client_name", ""), d.get("name", ""), d.get("designation", ""), d.get("nature_of_assignment", ""),
                     d.get("period_of_assignment") or "", d.get("assignment_reporting", ""), d.get("assignment_spoc") or ""]
                    + [d.get(key, "") for key, _ in FEEDBACK_RATINGS]
                    + [d.get("would_refer") or "", d.get("delighted_by_service") or "", d.get("testimonial") or "", refs])
    body, count = build_xlsx("Client feedback", headers, rows, [7, 12, 10, 28, 22, 20, 32, 16, 14, 18] + [14] * len(FEEDBACK_RATINGS) + [12, 14, 60, 50])
    return xlsx_response(body, count, f"JHS_Client_Feedback_{label}.xlsx")
