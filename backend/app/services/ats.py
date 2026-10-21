"""ATS-style resume ↔ job-description matching.

Deterministic and explainable (no external AI service: resumes never leave our
servers). The score is 0-100 and is the sum of five parts:

    keywords    60   job keywords / skills found in the resume
    title       10   the job title's words appear in the resume
    experience  15   years of experience vs. what the vacancy asks for
    education   10   qualifications named in the vacancy found in the resume
    format       5   the resume is machine-readable (text, contact, sections)

A score of MATCH_THRESHOLD (60) or more counts as a match.
"""
from __future__ import annotations

import io
import re
from collections import Counter
from datetime import datetime, timezone
from typing import Optional

MATCH_THRESHOLD = 60
MAX_PAGES = 15            # pages read from a PDF (a longer file is not a normal resume)
MAX_TEXT_CHARS = 60_000   # extracted text kept for scoring

WEIGHTS = {"keywords": 60, "title": 10, "experience": 15, "education": 10, "format": 5}

STOPWORDS = set("""
a about above across after again against all also am an and any are as at be because been before being below between both
but by can could did do does doing down during each few for from further had has have having he her here hers him his how i
if in into is it its itself just me more most my no nor not now of off on once only or other our out over own same she should
so some such than that the their them then there these they this those through to too under until up us very was we were
what when where which while who whom why will with would you your yours etc eg ie per via within without including include
able ability abilities strong good excellent knowledge understanding responsible responsibilities role roles candidate
candidates required requirement requirements preferred looking join team work works working years year experience experienced
minimum plus must should need needs skills skill etc job position opportunity company firm
""".split())

# Words that say nothing about fit even when they are repeated.
GENERIC = {"manage", "support", "ensure", "develop", "provide", "perform", "prepare", "maintain", "hand", "level", "new"}

# Different ways of writing the same thing -> one canonical token sequence.
ALIASES = {
    "chartered accountant": "ca", "chartered accountancy": "ca", "company secretary": "cs",
    "cost accountant": "cma", "goods and services tax": "gst", "income tax": "incometax",
    "ind as": "indas", "indian accounting standards": "indas", "international financial reporting standards": "ifrs",
    "tax deducted at source": "tds", "know your customer": "kyc", "internal financial controls": "ifc",
    "microsoft excel": "excel", "ms excel": "excel", "ms office": "msoffice", "microsoft office": "msoffice",
    "bachelor of commerce": "bcom", "b com": "bcom", "master of commerce": "mcom", "m com": "mcom",
    "post graduate": "pg", "postgraduate": "pg", "articleship": "articles", "article ship": "articles",
    "information systems audit": "isaudit", "cyber security": "cybersecurity", "information security": "infosec",
}

QUALIFICATIONS = {
    "ca": "ca", "acs": "cs", "cs": "cs", "cma": "cma", "icwa": "cma", "cpa": "cpa", "acca": "acca", "cia": "cia",
    "cisa": "cisa", "disa": "disa", "cfa": "cfa", "frm": "frm", "llb": "llb", "llm": "llb", "mba": "mba", "pgdm": "mba",
    "bcom": "bcom", "mcom": "mcom", "bba": "bba", "bca": "bca", "mca": "mca", "btech": "btech", "mtech": "mtech",
    "bsc": "bsc", "msc": "msc", "ba": "ba", "ma": "ma", "graduate": "degree", "graduation": "degree",
    "postgraduate": "pg", "pg": "pg", "diploma": "diploma",
}

SECTION_WORDS = ("experience", "education", "skills", "summary", "objective", "projects", "certification",
                 "qualification", "employment", "achievements", "profile")

_WORD = re.compile(r"[a-z0-9][a-z0-9+#]*")


# ───────────────────────────── PDF → text ─────────────────────────────

