# JHS AI Knowledge Assistant — Phase 1: Audit and Final Design

Date: 2026-11-13. Status: audit complete, nothing in production was modified.

## 1. Existing system

| Area | Finding |
|---|---|
| Repo layout | `frontend` (React/Vite), `backend` (FastAPI, Mongo via motor), `admin-panel` (React), `chatbot-backend` (**Node/Express**), `nginx`, `docker-compose.yml` |
| Current chatbot | `chatbot-backend/server.js` (1,741 lines), `crawler.js` (Puppeteer), `ingest-extra.js` (Mongo→text), `scheduler.js`, `lib/pinecone.js`, `lib/people.js`, `data/contacts.json` |
| LLM / embeddings | `gpt-4o-mini`, `text-embedding-3-small` (1536-d) |
| Vector store | Pinecone index `jhs-website-chatbot` (1536-d, 2,901 vectors); also an in-memory `index.json` fallback |
| Retrieval | Cosine top-K over crawled page chunks. People questions bypass retrieval and dump **all** team members into the prompt. |
| Intelligence layer | Dozens of regexes and typo/keyword detectors in `server.js` (credential count, location, sector, name matching) around a thin RAG call |
| Frontend contract | `POST /chatbot-api/chat` body `{message, history[last few]}`; reply is SSE (`{delta}`, `{done, reply, links, people}`, `{error}`) or JSON (`{reply, links, items, people}`). nginx rewrites `/chatbot-api/` to `chatbot-backend:3001/api/`; `/reindex` is blocked publicly. UI is `frontend/src/components/common/ChatBot.tsx` (730 lines). |
| Deployment | `docker-compose.yml` service `chatbot-backend` (node:20 + Chromium), nginx gateway, `deploy.yml`; `main` and `staging` deploy to separate ports. Staging site is live at staging.jhsassociates.in |
| Sessions | None. Client resends recent history; server keeps no conversation state. |
| Tests / eval | None for the chatbot. |

## 2. Why answers are wrong (root causes)

1. **Structured data is read as scraped text.** Leadership, services and sectors are clean records in Mongo (`roles`, `location`, `services`, `sectors`, `status`), but the bot reads the rendered website pages instead and asks a small model to filter lists. Example: "governance council members" returned Partners and Advisory Board members and was cut off mid-list.
2. **Wrong-source retrieval with no refusal threshold.** "Governance board members" matched an IRDAI insurance article.
3. **Facts the site never states** (founder) are unanswerable from crawled text.
4. **Heuristic sprawl.** Hundreds of lines of hand-written regex detectors replace a real router; each new phrasing breaks.
5. **Stale / partial sources.** Mongo content is flattened to text with no type, status or date; website content written into React code is only seen through crawling.
6. **No evaluation**, so regressions and gaps are invisible.

## 3. Environment findings (verified, read-only)

* MongoDB: **6.0.10, standalone** (`topology: Single`) → **Change Streams are NOT available.** Sync will use an app-level hook plus scheduled reconciliation (updated-at / hash based).
* The `.env` points to `JHS_website_staging` on a local port. Production DB name is `JHS_website`. Staging counts: leadership 37, services 10, sectors 26, Articles 147, Knowledge 42, Regulatory 5, WhitePaper 2, Excellencia 13, podcasts 1, events 1, alumni 6, Blogs/Newsletter/career_jobs/reg_watch 0.
* Content collections have **no `status` field** (all treated as published). `leadership.status` (Active/Inactive), `podcasts.status` and `events.status` exist.
* OpenAI key works. `text-embedding-3-large` returns 3072-d natively and supports a `dimensions` parameter. Chat models available: gpt-4.1, gpt-4.1-mini, gpt-4o, gpt-4o-mini, gpt-5, gpt-5-mini, gpt-5-nano.
* Pinecone key works. There is an **empty** index `jhs-associates-assistant` (1024-d, cosine, serverless us-east-1, dense). The old index must not be touched (live bot uses it).
* Docker is available locally; local Python is 3.10 (the container will pin its own).
* `.env` keys present: OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX, SITE_SITEMAP_URL, MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, PORT, ALLOWED_ORIGIN, API_KEY, AUTO_REFRESH_*. **Not present:** Langfuse keys, admin-auth settings, a Mongo write location for assistant data.

## 4. Design decisions

