"""Post-generation checks: parse the used-source marker, strip anything not grounded, flag invented names."""
import re
from dataclasses import dataclass, field
from typing import List, Set

from app.core.security import strip_unknown_urls

_USED = re.compile(r"\[\[USED:\s*([^\]]*)\]\]", re.I)
_EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
_BOLD = re.compile(r"\*\*([^*\n]{3,60})\*\*")
_NAME_LIKE = re.compile(r"^(?:Dr\.?\s+|Mr\.?\s+|Mrs\.?\s+|CA\s+)?[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,3}$")
_NON_NAMES = {"JHS Associates", "JHS Associates LLP", "Governance Council", "Advisory Board", "Advisory Board Member",
              "Reg Watch", "Reg-Watch", "Income Tax", "Internal Audit", "Statutory Audit", "Risk Advisory",
              "Corporate Finance", "Learning Development", "Compliance Governance", "Single Window Assistance",
              "SOC Attestation", "IT Assurance", "Our Story", "Company Overview"}


@dataclass
class Validated:
    text: str
    used_ids: List[str] = field(default_factory=list)
    flags: List[str] = field(default_factory=list)


def split_used_marker(raw: str) -> tuple[str, List[str] | None]:
    m = _USED.search(raw)
    ids = None
    if m:
        body = m.group(1).strip()
        ids = [] if body.lower() in ("", "none") else [x.strip().upper() for x in body.split(",") if x.strip()]
    cleaned = _USED.sub("", raw)
    cleaned = re.sub(r"\[\[USED:[^\n]*$", "", cleaned)  # an unterminated marker at the very end
    return cleaned.strip(), ids


def validate(raw: str, *, valid_ids: Set[str], allowed_urls: Set[str], allowed_emails: Set[str],
             evidence_text: str, known_names: Set[str]) -> Validated:
    text, ids = split_used_marker(raw)
    flags: List[str] = []
    used = [i for i in (ids or []) if i in valid_ids]
    if ids is not None and len(used) != len(ids):
        flags.append("unknown_source_id")
    text2 = strip_unknown_urls(text, allowed_urls)
    if text2 != text:
        flags.append("removed_unknown_url")
    emails = {e.lower() for e in allowed_emails}
    text3 = _EMAIL.sub(lambda m: m.group(0) if m.group(0).lower() in emails else "", text2)
    if text3 != text2:
        flags.append("removed_unknown_email")
    low_ev = evidence_text.lower()
    low_names = {n.lower() for n in known_names}
    for m in _BOLD.finditer(text3):
        cand = m.group(1).strip()
        if cand in _NON_NAMES or not _NAME_LIKE.match(cand):
            continue
        if cand.lower() not in low_ev and cand.lower() not in low_names:
            flags.append(f"ungrounded_name:{cand}")
    text3 = re.sub(r"\s{2,}", " ", text3).replace(" .", ".").replace(" ,", ",").strip()
    return Validated(text=text3, used_ids=used, flags=flags)
