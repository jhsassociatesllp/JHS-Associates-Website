"""Deterministic answers built in code from live database records: complete, exact and instant (no LLM involved).
Whenever the question is really a lookup or a list, these are used so names/counts can never be invented or dropped."""
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from app.core.config import Settings
from app.llm.prompt_manager import SUGGESTIONS
from app.retrieval.query_classifier import QueryPlan
from app.retrieval.structured import ROLES, person_card

ROLE_PLURAL = {"Partner": "partners", "Governance Council": "Governance Council members",
               "Advisory Board Member": "Advisory Board members", "Associate": "associates"}
LISTING = {"ARTICLES": ("Articles", "/articles"), "BLOGS": ("Blogs", "/articles"), "KNOWLEDGE_RESOURCES": ("Knowledge resources", "/resources"),
           "REGULATORY": ("Regulatory updates", "/regulatory"), "WHITEPAPERS": ("White papers", "/white-papers")}


@dataclass
class Answer:
    reply: str
    links: List[Dict[str, str]] = field(default_factory=list)
    people: List[Dict[str, Any]] = field(default_factory=list)
    items: List[Dict[str, Any]] = field(default_factory=list)
    sources: List[Dict[str, str]] = field(default_factory=list)
    suggested_questions: List[str] = field(default_factory=list)
    meta: Dict[str, Any] = field(default_factory=dict)


def suggestions(category: str) -> List[str]:
    return SUGGESTIONS.get(category, SUGGESTIONS["DEFAULT"])[:3]


def contact_links(s: Settings) -> List[Dict[str, str]]:
    return [{"label": "Contact JHS", "url": s.site_base_url + s.contact_page_path}]


def refusal(s: Settings, category: str = "DEFAULT", what: str = "that") -> Answer:
    return Answer(
        reply=(f"I couldn't find {what} in JHS's published information, so I don't want to guess. "
               f"You can reach the team at {s.contact_email} or through our contact page and they'll be glad to help."),
        links=contact_links(s), suggested_questions=suggestions(category), meta={"refused": True},
    )


def _date(d: Dict[str, Any]) -> str:
    v = d.get("publish_date") or d.get("created_at")
    return v.strftime("%d %b %Y") if hasattr(v, "strftime") else ""


def people_answer(plan: QueryPlan, people: List[Dict[str, Any]], s: Settings) -> Optional[Answer]:
    if not people:
        return None
    link = [{"label": "View Leadership", "url": s.site_base_url + "/about/leadership"}]
    cards = [person_card(p, s) for p in people]

    if plan.person_name:  # a specific person
        lines = [f"**{p['name']}** — {p['location']}{', ' + p['role'] if p['role'] else ''}. {p['expertise']}".strip()
                 for p in cards[:5]]
        return Answer("\n".join(lines), links=link, people=cards[:3], suggested_questions=suggestions("LEADERSHIP"),
                      meta={"deterministic": "person"})

    who = ROLE_PLURAL.get(plan.role or "", "team members")
    qual = []
    if plan.city:
        qual.append(f"in {plan.city}")
    if plan.service:
        qual.append(f"in {plan.service}")
    elif plan.topic:
        qual.append(f"with expertise in {plan.topic}")
    if plan.sector:
        qual.append(f"serving the {plan.sector} sector")
    qualifier = (" " + " ".join(qual)) if qual else ""
    n = len(people)

    # An unfiltered "who is on the team" would be 30+ lines: summarise by group instead.
    if not (plan.role or plan.city or plan.service or plan.topic or plan.sector) and n > 15:
        groups = {r: [p for p in people if r in (p.get("roles") or [])] for r in ROLES}
        gc = groups["Governance Council"]
        lines = [f"JHS's leadership team has **{n}** members. Our **Governance Council** ({len(gc)}):"]
        lines += [f"{i}. **{p['name']}** — {p.get('location', '')}" for i, p in enumerate(gc, 1)]
        lines.append(f"We also have {len(groups['Partner'])} partners and {len(groups['Advisory Board Member'])} "
                     f"Advisory Board members. Ask me for any group, city or area of expertise to see them.")
        return Answer("\n".join(lines), links=link, suggested_questions=suggestions("LEADERSHIP"),
                      meta={"deterministic": "team_summary", "count": n})

    head = (f"JHS has **{n}** {who}{qualifier}:" if plan.wants_count or n > 1 else f"Here is who I found{qualifier}:")
    short = n > 8
    lines = [head]
    for i, c in enumerate(cards, 1):
        loc = f"{c['location']}" if c["location"] else ""
        role = f"{c['role']}" if c["role"] else ""
        meta_txt = ", ".join(x for x in (loc, role) if x)
        lines.append(f"{i}. **{c['name']}** — {meta_txt}" + ("" if short or not c["expertise"] else f". {c['expertise'].strip()}"))
    return Answer("\n".join(lines), links=link, people=cards if n <= 5 else [], suggested_questions=suggestions("LEADERSHIP"),
                  meta={"deterministic": "people_list", "count": n})


