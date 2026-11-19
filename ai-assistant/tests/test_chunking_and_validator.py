from app.ingestion.chunking import chunk_text, count_tokens
from app.ingestion.documents import html_to_text
from app.llm.answer_validator import split_used_marker, validate
from app.llm.response_generator import MarkerFilter

LONG = " ".join(f"Sentence number {i} talks about audit and tax compliance matters." for i in range(120))


def test_chunks_respect_size_and_overlap():
    chunks = chunk_text(LONG, max_tokens=100, overlap_tokens=20, min_tokens=10)
    assert len(chunks) > 3
    assert all(c.tokens <= 130 for c in chunks)          # small slack for merged tail
    assert [c.index for c in chunks] == list(range(len(chunks)))


def test_overlap_repeats_content_between_neighbours():
    paras = "\n\n".join(f"Paragraph {i}: " + "word " * 25 for i in range(12))
    chunks = chunk_text(paras, max_tokens=100, overlap_tokens=40, min_tokens=10)
    assert any(chunks[i].text.split("\n\n")[0] in chunks[i - 1].text for i in range(1, len(chunks)))


def test_headings_are_tracked_and_tables_stay_whole():
    text = "## Services\n\nIntro text.\n\n### Audit\n\n| a | b |\n| 1 | 2 |\n| 3 | 4 |\n\nTail."
    chunks = chunk_text(text, max_tokens=200, overlap_tokens=20, min_tokens=5)
    assert chunks[0].heading_path.endswith("Audit")
    assert "| a | b |\n| 1 | 2 |\n| 3 | 4 |" in chunks[0].text


def test_html_to_text_keeps_structure():
    out = html_to_text("<h2>Title</h2><p>Para</p><ul><li>One</li><li>Two</li></ul><script>x()</script>")
    assert "## Title" in out and "- One" in out and "x()" not in out


def test_marker_parse_and_hide():
    text, ids = split_used_marker("Answer here.\n[[USED: S1, s3]]")
    assert text == "Answer here." and ids == ["S1", "S3"]
    f = MarkerFilter()
    shown = "".join(f.feed(p) for p in ["Answer ", "here.\n[", "[USED: S", "1]]"]) + f.flush()
    assert shown.strip() == "Answer here."
    f2 = MarkerFilter()
    assert "".join(f2.feed(p) for p in ["See [1] and ", "[2]"]) + f2.flush() == "See [1] and [2]"


def _v(raw, **kw):
    base = dict(valid_ids={"S1"}, allowed_urls={"https://jhsassociates.in/a"}, allowed_emails={"connect@jhsassociates.in"},
                evidence_text="Disha Shah is a partner", known_names={"Disha Shah"})
    base.update(kw)
    return validate(raw, **base)


def test_validator_strips_unknown_urls_and_emails():
    r = _v("Visit https://evil.example/x or https://jhsassociates.in/a mail bad@evil.com ok connect@jhsassociates.in [[USED: S1]]")
    assert "evil" not in r.text and "https://jhsassociates.in/a" in r.text and "connect@jhsassociates.in" in r.text
    assert "removed_unknown_url" in r.flags and "removed_unknown_email" in r.flags and r.used_ids == ["S1"]


def test_validator_flags_invented_person_but_not_known_or_terms():
    ok = _v("**Disha Shah** leads **Internal Audit** at **JHS Associates**. [[USED: S1]]")
    assert not [f for f in ok.flags if f.startswith("ungrounded")]
    bad = _v("**Ramesh Kulkarni** is our tax head. [[USED: S1]]")
    assert any(f.startswith("ungrounded_name") for f in bad.flags)


def test_validator_drops_unknown_source_ids():
    r = _v("Text [[USED: S1, S9]]")
    assert r.used_ids == ["S1"] and "unknown_source_id" in r.flags
