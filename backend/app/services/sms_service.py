"""SMS sending through MSG91 (Flow API). Credentials come from the environment only."""
import logging

import httpx

from app.config.settings import settings

logger = logging.getLogger(__name__)

MSG91_FLOW_URL = "https://control.msg91.com/api/v5/flow"


class SmsError(Exception):
    """The SMS provider is not configured or did not accept the message."""


def is_configured() -> bool:
    return bool(settings.msg91_auth_key and settings.msg91_template_id)


async def send_otp_sms(mobile10: str, otp: str) -> None:
    """Send `otp` to an Indian mobile (10 digits). MSG91 needs the 91 country prefix."""
    if not is_configured():
        raise SmsError("OTP service is not configured")

    payload = {
        "template_id": settings.msg91_template_id,
        "realTimeResponse": "1",
        "recipients": [{"mobiles": f"91{mobile10}", "number": otp}],
    }
    headers = {
        "accept": "application/json",
        "authkey": settings.msg91_auth_key,
        "content-type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            res = await client.post(MSG91_FLOW_URL, json=payload, headers=headers)
        body = res.json() if res.content else {}
    except (httpx.HTTPError, ValueError) as exc:
        logger.error("MSG91 request failed: %s", type(exc).__name__)
        raise SmsError("Could not reach the SMS provider") from exc

    if res.status_code != 200 or str(body.get("type", "")).lower() != "success":
        # Log the provider's reason, never the OTP or the phone number.
        logger.error("MSG91 rejected the message: status=%s type=%s message=%s",
                     res.status_code, body.get("type"), str(body.get("message"))[:200])
        raise SmsError("The SMS provider rejected the request")
