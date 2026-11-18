"""Shared fakes: no network, no real MongoDB. Real Mongo/OpenAI/Pinecone are exercised by scripts/live_smoke_test.py."""
import hashlib
import math
import os
from datetime import datetime, timezone
from typing import Any, Dict, List

import pytest
from mongomock_motor import AsyncMongoMockClient

os.environ.setdefault("OPENAI_API_KEY", "test")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key")

from app.container import build_services  # noqa: E402
from app.core.config import Settings, get_settings  # noqa: E402
from app.database.mongodb import Mongo  # noqa: E402

DIM = 16


def fake_vec(text: str) -> List[float]:
    """Deterministic bag-of-words hash embedding: texts sharing words are close (cosine)."""
    v = [0.0] * DIM
    for w in text.lower().split():
        h = int(hashlib.md5(w.encode()).hexdigest(), 16)
        v[h % DIM] += 1.0
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]


class FakeLLM:
    def __init__(self):
        self.usage = {"prompt_tokens": 0, "completion_tokens": 0, "embedding_tokens": 0}
        self.json_queue: List[Any] = []     # scripted results for chat_json (router / reranker)
        self.stream_text = "Test answer. [[USED: S1]]"
        self.chat_text = "Hello! How can I help?"
        self.embed_calls = 0
        self.last_messages: List[Dict[str, str]] = []

    async def embed(self, texts):
        self.embed_calls += len(texts)
        return [fake_vec(t) for t in texts]

    async def embed_one(self, text):
        return (await self.embed([text]))[0]

    async def chat(self, messages, **kw):
        self.last_messages = messages
        return self.chat_text

    async def chat_json(self, messages, schema, **kw):
        self.last_messages = messages
        if not self.json_queue:
            raise RuntimeError("no scripted json")
        item = self.json_queue.pop(0)
        if isinstance(item, Exception):
            raise item
        return item

    async def chat_stream(self, messages, **kw):
        self.last_messages = messages
        for i in range(0, len(self.stream_text), 7):
            yield self.stream_text[i:i + 7]


class FakeVectors:
    def __init__(self):
        self.ns: Dict[str, Dict[str, Dict[str, Any]]] = {}

    async def verify(self):
        return {"vectors": sum(len(v) for v in self.ns.values()), "namespaces": sorted(self.ns)}

    async def upsert(self, namespace, records):
        for r in records:
            self.ns.setdefault(namespace, {})[r["id"]] = r
        return len(records)

    async def delete(self, namespace, ids):
        for i in ids:
            self.ns.get(namespace, {}).pop(i, None)
        return len(list(ids))

    async def query(self, vector, namespace, top_k, flt=None):
        out = []
        for r in self.ns.get(namespace, {}).values():
            if flt and flt.get("access_level", {}).get("$eq") and r["metadata"].get("access_level") != flt["access_level"]["$eq"]:
                continue
            score = sum(a * b for a, b in zip(vector, r["values"]))
            out.append({"id": r["id"], "score": score, "metadata": r["metadata"], "namespace": namespace})
        return sorted(out, key=lambda m: -m["score"])[:top_k]

    def total(self):
        return sum(len(v) for v in self.ns.values())


def person(name, roles, location="Mumbai", cities=None, **kw):
    return {"name": name, "roles": roles, "location": location, "cities": cities or [location], "status": "Active",
            "education": kw.pop("education", "FCA"), "description": kw.pop("description", f"Expert in audit"),
            "email": kw.pop("email", f"{name.split()[0].lower()}@jhsassociates.in"), "linkedin": kw.pop("linkedin", ""),
            "services": kw.pop("services", []), "sectors": kw.pop("sectors", []), "specializations": kw.pop("specializations", []),
            "display_order": kw.pop("display_order", 1), "photo_file": "secret.webp", **kw}


SEED_PEOPLE = [
    person("Huzeifa Unwala", ["Partner", "Governance Council"], description="Expert in IFC, Governance, Risk & Cyber Security", display_order=1),
    person("Kalpesh Parmar", ["Governance Council"], "Vadodara", ["Gujarat"], description="Expert in Statutory Audit, Ind AS", display_order=2),
    person("Sharad Mohata", ["Governance Council"], "Kolkata", description="Expert in Direct Taxation and International Tax", services=["Taxation"], display_order=3),
    person("Tasnim Tankiwala", ["Partner"], description="Expert in Auditing, Tax, Accounting & IFC", services=["Taxation"], display_order=4),
    person("Disha Shah", ["Partner"], description="Expert in Accounting, Tax, Governance", display_order=5),
    person("Dipika Bisawa", ["Advisory Board Member"], description="Expert in Corporate Governance, Compliance", display_order=6),
    person("Raj Dabburi", ["Advisory Board Member"], description="Expert in Corporate Finance", display_order=7),
    person("Old Member", ["Partner"], description="Retired", status="Inactive", display_order=8),
]
SEED_SERVICES = [
    {"key": "assurance", "name": "Assurance", "order": 1, "points": [{"id": "01", "title": "Statutory Audit", "order": 1}, {"id": "02", "title": "Internal Audit", "order": 2}]},
    {"key": "taxation", "name": "Taxation", "order": 2, "points": [{"id": "01", "title": "Direct Tax", "desc": "Income tax compliance", "order": 1}]},
]


@pytest.fixture
def settings() -> Settings:
    get_settings.cache_clear()
    return Settings(openai_api_key="test", admin_api_key="test-admin-key", embedding_dimensions=DIM,
                    chunk_max_tokens=120, chunk_overlap_tokens=20, chunk_min_tokens=10, rate_limit_per_minute=1000,
                    rerank_enabled=False, min_dense_score=0.2)


@pytest.fixture
def mongo(settings):
    return Mongo(settings, client=AsyncMongoMockClient())


@pytest.fixture
async def seeded(mongo):
    src = mongo.client[mongo.settings.source_db_name]
    await src.leadership.insert_many([dict(p) for p in SEED_PEOPLE])
    await src.services.insert_many([dict(s) for s in SEED_SERVICES])
    await src.sectors.insert_many([{"name": "Banking", "order": 1}, {"name": "Manufacturing", "order": 2}])
    await src.admins.insert_one({"email": "root@x", "password": "hash"})
    await src.contact_us.insert_one({"email": "visitor@x"})
    await src.Articles.insert_many([
        {"title": "GST Input Tax Credit explained", "short_description": "ITC rules under GST", "content": "<h2>ITC</h2><p>Input tax credit lets a registered person claim credit of GST paid on purchases.</p>",
         "publish_date": datetime(2026, 3, 1, tzinfo=timezone.utc), "created_at": datetime(2026, 3, 1, tzinfo=timezone.utc)},
        {"title": "Older article", "short_description": "x", "content": "<p>Some older text.</p>", "publish_date": datetime(2025, 1, 1, tzinfo=timezone.utc),
         "created_at": datetime(2025, 1, 1, tzinfo=timezone.utc)},
    ])
    return mongo


@pytest.fixture
def llm():
    return FakeLLM()


@pytest.fixture
def vectors():
    return FakeVectors()


@pytest.fixture
def svc(settings, seeded, llm, vectors):
    return build_services(settings, mongo=seeded, llm=llm, vectors=vectors)