def extract_pdf_text(data: bytes) -> tuple[str, int]:
    """Returns (text, page_count). Raises ValueError for anything that isn't a readable PDF."""
    if not data.startswith(b"%PDF-"):
        raise ValueError("not a PDF")
    from pypdf import PdfReader

    try:
        reader = PdfReader(io.BytesIO(data), strict=False)
        if reader.is_encrypted:
            try:
                if not reader.decrypt(""):
                    raise ValueError("encrypted PDF")
            except Exception as exc:  # noqa: BLE001
                raise ValueError("encrypted PDF") from exc
        pages = len(reader.pages)
        chunks: list[str] = []
        total = 0
        for page in reader.pages[:MAX_PAGES]:
            try:
                part = page.extract_text() or ""
            except Exception:  # noqa: BLE001  - one broken page must not sink the file
                part = ""
            chunks.append(part)
            total += len(part)
            if total >= MAX_TEXT_CHARS:
                break
        return "\n".join(chunks)[:MAX_TEXT_CHARS], pages
    except ValueError:
        raise
    except Exception as exc:  # noqa: BLE001
        raise ValueError("unreadable PDF") from exc


# ───────────────────────────── text helpers ─────────────────────────────

def _stem(word: str) -> str:
    if len(word) > 5 and word.endswith("ies"):
        return word[:-3] + "y"
    for suffix in ("ations", "ation", "ings", "ing", "ments", "ment", "ed", "es", "s"):
        if len(word) - len(suffix) >= 4 and word.endswith(suffix):
            return word[: -len(suffix)]
    return word


def _normalize(text: str) -> str:
    t = text.lower().replace("&", " and ").replace("/", " ").replace("’", "'")
    t = re.sub(r"[‐‑–—]", "-", t)
    for phrase, alias in sorted(ALIASES.items(), key=lambda kv: -len(kv[0])):
        t = re.sub(rf"\b{re.escape(phrase)}\b", alias, t)
    return t


def _tokens(text: str) -> list[str]:
    return [_stem(w) for w in _WORD.findall(_normalize(text))]


# stop-words and generic words, in both raw and stemmed form ("looking" -> "look")
_STOP_ALL = STOPWORDS | {_stem(w) for w in STOPWORDS}
_GENERIC_ALL = GENERIC | {_stem(w) for w in GENERIC}


def _surface_forms(text: str) -> dict[str, str]:
    """stem -> a readable word from the text (so admins see "qualified", not "qualifi")."""
    out: dict[str, str] = {}
    for w in _WORD.findall(_normalize(text)):
        out.setdefault(_stem(w), w)
    return out


def _content_tokens(text: str) -> list[str]:
    return [w for w in _tokens(text) if w not in _STOP_ALL and w not in _GENERIC_ALL and len(w) >= 2 and not w.isdigit()]


def _phrase_tokens(phrase: str) -> list[str]:
    return [w for w in _tokens(phrase) if w not in _STOP_ALL]


def _contains(resume_tokens: list[str], resume_set: set[str], phrase: list[str]) -> bool:
    if not phrase:
        return False
    if len(phrase) == 1:
        return phrase[0] in resume_set
    n = len(phrase)
    # a multi-word term counts if its words appear next to each other (allowing one filler word)
    for i in range(len(resume_tokens) - n + 1):
        if resume_tokens[i:i + n] == phrase:
            return True
    positions = {w: [] for w in phrase}
    for idx, w in enumerate(resume_tokens):
        if w in positions:
            positions[w].append(idx)
    if any(not p for p in positions.values()):
        return False
    first = positions[phrase[0]]
    return any(
        all(any(0 < q - start <= n + 1 for q in positions[w]) for w in phrase[1:])
        for start in first
    )


# ───────────────────────────── job side ─────────────────────────────

