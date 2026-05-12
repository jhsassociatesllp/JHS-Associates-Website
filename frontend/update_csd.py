import re

file_path = r'f:\Maaz\JHS-Associates-Website\frontend\src\components\Insights\CaseStudyDetail.css'
with open(file_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace variables
tokens = '''
/* ── Tokens ── */
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

  --font: "Inter", "DM Sans", "Helvetica Neue", sans-serif;
  --font-mono: "Inter", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
'''
css = re.sub(r':root\s*\{[^}]+\}', tokens, css)

# Replace variables usage
css = css.replace('--csd-navy', '--ink')
css = css.replace('--csd-red', '--red')
css = css.replace('--csd-text', '--ink-3')
css = css.replace('--csd-heading', '--ink')
css = css.replace('--csd-bg', '--bg')
css = css.replace('--csd-border', '--border')

# Update fonts
css = re.sub(r"font-family:\s*'DM Sans',\s*sans-serif;", 'font-family: var(--font);', css)

# Update Hero section
css = re.sub(
    r'\.csd-hero__overlay\s*\{[^}]+\}',
    r'''.csd-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(22, 41, 70, 0.60) 0%, rgba(34, 53, 82, 0.60) 100%);
  z-index: 2;
}''',
    css
)

hero_pseudo = '''
.csd-hero::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red), var(--red-hi), transparent);
  z-index: 4;
}

.csd-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 3;
}
'''
if '.csd-hero::before' not in css:
    css = css.replace('.csd-hero__inner {', hero_pseudo + '\n.csd-hero__inner {')

# Update Badge
css = re.sub(
    r'\.csd-badge\s*\{[^}]+\}',
    r'''.csd-badge {
  display: inline-block;
  background: var(--red);
  color: var(--white);
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 32px;
  box-shadow: var(--shadow-card);
  border: none;
}''',
    css
)

# Update Title shadow
css = css.replace('.csd-title {\n  font-size: clamp(2rem, 4vw, 3.5rem);\n  font-weight: 700;\n  line-height: 1.2;\n  margin: 0;\n  max-width: 900px;\n}',
'''.csd-title {
  font-family: var(--font);
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0;
  max-width: 900px;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}''')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('CaseStudyDetail CSS Updated')
