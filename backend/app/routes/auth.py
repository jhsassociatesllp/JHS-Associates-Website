from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Request

from app.auth.deps import get_current_user
from app.auth.security import create_access_token
from app.auth.throttle import MAX_FAILS, MAX_FAILS_PER_IP, check_login_allowed, clear_failures, record_failure
from app.utils.netutil import client_ip, throttle
from app.controllers import applicant as applicant_ctrl
from app.controllers import user as user_ctrl
from app.schemas.user import (
    AuthResponse,
    GoogleAuthRequest,
    UserLogin,
    UserResponse,
    UserSignup,
)
from app.services.email_service import send_user_welcome_email

router = APIRouter(prefix="/auth", tags=["Site Account"])

USER_TOKEN_EXPIRES = timedelta(hours=24)   # was 30 days; shorter sessions limit the damage of a stolen token


def _issue_token(user: dict) -> str:
    return create_access_token(
        {"sub": user["email"], "uid": user["id"], "type": "site_user"},
        expires_delta=USER_TOKEN_EXPIRES,
    )


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(request: Request, data: UserSignup):
    throttle(f"signup:{client_ip(request)}", 3600, 8, "Too many sign-up attempts. Please try again later.")
    user = await user_ctrl.create_user_with_password(data)
    await send_user_welcome_email(user)
    return {"token": _issue_token(user), "user": user}


@router.post("/login", response_model=AuthResponse)
async def login(request: Request, data: UserLogin):
    ip = client_ip(request)
    keys = [(f"user:{data.email.lower()}", MAX_FAILS), (f"ip:{ip}", MAX_FAILS_PER_IP)]
    await check_login_allowed(keys)
    try:
        user = await user_ctrl.authenticate_user(data.email, data.password)
    except HTTPException as exc:
        if exc.status_code in (400, 401, 403):
            await record_failure([k for k, _ in keys])
        raise
    await clear_failures(f"user:{data.email.lower()}")
    return {"token": _issue_token(user), "user": user}


@router.post("/google", response_model=AuthResponse)
async def google_signin(data: GoogleAuthRequest):
    google_payload = applicant_ctrl.verify_google_credential(data.credential)
    user = await user_ctrl.upsert_user_from_google(google_payload)
    return {"token": _issue_token(user), "user": user}


@router.get("/me", response_model=UserResponse)
async def current_user(user: dict = Depends(get_current_user)):
    """Lets the frontend proactively check whether a stored session token is
    still valid (and the account still active) on page load, rather than
    only discovering an expired/revoked session when a gated action fails."""
    return user
