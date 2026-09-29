"""
resume_ranking.py
------------------
Ranks a candidate's CV against a job's own description, and against
whatever free-text HR types into the applications search box — so the
best-matching resumes surface first without HR reading every one manually.

Deliberately does NOT call any AI/embedding API: this is a plain keyword/
term-frequency match (classic TF-cosine + keyword-overlap), computed
entirely in this process. That keeps the feature at zero ongoing cost and
zero external dependency for something a simple, transparent algorithm
already does well for structured text like resumes and job descriptions
(skills, qualifications, role keywords). If smarter semantic matching
(synonyms, "CA" vs "Chartered Accountant", etc.) is wanted later, an
embedding-based score can be layered on top of this without changing the
storage shape below.

Resume text is extracted ONCE at upload time (see career.py) and cached on
the application document (`resume_text`) — ranking then just re-tokenizes
that cached text against the job description / search query, in pure
Python, with no PDF parsing on the hot path.
"""

import io
import logging
import re
from collections import Counter
from typing import Optional

logger = logging.getLogger("resume_ranking")

# A real PDF always starts with this — checked BEFORE handing untrusted bytes
# to the parser, regardless of what content-type header the client sent
# (that header is client-supplied and not to be trusted on its own).
PDF_MAGIC = b"%PDF-"

# Bounds how much of a resume gets parsed/scored — resumes are short
# documents; a huge page count or wall of repeated text in a crafted file
# shouldn't be allowed to spend unbounded CPU/memory on this request.
MAX_PDF_PAGES = 15
MAX_TEXT_CHARS = 50_000

_STOPWORDS = frozenset(
    """
    a an the and or but if then else for nor so yet of to in on at by from with
    without into onto over under above below between among through during
    before after up down out off again further once here there when where why
    how all any both each few more most other some such no not only own same
    than too very s t can will just don should now is am are was were be been
    being have has had having do does did doing i me my myself we our ours
    ourselves you your yours yourself yourselves he him his himself she her
    hers herself it its itself they them their theirs themselves what which
    who whom this that these those as while also etc per via using use used
    year years month months day days experience experienced working work
    company companies role roles job jobs candidate candidates applicant
    resume cv curriculum vitae email phone address name contact
    """.split()
)

# Words like "CA", "GST" are meaningful in this domain despite being short —
# excluded from the usual short-token cutoff below.
_KEEP_SHORT = frozenset({"ca", "cs", "cma", "gst", "tds", "it", "ai", "ml", "hr", "us", "uk", "uae", "qa"})

_TOKEN_RE = re.compile(r"[a-z][a-z0-9+#]{0,30}")


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Best-effort plain-text extraction from a PDF resume. Never raises —
    ranking is a nice-to-have, not something an extraction hiccup should be
    allowed to break the whole upload/listing request over. Returns "" on
    anything it can't confidently parse."""
    if not pdf_bytes or not pdf_bytes.startswith(PDF_MAGIC):
        return ""
    try:
        from pypdf import PdfReader  # imported lazily so a missing/broken
        # install only affects ranking, never the rest of the app
    except Exception:  # pragma: no cover - environment issue, not a code path we test
        logger.warning("pypdf not available — resume text extraction disabled.")
        return ""

    try:
        reader = PdfReader(io.BytesIO(pdf_bytes), strict=False)
    except Exception as err:
        logger.info("Could not open resume PDF for text extraction: %s", err)
        return ""

    parts: list[str] = []
    total = 0
    try:
        for page in reader.pages[:MAX_PDF_PAGES]:
            try:
                text = page.extract_text() or ""
            except Exception as err:  # a single malformed page shouldn't sink the rest
                logger.info("Skipping unreadable resume page: %s", err)
                continue
            parts.append(text)
            total += len(text)
            if total >= MAX_TEXT_CHARS:
                break
    except Exception as err:
        logger.info("Resume text extraction stopped early: %s", err)

    return "\n".join(parts)[:MAX_TEXT_CHARS]


def tokenize(text: str) -> list[str]:
    if not text:
        return []
    tokens = _TOKEN_RE.findall(text.lower())
    return [t for t in tokens if (len(t) >= 3 or t in _KEEP_SHORT) and t not in _STOPWORDS]


def _cosine(a: Counter, b: Counter) -> float:
    if not a or not b:
        return 0.0
    common = set(a) & set(b)
    dot = sum(a[t] * b[t] for t in common)
    norm_a = sum(v * v for v in a.values()) ** 0.5
    norm_b = sum(v * v for v in b.values()) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def score_match(resume_text: Optional[str], reference_text: Optional[str]) -> Optional[float]:
    """0-100 relevance score of a resume against a reference text (a job
    description, or whatever HR typed into the search box). None when either
    side has no usable text — kept separate from a real 0, which means
    "parsed fine, just no overlap"."""
    resume_tokens = tokenize(resume_text or "")
    reference_tokens = tokenize(reference_text or "")
    if not resume_tokens or not reference_tokens:
        return None

    cos = _cosine(Counter(resume_tokens), Counter(reference_tokens))

    # How many of the reference's OWN distinct terms actually show up in the
    # resume — rewards hitting the specific things the job/search asked for,
    # not just generally similar wording.
    reference_terms = set(reference_tokens)
    overlap = len(reference_terms & set(resume_tokens)) / len(reference_terms)

    combined = 0.5 * cos + 0.5 * overlap
    return round(min(combined, 1.0) * 100, 1)
