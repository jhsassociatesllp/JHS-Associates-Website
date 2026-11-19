"""Which MongoDB collections and fields the PUBLIC assistant may read. Everything else is denied by default.

The assistant never builds queries from model output: callers use the fixed query functions in
app/retrieval/structured.py, and every read goes through PublicReader which applies the projection below.
"""
from dataclasses import dataclass, field
from typing import Any, Dict, List

from app.core.exceptions import AccessDenied


@dataclass(frozen=True)
class CollectionSpec:
    fields: List[str]
    base_filter: Dict[str, Any] = field(default_factory=dict)  # always ANDed into every query


_CONTENT_FIELDS = ["title", "short_description", "content", "author", "publish_date", "created_at", "last_edited_at"]

ALLOWED: Dict[str, CollectionSpec] = {
    "leadership": CollectionSpec(
        ["name", "education", "description", "location", "email", "linkedin", "services", "sectors", "cities",
         "specializations", "roles", "section", "status", "display_order", "service_points", "updated_at"],
        {"status": "Active"},
    ),
    "services": CollectionSpec(["key", "name", "order", "points"]),
    "sectors": CollectionSpec(["name", "order"]),
    "Articles": CollectionSpec(_CONTENT_FIELDS),
    "Blogs": CollectionSpec(_CONTENT_FIELDS),
    "Knowledge": CollectionSpec(_CONTENT_FIELDS),
    "Regulatory": CollectionSpec(["title", "short_description", "created_at", "last_edited_at"]),
    "WhitePaper": CollectionSpec(["title", "short_description", "created_at", "last_edited_at"]),
    "Newsletter": CollectionSpec(_CONTENT_FIELDS),
    "Excellencia": CollectionSpec(["heading", "short_description", "button_text", "button_url", "created_at"]),
    "podcasts": CollectionSpec(
        ["title", "description", "guest", "duration", "platform", "listen_url", "published_on", "status", "created_at"],
        {"status": {"$in": ["Published", "published"]}},
    ),
    "events": CollectionSpec(
        ["title", "event_type", "summary", "description", "start_at", "end_at", "mode", "venue", "host", "status",
         "external_registration_url"],
        {"status": {"$in": ["Published", "published"]}},
    ),
    "career_jobs": CollectionSpec(
        ["title", "department", "location", "employment_type", "experience", "description", "status", "keywords"],
        {"status": "open"},
    ),
    "reg_watch": CollectionSpec(["title", "short_description", "created_at"]),
}

# Never readable by the public assistant, even if someone adds them to ALLOWED by mistake (checked in code + test).
BLOCKED = {
    "admins", "admin_audit_log", "login_failures", "users", "user_activity", "revoked_tokens", "otp_codes",
    "otp_used_tokens", "career_applications", "career_resumes", "career_resumes.files", "career_resumes.chunks",
    "contact_us", "feedback", "event_registrations", "appointments", "proposals", "alumni", "cookie_consents",
    "notify_jobs", "app_meta", "fs.files", "fs.chunks", "uploads.files", "uploads.chunks", "event_files",
    "podcast_files", "reg_watch_files", "newsletter_subscribers",
}


def spec_for(collection: str) -> CollectionSpec:
    if collection in BLOCKED or collection not in ALLOWED:
        raise AccessDenied(f"collection '{collection}' is not approved for the public assistant")
    return ALLOWED[collection]


def projection_for(collection: str) -> Dict[str, int]:
    return {f: 1 for f in spec_for(collection).fields}
