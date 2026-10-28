"""Check that the website can send email, and say exactly why not if it cannot.

Run on the server, inside the backend container:

    docker exec -it <backend-container> python scripts/check_email.py you@example.com

It sends one test message to the address you give and prints how it went out (Microsoft Graph or SMTP).
Secrets are never printed.
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.services import email_service as es


def _set(value: str, name: str) -> str:
    return "set" if value else f"(EMPTY - the {name} secret is not set)"


async def main(to: str) -> int:
    print("Microsoft Graph (preferred):")
    print("  Tenant ID    :", _set(es.GRAPH_TENANT_ID, "GRAPH_TENANT_ID"))
    print("  Client ID    :", _set(es.GRAPH_CLIENT_ID, "GRAPH_CLIENT_ID"))
    print("  Client secret:", _set(es.GRAPH_CLIENT_SECRET, "GRAPH_CLIENT_SECRET"))
    print("  Sender       :", es.GRAPH_SENDER or "(EMPTY - the GRAPH_SENDER secret is not set)")
    print("  Status       :", "READY" if es._graph_configured() else "not configured, so SMTP will be used")
    print("SMTP (fallback):")
    print("  Server       :", f"{es.SMTP_HOST}:{es.SMTP_PORT}")
    print("  Login (user) :", es.SMTP_USERNAME or "(EMPTY)")
    print("  Password     :", "set" if es.SMTP_PASSWORD else "(EMPTY)")
    print("HR inbox:", es.HR_EMAIL, "| Contact/RFP inbox:", es.CONNECT_EMAIL)
    print()

    if es._graph_configured():
        # try Graph on its own first, so a Graph problem is never hidden by the SMTP fallback
        try:
            await es._send_via_graph(to, "Test", "JHS website email test (Graph)", es._wrap_html("Email test (Graph)", '<tr><td style="padding:8px 0;">This is a test message sent through Microsoft Graph.</td></tr>'))
            print(f"OK: Microsoft Graph accepted a test mail for {to} (sent as {es.GRAPH_SENDER}). Check that inbox (and Junk).")
            return 0
        except es.GraphError as exc:
            print("GRAPH FAILED:", exc)
            print("Trying SMTP as the website would do…")
    ok = await es._send_via_smtp(to, "Test", "JHS website email test (SMTP)", es._wrap_html("Email test (SMTP)", '<tr><td style="padding:8px 0;">This is a test message sent over SMTP.</td></tr>'))
    if ok:
        print(f"OK (SMTP only): a test mail was accepted for {to}. Check that inbox (and Junk).")
        return 0 if not es._graph_configured() else 1
    print("SMTP FAILED:", es.last_error or "unknown error")
    return 1


if __name__ == "__main__":
    if len(sys.argv) != 2 or "@" not in sys.argv[1]:
        print("Usage: python scripts/check_email.py you@example.com")
        sys.exit(2)
    sys.exit(asyncio.run(main(sys.argv[1])))
