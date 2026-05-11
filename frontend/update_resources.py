import re

file_path = r'f:\Maaz\JHS-Associates-Website\frontend\src\components\Insights\Resources.css'
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

# 3. Replace hero gradient
css = re.sub(
    r'linear-gradient\([^)]*160deg.*?100%\s*\)',
    r'linear-gradient(135deg, rgba(22, 41, 70, 0.60) 0%, rgba(34, 53, 82, 0.60) 100%)',
    css, flags=re.DOTALL
)

# 4. Update hero title & eyebrow & sub
css = re.sub(
    r'\.res-hero__title\s*\{[^}]+\}',
    r'.res-hero__title {\n  font-family: var(--font);\n  font-size: clamp(3.5rem, 6vw, 5rem);\n  font-weight: 900;\n  color: var(--white);\n  line-height: 1.05;\n  letter-spacing: -0.03em;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}',
    css
)

css = re.sub(
    r'\.res-hero__title em\s*\{[^}]+\}',
    r'.res-hero__title em {\n  font-style: normal;\n}',
    css
)

css = re.sub(
    r'\.res-hero__eyebrow\s*\{[^}]+\}',
    r'.res-hero__eyebrow {\n  display: inline-block;\n  background: var(--red);\n  color: var(--white);\n  padding: 8px 20px;\n  border-radius: 100px;\n  font-size: 0.85rem;\n  font-weight: 700;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  margin-bottom: 32px;\n  box-shadow: var(--shadow-card);\n  border: none;\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n}',
    css
)

css = re.sub(
    r'\.res-hero__sub\s*\{[^}]+\}',
    r'.res-hero__sub {\n  font-size: 1.25rem;\n  font-weight: 400;\n  line-height: 1.7;\n  color: #e2e8f0;\n  max-width: 650px;\n  text-align: center;\n}',
    css
)

# 5. Remove specific padding-top that overrides background flow
css = re.sub(
    r'padding-top: 90px;',
    r'/* padding-top: 90px; */',
    css
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated Resources.css via Python')
