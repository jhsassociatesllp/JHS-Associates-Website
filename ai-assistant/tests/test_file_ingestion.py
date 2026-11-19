import docx

from app.core.config import get_settings
from app.ingestion.file_ingestion import collect_files, sync_folder


def _make(tmp_path):
    d = docx.Document(); d.add_heading("Our Approach", 1); d.add_paragraph("JHS delivers statutory audit with a risk based approach. " * 8)
    d.save(tmp_path / "Profile.docx")
    (tmp_path / "notes.txt").write_text("JHS has offices in Mumbai and Ahmedabad. " * 10, encoding="utf-8")
    (tmp_path / "ignore.exe").write_bytes(b"x")


def test_collects_supported_files_only(tmp_path):
    _make(tmp_path)
    docs = collect_files(get_settings(), tmp_path)
    assert sorted(d.title for d in docs) == ["Profile", "notes"]
    assert all(d.namespace == "company_documents" and d.access_level == "PUBLIC" for d in docs)


async def test_sync_is_idempotent_and_removes_deleted_files(tmp_path, svc):
    _make(tmp_path)
    s = get_settings()
    first = await sync_folder(s, svc.indexer, svc.mongo.app, tmp_path)
    again = await sync_folder(s, svc.indexer, svc.mongo.app, tmp_path)
    assert first["files"] == 2 and first["chunks"] > 0 and again["chunks"] == 0 and again["skipped"] == 2
    (tmp_path / "notes.txt").unlink()
    assert (await sync_folder(s, svc.indexer, svc.mongo.app, tmp_path))["removed"] == 1
