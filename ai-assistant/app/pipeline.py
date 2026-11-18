"""The orchestrator: facts -> understand -> structured (live DB) and/or semantic (hybrid) -> grounded answer -> validate.

Emits events: ("delta", text) while streaming and finally ("done", Answer)."""
import time
from typing import Any, AsyncIterator, Dict, List, Optional, Set, Tuple

from app import answer_builders as B
from app.core.config import Settings
from app.core.logging import get_logger
from app.llm.answer_validator import validate
from app.llm.openai_client import LLM
from app.llm.prompt_manager import SCOPE_REPLY, SMALL_TALK_SYSTEM
from app.llm.response_generator import stream_answer
from app.retrieval.context_builder import build_context
from app.retrieval.facts import Facts
from app.retrieval.hybrid_retriever import Evidence, HybridRetriever
from app.retrieval.query_classifier import QueryPlan, classify
from app.retrieval.reranker import rerank
from app.retrieval.structured import StructuredRetriever, person_card

log = get_logger("pipeline")
Event = Tuple[str, Any]


class Structured:
    """Outcome of the live-database step: a finished deterministic answer, or evidence blocks for the model."""

    def __init__(self, answer: Optional[B.Answer] = None, blocks: Optional[List[str]] = None,
                 names: Optional[Set[str]] = None, emails: Optional[Set[str]] = None):
        self.answer, self.blocks, self.names, self.emails = answer, blocks or [], names or set(), emails or set()


def _people_block(people: List[Dict[str, Any]]) -> str:
    rows = [
        f"- {p['name']} | location: {p.get('location', '')} | roles: {', '.join(p.get('roles') or [])} | "
        f"education: {p.get('education', '')} | expertise: {p.get('description', '')} | "
        f"specialisations: {', '.join(p.get('specializations') or [])} | services: {', '.join(p.get('services') or [])} | "
        f"sectors: {', '.join(p.get('sectors') or [])}" for p in people
    ]
    return '<records type="people" note="current approved leadership records">\n' + "\n".join(rows) + "\n</records>"


def _service_block(services: List[Dict[str, Any]]) -> str:
    out = []
    for sv in services:
        pts = "\n".join(f"  - {p.get('title', '')}" + (f": {p.get('desc')}" if p.get("desc") else "")
                        for p in sorted(sv.get("points") or [], key=lambda x: x.get("order", 0)))
        out.append(f"{sv['name']}:\n{pts}")
    return '<records type="services" note="current service catalogue">\n' + "\n\n".join(out) + "\n</records>"


