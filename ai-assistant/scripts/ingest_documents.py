"""Index a folder of company documents (PDF/PPTX/DOCX/TXT/MD) into the 'company_documents' namespace.
Usage (from ai-assistant/):  python -m scripts.ingest_documents "<folder>" [--access PUBLIC|INTERNAL] [--dry-run]
--dry-run extracts and chunks only (no OpenAI/Pinecone/Mongo needed) and prints what would be indexed."""
import argparse
import asyncio
from pathlib import Path

from app.container import build_services
from app.core.config import get_settings
from app.core.logging import setup_logging
from app.ingestion.chunking import chunk_text
from app.ingestion.file_ingestion import collect_files, sync_folder


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--access", default="PUBLIC", choices=["PUBLIC", "INTERNAL"])
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    s, folder = get_settings(), Path(a.folder)
    setup_logging("WARNING")
    if a.dry_run:
        for d in collect_files(s, folder, a.access):
            n = len(chunk_text(d.text, s.chunk_max_tokens, s.chunk_overlap_tokens, s.chunk_min_tokens))
            print(f"{d.title}: {len(d.text):,} chars -> {n} chunks (unreadable pages: {d.extra['unreadable_pages']})")
        return
    svc = build_services(s)
    await svc.mongo.ensure_indexes()
    print(await sync_folder(s, svc.indexer, svc.mongo.app, folder, a.access))
    print("Embedding tokens used:", svc.llm.usage["embedding_tokens"])
    await svc.mongo.close()


if __name__ == "__main__":
    asyncio.run(main())
