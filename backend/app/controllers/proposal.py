import io
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

from app.utils.validation import GUARD_FIELDS
from app.database.connection import get_database
from app.schemas.proposal import ProposalCreate, ProposalResponse, ProposalStatusUpdate
from app.services.email_service import notify_hr_new_proposal
from app.controllers.career_export import IST, ExportError, _range_utc, label_for, parse_day
from app.controllers.cookie_consent import csv_safe

async def create_proposal(proposal: ProposalCreate, user: dict) -> ProposalResponse:
    db = get_database()
    collection = db["proposals"]

    # Prepare document
    proposal_dict = proposal.model_dump(exclude=GUARD_FIELDS)
    proposal_dict["consent_at"] = datetime.now(timezone.utc)
    proposal_dict["user_id"] = user["id"]
    proposal_dict["created_at"] = datetime.now(timezone.utc)
    proposal_dict["status"] = "new"

    # Insert into MongoDB
    result = await collection.insert_one(proposal_dict)

    # Send email notifications (fire-and-forget)
    await notify_hr_new_proposal(proposal_dict)

    # Return response
    proposal_dict["id"] = str(result.inserted_id)
    return ProposalResponse(**proposal_dict)

async def get_all_proposals() -> list[ProposalResponse]:
    db = get_database()
    collection = db["proposals"]

    proposals = []
    cursor = collection.find({}).sort("created_at", -1)

    async for document in cursor:
        document["id"] = str(document["_id"])
        proposals.append(ProposalResponse(**document))

    return proposals


STATUS_LABELS = {"new": "New", "in_review": "In review", "proposal_sent": "Proposal sent", "closed": "Closed"}


def _proposal_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise ValueError("Invalid proposal id")


async def update_proposal_status(proposal_id: str, data: ProposalStatusUpdate, admin_email: str) -> Optional[ProposalResponse]:
    """Records where the request stands, a short internal note, who updated it and when."""
    db = get_database()
    oid = _proposal_id(proposal_id)
    result = await db["proposals"].update_one(
        {"_id": oid},
        {"$set": {"status": data.status, "admin_note": data.note, "handled_by": admin_email, "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        return None
    doc = await db["proposals"].find_one({"_id": oid})
    doc["id"] = str(doc["_id"])
    return ProposalResponse(**doc)


def _ist(dt):
    if not dt:
        return None
    return (dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt).astimezone(IST)


async def export_proposals(date_from: Optional[str], date_to: Optional[str], status: Optional[str]) -> tuple[bytes, int, str]:
    """Excel sheet of the requests received in the chosen (Indian) days: (file bytes, count, label)."""
    day_from, day_to = parse_day(date_from), parse_day(date_to)
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
    if status and status != "all":
        if status not in STATUS_LABELS:
            raise ExportError(422, "Unknown status")
        if status == "new":
            query["$or"] = [{"status": "new"}, {"status": {"$exists": False}}]   # older requests have no status yet
        else:
            query["status"] = status
    docs = [d async for d in get_database()["proposals"].find(query)]
    docs.sort(key=lambda d: d.get("created_at") or datetime.min)

    header = ["Sr. No", "Date (IST)", "Time (IST)", "First name", "Last name", "Email", "Phone", "Inquiry reason", "Subject",
              "Details", "Status", "Team note", "Last updated by", "Last updated (IST)"]
    wb = Workbook()
    ws = wb.active
    ws.title = "Proposal requests"
    ws.append(header)
    navy = PatternFill("solid", fgColor="0F2340")
    for c in range(1, len(header) + 1):
        cell = ws.cell(row=1, column=c)
        cell.font, cell.fill, cell.alignment = Font(bold=True, color="FFFFFF"), navy, Alignment(vertical="center", wrap_text=True)

    for i, d in enumerate(docs, 1):
        when, upd = _ist(d.get("created_at")), _ist(d.get("updated_at"))
        row = [i, when.strftime("%d-%m-%Y") if when else "", when.strftime("%I:%M %p") if when else "", d.get("first_name", ""),
               d.get("last_name", ""), d.get("email", ""), d.get("phone") or "", d.get("inquiry_reason", ""), d.get("subject", ""),
               d.get("message") or "", STATUS_LABELS.get(d.get("status", "new"), "New"), d.get("admin_note") or "",
               d.get("handled_by") or "", upd.strftime("%d-%m-%Y %I:%M %p") if upd else ""]
        ws.append([csv_safe(v) if isinstance(v, str) else v for v in row])   # a typed "=..." must not run as an Excel formula
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(header))}{max(len(docs) + 1, 2)}"
    for c, w in enumerate([7, 12, 10, 16, 16, 30, 16, 24, 30, 60, 14, 36, 28, 20], 1):
        ws.column_dimensions[get_column_letter(c)].width = w
    out = io.BytesIO()
    wb.save(out)
    return out.getvalue(), len(docs), label_for(day_from, day_to)
