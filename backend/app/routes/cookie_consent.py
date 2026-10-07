import csv
import io
import time
from collections import defaultdict, deque

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from fastapi.responses import StreamingResponse

from app.auth.deps import require_roles
from app.controllers import cookie_consent as ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.cookie_consent import ConsentSubmit

router = APIRouter(prefix="/cookie-consent", tags=["Cookie Consent"])

admin_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])

# ── Tiny in-memory rate limiter for the public endpoint ──────────────────────
# A real visitor submits a choice once (or a few times if they change it);
# anything faster than this is a script.
_WINDOW_SECONDS = 60
_MAX_PER_WINDOW = 12
_hits: dict[str, deque] = defaultdict(deque)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _check_rate(key: str) -> None:
    now = time.monotonic()
    q = _hits[key]
    while q and now - q[0] > _WINDOW_SECONDS:
        q.popleft()
    if len(q) >= _MAX_PER_WINDOW:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
    q.append(now)
    if len(_hits) > 5000:  # keep memory bounded
        for k in [k for k, v in _hits.items() if not v][:1000]:
            _hits.pop(k, None)


# ── Public: record a visitor's choice ────────────────────────────────────────

@router.post("/", status_code=status.HTTP_204_NO_CONTENT)
async def submit_consent(data: ConsentSubmit, request: Request):
    ip = _client_ip(request)
    _check_rate(ctrl.hash_ip(ip))
    await ctrl.record_consent(data, ip, request.headers.get("user-agent", ""))
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ── Admin ────────────────────────────────────────────────────────────────────

@router.get("/admin/summary")
async def admin_summary(days: int = Query(30, ge=7, le=90), _: AdminInDB = Depends(admin_access)):
    return await ctrl.summary(days)


@router.get("/admin/records")
async def admin_records(
    status_filter: str | None = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    _: AdminInDB = Depends(admin_access),
):
    return await ctrl.list_records(status_filter, skip, limit)


@router.get("/admin/export")
async def admin_export(_: AdminInDB = Depends(admin_access)):
    rows = await ctrl.export_rows()
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Reference", "Status", "Preferences cookies", "Browser", "Device", "Page", "Policy version",
                     "Changes", "First seen (UTC)", "Last updated (UTC)", "Expires (UTC)"])
    for d in rows:
        writer.writerow([ctrl.csv_safe(x) for x in [
            d["visitor_id"][:8], d.get("status"), "Yes" if d.get("categories", {}).get("preferences") else "No",
            d.get("browser"), d.get("device"), d.get("page"), d.get("policy_version"), len(d.get("history", [])),
            d.get("first_seen"), d.get("updated_at"), d.get("expires_at"),
        ]])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="cookie-consents.csv"'},
    )
