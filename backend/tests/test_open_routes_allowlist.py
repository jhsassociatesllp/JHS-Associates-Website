"""Run: python tests/test_open_routes_allowlist.py (no database needed).

Locks the security posture found by the VAPT report (57 of 74 routes were open): the ONLY API operations that may work
without a login are listed below, and each one is public on purpose (public reading of published content, forms
visitors fill in, sign-in / sign-up, unsubscribe links). Any new open route, and any open write or list-of-people
route, makes this test fail until it is reviewed.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.main import app

PUBLIC_ON_PURPOSE = {
    ("GET", "/"),
    ("GET", "/api/"),
    ("POST", "/api/admin/login"),
    ("POST", "/api/admin/login-form"),
    ("POST", "/api/alumni/"),
    ("GET", "/api/articles/"),
    ("GET", "/api/articles/image/{image_id}"),
    ("GET", "/api/articles/{article_id}"),
    ("POST", "/api/auth/google"),
    ("POST", "/api/auth/login"),
    ("POST", "/api/auth/signup"),
    ("GET", "/api/blogs/"),
    ("GET", "/api/blogs/{blog_id}"),
    ("POST", "/api/careers/auth/google"),
    ("GET", "/api/careers/jobs"),
    ("GET", "/api/careers/jobs/{job_id}"),
    ("GET", "/api/catalog/sectors"),
    ("GET", "/api/catalog/services"),
    ("POST", "/api/consulting/auth/google"),
    ("POST", "/api/contact/"),
    ("POST", "/api/cookie-consent/"),
    ("GET", "/api/events/"),
    ("GET", "/api/events/{event_id}"),
    ("GET", "/api/events/image/{image_id}"),
    ("POST", "/api/events/{event_id}/register"),
    ("GET", "/api/excellencia/"),
    ("GET", "/api/excellencia/image/{image_id}"),
    ("GET", "/api/excellencia/{excellencia_id}"),
    ("POST", "/api/feedback/"),
    ("GET", "/api/knowledge/"),
    ("GET", "/api/knowledge/image/{image_id}"),
    ("GET", "/api/knowledge/{knowledge_id}"),
    ("GET", "/api/leadership/"),
    ("GET", "/api/leadership/hidden"),
    ("GET", "/api/leadership/options"),
    ("GET", "/api/leadership/photo/{photo_id}"),
    ("GET", "/api/newsletters/"),
    ("GET", "/api/newsletters/image/{image_id}"),
    ("GET", "/api/newsletters/{newsletter_id}"),
    ("POST", "/api/notifications/resubscribe"),
    ("POST", "/api/notifications/unsubscribe"),
    ("POST", "/api/notifications/unsubscribe-one-click"),
    ("GET", "/api/podcasts/"),
    ("GET", "/api/podcasts/image/{image_id}"),
    ("GET", "/api/reg-watch/"),
    ("GET", "/api/reg-watch/image/{image_id}"),
    ("GET", "/api/regulatory/"),
    ("GET", "/api/regulatory/image/{image_id}"),
    ("GET", "/api/regulatory/{regulatory_id}"),
    ("GET", "/api/whitepapers/"),
    ("GET", "/api/whitepapers/image/{image_id}"),
    ("GET", "/api/whitepapers/{whitepaper_id}"),
}

spec = app.openapi()
open_ops = {
    (m.upper(), path)
    for path, item in spec["paths"].items()
    for m, op in item.items()
    if m in ("get", "post", "put", "patch", "delete") and not op.get("security")
}

unexpected = sorted(open_ops - PUBLIC_ON_PURPOSE)
no_longer_open = sorted(PUBLIC_ON_PURPOSE - open_ops)
bad_writes = sorted(o for o in open_ops if o[0] in ("PUT", "PATCH", "DELETE"))

print(f"operations: {sum(1 for p in spec['paths'].values() for m in p if m in ('get','post','put','patch','delete'))}, open on purpose: {len(open_ops)}")
for o in unexpected:
    print("UNEXPECTED OPEN ROUTE:", o)
for o in bad_writes:
    print("OPEN EDIT/DELETE ROUTE:", o)
print("ALL PASS" if not unexpected and not bad_writes else "FAILED")
