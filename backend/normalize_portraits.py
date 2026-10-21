"""Re-frame partner portraits to one consistent head-and-shoulders crop.

The source photos were framed differently (wide shots vs tight crops), so the
same circular avatar showed some people small and others large. This finds
each subject, crops a square based on their shoulder width and saves a
600x600 WebP, so every avatar looks the same size on every page.

    python normalize_portraits.py <uploads_dir> [backup_dir]

Only files listed in data/leadership_seed.json are touched. Originals are
copied to backup_dir first (default: ./portraits_backup).
"""
import json
import os
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageChops

SIZE = 600
SHOULDER_RATIO = 1.22   # crop side = subject (shoulder) width * this
HEADROOM = 0.05         # empty space above the head, as a fraction of the crop

SEED = Path(__file__).parent / "data" / "leadership_seed.json"


def subject_bbox(im):
    rgba = im.convert("RGBA")
    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] < 250:
        return alpha.point(lambda v: 255 if v > 20 else 0).getbbox(), None
    rgb = im.convert("RGB")
    bg = rgb.getpixel((3, 3))
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, bg)).convert("L").point(lambda v: 255 if v > 40 else 0)
    return diff.getbbox(), bg


def normalize(path: Path) -> Image.Image:
    im = Image.open(path)
    bbox, bg = subject_bbox(im)
    has_alpha = bg is None
    w, h = im.size
    x0, y0, x1, _ = bbox
    side = min((x1 - x0) * SHOULDER_RATIO, max(w, h))
    # Never reach below the photo's bottom edge: that would leave a flat strip of
    # padding under the shoulders instead of the body running out of the circle.
    _, y0_, _, _ = bbox
    side = min(side, (h - y0_) / (1 - HEADROOM))
    left = (x0 + x1) / 2 - side / 2
    top = y0 - side * HEADROOM
    base = im.convert("RGBA" if has_alpha else "RGB")
    canvas = Image.new(base.mode, (round(side), round(side)), (0, 0, 0, 0) if has_alpha else bg)
    canvas.paste(base, (round(-left), round(-top)))
    return canvas.resize((SIZE, SIZE), Image.LANCZOS)


def main() -> None:
    uploads = Path(sys.argv[1])
    backup = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("portraits_backup")
    backup.mkdir(parents=True, exist_ok=True)
    count = 0
    for person in json.loads(SEED.read_text(encoding="utf-8")):
        name = person.get("photo_file")
        path = uploads / name if name else None
        if not path or not path.exists():
            print("skipped (file not found):", person["name"], name)
            continue
        shutil.copy2(path, backup / name)
        normalize(path).save(path, "WEBP", quality=92, method=6)
        count += 1
    print(f"{count} portraits normalized; originals saved in {backup}")


if __name__ == "__main__":
    main()
