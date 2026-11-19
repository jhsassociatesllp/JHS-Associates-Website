"""Super Admin: preview or test-send the Founder's daily report without waiting for the morning."""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth.deps import require_roles
from app.controllers import daily_report as dr
from app.schemas.admin import AdminInDB, AdminRole

super_admin_only = require_roles([AdminRole.SUPER_ADMIN])

router = APIRouter(prefix="/admin/daily-report", tags=["Daily report"])


def _day(value: str | None) -> date:
    try:
        return date.fromisoformat(value) if value else dr.yesterday_ist()
    except ValueError:
        raise HTTPException(status_code=422, detail="Day must look like 2026-11-18")


@router.get("")
async def preview(day: str | None = Query(None, max_length=10), current_admin: AdminInDB = Depends(super_admin_only)):
    """The counts and settings, nothing is sent."""
    d = _day(day)
    data = await dr.collect(d)
    from app.config.settings import settings
    return {"day": d.isoformat(), "counts": {k: len(v) for k, v in data.items()}, "enabled": settings.daily_report_enabled,
            "sends_at_ist": f"{settings.daily_report_hour:02d}:00", "recipients": dr.recipients()}


@router.post("/test")
async def test_send(day: str | None = Query(None, max_length=10), to: str | None = Query(None, max_length=200),
                    current_admin: AdminInDB = Depends(super_admin_only)):
    """Sends the report for `day` (default: yesterday) to `to` (default: the logged-in admin, NOT the Founder)."""
    d = _day(day)
    result = await dr.send_report(d, to or current_admin.email)
    if not result["sent"]:
        raise HTTPException(status_code=502, detail=result.get("error") or "The email could not be sent")
    return result


_last_founder_send: list[float] = [0.0]
MIN_SECONDS_BETWEEN_FOUNDER_SENDS = 60


@router.post("/send-founder")
async def send_to_founder(current_admin: AdminInDB = Depends(super_admin_only)):
    """The admin-panel button: emails yesterday's report (with the résumés) to the configured recipients (the Founder) right now."""
    import time
    now = time.monotonic()
    if now - _last_founder_send[0] < MIN_SECONDS_BETWEEN_FOUNDER_SENDS:
        raise HTTPException(status_code=429, detail="The report was just sent. Please wait a minute before sending it again.")
    _last_founder_send[0] = now
    result = await dr.send_report(dr.yesterday_ist())
    result["day"] = dr.yesterday_ist().isoformat()
    if not result["sent"]:
        _last_founder_send[0] = 0.0   # let them try again straight away
        raise HTTPException(status_code=502, detail=result.get("error") or "The email could not be sent")
    return result
