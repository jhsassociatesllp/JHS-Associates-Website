import csv
import io
import time
from collections import defaultdict, deque
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse

from app.auth.deps import require_roles
from app.controllers import event as ctrl
from app.controllers.cookie_consent import csv_safe, hash_ip
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.event import (
    EventAdmin, EventCreate, EventPublic, EventUpdate, RegistrationAdmin, RegistrationCreate, RegistrationResult,
)
from app.services.email_service import notify_event_registration

router = APIRouter(prefix="/events", tags=["Events"])

admin_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])

# ── Rate limiting for the public registration endpoint ───────────────────────
_WINDOW = 60
_MAX_PER_WINDOW = 10          # any registration attempts per minute from one IP
_HOUR = 3600
_MAX_PER_EVENT_HOUR = 15      # attempts per IP for one event per hour (offices share one IP)
_hits: dict[str, deque] = defaultdict(deque)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _throttle(key: str, window: int, limit: int) -> None:
    now = time.monotonic()
    q = _hits[key]
    while q and now - q[0] > window:
        q.popleft()
    if len(q) >= limit:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Too many attempts. Please try again in a little while.")
    q.append(now)
    if len(_hits) > 5000:
        for k in [k for k, v in _hits.items() if not v][:1000]:
            _hits.pop(k, None)


def _bad_id():
    return HTTPException(status_code=404, detail="Event not found")


# ── Public ───────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[EventPublic])
async def upcoming_events(past: bool = False, limit: int = Query(12, ge=1, le=50)):
    """Published events: upcoming / live by default, or the past ones with ?past=true."""
    return await ctrl.list_public(past=past, limit=limit)


@router.get("/admin/all", response_model=List[EventAdmin])
async def admin_events(_: AdminInDB = Depends(admin_access)):
    return await ctrl.list_admin()


@router.get("/admin/summary")
async def admin_summary(_: AdminInDB = Depends(admin_access)):
    return await ctrl.summary()


@router.post("/admin", response_model=EventAdmin, status_code=status.HTTP_201_CREATED)
async def admin_create(data: EventCreate, _: AdminInDB = Depends(admin_access)):
    return await ctrl.create_event(data)


@router.put("/admin/{event_id}", response_model=EventAdmin)
async def admin_update(event_id: str, data: EventUpdate, _: AdminInDB = Depends(admin_access)):
    try:
        updated = await ctrl.update_event(event_id, data)
    except ValueError:
        raise _bad_id()
    if not updated:
        raise _bad_id()
    return updated


@router.delete("/admin/{event_id}")
async def admin_delete(event_id: str, _: AdminInDB = Depends(admin_access)):
    try:
        deleted = await ctrl.delete_event(event_id)
    except ValueError:
        raise _bad_id()
    if not deleted:
        raise _bad_id()
    return {"message": "Event deleted"}


@router.get("/admin/{event_id}/registrations")
async def admin_registrations(
    event_id: str,
    search: Optional[str] = Query(None, max_length=80),
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    _: AdminInDB = Depends(admin_access),
):
    return await ctrl.list_registrations(event_id, search, skip, limit)


@router.get("/admin/{event_id}/registrations/export")
async def admin_export(event_id: str, _: AdminInDB = Depends(admin_access)):
    rows = await ctrl.all_registrations(event_id)
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["Name", "Email", "Phone", "Organisation", "Designation", "City", "Attended", "Registered (UTC)"])
    for r in rows:
        w.writerow([csv_safe(x) for x in [
            r["name"], r["email"], r["phone"], r.get("organization"), r.get("designation"), r.get("city"),
            "Yes" if r.get("attended") else "No", r["created_at"]]])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": 'attachment; filename="event-registrations.csv"'})


@router.patch("/admin/registrations/{registration_id}/attended", response_model=RegistrationAdmin)
async def admin_attended(registration_id: str, attended: bool = Query(...), _: AdminInDB = Depends(admin_access)):
    try:
        updated = await ctrl.set_attended(registration_id, attended)
    except ValueError:
        raise HTTPException(status_code=404, detail="Registration not found")
    if not updated:
        raise HTTPException(status_code=404, detail="Registration not found")
    return updated


@router.delete("/admin/registrations/{registration_id}")
async def admin_delete_registration(registration_id: str, _: AdminInDB = Depends(admin_access)):
    try:
        deleted = await ctrl.delete_registration(registration_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Registration not found")
    if not deleted:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {"message": "Registration removed"}


@router.get("/{event_id}", response_model=EventPublic)
async def event_detail(event_id: str):
    try:
        event = await ctrl.get_public(event_id)
    except ValueError:
        raise _bad_id()
    if not event:
        raise _bad_id()
    return event


@router.post("/{event_id}/register", response_model=RegistrationResult, status_code=status.HTTP_201_CREATED)
async def register_for_event(event_id: str, data: RegistrationCreate, request: Request):
    ip = _client_ip(request)
    ip_key = hash_ip(ip)
    _throttle(f"all:{ip_key}", _WINDOW, _MAX_PER_WINDOW)
    _throttle(f"ev:{ip_key}:{event_id}", _HOUR, _MAX_PER_EVENT_HOUR)

    # Bots fill the hidden field; real visitors never see it.
    if data.website.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request")

    try:
        view, doc, reference = await ctrl.register(event_id, data, ip)
    except ValueError:
        raise _bad_id()
    except ctrl.RegistrationError as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)

    await notify_event_registration(doc, data.name, str(data.email), reference)
    return {
        "message": "You are registered",
        "reference": reference,
        "event": view,
        # the private join link is only ever returned to someone who just registered
        "join_link": doc.get("join_link"),
    }
