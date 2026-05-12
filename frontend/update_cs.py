import re

file_path = r'f:\Maaz\JHS-Associates-Website\frontend\src\components\Insights\CaseStudies.css'
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
css = css.replace('--cs-navy', '--ink')
css = css.replace('--cs-red', '--red')
css = css.replace('--cs-text', '--ink-3')
css = css.replace('--cs-heading', '--ink')
css = css.replace('--cs-bg', '--bg')
css = css.replace('--cs-border', '--border')

# Remove DM Sans import if present
css = re.sub(r"@import url\('https://fonts\.googleapis\.com/css2\?family=DM\+Sans[^']+'\);", '', css)

# Update fonts
css = re.sub(r"font-family:\s*'DM Sans',\s*sans-serif;", 'font-family: var(--font);', css)

# Update Hero section
css = re.sub(
    r'\.cs-hero\s*\{([^}]+)\}',
    r'''.cs-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--ink);
  overflow: hidden;
  padding: 6rem 2rem 5rem;
}''',
    css
)

css = re.sub(
    r'\.cs-hero__overlay\s*\{[^}]+\}',
    r'''.cs-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(22, 41, 70, 0.60) 0%, rgba(34, 53, 82, 0.60) 100%);
  z-index: 2;
}''',
    css
)

hero_pseudo = '''
.cs-hero::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red), var(--red-hi), transparent);
  z-index: 4;
}

.cs-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 3;
}
'''
if '.cs-hero::before' not in css:
    css = css.replace('.cs-hero__content {', hero_pseudo + '\n.cs-hero__content {')
    
# Set z-index of content to 5
css = re.sub(
    r'\.cs-hero__content\s*\{([^}]+)z-index:\s*\d+;([^}]+)\}',
    r'.cs-hero__content {\1z-index: 5;\2}',
    css
)

# Update Title shadow
css = re.sub(
    r'\.cs-title\s*\{([^}]+)\}',
    r'.cs-title {\1  font-family: var(--font);\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}',
    css
)

# Update badge top
css = re.sub(
    r'\.cs-card__badge-top\s*\{([^}]+)\}',
    r'.cs-card__badge-top {\1  font-family: var(--font-mono);\n}',
    css
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('CaseStudies CSS Updated')
