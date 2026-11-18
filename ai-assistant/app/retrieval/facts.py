"""Verified company facts, answered instantly before retrieval. File defaults; Mongo `ai_facts` overrides by id."""
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.core.config import Settings
from app.core.logging import get_logger

log = get_logger("facts")
FILE = Path(__file__).resolve().parents[2] / "data" / "company_facts.json"


class Facts:
    def __init__(self, settings: Settings, app_db=None, path: Path = FILE):
        self.s, self.db, self.path = settings, app_db, path
        self._facts: List[Dict[str, Any]] = []
        self.reload_file()

    def reload_file(self) -> int:
        try:
            raw = json.loads(self.path.read_text(encoding="utf-8")).get("facts", [])
        except Exception as e:
            log.warning("facts_not_loaded", extra={"ctx": {"err": type(e).__name__}})
            raw = []
        self._facts = [self._compile(f) for f in raw if f.get("id") and not str(f["id"]).startswith("_")]
        return len(self._facts)

    @staticmethod
    def _compile(f: Dict[str, Any]) -> Dict[str, Any]:
        return {**f, "_res": [re.compile(p, re.I) for p in f.get("patterns", [])]}

    async def _overrides(self) -> List[Dict[str, Any]]:
        if self.db is None:
            return []
        try:
            rows = await self.db.ai_facts.find({"enabled": {"$ne": False}}).to_list(length=None)
            return [self._compile({**r, "id": r["_id"]}) for r in rows]
        except Exception:
            return []

    async def match(self, question: str) -> Optional[Dict[str, Any]]:
        by_id = {f["id"]: f for f in self._facts}
        for f in await self._overrides():
            by_id[f["id"]] = f
        for f in by_id.values():
            if any(r.search(question) for r in f["_res"]):
                return {
                    "id": f["id"], "answer": f["answer"],
                    "links": [{"label": l["label"], "url": self.s.site_base_url + l["path"]} for l in f.get("links", [])],
                }
        return None
