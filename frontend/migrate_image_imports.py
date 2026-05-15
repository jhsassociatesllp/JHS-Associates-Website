# -*- coding: utf-8 -*-
"""
migrate_image_imports.py
========================
Converts all static image `import` statements in .tsx files to use
the `imageUrl()` helper from src/utils/imageUrl.ts.

Before:
    import ahmedabadBg from '../../image/Ahmedabad.png'
    import imgVirendra from '../../image/Virendra-Nayyar-removebg-preview.png'
    ...
    <img src={imgVirendra} />
    style={{ backgroundImage: `url(${ahmedabadBg})` }}

After:
    import { imageUrl } from '../../utils/imageUrl'
    ...
    <img src={imageUrl('Virendra-Nayyar-removebg-preview.png')} />
    style={{ backgroundImage: `url(${imageUrl('Ahmedabad.png')})` }}
"""

import os
import re
import sys

# ── Config ────────────────────────────────────────────────────────────────────
SRC_ROOT = os.path.join(os.path.dirname(__file__), 'src')

# Patterns for image import paths we want to convert (single OR double quotes)
IMAGE_IMPORT_PATTERNS = [
    # ../../image/filename.ext  (from components/*/  folders)
    re.compile(r'''import\s+(\w+)\s+from\s+['"](\.\.\/\.\.\/image\/([^'"]+))['"]'''),
    # ../image/filename.ext  (from sections/ or top-level components/)
    re.compile(r'''import\s+(\w+)\s+from\s+['"](\.\.\/image\/([^'"]+))['"]'''),
    # ./image/filename.ext  (rare, same-level)
    re.compile(r'''import\s+(\w+)\s+from\s+['"](\./image\/([^'"]+))['"]'''),
]


def compute_util_import_path(tsx_path: str) -> str:
    """Return the relative import path to src/utils/imageUrl from tsx_path."""
    tsx_dir = os.path.dirname(tsx_path)
    utils_path = os.path.join(SRC_ROOT, 'utils', 'imageUrl')
    rel = os.path.relpath(utils_path, tsx_dir).replace('\\', '/')
    if not rel.startswith('.'):
        rel = './' + rel
    return rel


def migrate_file(tsx_path: str, dry_run: bool = False) -> bool:
    """
    Process a single .tsx file.
    Returns True if the file was (or would be) modified.
    """
    with open(tsx_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.splitlines(keepends=True)
    new_lines = []
    # var_name → filename  mapping for this file
    image_vars: dict[str, str] = {}
    import_line_indices: set[int] = set()
    already_has_util_import = 'imageUrl' in content and 'utils/imageUrl' in content

    # ── Pass 1: collect image import lines ───────────────────────────────────
    for i, line in enumerate(lines):
        for pat in IMAGE_IMPORT_PATTERNS:
            m = pat.match(line.strip())
            if m:
                var_name, _full_path, filename = m.group(1), m.group(2), m.group(3)
                image_vars[var_name] = filename
                import_line_indices.add(i)
                break

    if not image_vars:
        return False  # nothing to do

    util_import_path = compute_util_import_path(tsx_path)
    util_import_line = f"import {{ imageUrl }} from '{util_import_path}'\n"

    inserted_util_import = False

    # ── Pass 2: rebuild lines ─────────────────────────────────────────────────
    for i, line in enumerate(lines):
        if i in import_line_indices:
            # Insert util import once, right before the first removed import
            if not inserted_util_import and not already_has_util_import:
                new_lines.append(util_import_line)
                inserted_util_import = True
            # Drop the original image import line
            continue
        new_lines.append(line)

    new_content = ''.join(new_lines)

    # ── Pass 3: replace variable usages ──────────────────────────────────────
    for var_name, filename in image_vars.items():
        replacement = f"imageUrl('{filename}')"
        # Match the variable used as a JS expression (not inside a string literal)
        # Covers: {varName}  varName  `url(${varName})`
        new_content = re.sub(
            rf'\b{re.escape(var_name)}\b',
            replacement,
            new_content
        )

    if new_content == content:
        return False

    print("  [OK] %s  (%d image import(s) migrated)" % (os.path.relpath(tsx_path, SRC_ROOT), len(image_vars)))
    if not dry_run:
        with open(tsx_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return True


def walk_and_migrate(dry_run: bool = False) -> None:
    changed = 0
    skipped = 0

    for root, _dirs, files in os.walk(SRC_ROOT):
        for fname in files:
            if not (fname.endswith('.tsx') or fname.endswith('.jsx') or fname.endswith('.js')):
                continue
            full_path = os.path.join(root, fname)
            try:
                if migrate_file(full_path, dry_run=dry_run):
                    changed += 1
                else:
                    skipped += 1
            except Exception as exc:
                print("  [ERR] %s: %s" % (fname, exc))

    print()
    prefix = '[DRY RUN] ' if dry_run else ''
    print("%sDone. %d file(s) updated, %d file(s) unchanged." % (prefix, changed, skipped))


if __name__ == '__main__':
    dry = '--dry-run' in sys.argv or '-n' in sys.argv
    if dry:
        print("DRY RUN -- no files will be modified\n")
    else:
        print("Migrating image imports to imageUrl() helper...\n")

    walk_and_migrate(dry_run=dry)