class Assistant:
    def __init__(self, settings: Settings, llm: LLM, structured: StructuredRetriever, retriever: HybridRetriever,
                 facts: Facts):
        self.s, self.llm, self.structured, self.retriever, self.facts = settings, llm, structured, retriever, facts
        self._vocab: Optional[Dict[str, List[str]]] = None
        self._vocab_at = 0.0

    async def vocab(self) -> Dict[str, List[str]]:
        if self._vocab is None or time.monotonic() - self._vocab_at > 300:
            self._vocab, self._vocab_at = await self.structured.vocabulary(), time.monotonic()
        return self._vocab

    # ------------------------------------------------------------------ main entry
    async def run(self, message: str, history: List[Dict[str, str]]) -> AsyncIterator[Event]:
        t0 = time.monotonic()
        usage0 = dict(self.llm.usage)

        def finish(ans: B.Answer, plan: Optional[QueryPlan] = None) -> Event:
            ans.meta.update({
                "category": plan.category if plan else ans.meta.get("category"),
                "router": plan.source if plan else None,
                "latency_ms": int((time.monotonic() - t0) * 1000),
                "tokens": {k: self.llm.usage[k] - usage0[k] for k in usage0},
            })
            return "done", ans

        fact = await self.facts.match(message)
        if fact:
            yield finish(B.Answer(fact["answer"], links=fact["links"], suggested_questions=B.suggestions("DEFAULT"),
                                  meta={"deterministic": "fact", "fact_id": fact["id"], "category": "COMPANY_PROFILE"}))
            return

        vocab = await self.vocab()
        plan = await classify(self.llm, message, history, vocab)

        if plan.category == "UNSUPPORTED_QUERY":
            yield finish(B.Answer(SCOPE_REPLY, suggested_questions=B.suggestions("DEFAULT"), meta={"refused": True}), plan)
            return
        if plan.small_talk:
            reply = await self.llm.chat([{"role": "system", "content": SMALL_TALK_SYSTEM}, {"role": "user", "content": message}],
                                        model=self.s.router_model, max_tokens=120)
            yield finish(B.Answer(reply, suggested_questions=B.suggestions("DEFAULT")), plan)
            return
        if plan.standalone_query != message:
            fact = await self.facts.match(plan.standalone_query)
            if fact:
                yield finish(B.Answer(fact["answer"], links=fact["links"], suggested_questions=B.suggestions("DEFAULT"),
                                      meta={"deterministic": "fact", "fact_id": fact["id"]}), plan)
                return

        st = await self._structured(plan)
        if st.answer:
            yield finish(st.answer, plan)
            return

        async for ev in self._generate(plan, message, history, st):
            if ev[0] == "done":
                yield finish(ev[1], plan)
            else:
                yield ev

    # ------------------------------------------------------------------ live database step
    async def _structured(self, plan: QueryPlan) -> Structured:
        c = plan.category
        S = self.structured
        if c in ("LEADERSHIP", "PARTNER_EXPERTISE"):
            people = await S.people(role=plan.role, city=plan.city, service=plan.service, sector=plan.sector,
                                    topic=plan.topic if not plan.person_name else None, name=plan.person_name)
            ans = B.people_answer(plan, people, self.s)
            if ans:
                return Structured(answer=ans)
            return Structured()  # nobody matched -> fall through to semantic search / honest refusal
        if c == "SERVICES":
            if not (plan.service or plan.topic) or plan.wants_list:
                ans = B.services_overview(await S.services(), self.s)
                if ans:
                    return Structured(answer=ans)
            svc = await S.services(plan.service) if plan.service else []
            blocks, names, emails = [], set(), set()
            if svc:
                blocks.append(_service_block(svc))
            if plan.service:
                experts = await S.people(service=plan.service)
                if experts:
                    blocks.append(_people_block(experts)); names |= {p["name"] for p in experts}
                    emails |= {p.get("email", "") for p in experts if p.get("email")}
            return Structured(blocks=blocks, names=names, emails=emails)
        if c == "INDUSTRIES":
            if not (plan.sector or plan.topic) or plan.wants_list:
                ans = B.sectors_overview(await S.sectors())
                if ans:
                    return Structured(answer=ans)
            blocks, names, emails = [], set(), set()
            if plan.sector:
                experts = await S.people(sector=plan.sector)
                if experts:
                    blocks.append(_people_block(experts)); names |= {p["name"] for p in experts}
                    emails |= {p.get("email", "") for p in experts if p.get("email")}
            return Structured(blocks=blocks, names=names, emails=emails)
        if c in ("ARTICLES", "BLOGS", "REGULATORY", "KNOWLEDGE_RESOURCES"):
            if plan.wants_latest or plan.wants_list or not plan.topic:
                docs = await S.content(c, topic=plan.topic, limit=5)
                return Structured(answer=B.content_list(plan, docs, self.s))
            return Structured()  # topical question: semantic search over the content itself
        if c == "CAREERS":
            return Structured(answer=B.jobs_answer(await S.jobs(), self.s))
        if c == "BUSINESS_ENQUIRY":
            return Structured(answer=B.contact_answer(self.s))
        return Structured()

    # ------------------------------------------------------------------ semantic + grounded generation
    async def _generate(self, plan: QueryPlan, original: str, history: List[Dict[str, str]], st: Structured) -> AsyncIterator[Event]:
        evidence = await self.retriever.retrieve(plan.standalone_query, plan.category)
        evidence = await rerank(self.s, self.llm, plan.standalone_query, evidence, keep=self.s.final_context_chunks)
        if self.s.rerank_enabled:
            good = [e for e in evidence if (e.rerank_grade or 0) >= 2]
        else:
            good = [e for e in evidence if (e.dense_score or 0) >= self.s.min_dense_score or e.lexical_score]
        meta = {"evidence_found": len(evidence), "evidence_used": len(good), "structured_blocks": len(st.blocks)}

        if not good and not st.blocks:
            ans = B.offices_pointer(self.s) if plan.category == "LOCATIONS" else B.refusal(self.s, plan.category)
            ans.meta.update(meta, no_evidence=True)
            yield "done", ans
            return

        context, sources = build_context(good, st.blocks)
        raw = ""
        async for kind, val in stream_answer(self.s, self.llm, question=plan.standalone_query, original=original,
                                             context=context, history=history):
            if kind == "delta":
                yield "delta", val
            else:
                raw = val

        valid_ids = {s.sid for s in sources}
        allowed_urls = {s.url for s in sources} | {self.s.site_base_url}
        allowed_emails = {self.s.contact_email} | st.emails
        v = validate(raw, valid_ids=valid_ids, allowed_urls=allowed_urls, allowed_emails=allowed_emails,
                     evidence_text=context, known_names=st.names)
        flagged = [f for f in v.flags if f.startswith("ungrounded_name")]
        if flagged or not v.text:
            log.warning("answer_rejected", extra={"ctx": {"flags": v.flags}})
            ans = B.refusal(self.s, plan.category)
            ans.meta.update(meta, validation_flags=v.flags, rejected=True)
            yield "done", ans
            return

        by_sid = {s.sid: s for s in sources}
        used = [by_sid[i] for i in v.used_ids] or ([] if not good else [sources[0]] if sources else [])
        links, seen = [], set()
        for s in used:
            if s.url and s.url not in seen:
                seen.add(s.url)
                links.append({"label": "View " + s.kind.replace("_", " ").title() + " page" if s.is_listing_url else s.title, "url": s.url})
        if not v.used_ids:  # model said it had nothing usable: point at the contact route
            links = B.contact_links(self.s)
        meta.update(validation_flags=v.flags, used_sources=[s.sid for s in used])
        people_cards = []
        if st.names and plan.category in ("SERVICES", "INDUSTRIES"):
            experts = await self.structured.people(service=plan.service, sector=plan.sector)
            named = [p for p in experts if p["name"].lower() in v.text.lower()]
            people_cards = [person_card(p, self.s) for p in named[:4]]
        yield "done", B.Answer(v.text, links=links[:3], people=people_cards,
                               sources=[{"title": s.title, "url": s.url} for s in used],
                               suggested_questions=B.suggestions(plan.category), meta=meta)
