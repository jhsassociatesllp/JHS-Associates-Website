# AI Assistant — Progress Tracker

Branch: `feature/ai-assistant` (from `staging`). Service: `ai-assistant/`. Legacy `chatbot-backend/` is untouched.

| Phase | Status | Notes |
|---|---|---|
| 1 Audit | Done | `01-AUDIT-AND-DESIGN.md` |
| 2 Foundation | Done | config, structured logging with PII redaction, error handling, admin auth (fails closed), rate limiter, Mongo allowlist, OpenAI + Pinecone clients, index creation script |
| 3 Ingestion | Partly done | Company documents (PDF/PPTX/DOCX) via `scripts.ingest_documents` (dry-run verified on the 4 files in `JHS Content`; live indexing pending Mongo). MongoDB to chunks to Pinecone with registry, idempotency, stale-vector deletion, webhook single-record sync. **Not yet:** website crawl, document upload (PDF/DOCX/...), parsing PDFs attached to Regulatory/WhitePaper records |
| 4 Retrieval + orchestration | Done (first version) | router/rewriter, live structured queries, hybrid (dense + BM25, RRF), reranker, grounded streaming answer, validator, verified facts |
| 5 Conversation | Done (first version) | session/conversation ids, isolation, history window, rolling summary, SSE streaming |
| 6 Sync | Partly done | worker (scheduled reconcile), admin sync endpoint, Mongo webhook. **Not yet:** website sync, document sync, failed-job retry queue |
| 7 Admin dashboard | Not started | only API endpoints (`/api/v1/knowledge/*`, `/api/v1/admin/health`) |
| 8 Evaluation + security | Started | 48 automated tests (security, isolation, grounding, sync). **Not yet:** RAGAS, 150-200 question set, load tests, Langfuse |
| 9 Deployment | Not started | compose services added (`ai-assistant`, `ai-worker`), not wired into nginx |

## Verified (2026-11-17)
* `pytest`: 48 passed (fakes for Mongo/OpenAI/Pinecone).
* Live: OpenAI `text-embedding-3-large` at 1024 dims; Pinecone upsert, query and delete on the new index; router classification with real `gpt-4.1-mini` on 4 sample questions.
* **Not verified live:** MongoDB (local tunnel on port 27019 was closed), so no real ingestion, no real end-to-end answers yet. Docker image not built (Docker daemon not running locally).

## Decisions and deviations
* **Pinecone index.** The index `jhs-associates-assistant` created in the console is a *document-schema* index with built-in `llama-text-embed-v2` embedding and full-text search; it rejects OpenAI vectors. The brief requires OpenAI `text-embedding-3-large`, so a standard dense index `jhs-assistant-vectors` (1024-d, cosine, serverless us-east-1) was created with `scripts/create_index.py`. The console index and the legacy `jhs-website-chatbot` index are untouched. Alternative: use the console index with Pinecone-side embedding and native hybrid search (would replace OpenAI embeddings and the in-process BM25).
* Embeddings use `dimensions=1024` (Matryoshka shortening of the 3072-d model); configurable.
* Mongo: no Change Streams (standalone server). Sync = worker + webhook + reconcile.
* Content collections have no publication status; all records are treated as published. Leadership/podcasts/events/jobs are filtered by their `status`.
* Article/Knowledge records have no per-item URL; their links point to the listing page and are labelled as listings.
* The chatbot only reads Mongo through an allowlist in code; a database-level read-only user is still recommended.

## How to run locally
```
cd ai-assistant
python -m venv .venv && .venv\Scripts\pip install -r requirements-dev.txt
.venv\Scripts\python -m pytest -q
.venv\Scripts\python -m scripts.create_index          # once
.venv\Scripts\python -m scripts.live_smoke_test       # OpenAI + Pinecone + Mongo connectivity
.venv\Scripts\python -m scripts.initial_ingestion     # needs MongoDB reachable
.venv\Scripts\python -m uvicorn app.main:app --port 8100
```
