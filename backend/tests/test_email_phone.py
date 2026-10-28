"""Run: python tests/test_email_phone.py (no database or mail server needed).

Career + alumni acknowledgement emails show the HR number; every other email shows the firm number.
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.services import email_service as es

_real_send = es._send_email
sent = []


async def fake_send(to, name, subject, html, *a, **k):
    sent.append((to, subject, html))
    return True


es._send_email = fake_send
es._fire_and_forget = lambda coro: asyncio.ensure_future(coro)

HR, FIRM = "+91 8097093034", "+91 8097095057"
ok = True


def check(name, cond):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name)


async def main():
    await es.notify_hr_new_alumni({"full_name": "Asha Rao", "email": "asha@x.com", "phone": "9876543210"})
    await es.notify_hr_new_application({"full_name": "Bilal Khan", "email": "bilal@x.com", "phone": "9876543210"}, "Auditor")
    await es.notify_hr_new_contact({"name": "Chitra", "email": "chitra@x.com", "message": "hi", "subject": "s", "phone": "9876543210"})
    await es.notify_hr_new_proposal({"first_name": "Esha", "last_name": "M", "email": "esha@x.com", "phone": "9876543210", "inquiry_reason": "x", "subject": "s", "message": "m"})
    await es.notify_hr_new_appointment({"name": "Farid", "email": "farid@x.com", "mobile": "9876543210", "date": "2026-11-01", "time": "10:00", "service": "Tax", "mode": "Online"})
    await asyncio.sleep(0.2)

asyncio.run(main())
users = {s[0]: s[2] for s in sent if s[0].endswith("@x.com")}
check("alumni acknowledgement shows HR number", HR in users.get("asha@x.com", "") and FIRM not in users.get("asha@x.com", ""))
check("career acknowledgement shows HR number", HR in users.get("bilal@x.com", "") and FIRM not in users.get("bilal@x.com", ""))
for who in ("chitra@x.com", "esha@x.com", "farid@x.com"):
    check(f"{who.split('@')[0]} (contact / proposal / appointment) shows the firm number", FIRM in users.get(who, "") and HR not in users.get(who, ""))
print(f"({len(users)} user emails checked)")


# ── sending: From-address fallback and clear failure reasons ──
import aiosmtplib  # noqa: E402

calls = []


def run_send(side_effects, sender="connect@jhsassociates.in", username="maaz@jhsassociates.in"):
    calls.clear()
    es.SMTP_USERNAME, es.SMTP_PASSWORD, es.SENDER_EMAIL = username, "x", sender
    queue = list(side_effects)

    async def fake_smtp(message):
        calls.append((message["From"], message["Reply-To"]))
        eff = queue.pop(0)
        if eff:
            raise eff

    es._smtp_send = fake_smtp
    es._send_email = _real_send
    return asyncio.run(_real_send("a@x.com", "A", "s", "<p>h</p>"))


ok2 = True


def check2(name, cond):
    global ok2
    ok2 &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name)


check2("mail goes out normally", run_send([None]) is True and len(calls) == 1 and "connect@" in calls[0][0])
res = run_send([aiosmtplib.SMTPSenderRefused(550, "5.7.60 SMTP; Client does not have permissions to send as this sender", "connect@jhsassociates.in"), None])
check2("'cannot send as' refusal -> resent from the login mailbox with Reply-To", res is True and len(calls) == 2 and "maaz@" in calls[1][0] and calls[1][1] == "connect@jhsassociates.in")
res = run_send([aiosmtplib.SMTPAuthenticationError(535, "5.7.139 Authentication unsuccessful")])
check2("login refused -> False, plain-English reason", res is False and "refused the login" in es.last_error and len(calls) == 1)
res = run_send([OSError("Connect call failed")])
check2("server unreachable -> False, port-587 hint", res is False and "587" in es.last_error)
es.SMTP_USERNAME = ""
check2("no credentials -> False, tells which secret is missing", asyncio.run(_real_send("a@x.com", "A", "s", "h")) is False and "SMTP_USERNAME" in es.last_error)
print("ALL PASS" if (ok and ok2) else "SOME FAILED")
