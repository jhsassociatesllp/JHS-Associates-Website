"""Fails if a state-changing API route is reachable without any login dependency.

Run:  python -m pytest tests/test_auth_coverage.py   (or: python tests/test_auth_coverage.py)
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Routes that are public on purpose (forms, sign-in, anonymous consent). Each is rate-limited or validated in its handler.
PUBLIC = {
    "/api/auth/signup", "/api/auth/login", "/api/auth/google",
    "/api/admin/login", "/api/admin/login-form",
    "/api/contact/", "/api/alumni/", "/api/feedback/", "/api/cookie-consent/",
    "/api/careers/auth/google", "/api/consulting/auth/google",
    "/api/events/{event_id}/register",
    "/api/notifications/unsubscribe", "/api/notifications/resubscribe", "/api/notifications/unsubscribe-one-click",
}


def unprotected_write_routes():
    """Every write operation in the OpenAPI schema must declare a security requirement
    (our login dependencies are OAuth2 bearer schemes, so they show up there)."""
    from app.main import app

    found = []
    for path, ops in app.openapi()["paths"].items():
        for method, op in ops.items():
            if method.upper() in {"POST", "PUT", "PATCH", "DELETE"} and path not in PUBLIC and not op.get("security"):
                found.append(f"{method.upper()} {path}")
    return sorted(found)


def test_all_write_routes_are_protected():
    bad = unprotected_write_routes()
    assert not bad, "Write routes without a login dependency:\n" + "\n".join(bad)


if __name__ == "__main__":
    bad = unprotected_write_routes()
    print("OK - every write route is protected" if not bad else "UNPROTECTED:\n" + "\n".join(bad))
    sys.exit(1 if bad else 0)
