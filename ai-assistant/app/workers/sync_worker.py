"""Background worker: periodic reconciliation of MongoDB content into Pinecone.
Run as its own container/process:  python -m app.workers.sync_worker"""
import asyncio
import os
import signal

from app.container import build_services
from app.core.config import get_settings
from app.core.logging import get_logger, setup_logging

log = get_logger("worker")


async def main() -> None:
    s = get_settings()
    setup_logging(s.log_level)
    svc = build_services(s)
    await svc.mongo.ensure_indexes()
    interval = int(os.getenv("SYNC_INTERVAL_MINUTES", "360")) * 60  # incremental every 6h by default
    stop = asyncio.Event()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            asyncio.get_running_loop().add_signal_handler(sig, stop.set)
        except NotImplementedError:  # Windows
            pass
    first = True
    while not stop.is_set():
        try:
            # Full re-embed only on explicit request; content-hash comparison keeps routine runs cheap.
            report = await svc.sync.sync_collections(force=False)
            log.info("sync_done", extra={"ctx": {"report": report}})
        except Exception as e:
            log.error("sync_failed", extra={"ctx": {"err": type(e).__name__, "detail": str(e)[:200]}})
        first = False
        try:
            await asyncio.wait_for(stop.wait(), timeout=interval)
        except asyncio.TimeoutError:
            pass
    await svc.mongo.close()


if __name__ == "__main__":
    asyncio.run(main())
