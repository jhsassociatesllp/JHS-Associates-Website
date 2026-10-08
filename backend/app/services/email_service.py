"""
Outlook / Microsoft 365 SMTP Email Service
============================================
Sends transactional emails via SMTP through an Outlook/Microsoft 365
mailbox (smtp.office365.com, STARTTLS on port 587).
Every public helper fires TWO emails:
  1.  HR notification   →  HR_NOTIFICATION_EMAIL
  2.  Thank‑you email   →  the submitting user
Errors are logged but never crash the caller (fire‑and‑forget).

Note: Microsoft has been disabling basic SMTP AUTH by default on newer
tenants. If sending fails with an authentication error, enable "SMTP AUTH"
for the sending mailbox in the Microsoft 365 admin center (Exchange admin
center → mailboxes → that mailbox → manage email apps), and use an App
Password for smtp_password if MFA is enabled on the account.
"""

import asyncio
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config.settings import settings

logger = logging.getLogger("email_service")

# asyncio only holds a WEAK reference to tasks created via create_task(), so
# a task with no other reference can be garbage-collected before it ever
# runs — silently dropping the email with no error. Keeping a strong
# reference here (and discarding it once the task finishes) is the fix
# recommended by the asyncio docs for exactly this fire-and-forget pattern.
_background_email_tasks: set[asyncio.Task] = set()


def _fire_and_forget(coro) -> asyncio.Task:
    task = asyncio.create_task(coro)
    _background_email_tasks.add(task)
    task.add_done_callback(_background_email_tasks.discard)
    return task


# ── Config from settings ─────────────────────────────────────
HR_EMAIL = settings.hr_notification_email
APPOINTMENT_EMAIL = settings.appointment_notification_email
CONNECT_EMAIL = settings.connect_notification_email   # Contact Us + Request for Proposal
SENDER_EMAIL = settings.sender_email or settings.smtp_username
SENDER_NAME = settings.sender_name

SMTP_HOST = settings.smtp_host
SMTP_PORT = settings.smtp_port
SMTP_USERNAME = settings.smtp_username
SMTP_PASSWORD = settings.smtp_password


# ── Low‑level sender ────────────────────────────────────────
async def _send_email(
    to_email: str,
    to_name: str,
    subject: str,
    html_body: str,
) -> bool:
    """Send a single email via Outlook/Office 365 SMTP. Returns True on success."""
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured – skipping email to %s", to_email)
        return False

    effective_sender = SENDER_EMAIL or SMTP_USERNAME
    message = MIMEMultipart("alternative")
    message["From"] = f"{SENDER_NAME} <{effective_sender}>"
    message["To"] = f"{to_name} <{to_email}>" if to_name else to_email
    message["Subject"] = subject
    message.attach(MIMEText(html_body, "html"))

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
            start_tls=True,
            timeout=15,
        )
        logger.info("Email sent -> %s  subject=%s", to_email, subject)
        return True
    except Exception as exc:
        logger.error("Email send error -> %s: %s", to_email, exc)
        return False


# ── Shared HTML wrapper (letterhead layout) ──────────────────
FIRM_ADDRESS = "B Wing, 4th Floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East), Mumbai &ndash; 400059"
FIRM_PHONE = "1800 120 1022"
FIRM_WEBSITE = "jhsassociates.in"
FIRM_EMAIL = "connect@jhsassociates.in"

NAVY = "#0f2340"
CRIMSON = "#B01E2E"


class _Html(str):
    """Marks a value as already-safe HTML so _row does not escape it again."""


def _letter_date() -> str:
    from datetime import datetime, timedelta, timezone

    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%d %B %Y")


