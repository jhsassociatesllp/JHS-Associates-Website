"""Company documents (PDF / PPTX / DOCX / TXT / MD) -> SourceDoc. One SourceDoc per file; the chunker splits it.

Page / slide markers become headings ("## Page 3") so a chunk keeps its place in the file. The source id is derived
from the file name, so re-running is idempotent and an edited file is re-indexed (content hash), a removed file is
deleted from the index (see `sync_folder`).
"""
import re
from pathlib import Path
from typing import Dict, List

from app.core.config import Settings
from app.core.logging import get_logger
from app.ingestion.documents import SourceDoc

log = get_logger("file_ingestion")
SUPPORTED = {".pdf", ".pptx", ".docx", ".txt", ".md"}
MIN_CHARS_PER_PAGE = 40   # below this a PDF page is probably scanned/image-only (needs OCR)


def _clean(t: str) -> str:
    t = t.replace("➢", "-").replace("•", "-").replace("\xa0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def _pdf(path: Path):
    import pymupdf
    parts, empty = [], 0
    with pymupdf.open(path) as doc:
        for i, page in enumerate(doc, 1):
            txt = _clean(page.get_text("text", sort=True))
            if len(txt) < MIN_CHARS_PER_PAGE:
                empty += 1
                continue
            parts.append(f"## Page {i}\n\n{txt}")
    return "\n\n".join(parts), empty


def _pptx(path: Path):
    from pptx import Presentation

    def shape_text(sh) -> List[str]:
        out = []
        if sh.shape_type == 6:                                   # group
            for s in sh.shapes:
                out += shape_text(s)
        elif getattr(sh, "has_table", False) and sh.has_table:
            for row in sh.table.rows:
                out.append("| " + " | ".join(c.text.strip().replace("\n", " ") for c in row.cells) + " |")
        elif sh.has_text_frame and sh.text_frame.text.strip():
            out.append(sh.text_frame.text.strip())
        return out

    parts, empty = [], 0
    for i, slide in enumerate(Presentation(path).slides, 1):
        lines = []
        for sh in slide.shapes:
            lines += shape_text(sh)
        if slide.has_notes_slide and slide.notes_slide.notes_text_frame.text.strip():
            lines.append("Notes: " + slide.notes_slide.notes_text_frame.text.strip())
        txt = _clean("\n".join(lines))
        if len(txt) < MIN_CHARS_PER_PAGE:
            empty += 1
            continue
        parts.append(f"## Slide {i}\n\n{txt}")
    return "\n\n".join(parts), empty


def _docx(path: Path):
    import docx
    d = docx.Document(path)
    lines = []
    for p in d.paragraphs:
        if not p.text.strip():
            continue
        m = re.match(r"Heading (\d)", p.style.name or "")
        lines.append(("#" * (min(int(m.group(1)) + 1, 6)) + " " if m else "") + p.text.strip())
    for t in d.tables:
        for r in t.rows:
            lines.append("| " + " | ".join(c.text.strip().replace("\n", " ") for c in r.cells) + " |")
    return _clean("\n".join(lines)), 0


def extract_text(path: Path):
    ext = path.suffix.lower()
    if ext == ".pdf":
        return _pdf(path)
    if ext == ".pptx":
        return _pptx(path)
    if ext == ".docx":
        return _docx(path)
    return _clean(path.read_text(encoding="utf-8", errors="ignore")), 0


def file_to_doc(settings: Settings, path: Path, root: Path, access_level: str = "PUBLIC") -> SourceDoc | None:
    text, unreadable = extract_text(path)
    if unreadable:
        log.warning("pages_without_text", extra={"file": path.name, "pages": unreadable})
    if not text.strip():
        return None
    rel = path.relative_to(root).as_posix()
    title = re.sub(r"[_\-]+", " ", path.stem).strip()
    return SourceDoc(
        source_id=f"document:{rel}", source_type="document", namespace="company_documents", title=title,
        url=settings.site_base_url + settings.contact_page_path, is_listing_url=True,   # no public URL for a file
        category="Company document", text=text, access_level=access_level,
        extra={"file": rel, "unreadable_pages": unreadable})


def collect_files(settings: Settings, folder: Path, access_level: str = "PUBLIC") -> List[SourceDoc]:
    docs = []
    for p in sorted(folder.rglob("*")):
        if p.is_file() and p.suffix.lower() in SUPPORTED and not p.name.startswith("~$"):
            d = file_to_doc(settings, p, folder, access_level)
            if d:
                docs.append(d)
    return docs


async def sync_folder(settings: Settings, indexer, db, folder: Path, access_level: str = "PUBLIC") -> Dict[str, int]:
    """Index every file in `folder`; remove from the index any document that no longer exists there."""
    docs = collect_files(settings, folder, access_level)
    res = {"files": len(docs), "chunks": 0, "skipped": 0, "removed": 0}
    for d in docs:
        r = await indexer.upsert_document(d)
        res["chunks"] += r["chunks"]; res["skipped"] += r["skipped"]
    keep = {d.source_id for d in docs}
    async for s in db.ai_sources.find({"source_type": "document"}):
        if s["_id"] not in keep:
            await indexer.delete_source(s["_id"]); res["removed"] += 1
    return res
