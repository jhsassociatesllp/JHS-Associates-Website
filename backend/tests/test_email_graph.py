"""Run: python tests/test_email_graph.py (no network, no mail server needed).

Mail goes through Microsoft Graph first and falls back to SMTP; errors are explained in plain English.
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import httpx

from app.services import email_service as es

SECRET = "sup3r-secret-value-123"
ok = True
log = []


def check(name, cond, extra=""):
    global ok
    ok &= bool(cond)
    print(("PASS " if cond else "FAIL ") + name, extra)


def setup(graph=True, graph_status=202, smtp_ok=True, token_error=None):
    log.clear()
    es._graph_token_cache.update({"token": "", "expires": 0.0})
    es.GRAPH_TENANT_ID, es.GRAPH_CLIENT_ID, es.GRAPH_CLIENT_SECRET, es.GRAPH_SENDER = (
        ("tenant-123", "client-456", SECRET, "connect@jhsassociates.in") if graph else ("", "", "", ""))
    es.SENDER_NAME = "JHS"
    es.last_error = es.last_method = ""

    async def fake_token():
        log.append("token")
        if token_error:
            raise es.GraphError(token_error)
        return "TOKEN"

    async def fake_post(token, payload):
        log.append(("graph", token, payload))
        return graph_status, '{"error":{"code":"ErrorAccessDenied","message":"Access is denied."}}' if graph_status != 202 else ""

    async def fake_smtp(to, name, subject, html, headers=None):
        log.append("smtp")
        es.last_error = "" if smtp_ok else "smtp broke"
        return smtp_ok

    es._graph_token, es._graph_post, es._send_via_smtp = fake_token, fake_post, fake_smtp


def send(headers=None):
    return asyncio.run(es._send_email("visitor@x.com", 'Asha "Rao"', "Hello\nthere", "<p>hi</p>", headers))


setup()
check("Graph configured -> sent by Graph, SMTP not touched", send() is True and es.last_method == "graph" and "smtp" not in log and log[0] == "token")
g = [x for x in log if isinstance(x, tuple)][0]
msg = g[2]["message"]
check("Graph payload: HTML body, recipient, From name JHS as the sender mailbox, saved to Sent",
      msg["body"]["contentType"] == "HTML" and msg["toRecipients"][0]["emailAddress"]["address"] == "visitor@x.com"
      and msg["from"]["emailAddress"] == {"address": "connect@jhsassociates.in", "name": "JHS"} and g[2]["saveToSentItems"] is True)
check("subject has no line breaks; quotes stripped from the name", "\n" not in msg["subject"] and '"' not in msg["toRecipients"][0]["emailAddress"]["name"], msg["subject"])

setup(graph_status=403)
check("Graph refuses (403) -> falls back to SMTP and still succeeds", send() is True and es.last_method == "smtp" and "smtp" in log)

setup(graph_status=403, smtp_ok=False)
r = send()
check("both fail -> False, error names both, in plain English", r is False and "Graph:" in es.last_error and "Application Access Policy" in es.last_error and "SMTP: smtp broke" in es.last_error, es.last_error[:120])

setup(token_error="The app login was refused: GRAPH_CLIENT_SECRET is wrong")
check("bad client secret -> SMTP fallback", send() is True and es.last_method == "smtp")

setup(graph=False)
check("Graph not configured -> SMTP only", send() is True and "token" not in log and es.last_method == "smtp")

setup()
check("mail needing List-Unsubscribe goes by SMTP (Graph cannot carry it)", send({"List-Unsubscribe": "<https://x/u>"}) is True and es.last_method == "smtp" and "token" not in log)
setup()
check("x- headers are allowed through Graph", send({"X-JHS-Ref": "123"}) is True and es.last_method == "graph")

# error messages
e = es._graph_explain(400, '{"error":"invalid_client","error_description":"AADSTS7000215: Invalid client secret provided."}')
check("expired / wrong secret explained, secret value never shown", "GRAPH_CLIENT_SECRET" in e and SECRET not in e, e[:90])
check("wrong tenant/app explained", "GRAPH_CLIENT_ID" in es._graph_explain(400, '{"error":"unauthorized_client","error_description":"AADSTS700016: Application not found"}'))
check("403 explained (consent / access policy)", "admin consent" in es._graph_explain(403, '{"error":{"code":"ErrorAccessDenied","message":"x"}}'))
check("missing mailbox explained", "GRAPH_SENDER" in es._graph_explain(404, '{"error":{"code":"MailboxNotFound","message":"x"}}'))
check("rate limit explained", "rate-limiting" in es._graph_explain(429, "{}"))

# the real token + post code against a fake Microsoft (no internet)
calls = []


def handler(request: httpx.Request):
    calls.append((request.method, str(request.url), request.headers.get("authorization", ""), request.content.decode()[:300]))
    if "login.microsoftonline.com" in str(request.url):
        return httpx.Response(200, json={"access_token": "REAL-TOKEN", "expires_in": 3599})
    return httpx.Response(202)


transport = httpx.MockTransport(handler)
_Orig = httpx.AsyncClient
es.httpx.AsyncClient = lambda **kw: _Orig(transport=transport, **kw)
importlib_reload = __import__("importlib").reload
# bring back the real functions (setup() replaced them)
import app.services.email_service as _m
real = importlib_reload(_m)
real.GRAPH_TENANT_ID, real.GRAPH_CLIENT_ID, real.GRAPH_CLIENT_SECRET, real.GRAPH_SENDER = "tenant-123", "client-456", SECRET, "connect@jhsassociates.in"
real.httpx.AsyncClient = lambda **kw: _Orig(transport=transport, **kw)


async def two_sends():
    a = await real._send_via_graph("a@x.com", "A", "s", "<p>1</p>")
    b = await real._send_via_graph("b@x.com", "B", "s", "<p>2</p>")
    return a, b


res = asyncio.run(two_sends())
tok_calls = [c for c in calls if "login.microsoftonline.com" in c[1]]
send_calls = [c for c in calls if "graph.microsoft.com" in c[1]]
check("real code: token asked once and reused, two mails sent", res == (True, True) and len(tok_calls) == 1 and len(send_calls) == 2, (len(tok_calls), len(send_calls)))
check("real code: sends as the sender mailbox with the Bearer token", send_calls[0][1].endswith("/users/connect@jhsassociates.in/sendMail") and send_calls[0][2] == "Bearer REAL-TOKEN")
check("real code: token request uses tenant id and client credentials", "tenant-123" in tok_calls[0][1] and "client_credentials" in tok_calls[0][3])
print("ALL PASS" if ok else "SOME FAILED")