def services_overview(services: List[Dict[str, Any]], s: Settings) -> Optional[Answer]:
    if not services:
        return None
    lines = [f"JHS offers **{len(services)}** service lines:"]
    for i, sv in enumerate(services, 1):
        k = len(sv.get("points") or [])
        lines.append(f"{i}. **{sv['name']}**" + (f" — {k} areas of work" if k else ""))
    lines.append("Tell me which one you'd like to know more about, or ask who specialises in it.")
    return Answer("\n".join(lines), suggested_questions=suggestions("SERVICES"), meta={"deterministic": "services_overview"})


def sectors_overview(sectors: List[Dict[str, Any]]) -> Optional[Answer]:
    if not sectors:
        return None
    names = [x["name"] for x in sectors]
    return Answer(f"JHS serves **{len(names)}** sectors: " + ", ".join(names) + ".",
                  suggested_questions=suggestions("INDUSTRIES"), meta={"deterministic": "sectors_overview"})


def content_list(plan: QueryPlan, docs: List[Dict[str, Any]], s: Settings) -> Answer:
    label, path = LISTING.get(plan.category, ("Articles", "/articles"))
    link = [{"label": f"View {label}", "url": s.site_base_url + path}]
    if not docs:
        what = f"any {label.lower()}" + (f" about {plan.topic}" if plan.topic else "")
        r = refusal(s, plan.category, what)
        r.links = link + r.links
        return r
    head = (f"The latest {label.lower()}" if plan.wants_latest or not plan.topic else f"{label} matching “{plan.topic}”") + ":"
    lines = [head]
    for i, d in enumerate(docs, 1):
        t = d.get("title") or d.get("heading", "")
        dt = _date(d)
        lines.append(f"{i}. **{t}**" + (f" ({dt})" if dt else ""))
    lines.append(f"You can read them on our {label} page.")
    return Answer("\n".join(lines), links=link, suggested_questions=suggestions(plan.category), meta={"deterministic": "content_list"})


def jobs_answer(jobs: List[Dict[str, Any]], s: Settings) -> Answer:
    link = [{"label": "View Careers", "url": s.site_base_url + "/about/careers"}]
    if not jobs:
        return Answer(f"I don't see any open positions listed right now. You can keep an eye on our Careers page, or write to "
                      f"{s.contact_email} to share your profile.", links=link, suggested_questions=suggestions("CAREERS"),
                      meta={"deterministic": "jobs_none"})
    lines = [f"We currently have **{len(jobs)}** open position(s):"]
    for i, j in enumerate(jobs, 1):
        bits = ", ".join(x for x in (j.get("department"), j.get("location"), j.get("employment_type")) if x)
        lines.append(f"{i}. **{j.get('title', '')}**" + (f" — {bits}" if bits else ""))
    return Answer("\n".join(lines), links=link, suggested_questions=suggestions("CAREERS"), meta={"deterministic": "jobs"})


def contact_answer(s: Settings) -> Answer:
    return Answer(f"You can reach JHS at **{s.contact_email}** or send us a message through the Contact page and our team "
                  f"will get back to you about your consultation.", links=contact_links(s),
                  suggested_questions=suggestions("DEFAULT"), meta={"deterministic": "contact"})


def offices_pointer(s: Settings) -> Answer:
    return Answer("You'll find our office locations and details on the Our Offices page.",
                  links=[{"label": "Our Offices", "url": s.site_base_url + "/about/our-offices"}],
                  suggested_questions=suggestions("DEFAULT"), meta={"deterministic": "offices_pointer"})
