"""One set of validation rules shared by every public form (see the audit report, FRM-04/07/12/13).

* No angle brackets in plain-text fields (stops stored HTML / script payloads).
* One phone rule, one email rule, one set of length limits.
* A hidden "website" honeypot, an optional Cloudflare Turnstile token and a consent flag.
"""
import hashlib
import re
from typing import Annotated, Optional

import httpx
from fastapi import HTTPException, Request
from pydantic import AfterValidator, BaseModel, EmailStr, Field, StringConstraints, field_validator

from app.config.settings import settings
from app.utils.netutil import client_ip, throttle


def _no_markup(value: str) -> str:
    if "<" in value or ">" in value:
        raise ValueError("Angle brackets (< >) are not allowed")
    return value


def _phone(value: str) -> str:
    cleaned = re.sub(r"[\s\-().]", "", value)
    if not re.fullmatch(r"\+?[0-9]{7,15}", cleaned):
        raise ValueError("Enter a valid phone number (7 to 15 digits, optional + at the start)")
    return cleaned


def _email(value: str) -> str:
    value = value.strip().lower()
    if len(value) > 254:
        raise ValueError("Email is too long")
    return value


def _text(min_length: int, max_length: int):
    return Annotated[str, StringConstraints(strip_whitespace=True, min_length=min_length, max_length=max_length), AfterValidator(_no_markup)]


Name = _text(2, 100)
ShortText = _text(1, 100)           # company, city, designation ...
Subject = _text(2, 300)
Message = _text(10, 2000)
Phone = Annotated[str, StringConstraints(strip_whitespace=True, max_length=30), AfterValidator(_phone)]
Email = Annotated[EmailStr, AfterValidator(_email)]


def optional_blank_to_none(value):
    """Forms send "" for an empty optional box; treat that as 'not given'."""
    if isinstance(value, str) and not value.strip():
        return None
    return value


class FormGuard(BaseModel):
    """Mix-in for public form payloads: honeypot + Turnstile token + privacy consent."""
    website: Optional[str] = Field(None, max_length=200)             # honeypot: real users never see or fill it
    cf_turnstile_token: Optional[str] = Field(None, max_length=4096)
    consent: bool = False

    @field_validator("consent")
    @classmethod
    def _consent(cls, value: bool) -> bool:
        if value is not True:
            raise ValueError("Please accept the Privacy Policy to continue")
        return value


GUARD_FIELDS = {"website", "cf_turnstile_token"}


async def _verify_turnstile(token: Optional[str], ip: str) -> bool:
    if not settings.turnstile_secret:
        return True                      # Turnstile not configured for this environment
    if not token:
        return False
    try:
        async with httpx.AsyncClient(timeout=6) as http:
            res = await http.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data={"secret": settings.turnstile_secret, "response": token, "remoteip": ip},
            )
        return bool(res.json().get("success"))
    except Exception:
        return False


async def guard_form(request: Request, data: Optional[FormGuard], name: str, per_hour: int = 30, per_minute: int = 5,
                     dup: Optional[str] = None) -> str:
    """Rate limit + honeypot + Turnstile. Returns the client IP. Raises 429 / 400 / 403."""
    ip = client_ip(request)
    throttle(f"{name}:m:{ip}", 60, per_minute)
    throttle(f"{name}:h:{ip}", 3600, per_hour)
    if data is not None:
        if (data.website or "").strip():
            raise HTTPException(400, "Could not submit the form")
        if not await _verify_turnstile(data.cf_turnstile_token, ip):
            raise HTTPException(403, "Security check failed. Please refresh the page and try again.")
    if dup:
        # the same email + text twice within 5 minutes is a double click / replay, not a second enquiry
        digest = hashlib.sha256(dup.encode()).hexdigest()
        throttle(f"dup:{name}:{digest}", 300, 1, "We have already received this submission. Thank you.")
    return ip