| Decision | Choice | Why |
|---|---|---|
| Service | New **Python/FastAPI** service in `ai-assistant/`. Old `chatbot-backend` stays untouched until cutover. | Matches the brief and the main backend; gives a clean rollback (flip nginx upstream). |
| Frontend contract | New service **keeps the existing SSE/JSON shape** (`delta`, `done`, `reply`, `links`, `people`, `items`) at `/api/chat`, plus the new `/api/v1/...` endpoints. | UI works unchanged on day one; we extend later for citations/feedback. |
| Embeddings | `text-embedding-3-large` with `dimensions=1024`, matching the existing empty index. | Reuses the index you created; no recreate. Dimension and model stay configurable. |
| Hybrid search | Dense (Pinecone) + BM25 keyword over the same chunks (kept in an `ai_chunks` Mongo collection), fused with RRF, then reranked. | A dense-only Pinecone index has no sparse support; BM25 catches names, acronyms and section numbers. |
| Reranker | Pluggable. Default: an LLM listwise reranker (gpt-4.1-mini); a cross-encoder can be swapped in. | No extra vendor needed. |
| Structured data | Predefined, validated Mongo query functions (leadership, services, sectors, articles, jobs, events, podcasts). The LLM only chooses a function and arguments from a fixed schema (tool-calling); it never writes queries. | Exact, complete, fast, and safe. |
| Router | Cheap model classifies intent into the 15 categories, rewrites follow-ups, and picks sources. | Replaces the regex sprawl. |
| Conversation state | Mongo collections `ai_conversations`, `ai_messages` with a recent-window plus rolling summary. | Per the brief; session isolation by server-issued ids. |
| Website content | Crawl4AI/Playwright crawl of sitemap pages; content hash change detection; stale-vector deletion. Page content that lives in React code is covered because the rendered page is crawled. | Source of truth for service descriptions that are not in Mongo. |
| Documents | Docling/PyMuPDF/python-docx ingestion with access levels; only PUBLIC is retrievable by the public bot. | Per the brief. |
| Sync | Scheduled incremental (6h) + daily reconciliation + webhook endpoint the FastAPI backend can call on publish. No Change Streams. | Mongo is standalone. |
| Verified facts | `company_facts` layer (founder, founding date etc.) editable by admins, answered before retrieval. | Covers facts no source states. Already prototyped in the Node bot. |
| Monitoring | Langfuse (needs keys); privacy-aware logging. | Per the brief. |
| Eval | 150–200 question set owned by JHS, deterministic checks for structured answers plus RAGAS for content; run on every change. | Honest measurement. |

## 5. Mongo access allowlist (public chatbot)

Allowed, specific fields only:
`leadership` (name, education, description, location, email, linkedin, services, sectors, cities, specializations, roles, section, status=Active), `services`, `sectors`, `Articles`, `Blogs`, `Knowledge`, `Regulatory`, `WhitePaper`, `Newsletter`, `Excellencia`, `podcasts` (published), `events` (public fields), `career_jobs` (active only), `reg_watch`.

Blocked: `admins`, `users`, `career_applications`, `career_resumes.*`, `contact_us`, `feedback`, `event_registrations`, `user_activity`, `admin_audit_log`, `login_failures`, `appointments`, `proposals`, `otp_*`, `revoked_tokens`, `cookie_consents`, `notify_jobs`, `alumni` (contains personal email and phone), all GridFS (`fs.*`, `uploads.*`, `*_files`).

## 6. Open items that need a decision from you

1. **Where may the assistant write?** It needs its own collections (conversations, chunks, sync log, facts, eval). Proposal: a separate database `JHS_ai_assistant` on the same Mongo, with chatbot reads of `JHS_website` through a **read-only** user. Is a read-only Mongo user available, or should I use the existing URI for now?
2. **Which database to build against?** The `.env` points to `JHS_website_staging`. Proposal: build and evaluate on staging data, switch to `JHS_website` only at cutover.
3. **Answer model.** Proposal: router/rewriter `gpt-4.1-mini`, answer `gpt-4.1` (configurable). Costs are higher than `gpt-4o-mini`; set a monthly budget cap?
4. **Langfuse**: cloud account (public/secret keys) or self-hosted? Until then tracing is a no-op.
5. **Admin dashboard auth**: reuse the existing admin panel login (JWT from the FastAPI backend)? Proposal: yes, validate the same token and `admin`/`super_admin` roles, and add an "AI Assistant" page to the existing admin-panel instead of a separate app.
6. **Evaluation questions**: JHS writes the 150–200 questions and expected answers, held out from development.

## 7. Plan (files)

Create: `ai-assistant/` per the brief's structure (app/api, core, database, ingestion, retrieval, llm, conversation, evaluation, workers; scripts; tests; Dockerfile; compose service; `.env.example`).
Modify at cutover only: `docker-compose.yml` (add `ai-assistant`, `ai-worker`), `frontend/nginx.conf` (upstream for `/chatbot-api/`), later `ChatBot.tsx` (citations, feedback), `admin-panel` (new page), `backend` (publish webhook call).
Untouched until cutover: `chatbot-backend/`.

Phases follow the brief: 2 foundation, 3 ingestion, 4 retrieval, 5 conversation, 6 sync, 7 admin, 8 eval and security, 9 deployment. Each ends with tests and a progress update in `docs/ai-assistant/PROGRESS.md`.

## 8. Rollback

The old service keeps running. Cutover is a single nginx upstream change (`chatbot-backend:3001` to `ai-assistant:8100`) and reverting it restores the old bot immediately. New data lives in new Mongo collections and a separate Pinecone index, so nothing of the old system is modified.
