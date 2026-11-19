"""Turn approved MongoDB records into SourceDocs. Reads ONLY through the allowlisted PublicReader.

Leadership is intentionally NOT embedded: people questions are answered live from the database (exact, current).
"""
from typing import Awaitable, Callable, Dict, List

from app.core.config import Settings
from app.database.mongodb import PublicReader
from app.ingestion.documents import SourceDoc, html_to_text

# Pages that really exist on the website (App.tsx). Anything not listed falls back to the listing/site URL
# instead of inventing a link.
SERVICE_PATHS = {
    "outsourcing", "consulting", "taxation", "assurance", "it-assurance", "single-window-assistance", "soc-attestation",
    "corporate-finance", "compliance-learning", "startups-msmes", "learning-development",
}
SECTOR_PATHS = {
    "banking": "financial-services/banking", "mutual funds": "financial-services/mutual-funds",
    "broking": "financial-services/broking", "family oriented businesses": "financial-services/family-oriented-businesses",
    "insurance": "financial-services/insurance", "digital currency": "financial-services/digital-currency",
    "nbfc": "financial-services/nbfc", "portfolio management": "financial-services/portfolio-management",
    "venture capital": "financial-services/venture-capital", "housing": "consumer/housing",
    "gems & jewellery": "consumer/gems-jewellery", "real estate": "consumer/real-estate", "retail": "consumer/retail",
    "oil & gas": "consumer/oil-gas-industry", "fmcg": "consumer/fmcg", "commodity": "consumer/commodity",
    "media": "media-technology/media", "it system audit": "media-technology/it-system-audit",
    "it / ites": "media-technology/it-tes", "healthcare": "other/healthcare", "constructions": "other/construction",
    "ngo": "other/ngo", "manufacturing": "other/manufacturing", "logistics": "other/logistics",
}

# (collection -> (namespace, category, listing path))
CONTENT = {
    "Articles": ("articles", "articles", "/articles"),
    "Blogs": ("blogs", "blogs", "/articles"),
    "Knowledge": ("knowledge", "knowledge", "/resources"),
    "Regulatory": ("regulatory", "regulatory", "/regulatory"),
    "WhitePaper": ("publications", "whitepaper", "/white-papers"),
    "Newsletter": ("publications", "newsletter", "/resources"),
    "Excellencia": ("publications", "excellencia", "/excellencia"),
    "reg_watch": ("regulatory", "reg_watch", "/reg-watch"),
}


def _s(v) -> str:
    return str(v).strip() if v else ""


def _date(doc: dict):
    return doc.get("publish_date") or doc.get("last_edited_at") or doc.get("created_at") or doc.get("updated_at")


def _fmt(d) -> str:
    return d.strftime("%d %B %Y") if hasattr(d, "strftime") else _s(d)


def _content_doc(settings: Settings, collection: str, d: dict) -> SourceDoc | None:
    namespace, category, listing = CONTENT[collection]
    title = _s(d.get("title") or d.get("heading"))
    if not title:
        return None
    parts = [f"# {title}"]
    if d.get("author"):
        parts.append(f"Author: {_s(d['author'])}")
    if _date(d):
        parts.append(f"Date: {_fmt(_date(d))}")
    if d.get("short_description"):
        parts.append(html_to_text(_s(d["short_description"])))
    if d.get("content"):
        parts.append(html_to_text(_s(d["content"])))
    if d.get("button_url"):
        parts.append(f"Link: {_s(d['button_url'])}")
    url = _s(d.get("button_url")) if collection == "Excellencia" and str(d.get("button_url", "")).startswith("http") else None
    return SourceDoc(
        source_id=f"mongodb:{collection}:{d['_id']}", source_type="mongodb", namespace=namespace, title=title,
        url=url or settings.site_base_url + listing, category=category, text="\n\n".join(parts),
        is_listing_url=url is None, last_updated=_date(d), extra={"collection": collection},
    )


def _service_doc(settings: Settings, d: dict) -> SourceDoc | None:
    name = _s(d.get("name"))
    if not name:
        return None
    lines = [f"# {name}", f"JHS offers {name} services. The sub-services under {name} are:"]
    for p in sorted(d.get("points") or [], key=lambda x: x.get("order", 0)):
        t = _s(p.get("title"))
        if t:
            lines.append(f"- {t}" + (f": {_s(p.get('desc'))}" if p.get("desc") else ""))
    key = _s(d.get("key"))
    url = f"{settings.site_base_url}/services/{key}" if key in SERVICE_PATHS else settings.site_base_url
    return SourceDoc(
        source_id=f"mongodb:services:{d['_id']}", source_type="mongodb", namespace="company", title=name, url=url,
        category="services", text="\n\n".join(lines), is_listing_url=key not in SERVICE_PATHS,
        extra={"collection": "services", "key": key},
    )