def _wrap_html(title: str, body_rows: str) -> str:
    """Return a styled HTML email in a professional letterhead layout."""
    from datetime import datetime
    from html import escape as _esc

    title = _esc(title)
    year = datetime.now().year
    automated = "Warm regards" not in body_rows
    signoff = (
        f"""<tr><td colspan="2" style="padding:22px 0 0;font-size:12px;color:#8a93a3;line-height:1.6;">
              This is an automated message from the JHS website.</td></tr>"""
        if automated else ""
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>{title}</title></head>
<body style="margin:0;padding:0;background:#eef0f4;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f4;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;box-shadow:0 6px 28px rgba(15,35,64,0.10);">
        <tr>
          <!-- ───────── letter ───────── -->
          <td valign="top" style="padding:0;">
            <!-- letterhead -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:34px 36px 20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td style="border-left:5px solid {CRIMSON};padding-left:12px;">
                      <div style="font-size:34px;line-height:34px;font-weight:800;letter-spacing:0.02em;color:{CRIMSON};">JHS</div>
                      <div style="font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:{NAVY};padding-top:5px;">Chartered Accountants</div>
                    </td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 36px 18px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td valign="top" style="font-size:12px;line-height:1.75;color:#44506a;">
                      <strong style="color:{CRIMSON};font-size:13px;">JHS</strong><br>
                      <strong style="color:{CRIMSON};">Website</strong>&nbsp; : &nbsp;<a href="https://{FIRM_WEBSITE}" style="color:#44506a;text-decoration:none;">{FIRM_WEBSITE}</a><br>
                      <strong style="color:{CRIMSON};">Email</strong>&nbsp; : &nbsp;<a href="mailto:{FIRM_EMAIL}" style="color:#44506a;text-decoration:none;">{FIRM_EMAIL}</a><br>
                      <strong style="color:{CRIMSON};">Phone</strong>&nbsp; : &nbsp;{FIRM_PHONE}
                    </td>
                    <td valign="top" align="right" style="font-size:12px;color:#44506a;white-space:nowrap;">Date, {_letter_date()}</td>
                  </tr></table>
                </td>
              </tr>
              <tr><td style="padding:0 36px;"><div style="border-top:1px solid #d9dde6;font-size:0;line-height:0;">&nbsp;</div></td></tr>
              <!-- title + content -->
              <tr>
                <td style="padding:24px 36px 6px;">
                  <h2 style="margin:0;color:{NAVY};font-size:19px;line-height:1.35;font-weight:700;">{title}</h2>
                  <div style="width:42px;height:3px;background:{CRIMSON};margin-top:10px;font-size:0;line-height:0;">&nbsp;</div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 36px 30px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#2b3445;">
                    {body_rows}
                    {signoff}
                  </table>
                </td>
              </tr>
              <!-- footer -->
              <tr><td style="padding:0 36px;"><div style="border-top:2px solid {CRIMSON};opacity:0.85;font-size:0;line-height:0;">&nbsp;</div></td></tr>
              <tr>
                <td style="padding:16px 36px 26px;font-size:12px;line-height:1.8;color:#44506a;">
                  <strong style="color:{NAVY};font-size:13px;">JHS &ndash; Chartered Accountants</strong><br>
                  {FIRM_ADDRESS}<br>
                  <span style="color:{CRIMSON};font-weight:700;">Phone</span>&nbsp; {FIRM_PHONE}<br>
                  <span style="color:{CRIMSON};font-weight:700;">Email</span>&nbsp; <a href="mailto:{FIRM_EMAIL}" style="color:#44506a;text-decoration:none;">{FIRM_EMAIL}</a><br>
                  <span style="color:{CRIMSON};font-weight:700;">Website</span>&nbsp; <a href="https://{FIRM_WEBSITE}" style="color:#44506a;text-decoration:none;">{FIRM_WEBSITE}</a>
                  <div style="padding-top:10px;font-size:11px;color:#98a1b1;">&copy; {year} JHS. All rights reserved.</div>
                </td>
              </tr>
            </table>
          </td>
          <!-- ───────── side stripe ───────── -->
          <td width="26" valign="top" bgcolor="{CRIMSON}" style="width:26px;background-color:{CRIMSON};background-image:linear-gradient(to bottom,{NAVY} 0%,{NAVY} 52%,{CRIMSON} 52%,{CRIMSON} 100%);font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


def _row(label: str, value: str) -> str:
    """One labelled detail line. Plain values are HTML-escaped; wrap trusted markup in _Html()."""
    from html import escape as _esc

    if isinstance(value, _Html):
        shown = str(value)
    else:
        shown = _esc(str(value if value is not None else "")).replace("\r\n", "\n").replace("\n", "<br>")
    return f"""
    <tr>
      <td width="150" valign="top" style="padding:12px 14px 10px 0;border-bottom:1px solid #edf0f5;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7b869a;">{_esc(label)}</td>
      <td valign="top" style="padding:10px 0;border-bottom:1px solid #edf0f5;font-size:14px;line-height:1.55;color:#1f2a3d;word-break:break-word;">{shown}</td>
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
    _fire_and_forget(
        _send_email(CONNECT_EMAIL, "JHS Connect", f"New Contact Submission from {name}", hr_html)
    )

    # ── User thank‑you ──
    user_body = _wrap_html(
        "Thank You for Contacting Us",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{name}</strong>,<br><br>
          Thank you for reaching out to <strong>JHS</strong>.
          We have received your message and our team will get back to you shortly.<br><br>
          If your query is urgent, please feel free to call us directly.<br><br>
          Warm regards,<br>
          <strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(email, name, "Thank you for contacting JHS", user_body)
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
    _fire_and_forget(
        _send_email(HR_EMAIL, "JHS HR Team", f"New Alumni Registration: {full_name}", hr_html)
    )

    user_body = _wrap_html(
        "Welcome Back to the JHS Alumni Network",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{full_name}</strong>,<br><br>
          Thank you for registering with the <strong>JHS Alumni Network</strong>.
          We're delighted to stay connected with you!<br><br>
          Our team will review your details and reach out if there are any upcoming alumni events or opportunities.<br><br>
          Warm regards,<br>
          <strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(email, full_name, "Welcome back to JHS Alumni Network", user_body)
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
    _fire_and_forget(
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
        + _row("Current CTC", data.get("current_ctc") or "—")
        + _row("Expected CTC", data.get("expected_ctc") or "—")
        + _row("How They Heard About Us", how_heard)
        + _row("Remark", data.get("cover_letter") or "—")
        + _row("Resume", "Attached in the admin panel")
    )
    if data.get("ats_status") in ("matched", "below"):
        verdict = "Match (60%+)" if data.get("ats_match") else "Below the 60% match line"
        rows = _row("ATS Resume Match", f"{data.get('ats_score')}% — {verdict}") + rows
    elif data.get("ats_status") == "unreadable":
        rows = _row("ATS Resume Match", "Resume text could not be read — review manually") + rows
    hr_html = _wrap_html("New Job Application Received", rows)
    _fire_and_forget(
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
          at <strong>JHS</strong>.<br><br>
          Our HR team has received your application and will review it carefully.
          If your profile matches our requirements, we will reach out to schedule the next steps.<br><br>
          We appreciate your interest in joining JHS and wish you all the best.<br><br>
          Warm regards,<br>
          <strong>HR Team<br>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(
            email, name,
            f"Application Received – {job_title} at JHS",
            user_body,
        )
    )


# ══════════════════════════════════════════════════════════════
#  5.  APPOINTMENT BOOKING
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_appointment(data: dict) -> None:
    """Fire‑and‑forget: team (connect@) + user emails for a Book Appointment submission."""
    name = data.get("full_name", "")
    email = data.get("email", "")
    mobile = data.get("mobile", "")
    speciality = data.get("speciality", "")
    partner = data.get("partner") or "Any available partner"

    rows = (
        _row("Name", name)
        + _row("Mobile", f"+91 {mobile}")
        + _row("Email", email)
        + _row("City", data.get("city") or "—")
        + _row("Speciality", speciality)
        + _row("Preferred Partner", partner)
        + _row("Notes", data.get("message") or "—")
    )
    hr_html = _wrap_html("New Appointment Request", rows)
    subject = f"New Appointment Request: {name}"
    if data.get("partner"):
        subject += f" → {data['partner']}"
    _fire_and_forget(
        _send_email(APPOINTMENT_EMAIL, "JHS Appointments", subject, hr_html)
    )

    user_body = _wrap_html(
        "Appointment Request Received",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{name}</strong>,<br><br>
          Thank you for booking an appointment with <strong>JHS</strong>
          for <strong>{speciality}</strong>.<br><br>
          Our team will call you on <strong>+91 {mobile}</strong> shortly to confirm
          a convenient time for your appointment.<br><br>
          Warm regards,<br>
          <strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(email, name, "Your appointment request — JHS", user_body)
    )


# ══════════════════════════════════════════════════════════════
#  6.  CONSULTATION REQUEST (Consulting page — partner booking)
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_consultation_request(data: dict) -> None:
    """Fire‑and‑forget: team (connect@) + user emails for a partner consultation request."""
    name = data.get("user_name", "")
    email = data.get("user_email", "")
    partner_name = data.get("partner_name", "")
    partner_role = data.get("partner_role") or "—"
    appointment_type = data.get("appointment_type", "")

    rows = (
        _row("Requested By", name)
        + _row("Email", email)
        + _row("Partner", partner_name)
        + _row("Partner Role", partner_role)
        + _row("Location", data.get("partner_location") or "—")
        + _row("Appointment Type", appointment_type)
        + _row("Notes", data.get("message") or "—")
    )
    hr_html = _wrap_html("New Consultation Request", rows)
    _fire_and_forget(
        _send_email(
            APPOINTMENT_EMAIL, "JHS Appointments",
            f"New Consultation Request: {name} → {partner_name}",
            hr_html,
        )
    )

    user_body = _wrap_html(
        "Consultation Request Received",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{name}</strong>,<br><br>
          Thank you for requesting a <strong>{appointment_type}</strong> with
          <strong>{partner_name}</strong> at <strong>JHS</strong>.<br><br>
          Our team will reach out to you on <strong>{email}</strong> shortly to confirm the schedule.<br><br>
          Warm regards,<br>
          <strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(email, name, "Your consultation request — JHS", user_body)
    )


# ══════════════════════════════════════════════════════════════
#  7.  REQUEST FOR PROPOSAL
# ══════════════════════════════════════════════════════════════

async def notify_hr_new_proposal(data: dict) -> None:
    """Fire‑and‑forget: HR + user emails for a Request for Proposal submission."""
    full_name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
    email = data.get("email", "")
    subject_line = data.get("subject", "")

    rows = (
        _row("Name", full_name)
        + _row("Email", email)
        + _row("Phone", data.get("phone") or "—")
        + _row("Reason for Inquiry", data.get("inquiry_reason", ""))
        + _row("Subject", subject_line)
        + _row("Message", data.get("message") or "—")
    )
    hr_html = _wrap_html("New Request for Proposal", rows)
    _fire_and_forget(
        _send_email(CONNECT_EMAIL, "JHS Connect", f"New Proposal Request: {full_name}", hr_html)
    )

    user_body = _wrap_html(
        "Request Received",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{full_name}</strong>,<br><br>
          Thank you for reaching out to <strong>JHS</strong> regarding
          <strong>{subject_line}</strong>.<br><br>
          Our team has received your request and will get back to you within one business day.<br><br>
          Warm regards,<br>
          <strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(email, full_name, "Your request has been received — JHS", user_body)
    )


# ══════════════════════════════════════════════════════════════
#  8.  SITE ACCOUNT WELCOME
# ══════════════════════════════════════════════════════════════

async def send_user_welcome_email(user: dict) -> None:
    """Fire-and-forget welcome email for a new unified site account.
    Best-effort only — a missing/broken mailbox must never block signup,
    which is why every caller uses _fire_and_forget rather than awaiting
    this directly."""
    name = user.get("name") or user.get("first_name") or "there"
    email = user.get("email", "")

    body = _wrap_html(
        "Welcome to JHS",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{name}</strong>,<br><br>
          Your account has been created successfully. You can now download our
          white papers, newsletters, articles and regulatory updates, apply for
          open roles, request a proposal and book appointments — all using this
          one sign-in.<br><br>
          Warm regards,<br>
          <strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(
        _send_email(email, name, "Welcome to JHS", body)
    )


# ══════════════════════════════════════════════════════════════
#  EVENT REGISTRATION (Excellencia, Knowledge Setu, office events)
# ══════════════════════════════════════════════════════════════

async def notify_event_registration(event: dict, name: str, email: str, reference: str) -> None:
    """Fire-and-forget confirmation to the person who registered (values are HTML-escaped)."""
    from datetime import timezone as _tz, timedelta as _td
    from html import escape

    ist = _tz(_td(hours=5, minutes=30))

    def when(dt):
        if dt is None:
            return ""
        dt = dt.replace(tzinfo=_tz.utc) if dt.tzinfo is None else dt
        return dt.astimezone(ist).strftime("%A, %d %B %Y, %I:%M %p IST")

    title = escape(event.get("title", "the event"))
    rows = (
        _row("Event", _Html(f"<strong>{title}</strong>"))
        + _row("Type", event.get("event_type", ""))
        + _row("When", when(event.get("start_at")))
        + _row("Format", event.get("mode", "Online"))
    )
    if event.get("venue"):
        rows += _row("Venue", event["venue"])
    if event.get("join_link"):
        link = escape(event["join_link"], quote=True)
        rows += _row("Join link", _Html(f'<a href="{link}" style="color:#B01E2E;">{link}</a>'))
    rows += _row("Your reference", reference)

    body = _wrap_html(
        "You are registered",
        f"""
        <tr><td colspan="2" style="padding:12px 0;line-height:1.7;color:#333;">
          Dear <strong>{escape(name)}</strong>,<br><br>
          Thank you for registering. Your seat for <strong>{title}</strong> is confirmed.
        </td></tr>
        {rows}
        <tr><td colspan="2" style="padding:16px 0 0;line-height:1.7;color:#333;">
          Please keep this email — it has everything you need to join.<br><br>
          Warm regards,<br><strong>JHS</strong>
        </td></tr>
        """,
    )
    _fire_and_forget(_send_email(email, name, f"You're registered: {event.get('title', 'JHS event')}", body))
