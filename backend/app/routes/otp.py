import time
from collections import defaultdict, deque

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.auth.deps import get_current_user
from app.controllers import otp as otp_ctrl

router = APIRouter(prefix="/otp", tags=["OTP"])

_hits: dict[str, deque] = defaultdict(deque)


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _throttle(key: str, window: int, limit: int) -> None:
    now = time.monotonic()
    q = _hits[key]
    while q and now - q[0] > window:
        q.popleft()
    if len(q) >= limit:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Too many attempts. Please try again in a little while.")
    q.append(now)
    if len(_hits) > 5000:
        for k in [k for k, v in _hits.items() if not v][:1000]:
            _hits.pop(k, None)


class SendOtp(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10)


class VerifyOtp(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10)
    otp: str = Field(..., min_length=6, max_length=6)


def _raise(exc: otp_ctrl.OtpError):
    raise HTTPException(status_code=exc.status_code, detail=exc.detail)


@router.post("/send")
async def send_otp(data: SendOtp, request: Request, user: dict = Depends(get_current_user)):
    _throttle(f"send-ip:{_client_ip(request)}", 3600, 30)
    try:
        cooldown = await otp_ctrl.send_code(user, data.mobile)
    except otp_ctrl.OtpError as exc:
        _raise(exc)
    return {"message": "OTP sent", "resend_in": cooldown, "expires_in": 300}


@router.post("/verify")
async def verify_otp(data: VerifyOtp, request: Request, user: dict = Depends(get_current_user)):
    _throttle(f"verify-ip:{_client_ip(request)}", 600, 60)
    try:
        token = await otp_ctrl.verify_code(user, data.mobile, data.otp)
    except otp_ctrl.OtpError as exc:
        _raise(exc)
    return {"verified": True, "otp_token": token}
