"""Builds the model context. Retrieved text is wrapped as untrusted DATA with ids the answer must cite."""
from dataclasses import dataclass
from typing import Any, Dict, List

from app.ingestion.chunking import count_tokens
from app.retrieval.hybrid_retriever import Evidence

CONTEXT_TOKEN_BUDGET = 5500


@dataclass
class Source:
    sid: str            # "S1"
    title: str
    url: str
    kind: str
    is_listing_url: bool


def _esc(s: str) -> str:
    # The model must never see something that looks like our own closing tag inside source text.
    return (s or "").replace("</source>", "< /source>").replace("<source", "< source")


def build_context(evidence: List[Evidence], structured_blocks: List[str] | None = None) -> tuple[str, List[Source]]:
    parts: List[str] = []
    sources: List[Source] = []
    used = 0
    for block in structured_blocks or []:
        t = count_tokens(block)
        if used + t > CONTEXT_TOKEN_BUDGET:
            break
        parts.append(block); used += t
    for i, ev in enumerate(evidence, 1):
        body = _esc(ev.text)
        t = count_tokens(body)
        if used + t > CONTEXT_TOKEN_BUDGET:
            break
        sid = f"S{len(sources) + 1}"
        tag = f'<source id="{sid}" type="{ev.category}" title="{_esc(ev.title)}"' + (
            " listing_page=\"true\"" if ev.is_listing_url else "") + (f' date="{ev.date[:10]}"' if ev.date else "") + ">"
        parts.append(f"{tag}\n{body}\n</source>")
        sources.append(Source(sid, ev.title, ev.url, ev.category, ev.is_listing_url))
        used += t
    return "\n\n".join(parts), sources
