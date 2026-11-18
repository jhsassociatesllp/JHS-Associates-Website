from app.ingestion.documents import SourceDoc
from app.ingestion.mongodb_ingestion import collect_documents


def _doc(text, sid="mongodb:Articles:1", ns="articles"):
    return SourceDoc(source_id=sid, source_type="mongodb", namespace=ns, title="T", url="https://jhsassociates.in/articles",
                     category="articles", text=text, is_listing_url=True)


async def test_upsert_is_idempotent_and_updates_in_place(svc, vectors, llm):
    d = _doc("# T\n\n" + "alpha beta gamma. " * 120)
    r1 = await svc.indexer.upsert_document(d)
    assert r1["chunks"] > 1 and vectors.total() == r1["chunks"]
    calls = llm.embed_calls
    r2 = await svc.indexer.upsert_document(d)                       # unchanged -> nothing re-embedded
    assert r2["skipped"] == 1 and llm.embed_calls == calls
    r3 = await svc.indexer.upsert_document(_doc("# T\n\nshort now."))   # shrinks -> stale vectors removed
    assert r3["deleted"] == r1["chunks"] - 1 and vectors.total() == 1


async def test_delete_source_removes_vectors_and_registry(svc, vectors):
    await svc.indexer.upsert_document(_doc("# T\n\nhello world content here"))
    assert await svc.indexer.delete_source("mongodb:Articles:1") == 1
    assert vectors.total() == 0
    assert await svc.mongo.app.ai_chunks.count_documents({}) == 0
    assert await svc.mongo.app.ai_sources.count_documents({}) == 0


async def test_full_sync_indexes_public_content_only_and_reconcile_removes_deleted(svc, vectors, mongo=None):
    rep = await svc.sync.sync_collections(["Articles", "services", "sectors"])
    assert rep["Articles"]["docs"] == 2 and rep["services"]["docs"] == 2 and rep["sectors"]["docs"] == 2
    assert vectors.total() >= 6
    src = svc.mongo.client[svc.settings.source_db_name]
    await src.Articles.delete_one({"title": "Older article"})        # deleted upstream
    rep2 = await svc.sync.sync_collections(["Articles"])
    assert rep2["Articles"]["removed_sources"] == 1
    ids = {r["_id"] async for r in svc.mongo.app.ai_sources.find({})}
    assert not any("Older" in i for i in ids)


async def test_nothing_private_is_ever_collected(svc):
    grouped = await collect_documents(svc.mongo.public, svc.settings)
    blob = " ".join(d.text for docs in grouped.values() for d in docs)
    assert "visitor@x" not in blob and "root@x" not in blob
    assert "Huzeifa" not in blob          # leadership is served live, not embedded


async def test_webhook_single_record_reindex_and_removal(svc, vectors):
    src = svc.mongo.client[svc.settings.source_db_name]
    art = await src.Articles.find_one({"title": "GST Input Tax Credit explained"})
    r = await svc.sync.sync_one("Articles", str(art["_id"]))
    assert r["chunks"] >= 1
    await src.Articles.update_one({"_id": art["_id"]}, {"$set": {"content": "<p>Completely new text about GST returns.</p>"}})
    r2 = await svc.sync.sync_one("Articles", str(art["_id"]))
    assert r2["skipped"] == 0
    await src.Articles.delete_one({"_id": art["_id"]})
    assert (await svc.sync.sync_one("Articles", str(art["_id"])))["removed_vectors"] >= 1
    assert vectors.total() == 0
    assert (await svc.sync.sync_one("admins", "1")).get("ignored")    # non-indexed collections are ignored
