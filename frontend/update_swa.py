import re

file_path = r'f:\Maaz\JHS-Associates-Website\frontend\src\components\services\SingleWindowAssistance.css'
with open(file_path, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Remove Montserrat import
css = re.sub(r"@import url\('https://fonts\.googleapis\.com/css2\?family=Montserrat[^']+'\);", '', css)

# 2. Replace :root tokens
root_tokens = ''':root {
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
css = re.sub(r':root\s*\{[^}]+\}', root_tokens, css)

# 3. Replace hero overlay gradient
css = re.sub(
    r'\.swa-hero__overlay\s*\{[^}]+\}',
    r'.swa-hero__overlay {\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(135deg, rgba(22, 41, 70, 0.60) 0%, rgba(34, 53, 82, 0.60) 100%);\n}',
    css
)

# Add noise pattern back to hero overlay as ::after
if '.swa-hero::after' not in css:
    css = css.replace('.swa-hero__overlay {', '''.swa-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

.swa-hero::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red), var(--red-hi), transparent);
  z-index: 2;
}

.swa-hero__overlay {''')

# 4. Update badge
css = re.sub(
    r'\.swa-hero__badge\s*\{[^}]+\}',
    r'.swa-hero__badge {\n  display: inline-block;\n  background: var(--red);\n  color: var(--white);\n  padding: 8px 20px;\n  border-radius: 100px;\n  font-size: 0.85rem;\n  font-weight: 700;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  margin-bottom: 32px;\n  box-shadow: var(--shadow-card);\n  border: none;\n}',
    css
)

# 5. Remove padding top
css = re.sub(
    r'padding-top:\s*90px;',
    r'/* padding-top: 90px; */',
    css
)

# 6. Update em
css = re.sub(
    r'\.swa-hero__title em\s*\{[^}]+\}',
    r'.swa-hero__title em {\n  font-style: normal;\n}',
    css
)

# 7. Update .swa-hero__title text-shadow
css = re.sub(
    r'\.swa-hero__title\s*\{([^}]+)\}',
    r'.swa-hero__title {\1  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}',
    css
)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated SingleWindowAssistance.css via Python')
