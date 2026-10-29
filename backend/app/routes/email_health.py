"""Super-Admin-only email health check: shows how mail is set up and sends one test message,
so a delivery problem can be read on screen instead of digging through server logs."""
import time

from fastapi import APIRouter, Depends, HTTPException

from app.auth.deps import require_roles
from app.schemas.admin import AdminInDB, AdminRole
from app.services import email_service as es

super_admin_only = require_roles([AdminRole.SUPER_ADMIN])

router = APIRouter(prefix="/admin/email-health", tags=["Email health"])

_last_test: dict[str, float] = {}   # admin email -> when they last pressed the button
MIN_SECONDS_BETWEEN_TESTS = 10


def _mask(value: str) -> str:
    """Shows that a value is present without revealing it."""
    return "set" if value else "NOT SET"


@router.get("")
async def email_health(current_admin: AdminInDB = Depends(super_admin_only)):
    graph = es._graph_configured()
    return {
        "graph": {
            "configured": graph,
            "tenant_id": _mask(es.GRAPH_TENANT_ID),
            "client_id": _mask(es.GRAPH_CLIENT_ID),
            "client_secret": _mask(es.GRAPH_CLIENT_SECRET),
            "sender": es.GRAPH_SENDER or "NOT SET",
        },
        "smtp": {
            "configured": bool(es.SMTP_USERNAME and es.SMTP_PASSWORD),
            "login": es.SMTP_USERNAME or "NOT SET",
            "password": _mask(es.SMTP_PASSWORD),
            "server": f"{es.SMTP_HOST}:{es.SMTP_PORT}",
        },
        "inboxes": {"hr": es.HR_EMAIL, "contact_and_proposals": es.CONNECT_EMAIL, "appointments": es.APPOINTMENT_EMAIL},
        "will_use": "Microsoft Graph, then SMTP if Graph fails" if graph else ("SMTP only" if es.SMTP_USERNAME and es.SMTP_PASSWORD else "NOTHING: no email can be sent"),
    }


@router.post("/test")
async def send_test_email(current_admin: AdminInDB = Depends(super_admin_only)):
    """Sends one test message to the logged-in admin and reports exactly how it went."""
    now = time.monotonic()
    if now - _last_test.get(current_admin.email, 0) < MIN_SECONDS_BETWEEN_TESTS:
        raise HTTPException(status_code=429, detail="Please wait a few seconds before sending another test.")
    _last_test[current_admin.email] = now

    result = {"to": current_admin.email, "graph_error": "", "smtp_error": "", "method": "", "ok": False}
    html = es._wrap_html("Email check", '<tr><td style="padding:8px 0;">This is a test message from the JHS admin panel. If you can read it, the website can send email.</td></tr>')

    if es._graph_configured():
        try:
            await es._send_via_graph(current_admin.email, "JHS Admin", "JHS website email check", html)
            return {**result, "ok": True, "method": "Microsoft Graph"}
        except es.GraphError as exc:
            result["graph_error"] = str(exc)
    sent = await es._send_via_smtp(current_admin.email, "JHS Admin", "JHS website email check", html)
    if sent:
        return {**result, "ok": True, "method": "SMTP"}
    result["smtp_error"] = es.last_error or "SMTP is not configured"
    return result
