"""Ask the real assistant questions from the command line (live OpenAI/Pinecone/Mongo).
Usage: python -m scripts.ask "question 1" "question 2" ..."""
import asyncio
import sys

from app.container import build_services
from app.core.config import get_settings
from app.core.logging import setup_logging


async def main(qs):
    setup_logging("ERROR")
    svc = build_services(get_settings())
    for q in qs:
        text, done = "", None
        async for kind, val in svc.assistant.run(q, []):
            if kind == "delta":
                text += val
            else:
                done = val
        a = done
        print(f"\n=== {q}\n{a.reply if hasattr(a, 'reply') else text}")
        print("   [meta]", getattr(a, "metadata", None) or {k: getattr(a, k, None) for k in ("refused", "deterministic")},
              "sources:", [s["title"] for s in getattr(a, "sources", [])][:4])
    await svc.mongo.close()

asyncio.run(main(sys.argv[1:]))
