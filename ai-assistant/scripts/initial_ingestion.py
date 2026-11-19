"""One-off / manual full sync of approved MongoDB content into the Pinecone index.
Usage (from ai-assistant/):  python -m scripts.initial_ingestion [--force] [--collections Articles services ...]"""
import argparse
import asyncio
import json

from app.container import build_services
from app.core.config import get_settings
from app.core.logging import setup_logging


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-embed everything even if unchanged")
    ap.add_argument("--collections", nargs="*")
    args = ap.parse_args()
    s = get_settings()
    setup_logging("WARNING")
    svc = build_services(s)
    await svc.mongo.ping()
    await svc.mongo.ensure_indexes()
    print("Pinecone:", await svc.vectors.verify())
    report = await svc.sync.sync_collections(args.collections, force=args.force)
    print(json.dumps(report, indent=2, default=str))
    print("Pinecone after:", await svc.vectors.verify())
    print("Embedding tokens used:", svc.llm.usage["embedding_tokens"])
    await svc.mongo.close()


if __name__ == "__main__":
    asyncio.run(main())
