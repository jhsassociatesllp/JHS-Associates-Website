"""Wires the application's services together (one instance per process)."""
from dataclasses import dataclass
from typing import Any, Optional

from app.conversation.manager import ConversationManager
from app.core.config import Settings
from app.core.security import SlidingWindowLimiter
from app.database.mongodb import Mongo
from app.database.pinecone import VectorStore
from app.ingestion.indexer import Indexer
from app.ingestion.synchronization import SyncService
from app.llm.openai_client import LLM
from app.pipeline import Assistant
from app.retrieval.facts import Facts
from app.retrieval.hybrid_retriever import HybridRetriever
from app.retrieval.lexical import LexicalIndex
from app.retrieval.structured import StructuredRetriever


@dataclass
class Services:
    settings: Settings
    mongo: Mongo
    llm: LLM
    vectors: VectorStore
    lexical: LexicalIndex
    structured: StructuredRetriever
    retriever: HybridRetriever
    facts: Facts
    assistant: Assistant
    conversations: ConversationManager
    indexer: Indexer
    sync: SyncService
    limiter: SlidingWindowLimiter


def build_services(settings: Settings, *, mongo: Optional[Mongo] = None, llm: Optional[LLM] = None,
                   vectors: Any = None) -> Services:
    mongo = mongo or Mongo(settings)
    llm = llm or LLM(settings)
    vectors = vectors or VectorStore(settings)
    lexical = LexicalIndex(mongo.app, settings.bm25_refresh_seconds)
    structured = StructuredRetriever(mongo.public, settings)
    retriever = HybridRetriever(settings, llm, vectors, lexical)
    facts = Facts(settings, mongo.app)
    indexer = Indexer(settings, llm, vectors, mongo.app)
    return Services(
        settings=settings, mongo=mongo, llm=llm, vectors=vectors, lexical=lexical, structured=structured,
        retriever=retriever, facts=facts, assistant=Assistant(settings, llm, structured, retriever, facts),
        conversations=ConversationManager(settings, mongo.app, llm), indexer=indexer,
        sync=SyncService(settings, mongo.public, indexer, mongo.app),
        limiter=SlidingWindowLimiter(settings.rate_limit_per_minute),
    )
