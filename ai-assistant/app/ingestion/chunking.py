"""Heading-, paragraph- and table-aware chunking with token-budgeted overlap. Sizes come from Settings."""
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import List, Tuple

import tiktoken

_HEADING = re.compile(r"^(#{1,6})\s+(.*)$")
_TABLE_ROW = re.compile(r"^\s*\|.*\|\s*$")
_SENTENCE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9\"'(])")


@lru_cache
def _enc():
    return tiktoken.get_encoding("cl100k_base")  # the tokenizer used by text-embedding-3-*


def count_tokens(text: str) -> int:
    return len(_enc().encode(text or ""))


@dataclass
class Chunk:
    index: int
    text: str            # what is shown to the model and stored (no title prefix)
    heading_path: str    # "Section > Subsection" the chunk sits under
    tokens: int


def _blocks(text: str) -> List[Tuple[str, str]]:
    """Split into (kind, text) blocks: heading | table | para. Tables stay whole (one block per table)."""
    blocks: List[Tuple[str, str]] = []
    para: List[str] = []
    table: List[str] = []

    def flush_para():
        if para:
            blocks.append(("para", " ".join(s.strip() for s in para).strip()))
            para.clear()

    def flush_table():
        if table:
            blocks.append(("table", "\n".join(table)))
            table.clear()

    for line in text.replace("\r\n", "\n").split("\n"):
        if _TABLE_ROW.match(line):
            flush_para()
            table.append(line.rstrip())
            continue
        flush_table()
        m = _HEADING.match(line)
        if m:
            flush_para()
            blocks.append(("heading", m.group(2).strip()))
        elif not line.strip():
            flush_para()
        else:
            para.append(line)
    flush_para()
    flush_table()
    return [b for b in blocks if b[1]]


def _split_long(text: str, max_tokens: int) -> List[str]:
    """Break an over-long block at sentence boundaries, then hard-wrap on tokens as a last resort."""
    if count_tokens(text) <= max_tokens:
        return [text]
    out: List[str] = []
    cur: List[str] = []
    cur_t = 0
    for sent in _SENTENCE.split(text):
        st = count_tokens(sent)
        if st > max_tokens:  # one gigantic sentence: hard wrap
            if cur:
                out.append(" ".join(cur)); cur, cur_t = [], 0
            ids = _enc().encode(sent)
            for i in range(0, len(ids), max_tokens):
                out.append(_enc().decode(ids[i:i + max_tokens]))
            continue
        if cur_t + st > max_tokens and cur:
            out.append(" ".join(cur)); cur, cur_t = [], 0
        cur.append(sent); cur_t += st
    if cur:
        out.append(" ".join(cur))
    return out


def chunk_text(text: str, max_tokens: int = 700, overlap_tokens: int = 100, min_tokens: int = 60) -> List[Chunk]:
    """Pack blocks into chunks of <= max_tokens. When a chunk closes, the next one starts with the trailing blocks of
    the previous one (up to overlap_tokens) so facts spanning a boundary stay retrievable. Heading context is kept."""
    if overlap_tokens >= max_tokens:
        raise ValueError("overlap must be smaller than the chunk size")
    heads: List[str] = []
    pieces: List[Tuple[str, str, int]] = []  # (text, heading_path, tokens)
    for kind, body in _blocks(text):
        if kind == "heading":
            heads = (heads + [body])[-3:] if heads else [body]
            continue
        path = " > ".join(heads)
        parts = [body] if kind == "table" and count_tokens(body) <= max_tokens else _split_long(body, max_tokens)
        for p in parts:
            pieces.append((p, path, count_tokens(p)))

    chunks: List[Chunk] = []
    cur: List[Tuple[str, str, int]] = []
    cur_t = 0

    def emit(items: List[Tuple[str, str, int]]):
        body = "\n\n".join(i[0] for i in items).strip()
        if body:
            chunks.append(Chunk(len(chunks), body, items[-1][1], count_tokens(body)))

    for piece in pieces:
        if cur and cur_t + piece[2] > max_tokens:
            emit(cur)
            keep: List[Tuple[str, str, int]] = []
            kt = 0
            for prev in reversed(cur):
                if kt + prev[2] > overlap_tokens:
                    break
                keep.insert(0, prev); kt += prev[2]
            cur, cur_t = keep, kt
        cur.append(piece); cur_t += piece[2]
    if cur:
        emit(cur)

    # Merge a tiny trailing chunk into its predecessor instead of keeping a near-empty one.
    if len(chunks) > 1 and chunks[-1].tokens < min_tokens:
        last = chunks.pop()
        prev = chunks[-1]
        merged = prev.text + "\n\n" + last.text
        chunks[-1] = Chunk(prev.index, merged, last.heading_path or prev.heading_path, count_tokens(merged))
    return chunks