def job_terms(job: dict) -> tuple[list[tuple[list[str], str, float]], list[str]]:
    """(terms, title_tokens). Each term = (token-sequence, display label, weight)."""
    terms: list[tuple[list[str], str, float]] = []
    seen: set[str] = set()

    for kw in job.get("keywords") or []:
        toks = _phrase_tokens(kw)
        key = " ".join(toks)
        if toks and key not in seen:
            seen.add(key)
            terms.append((toks, kw.strip(), 2.0))        # skills the recruiter named count double

    title = job.get("title", "")
    body = " ".join([title, job.get("department", ""), job.get("description", "")])
    title_tokens = [w for w in _content_tokens(title)]

    surface = _surface_forms(body)
    counts = Counter(_content_tokens(body))
    boosted = Counter({w: c + (3 if w in title_tokens else 0) for w, c in counts.items()})
    limit = 12 if job.get("keywords") else 22
    for word, _ in boosted.most_common(limit * 2):
        if len(terms) >= len(job.get("keywords") or []) + limit:
            break
        if word not in seen:
            seen.add(word)
            terms.append(([word], surface.get(word, word), 1.0))

    # frequent two-word phrases ("tax audit", "financial reporting")
    seq = [w for w in _tokens(body) if w not in _STOP_ALL and w not in _GENERIC_ALL and not w.isdigit()]
    pairs = Counter(zip(seq, seq[1:]))
    added = 0
    for (a, b), c in pairs.most_common(20):
        if c >= 2 and added < 6:
            key = f"{a} {b}"
            if key not in seen:
                seen.add(key)
                terms.append(([a, b], f"{surface.get(a, a)} {surface.get(b, b)}", 1.0))
                added += 1
    return terms, title_tokens


def _experience_required(text: str) -> tuple[Optional[float], Optional[float]]:
    t = (text or "").lower()
    if re.search(r"\b(fresher|freshers|entry level|no experience)\b", t):
        return 0.0, 1.0
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)", t)
    if m:
        return float(m.group(1)), float(m.group(2))
    m = re.search(r"(\d+(?:\.\d+)?)\s*\+?", t)
    if m:
        return float(m.group(1)), None
    return None, None


MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec"


def detect_experience_years(text: str) -> Optional[float]:
    t = text.lower()
    explicit = [float(x) for x in re.findall(r"(\d{1,2}(?:\.\d)?)\s*\+?\s*(?:years|yrs)\b", t) if float(x) <= 45]
    now_year = datetime.now(timezone.utc).year
    spans = []
    for m in re.finditer(rf"(?:(?:{MONTHS})[a-z]*\.?\s+)?((?:19|20)\d{{2}})\s*(?:-|–|to)\s*((?:19|20)\d{{2}}|present|current|till date|now)", t):
        start = int(m.group(1))
        end = now_year if not m.group(2).isdigit() else int(m.group(2))
        if 1990 <= start <= end <= now_year + 1 and end - start <= 40:
            spans.append((start, end))
    span_years = None
    if spans:
        spans.sort()
        merged = [list(spans[0])]
        for s, e in spans[1:]:
            if s <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], e)
            else:
                merged.append([s, e])
        span_years = float(sum(e - s for s, e in merged))
    best = max([v for v in [max(explicit) if explicit else None, span_years] if v is not None], default=None)
    return best


def _qualifications_in(text: str) -> set[str]:
    return {QUALIFICATIONS[w] for w in _WORD.findall(_normalize(text)) if w in QUALIFICATIONS}


# ───────────────────────────── scoring ─────────────────────────────

