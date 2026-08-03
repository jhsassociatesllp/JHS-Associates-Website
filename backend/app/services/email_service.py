"""
Brevo (Sendinblue) SMTP Email Service
======================================
Sends transactional emails via the Brevo v3 SMTP API.
Every public helper fires TWO emails:
  1.  HR notification   →  HR_NOTIFICATION_EMAIL
  2.  Thank‑you email   →  the submitting user
Errors are logged but never crash the caller (fire‑and‑forget).
"""

import asyncio
import logging
import os

import httpx

from app.config.settings import settings

logger = logging.getLogger("email_service")

# ── Config from settings ─────────────────────────────────────
BREVO_API_KEY = settings.brevo_api_key
HR_EMAIL = settings.hr_notification_email
SENDER_EMAIL = settings.sender_email
SENDER_NAME = settings.sender_name

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


# ── Low‑level sender ────────────────────────────────────────
async def _send_email(
    to_email: str,
    to_name: str,
    subject: str,
    html_body: str,
) -> bool:
    """Send a single email via Brevo. Returns True on success."""
    if not BREVO_API_KEY:
        logger.warning("BREVO_API_KEY not configured – skipping email to %s", to_email)
        return False

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": to_email, "name": to_name}],
        "subject": subject,
        "htmlContent": html_body,
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                BREVO_URL,
                json=payload,
                headers={
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            )
            if resp.status_code in (200, 201):
                logger.info("Email sent → %s  subject=%s", to_email, subject)
                return True
            else:
                logger.error(
                    "Brevo %s  to=%s  body=%s", resp.status_code, to_email, resp.text
                )
                return False
    except Exception as exc:
        logger.error("Email send error → %s: %s", to_email, exc)
        return False


# ── Shared HTML wrapper ──────────────────────────────────────
def _wrap_html(title: str, body_rows: str) -> str:
    """Return a styled HTML email body."""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1e3a5f 0%,#162d4a 100%);padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.03em;">JHS &amp; Associates LLP</h1>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Chartered Accountants</p>
              </td>
            </tr>
            <!-- Title -->
            <tr>
              <td style="padding:32px 40px 0;">
                <h2 style="margin:0 0 20px;color:#1e3a5f;font-size:18px;font-weight:700;border-bottom:2px solid #B01E2E;padding-bottom:12px;">{title}</h2>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:0 40px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333333;">
                  {body_rows}
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8f8fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#999;">© 2025 JHS &amp; Associates LLP &nbsp;|&nbsp; <a href="https://jhsassociates.in" style="color:#B01E2E;text-decoration:none;">jhsassociates.in</a></p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """


def _row(label: str, value: str) -> str:
    """Single info row inside the body table."""
    return f"""
    <tr>
      <td style="padding:8px 0;font-weight:600;color:#555;width:160px;vertical-align:top;">{label}</td>
      <td style="padding:8px 0;color:#222;">{value}</td>
    </tr>"""


# ══════════════════════════════════════════════════════════════
#  1.  CONTACT FORM
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_contact(data: dict) -> None:
    """Fire‑and‑forget: HR + user emails for Contact form."""
    name = data.get("name", "")
    email = data.get("email", "")

    # ── HR notification ──
    rows = (
        _row("Name", name)
        + _row("Email", email)
        + _row("Phone", data.get("phone") or "—")
        + _row("Company", data.get("company") or "—")
        + _row("Service Interested", data.get("service") or "—")
        + _row("Message", data.get("message", ""))
    )
    hr_html = _wrap_html("New Contact Form Submission", rows)
    asyncio.create_task(
        _send_email(HR_EMAIL, "JHS HR Team", f"New Contact Submission from {name}", hr_html)
    )

    # ── User thank‑you ──
    user_body = _wrap_html(
        "Thank You for Contacting Us",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{name}</strong>,<br><br>
          Thank you for reaching out to <strong>JHS &amp; Associates LLP</strong>.
          We have received your message and our team will get back to you shortly.<br><br>
          If your query is urgent, please feel free to call us directly.<br><br>
          Warm regards,<br>
          <strong>JHS &amp; Associates LLP</strong>
        </td></tr>
        """,
    )
    asyncio.create_task(
        _send_email(email, name, "Thank you for contacting JHS Associates", user_body)
    )


# ══════════════════════════════════════════════════════════════
#  2.  ALUMNI REGISTRATION
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_alumni(data: dict) -> None:
    """Fire‑and‑forget: HR + user emails for Alumni registration."""
    first = data.get("first_name", "")
    last = data.get("last_name", "")
    full_name = f"{first} {last}".strip()
    email = data.get("email", "")

    rows = (
        _row("Name", full_name)
        + _row("Email", email)
        + _row("Phone", data.get("phone") or "—")
        + _row("Current Company", data.get("company", ""))
        + _row("Designation", data.get("designation", ""))
        + _row("Tenure at JHS", data.get("tenure", ""))
        + _row("Last Role at JHS", data.get("last_role", ""))
        + _row("Message", data.get("message") or "—")
    )
    hr_html = _wrap_html("New Alumni Registration", rows)
    asyncio.create_task(
        _send_email(HR_EMAIL, "JHS HR Team", f"New Alumni Registration: {full_name}", hr_html)
    )

    user_body = _wrap_html(
        "Welcome Back to the JHS Alumni Network",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{full_name}</strong>,<br><br>
          Thank you for registering with the <strong>JHS &amp; Associates Alumni Network</strong>.
          We're delighted to stay connected with you!<br><br>
          Our team will review your details and reach out if there are any upcoming alumni events or opportunities.<br><br>
          Warm regards,<br>
          <strong>JHS &amp; Associates LLP</strong>
        </td></tr>
        """,
    )
    asyncio.create_task(
        _send_email(email, full_name, "Welcome back to JHS Associates Alumni Network", user_body)
    )


