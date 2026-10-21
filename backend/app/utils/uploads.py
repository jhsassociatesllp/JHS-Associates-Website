"""One place that decides whether an uploaded file is acceptable.

Images are always decoded and re-encoded to WebP (this strips scripts / metadata), and the
original bytes are never stored. PDFs must start with the PDF signature. Everything else
(HTML, SVG, executables ...) is refused.
"""
from fastapi import HTTPException

from app.utils.image import convert_to_webp

MAX_IMAGE = 10 * 1024 * 1024
MAX_PDF = 20 * 1024 * 1024


def require_webp(data: bytes) -> bytes:
    if not data:
        raise HTTPException(400, "The image is empty")
    if len(data) > MAX_IMAGE:
        raise HTTPException(413, "The image is too large (maximum 10 MB)")
    out = convert_to_webp(data)
    if out is None:
        raise HTTPException(400, "Please upload a valid image (JPG, PNG or WebP)")
    return out


def check_pdf(data: bytes) -> None:
    if not data:
        raise HTTPException(400, "The PDF is empty")
    if len(data) > MAX_PDF:
        raise HTTPException(413, "The PDF is too large (maximum 20 MB)")
    if not data.startswith(b"%PDF-"):
        raise HTTPException(400, "Please upload a valid PDF file")