def _sector_doc(settings: Settings, d: dict) -> SourceDoc | None:
    name = _s(d.get("name"))
    if not name:
        return None
    path = SECTOR_PATHS.get(name.lower())
    return SourceDoc(
        source_id=f"mongodb:sectors:{d['_id']}", source_type="mongodb", namespace="company", title=name,
        url=f"{settings.site_base_url}/sectors/{path}" if path else settings.site_base_url, category="sectors",
        text=f"# {name}\n\nJHS serves clients in the {name} sector.", is_listing_url=path is None,
        extra={"collection": "sectors"},
    )


def _podcast_doc(settings: Settings, d: dict) -> SourceDoc | None:
    title = _s(d.get("title"))
    if not title:
        return None
    body = [f"# {title}", _s(d.get("description"))]
    if d.get("guest"):
        body.append(f"Guest: {_s(d['guest'])}")
    if d.get("platform"):
        body.append(f"Platform: {_s(d['platform'])}")
    if d.get("published_on"):
        body.append(f"Published: {_s(d['published_on'])}")
    url = _s(d.get("listen_url")) or f"{settings.site_base_url}/podcasts"
    return SourceDoc(
        source_id=f"mongodb:podcasts:{d['_id']}", source_type="mongodb", namespace="publications", title=title,
        url=url, category="podcasts", text="\n\n".join(x for x in body if x), is_listing_url=not d.get("listen_url"),
        extra={"collection": "podcasts"},
    )


def _event_doc(settings: Settings, d: dict) -> SourceDoc | None:
    title = _s(d.get("title"))
    if not title:
        return None
    body = [f"# {title}", f"Type: {_s(d.get('event_type'))}", f"Mode: {_s(d.get('mode'))}"]
    if d.get("start_at"):
        body.append(f"Starts: {_fmt(d['start_at'])}")
    if d.get("venue"):
        body.append(f"Venue: {_s(d['venue'])}")
    for k in ("summary", "description"):
        if d.get(k):
            body.append(html_to_text(_s(d[k])))
    return SourceDoc(
        source_id=f"mongodb:events:{d['_id']}", source_type="mongodb", namespace="publications", title=title,
        url=f"{settings.site_base_url}/events/{d['_id']}", category="events", text="\n\n".join(body),
        extra={"collection": "events"},
    )


def _job_doc(settings: Settings, d: dict) -> SourceDoc | None:
    title = _s(d.get("title"))
    if not title:
        return None
    body = [f"# {title}"] + [f"{k.replace('_', ' ').title()}: {_s(d.get(k))}"
                             for k in ("department", "location", "employment_type", "experience") if d.get(k)]
    if d.get("description"):
        body.append(html_to_text(_s(d["description"])))
    return SourceDoc(
        source_id=f"mongodb:career_jobs:{d['_id']}", source_type="mongodb", namespace="company", title=title,
        url=f"{settings.site_base_url}/about/careers", category="careers", text="\n\n".join(body),
        extra={"collection": "career_jobs"},
    )


# collection -> converter
_CONVERTERS: Dict[str, Callable] = {
    **{c: (lambda s, d, c=c: _content_doc(s, c, d)) for c in CONTENT},
    "services": _service_doc,
    "sectors": _sector_doc,
    "podcasts": _podcast_doc,
    "events": _event_doc,
    "career_jobs": _job_doc,
}
INDEXED_COLLECTIONS = list(_CONVERTERS)


async def collect_documents(reader: PublicReader, settings: Settings, collections: List[str] | None = None,
                            ) -> Dict[str, List[SourceDoc]]:
    """Return {collection: [SourceDoc]} from the live database (current, approved records only)."""
    out: Dict[str, List[SourceDoc]] = {}
    for col in collections or INDEXED_COLLECTIONS:
        docs = await reader.find(col, limit=1000)
        converted = [c for c in (_CONVERTERS[col](settings, d) for d in docs) if c and c.text.strip()]
        out[col] = converted
    return out
