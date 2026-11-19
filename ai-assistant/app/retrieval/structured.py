"""Live, exact answers from MongoDB through fixed, validated query functions.
The LLM only chooses WHICH function to call and with what (validated) arguments; it never writes a query."""
import difflib
import re
from typing import Any, Dict, List, Optional

from app.core.config import Settings
from app.database.mongodb import PublicReader

ROLES = ["Partner", "Governance Council", "Advisory Board Member", "Associate"]
CITY_ALIASES = {"bangalore": "Bengaluru", "bengaluru": "Bengaluru", "bombay": "Mumbai", "mumbai": "Mumbai",
                "vadodara": "Gujarat", "baroda": "Gujarat", "ahmedabad": "Gujarat", "gujarat": "Gujarat",
                "kolkata": "Kolkata", "calcutta": "Kolkata", "chennai": "Chennai", "madras": "Chennai",
                "delhi": "Delhi", "new delhi": "Delhi", "hyderabad": "Hyderabad", "uae": "Global", "dubai": "Global",
                "global": "Global"}
CONTENT_COLLECTIONS = {"ARTICLES": "Articles", "BLOGS": "Blogs", "KNOWLEDGE_RESOURCES": "Knowledge",
                       "REGULATORY": "Regulatory", "WHITEPAPERS": "WhitePaper"}
_STOP = {"the", "a", "an", "of", "in", "and", "for", "to", "on", "about", "services", "service", "expert", "experts",
         "specialist", "specialists", "who", "is", "are", "at", "jhs"}


def _norm(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", " ", (s or "").lower()).strip()


def _term_in(term: str, tokens: set) -> bool:
    """Stem-tolerant word match: 'taxation' ~ 'tax', 'auditing' ~ 'audit' (shared 4-letter stem, or 3+ letter prefix)."""
    stem = term[:4]
    return any(
        t == term or t.startswith(stem) or (len(t) >= 3 and term.startswith(t))
        for t in tokens
    )


def canonical_city(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    return CITY_ALIASES.get(_norm(value), value.strip().title())


def person_card(m: Dict[str, Any], settings: Settings) -> Dict[str, Any]:
    """The contact-card shape the existing chat widget already renders (ChatPerson)."""
    email = (m.get("email") or "").strip()
    link = (m.get("linkedin") or "").strip()
    target = email or settings.contact_email
    roles = [r for r in ROLES if r in (m.get("roles") or [])]
    return {
        "name": m.get("name", ""),
        "role": " & ".join(roles) if roles else "",
        "location": m.get("location", "") or "",
        "creds": m.get("education", "") or "",
        "expertise": m.get("description", "") or "",
        "specialisations": ", ".join(m.get("specializations") or []),
        "email": target,
        "emailIsGeneral": not email,
        "actions": [
            {"label": "View Profile", "url": link if "linkedin.com" in link else f"{settings.site_base_url}/about/leadership"},
            {"label": "Connect", "url": f"mailto:{target}?subject=Enquiry%20for%20{(m.get('name') or '').replace(' ', '%20')}"},
        ],
    }


def match_person(query: str, members: List[Dict[str, Any]], cutoff: float = 0.82) -> List[Dict[str, Any]]:
    """Name lookup tolerant of typos / first name only ('dhisa shah' -> Disha Shah). Returns best matches."""
    q = [t for t in _norm(query).split() if t not in _STOP]
    if not q:
        return []
    scored = []
    for m in members:
        toks = _norm(m.get("name", "")).split()
        if not toks:
            continue
        hits = 0.0
        for qt in q:
            best = max((difflib.SequenceMatcher(None, qt, nt).ratio() for nt in toks), default=0)
            if best >= cutoff:
                hits += best
        if hits:
            scored.append((hits / len(q) + (0.5 if all(any(difflib.SequenceMatcher(None, qt, nt).ratio() >= cutoff
                                                          for nt in toks) for qt in q) else 0), m))
    if not scored:
        return []
    scored.sort(key=lambda x: -x[0])
    top = scored[0][0]
    return [m for s, m in scored if s >= top - 1e-9][:5] if top >= 0.5 else []


class StructuredRetriever:
    def __init__(self, reader: PublicReader, settings: Settings):
        self.r, self.s = reader, settings

    async def vocabulary(self) -> Dict[str, List[str]]:
        services = [d["name"] for d in await self.r.find("services", sort=[("order", 1)], limit=100)]
        sectors = [d["name"] for d in await self.r.find("sectors", sort=[("order", 1)], limit=200)]
        people = await self.r.find("leadership", limit=500)
        cities = sorted({c for p in people for c in (p.get("cities") or [])})
        return {"services": services, "sectors": sectors, "cities": cities, "roles": ROLES}

    async def people(
        self, *, role: Optional[str] = None, city: Optional[str] = None, service: Optional[str] = None,
        sector: Optional[str] = None, topic: Optional[str] = None, name: Optional[str] = None, limit: int = 100,
    ) -> List[Dict[str, Any]]:
        members = await self.r.find("leadership", sort=[("display_order", 1), ("name", 1)], limit=500)
        if name:
            return match_person(name, members)
        out = []
        city_c = canonical_city(city)
        topic_terms = [t for t in _norm(topic or "").split() if t not in _STOP]
        for m in members:
            if role and role not in (m.get("roles") or []):
                continue
            if city_c and city_c not in (m.get("cities") or []) and _norm(city or "") != _norm(m.get("location", "")):
                continue
            if sector and sector not in (m.get("sectors") or []):
                continue
            if service or topic_terms:
                hay = set(_norm(" ".join([m.get("description", ""), " ".join(m.get("specializations") or []),
                                          " ".join(m.get("services") or []), " ".join(m.get("sectors") or []),
                                          m.get("education", "")])).split())
                by_field = bool(service and service in (m.get("services") or []))
                by_text = bool(topic_terms) and all(_term_in(t, hay) for t in topic_terms)
                svc_terms = [t for t in _norm(service or "").split() if t not in _STOP]
                by_service_text = bool(svc_terms) and all(_term_in(t, hay) for t in svc_terms)
                if not (by_field or by_text or by_service_text):
                    continue
            out.append(m)
        return out[:limit]

    async def services(self, name: Optional[str] = None) -> List[Dict[str, Any]]:
        docs = await self.r.find("services", sort=[("order", 1)], limit=100)
        if name:
            n = _norm(name)
            docs = [d for d in docs if n in _norm(d.get("name", "")) or _norm(d.get("name", "")) in n or d.get("key") == n]
        return docs

    async def sectors(self) -> List[Dict[str, Any]]:
        return await self.r.find("sectors", sort=[("order", 1)], limit=200)

    async def content(self, category: str, topic: Optional[str] = None, limit: int = 5) -> List[Dict[str, Any]]:
        collection = CONTENT_COLLECTIONS.get(category)
        if not collection:
            return []
        query: Dict[str, Any] = {}
        terms = [t for t in _norm(topic or "").split() if t not in _STOP and len(t) > 2]
        if terms:
            rx = "|".join(re.escape(t) for t in terms)
            query = {"$or": [{"title": {"$regex": rx, "$options": "i"}},
                             {"short_description": {"$regex": rx, "$options": "i"}}]}
        sort = [("publish_date", -1), ("created_at", -1)] if collection in ("Articles", "Blogs", "Knowledge") else [("created_at", -1)]
        return await self.r.find(collection, query, sort=sort, limit=limit)

    async def jobs(self) -> List[Dict[str, Any]]:
        return await self.r.find("career_jobs", sort=[("title", 1)], limit=50)
