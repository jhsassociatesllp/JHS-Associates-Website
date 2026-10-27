"""Run: python tests/test_email_phone.py (no database or mail server needed).

Career + alumni acknowledgement emails show the HR number; every other email shows the firm number.
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.services import email_service as es

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
print("ALL PASS" if ok else "SOME FAILED", f"({len(users)} user emails checked)")