def score_resume(text: str, job: dict, declared_profile: Optional[str] = None) -> dict:
    """Score `text` (extracted resume text) against `job` (title/department/description/keywords/experience)."""
    now = datetime.now(timezone.utc)
    base = {"threshold": MATCH_THRESHOLD, "scored_at": now}

    if len((text or "").strip()) < 80:
        return {**base, "score": 0, "status": "unreadable", "match": False, "components": {},
                "matched_keywords": [], "missing_keywords": [], "experience_years": None,
                "flags": ["No readable text — probably a scanned or image-only PDF. Review the resume manually."]}

    tokens = _tokens(text)
    token_set = set(tokens)
    content = [w for w in tokens if w not in _STOP_ALL and not w.isdigit() and len(w) >= 2]
    flags: list[str] = []

    # keyword stuffing: one word making up a large share of the resume, or an extremely repetitive text
    stuffing = False
    if len(content) >= 150:
        top_word, top_count = Counter(content).most_common(1)[0]
        if top_count >= 15 and top_count / len(content) > 0.05:
            stuffing = True
        if len(set(content)) / len(content) < 0.22:
            stuffing = True
    if stuffing:
        flags.append("Possible keyword stuffing (words repeated unusually often) — keyword score reduced.")

    # 1) keywords ------------------------------------------------------
    terms, title_tokens = job_terms(job)
    matched, missing = [], []
    got = total = 0.0
    for toks, label, weight in terms:
        total += weight
        if _contains(tokens, token_set, toks):
            got += weight
            matched.append(label)
        else:
            missing.append(label)
    kw_ratio = got / total if total else 0.0
    if stuffing:
        kw_ratio *= 0.7
    keywords = WEIGHTS["keywords"] * kw_ratio

    # 2) title ---------------------------------------------------------
    head = set(_tokens(text[:700]))
    t_toks = list(dict.fromkeys(title_tokens))
    if t_toks:
        t_hits = sum((1.0 if w in token_set else 0.0) + (0.5 if w in head else 0.0) for w in t_toks)
        title_ratio = min(1.0, t_hits / (1.5 * len(t_toks)) * 1.3)
    else:
        title_ratio = 0.5
    title = WEIGHTS["title"] * title_ratio

    # 3) experience ----------------------------------------------------
    years = detect_experience_years(text)
    if years is None and declared_profile and re.search(r"fresher|intern|articles", declared_profile.lower()):
        years = 0.0
    need_min, _need_max = _experience_required(job.get("experience", ""))
    if need_min is None or need_min == 0:
        exp_ratio = 1.0
    elif years is None:
        exp_ratio = 0.5
    else:
        exp_ratio = min(1.0, years / need_min)
    experience = WEIGHTS["experience"] * exp_ratio

    # 4) education -----------------------------------------------------
    wanted = _qualifications_in(" ".join([job.get("description", ""), job.get("title", "")]))
    have = _qualifications_in(text)
    if wanted:
        edu_ratio = 1.0 if wanted & have else (0.4 if have else 0.0)
    else:
        edu_ratio = 1.0 if have else 0.6
    education = WEIGHTS["education"] * edu_ratio

    # 5) format --------------------------------------------------------
    t_low = text.lower()
    checks = [
        bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)),
        bool(re.search(r"(?:\+?\d[\d\s\-()]{8,}\d)", text)),
        sum(1 for s in SECTION_WORDS if s in t_low) >= 2,
        len(text.strip()) >= 400,
    ]
    fmt = WEIGHTS["format"] * sum(checks) / len(checks)
    if not checks[0] or not checks[1]:
        flags.append("No email address or phone number found in the resume text.")

    score = int(round(keywords + title + experience + education + fmt))
    score = max(0, min(100, score))
    return {
        **base,
        "score": score,
        "status": "matched" if score >= MATCH_THRESHOLD else "below",
        "match": score >= MATCH_THRESHOLD,
        "components": {
            "keywords": {"score": round(keywords, 1), "max": WEIGHTS["keywords"]},
            "title": {"score": round(title, 1), "max": WEIGHTS["title"]},
            "experience": {"score": round(experience, 1), "max": WEIGHTS["experience"]},
            "education": {"score": round(education, 1), "max": WEIGHTS["education"]},
            "format": {"score": round(fmt, 1), "max": WEIGHTS["format"]},
        },
        "matched_keywords": matched[:40],
        "missing_keywords": missing[:40],
        "experience_years": years,
        "flags": flags,
    }


def candidate_tips(result: dict) -> list[str]:
    """Plain-language advice for the applicant (shown before they submit)."""
    tips = []
    if result["status"] == "unreadable":
        return ["We couldn't read any text in this PDF. Export your resume as a text-based PDF (not a scan or photo)."]
    comp = result["components"]
    if result["missing_keywords"] and comp["keywords"]["score"] < comp["keywords"]["max"] * 0.8:
        tips.append("If you genuinely have these skills, mention them in your resume: " + ", ".join(result["missing_keywords"][:6]) + ".")
    if comp["experience"]["score"] < comp["experience"]["max"] * 0.6:
        tips.append("State your years of experience and role dates clearly (for example “Jan 2021 – Present”).")
    if comp["format"]["score"] < comp["format"]["max"]:
        tips.append("Include your email and phone number as text, plus clear sections such as Experience, Education and Skills.")
    if comp["education"]["score"] < comp["education"]["max"] * 0.6:
        tips.append("List your qualifications (for example CA, CS, B.Com) clearly.")
    if any("stuffing" in f for f in result["flags"]):
        tips.append("Avoid repeating keywords many times — it can lower your match.")
    return tips
