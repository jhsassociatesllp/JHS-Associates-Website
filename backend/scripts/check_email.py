"""Check that the website can send email, and say exactly why not if it cannot.

Run on the server, inside the backend container:

    docker exec -it <backend-container> python scripts/check_email.py you@example.com

It sends one test message to the address you give and prints the result. The password is never printed.
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.services import email_service as es


async def main(to: str) -> int:
    print("Mail server :", f"{es.SMTP_HOST}:{es.SMTP_PORT}")
    print("Login (user):", es.SMTP_USERNAME or "(EMPTY - the SMTP_USERNAME secret is not set)")
    print("Password    :", "set" if es.SMTP_PASSWORD else "(EMPTY - the SMTP_PASSWORD secret is not set)")
    print("From address:", es.SENDER_EMAIL or es.SMTP_USERNAME or "(none)")
    print("HR inbox    :", es.HR_EMAIL, "| Contact/RFP inbox:", es.CONNECT_EMAIL)
    print()
    ok = await es._send_email(to, "Test", "JHS website email test", es._wrap_html("Email test", '<tr><td style="padding:8px 0;">This is a test message from the JHS website server.</td></tr>'))
    if ok:
        print(f"OK: a test mail was accepted for {to}. Check that inbox (and Junk).")
        return 0
    print("FAILED:", es.last_error or "unknown error")
    return 1


if __name__ == "__main__":
    if len(sys.argv) != 2 or "@" not in sys.argv[1]:
        print("Usage: python scripts/check_email.py you@example.com")
        sys.exit(2)
    sys.exit(asyncio.run(main(sys.argv[1])))
