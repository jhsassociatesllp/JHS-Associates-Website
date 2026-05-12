import re

file_path = r'f:\Maaz\JHS-Associates-Website\frontend\src\components\Spotlight\Alumni.css'
with open(file_path, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Remove DM Sans import
css = re.sub(r'@import url\("https://fonts\.googleapis\.com/css2[^"]+"\);', '', css)

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

  --font: "Inter", "DM Sans", "Helvetica Neue", sans-serif;
  --font-mono: "Inter", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}'''
css = re.sub(r':root\s*\{[^}]+\}', new_root, css)

# 3. Replace old variable refs
css = css.replace('--alumni-navy', '--ink-2')
css = css.replace('--alumni-red', '--red')
css = css.replace('--alumni-bg', '--bg')
css = css.replace('--alumni-text', '--ink-3')
css = css.replace('--alumni-heading', '--ink')
css = css.replace('--alumni-border', '--border')

# 4. Replace font-family strings
css = re.sub(r'font-family:\s*"DM Sans",\s*sans-serif;', 'font-family: var(--font);', css)
css = re.sub(r"font-family:\s*'DM Sans',\s*sans-serif;", 'font-family: var(--font);', css)

# 5. Update hero section - move bg to section level for parallax
css = re.sub(
    r'\.alumni-hero\s*\{([^}]+)\}',
    r'''.alumni-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--white);
  font-family: var(--font);
  background-color: var(--ink);
  background-size: cover;
  background-position: center top;
  background-attachment: fixed;
  padding: 6rem 2rem 5rem;
}''',
    css
)

# 6. Remove alumni-hero__bg rule (will be unused)
css = re.sub(r'\.alumni-hero__bg\s*\{[^}]+\}', '/* .alumni-hero__bg — bg moved to .alumni-hero for parallax */', css)

# 7. Update overlay gradient
css = re.sub(
    r'\.alumni-hero__overlay\s*\{[^}]+\}',
    r'''.alumni-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(22, 41, 70, 0.60) 0%, rgba(34, 53, 82, 0.60) 100%);
  z-index: 2;
}''',
    css
)

# 8. Add pseudo-elements after overlay if not present
if '.alumni-hero::before' not in css:
    hero_pseudo = '''
.alumni-hero::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red), var(--red-hi), transparent);
  z-index: 4;
}

.alumni-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 3;
}
'''
    css = css.replace('.alumni-hero__content {', hero_pseudo + '\n.alumni-hero__content {')

# 9. Update hero content z-index to 5
css = re.sub(
    r'(\.alumni-hero__content\s*\{[^}]*)(z-index:\s*3;)',
    r'\1z-index: 5;',
    css
)

# 10. Update eyebrow to red pill style
css = re.sub(
    r'\.alumni-hero__eyebrow\s*\{[^}]+\}',
    r'''.alumni-hero__eyebrow {
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
}''',
    css
)

# 11. Update hero title
css = re.sub(
    r'\.alumni-hero__title\s*\{[^}]+\}',
    r'''.alumni-hero__title {
  font-family: var(--font);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}''',
    css
)

# 12. Update primary button
css = re.sub(
    r'\.alumni-hero__btn--primary\s*\{[^}]+\}',
    r'''.alumni-hero__btn--primary {
  background: linear-gradient(135deg, var(--red) 0%, var(--red-hi) 100%);
  color: var(--white);
  box-shadow: 0 4px 14px var(--red-glow);
  border-radius: var(--r-pill);
}''',
    css
)
css = re.sub(
    r'\.alumni-hero__btn--primary:hover\s*\{[^}]+\}',
    r'''.alumni-hero__btn--primary:hover {
  box-shadow: 0 8px 24px var(--red-glow);
  transform: translateY(-2px);
  filter: brightness(1.08);
}''',
    css
)

# 13. Update secondary button
css = re.sub(
    r'\.alumni-hero__btn--secondary\s*\{[^}]+\}',
    r'''.alumni-hero__btn--secondary {
  background: transparent;
  color: var(--white);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--r-pill);
}''',
    css
)

# 14. Update card styles
css = css.replace('border-top: 4px solid var(--alumni-red)', 'border-top: 4px solid var(--red)')
css = css.replace('border-top: 4px solid var(--red)', 'border-top: none;\n  border-left: 4px solid var(--red)')

# 15. Update alumni-card
css = re.sub(
    r'\.alumni-card\s*\{([^}]+)\}',
    r'''.alumni-card {
  background: var(--surface);
  border-left: 4px solid var(--red);
  border-radius: var(--r-card);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--red);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}''',
    css
)

# 16. Update form submit button
css = re.sub(
    r'\.alumni-form-submit\s*\{[^}]+\}',
    r'''.alumni-form-submit {
  margin-top: 1rem;
  background: linear-gradient(135deg, var(--red) 0%, var(--red-hi) 100%);
  color: var(--white);
  font-family: var(--font);
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 14px var(--red-glow);
}''',
    css
)
css = re.sub(
    r'\.alumni-form-submit:hover\s*\{[^}]+\}',
    r'''.alumni-form-submit:hover {
  box-shadow: 0 8px 24px var(--red-glow);
  transform: translateY(-2px);
  filter: brightness(1.08);
}''',
    css
)

# 17. Update form input focus
css = css.replace('border-bottom-color: var(--alumni-navy);', 'border-bottom-color: var(--ink-2);')
css = css.replace('border-bottom-color: var(--ink-2);', 'border-bottom-color: var(--red);')

# 18. Update connect section bg
css = css.replace('background-color: #eef2f6;', 'background-color: var(--bg);')

# 19. Update section bg
css = css.replace('background-color: var(--alumni-bg);', 'background-color: var(--bg);')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('Alumni.css updated successfully')
