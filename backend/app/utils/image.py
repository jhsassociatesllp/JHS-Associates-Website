from io import BytesIO
from PIL import Image


def convert_to_webp(content: bytes, quality: int = 92) -> bytes | None:
    """Convert arbitrary raster image bytes to WebP.

    Transparent images (logos, background-removed headshots) are re-encoded
    lossless so cutout edges stay clean — lossy WebP haloing looks bad on
    those. Everything else (photos) uses high-quality lossy compression,
    which is what actually gets the size win.

    Returns None if the bytes aren't a raster image Pillow can open (e.g. an
    SVG slipped through `accept="image/*"`), so the caller can fall back to
    storing the original upload untouched instead of failing it.
    """
    try:
        img = Image.open(BytesIO(content))
        img.load()
    except Exception:
        return None

    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    img = img.convert("RGBA") if has_alpha else img.convert("RGB")

    buf = BytesIO()
    if has_alpha:
        img.save(buf, format="WEBP", lossless=True, method=6)
    else:
        img.save(buf, format="WEBP", quality=quality, method=6)
    return buf.getvalue()


def webp_filename(filename: str) -> str:
    """Swap any extension for .webp, defaulting to 'image.webp' if none."""
    stem = filename.rsplit(".", 1)[0] if "." in filename else filename
    return f"{stem or 'image'}.webp"
