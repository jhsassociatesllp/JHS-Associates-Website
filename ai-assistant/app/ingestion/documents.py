"""The unit that gets indexed: one SourceDoc per source record/page/document."""
import hashlib
import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Optional

from bs4 import BeautifulSoup


@dataclass
class SourceDoc:
    source_id: str          # stable, e.g. "mongodb:Articles:65f..." or "website:https://..."
    source_type: str        # mongodb | website | document
    namespace: str          # Pinecone namespace
    title: str
    url: str                # real URL of the item, or of the listing page that contains it
    category: str
    text: str
    is_listing_url: bool = False   # url is a listing/hub page, not a page for this exact item
    access_level: str = "PUBLIC"
    last_updated: Optional[datetime] = None
    extra: Dict[str, Any] = field(default_factory=dict)

    @property
    def content_hash(self) -> str:
        h = hashlib.sha256()
        for part in (self.title, self.url, self.category, self.access_level, self.text):
            h.update((part or "").encode("utf-8")); h.update(b"\x00")
        return h.hexdigest()


def html_to_text(html: str) -> str:
    """HTML -> light markdown: headings become '## ', list items '- ', tables kept as pipe rows."""
    if not html:
        return ""
    if "<" not in html:
        return html.strip()
    soup = BeautifulSoup(html, "html.parser")
    for t in soup(["script", "style", "noscript", "iframe"]):
        t.decompose()
    for level in range(1, 7):
        for h in soup.find_all(f"h{level}"):
            h.replace_with(f"\n\n{'#' * min(level + 1, 6)} {h.get_text(' ', strip=True)}\n\n")
    for li in soup.find_all("li"):
        li.replace_with(f"\n- {li.get_text(' ', strip=True)}\n")
    for tr in soup.find_all("tr"):
        cells = [c.get_text(' ', strip=True) for c in tr.find_all(["th", "td"])]
        tr.replace_with("\n| " + " | ".join(cells) + " |\n")
    for p in soup.find_all(["p", "div", "br"]):
        p.append("\n")
    text = soup.get_text()
    text = re.sub(r"[ \t\xa0]+", " ", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()