# ══════════════════════════════════════════════════════════════
#  3.  CLIENT FEEDBACK
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_feedback(data: dict) -> None:
    """Fire‑and‑forget: HR + user emails for Client Feedback."""
    client = data.get("client_name", "")
    person_name = data.get("name", "")
    designation = data.get("designation", "")
    # Feedback has no direct user email, so we skip user thank‑you
    # Actually, there's no email field in the feedback schema.
    # Only send HR notification.

    rows = (
        _row("Client Name", client)
        + _row("Submitted By", f"{person_name}, {designation}")
        + _row("Nature of Assignment", data.get("nature_of_assignment", ""))
        + _row("Period", data.get("period_of_assignment") or "—")
        + _row("Overall Rating", f"{data.get('overall', 0)} / 5")
        + _row("Would Refer", data.get("would_refer", "—"))
        + _row("Delighted by Service", data.get("delighted_by_service", "—"))
        + _row("Testimonial", data.get("testimonial") or "—")
    )
    hr_html = _wrap_html("New Client Feedback Received", rows)
    asyncio.create_task(
        _send_email(
            HR_EMAIL, "JHS HR Team",
            f"New Client Feedback from {client}",
            hr_html,
        )
    )


# ══════════════════════════════════════════════════════════════
#  4.  CAREER APPLICATION
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_application(data: dict, job_title: str) -> None:
    """Fire‑and‑forget: HR + user emails for Career application."""
    name = data.get("full_name", "")
    email = data.get("email", "")

    def _with_other(value: str | None, other: str | None) -> str:
        if not value:
            return "—"
        if other:
            return f"{value} ({other})"
        return value

    how_heard = _with_other(data.get("how_heard"), data.get("how_heard_detail"))

    rows = (
        _row("Candidate Name", name)
        + _row("Email", email)
        + _row("Phone", data.get("phone", ""))
        + _row("Applied For", job_title)
        + _row("Place of Residence", data.get("place_of_residence") or "—")
        + _row("Location", data.get("current_location") or "—")
        + _row("Experience", data.get("experience_years") or "—")
        + _row("Highest Qualification", _with_other(data.get("highest_qualification"), data.get("highest_qualification_other")))
        + _row("Profile", _with_other(data.get("profile"), data.get("profile_other")))
        + _row("Reference", data.get("reference") or "—")
        + _row("How They Heard About Us", how_heard)
        + _row("Remark", data.get("cover_letter") or "—")
        + _row("Resume", "Attached in the admin panel")
    )
    hr_html = _wrap_html("New Job Application Received", rows)
    asyncio.create_task(
        _send_email(
            HR_EMAIL, "JHS HR Team",
            f"New Job Application: {name} for {job_title}",
            hr_html,
        )
    )

    user_body = _wrap_html(
        f"Application Received — {job_title}",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{name}</strong>,<br><br>
          Thank you for applying for the position of <strong>{job_title}</strong>
          at <strong>JHS &amp; Associates LLP</strong>.<br><br>
          Our HR team has received your application and will review it carefully.
          If your profile matches our requirements, we will reach out to schedule the next steps.<br><br>
          We appreciate your interest in joining JHS and wish you all the best.<br><br>
          Warm regards,<br>
          <strong>HR Team<br>JHS &amp; Associates LLP</strong>
        </td></tr>
        """,
    )
    asyncio.create_task(
        _send_email(
            email, name,
            f"Application Received – {job_title} at JHS Associates",
            user_body,
        )
    )
