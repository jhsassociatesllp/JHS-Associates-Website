import pytest

from app.answer_builders import people_answer
from app.core.exceptions import AccessDenied
from app.database.allowlist import ALLOWED, BLOCKED
from app.retrieval.query_classifier import QueryPlan


def test_blocked_and_allowed_never_overlap():
    assert not (set(ALLOWED) & BLOCKED)


@pytest.mark.parametrize("col", ["admins", "contact_us", "career_applications", "career_resumes", "users", "alumni",
                                 "feedback", "event_registrations", "admin_audit_log", "fs.files", "unknown_collection"])
async def test_blocked_collections_denied(seeded, col):
    with pytest.raises(AccessDenied):
        await seeded.public.find(col)


async def test_operators_refused(seeded):
    with pytest.raises(AccessDenied):
        await seeded.public.find("leadership", {"$where": "1==1"})


async def test_projection_hides_unapproved_fields_and_inactive_people(seeded):
    rows = await seeded.public.find("leadership")
    assert all("photo_file" not in r for r in rows)
    assert "Old Member" not in {r["name"] for r in rows}  # base filter status=Active
    assert len(rows) == 7


async def test_governance_council_is_exact(svc):
    people = await svc.structured.people(role="Governance Council")
    assert [p["name"] for p in people] == ["Huzeifa Unwala", "Kalpesh Parmar", "Sharad Mohata"]


async def test_partner_role_includes_dual_role_members_but_not_advisory(svc):
    names = {p["name"] for p in await svc.structured.people(role="Partner")}
    assert names == {"Huzeifa Unwala", "Tasnim Tankiwala", "Disha Shah"}


async def test_city_alias_and_topic_filters(svc):
    assert [p["name"] for p in await svc.structured.people(city="Baroda")] == ["Kalpesh Parmar"]
    tax = {p["name"] for p in await svc.structured.people(service="Taxation")}
    assert {"Sharad Mohata", "Tasnim Tankiwala", "Disha Shah"} <= tax          # by service field or bio text
    assert "Raj Dabburi" not in tax
    assert [p["name"] for p in await svc.structured.people(topic="cyber security")] == ["Huzeifa Unwala"]


@pytest.mark.parametrize("typed,expected", [("dhisa shah", "Disha Shah"), ("tasnim", "Tasnim Tankiwala"), ("Huzeifa", "Huzeifa Unwala")])
async def test_fuzzy_name(svc, typed, expected):
    assert [p["name"] for p in await svc.structured.people(name=typed)][0] == expected


async def test_people_answer_is_complete_and_never_invents(svc, settings):
    people = await svc.structured.people(role="Governance Council")
    ans = people_answer(QueryPlan("LEADERSHIP", "q", role="Governance Council", wants_list=True), people, settings)
    assert "**3** Governance Council members" in ans.reply
    for n in ("Huzeifa Unwala", "Kalpesh Parmar", "Sharad Mohata"):
        assert n in ans.reply
    assert "Dipika" not in ans.reply and "Tasnim" not in ans.reply     # the original bug: other roles mixed in
    assert len(ans.people) == 3


async def test_content_latest_sorted_desc(svc):
    docs = await svc.structured.content("ARTICLES", limit=5)
    assert [d["title"] for d in docs] == ["GST Input Tax Credit explained", "Older article"]
