from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from app.auth.deps import require_roles
from app.controllers import notify as ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.utils.netutil import client_ip, throttle

router = APIRouter(prefix="/notifications", tags=["Notifications"])

admin_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])


class TokenBody(BaseModel):
    token: str = Field(..., min_length=10, max_length=200)


class SettingsBody(BaseModel):
    enabled: bool
    delay_minutes: int = Field(..., ge=0, le=1440)


class TestBody(BaseModel):
    kind: str = "white_paper"


def _fail(exc: ctrl.NotifyError):
    raise HTTPException(status_code=exc.status_code, detail=exc.detail)


async def _toggle(request: Request, token: str, on: bool) -> dict:
    throttle(f"unsub:{client_ip(request)}", 3600, 30)
    uid = ctrl.read_token(token)
    if not uid or not await ctrl.set_subscription(uid, on):
        # one message for "bad token" and "no such account", so nothing can be probed
        raise HTTPException(status_code=400, detail="This link is not valid.")
    return {"subscribed": on}


# ── public: the link in every email ──────────────────────────────────────────

@router.post("/unsubscribe")
async def unsubscribe(request: Request, body: TokenBody):
    return await _toggle(request, body.token, False)


@router.post("/resubscribe")
async def resubscribe(request: Request, body: TokenBody):
    return await _toggle(request, body.token, True)


@router.post("/unsubscribe-one-click")
async def unsubscribe_one_click(request: Request, token: str):
    """Target of the List-Unsubscribe header (RFC 8058): mail apps POST here without opening a page."""
    return await _toggle(request, token, False)


# ── admin ────────────────────────────────────────────────────────────────────

@router.get("/admin/overview")
async def overview(admin: AdminInDB = Depends(admin_access)):
    return {"settings": await ctrl.get_settings(), "stats": await ctrl.stats(), "jobs": await ctrl.list_jobs()}


@router.put("/admin/settings")
async def save_settings(body: SettingsBody, admin: AdminInDB = Depends(admin_access)):
    try:
        return await ctrl.update_settings(body.enabled, body.delay_minutes)
    except ctrl.NotifyError as exc:
        _fail(exc)


@router.post("/admin/jobs/{job_id}/cancel")
async def cancel(job_id: str, admin: AdminInDB = Depends(admin_access)):
    try:
        await ctrl.cancel_job(job_id)
    except ctrl.NotifyError as exc:
        _fail(exc)
    return {"message": "Cancelled"}


@router.post("/admin/jobs/{job_id}/send-now")
async def send_now(job_id: str, admin: AdminInDB = Depends(admin_access)):
    try:
        await ctrl.send_now(job_id)
    except ctrl.NotifyError as exc:
        _fail(exc)
    return {"message": "Will be sent within a minute"}


@router.post("/admin/test")
async def send_test(request: Request, body: TestBody, admin: AdminInDB = Depends(admin_access)):
    """A sample email to the signed-in admin only."""
    throttle(f"notify-test:{admin.email}", 3600, 10)
    ok = await ctrl.send_test(body.kind, admin.email, admin.name or "")
    if not ok:
        raise HTTPException(status_code=502, detail="The test email could not be sent. Check the email settings.")
    return {"message": f"Test email sent to {admin.email}"}
