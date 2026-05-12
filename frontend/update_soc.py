import re

file_path = r'f:\Maaz\JHS-Associates-Website\frontend\src\components\services\SOCAttestation.css'
with open(file_path, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Remove Montserrat import
css = re.sub(r"@import url\('[^']+Montserrat[^']+'\);", '', css)

# 2. Replace :root tokens
new_root = '''/* ── Tokens ── */
:root {
  --red: #B01E2E;
  --red-hi: #d62b3e;
  --red-deep: #8a1725;
  --red-tint: rgba(176, 30, 46, 0.08);
  --red-glow: rgba(176, 30, 46, 0.25);
  --red-border: rgba(176, 30, 46, 0.22);

  --ink: #0f2340;
  --ink-2: #1e3a5f;
  --ink-3: #2d3748;
  --ink-4: #718096;
  --ink-5: #a0aec0;

  --white: #ffffff;
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --border-md: #cbd5e1;

  --r-card: 18px;
  --r-sm: 9px;
  --r-pill: 100px;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-card: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lift: 0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.08);

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --dur: 0.35s;
  --font: "Inter", "DM Sans", "Helvetica Neue", sans-serif;
  --font-mono: "Inter", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}'''
css = re.sub(r':root\s*\{[^}]+\}', new_root, css)

# 3. Replace old font ref
css = re.sub(r"--font:\s*'Montserrat',\s*sans-serif;", 'var(--font);', css)
css = re.sub(r"font-family:\s*'Montserrat',\s*sans-serif;", 'font-family: var(--font);', css)
css = re.sub(r'font-family:\s*var\(--font\);', 'font-family: var(--font);', css)

# 4. Fix soc-page bg
css = css.replace('background: var(--bg);\n  color: var(--ink);\n  font-family: var(--font);\n  padding-top: 90px;',
                   'background: var(--bg);\n  color: var(--ink);\n  font-family: var(--font);\n  padding-top: 0;')

# 5. Replace hero section — sticky + JHS overlay
old_hero = r'\.soc-hero\s*\{[^}]+\}'
new_hero = '''.soc-hero {
  position: sticky;
  top: 0;
  z-index: 0;
  min-height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 6rem 2rem 5rem;
  background-image: url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1800&q=80&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-color: var(--ink);
}'''
css = re.sub(old_hero, new_hero, css)

# 6. Fix overlay gradient to JHS navy
css = re.sub(
    r'\.soc-hero__overlay\s*\{[^}]+\}',
    r'''.soc-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(22, 41, 70, 0.75) 0%, rgba(34, 53, 82, 0.75) 100%);
  z-index: 1;
}''',
    css
)

# 7. Add pseudo accent line if missing
if '.soc-hero::before' not in css:
    hero_pseudo = '''
.soc-hero::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red), var(--red-hi), transparent);
  z-index: 4;
}
'''
    css = css.replace('.soc-hero__overlay {', hero_pseudo + '\n.soc-hero__overlay {')

# 8. Fix hero inner z-index
css = css.replace('z-index: 2;\n  max-width: 800px;', 'z-index: 5;\n  max-width: 800px;')

# 9. Fix hero badge to JHS red pill
css = re.sub(
    r'\.soc-hero__badge\s*\{[^}]+\}',
    r'''.soc-hero__badge {
  display: inline-block;
  background: var(--red);
  color: var(--white);
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 28px;
  box-shadow: var(--shadow-card);
  border: none;
}''',
    css
)

# 10. Fix hero title gradient em to plain white italic
css = re.sub(
    r'\.soc-hero__title\s*em\s*\{[^}]+\}',
    r'''.soc-hero__title em {
  font-style: italic;
  color: var(--white);
  -webkit-text-fill-color: var(--white);
}''',
    css
)

# 11. Make sections above sticky
for cls in ['.soc-standards', '.soc-benefits', '.soc-why-process', '.soc-trust', '.soc-cta']:
    css = re.sub(
        rf'{re.escape(cls)}\s*\{{',
        f'{cls} {{\n  position: relative;\n  z-index: 1;\n  background: var(--bg);\n',
        css,
        count=1
    )

# 12. Fix soc-benefits to have white surface
css = css.replace(
    '.soc-benefits {\n  position: relative;\n  z-index: 1;\n  background: var(--bg);\n\n  padding: 5rem 0;\n  background: var(--surface);',
    '.soc-benefits {\n  position: relative;\n  z-index: 1;\n  background: var(--surface);\n  padding: 5rem 0;'
)

# 13. Fix trust section
css = css.replace(
    '.soc-trust {\n  position: relative;\n  z-index: 1;\n  background: var(--bg);\n\n  padding: 4rem 0;\n  background: linear-gradient(135deg, var(--red-deep) 0%, var(--red) 45%, var(--red-hi) 100%);',
    '.soc-trust {\n  position: relative;\n  z-index: 1;\n  padding: 4rem 0;\n  background: linear-gradient(135deg, var(--ink) 0%, var(--ink-2) 100%);'
)

# 14. Fix mobile scroll
css = css.replace('background-attachment: scroll;\n    min-height: 450px;', 'background-attachment: scroll;\n  min-height: 450px;\n  position: relative;\n  z-index: 0;')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('SOCAttestation.css updated successfully')
