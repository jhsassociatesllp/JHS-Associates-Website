# JHS & Associates Website — Production Readiness Audit Report

**Scope:** `frontend/` (React 19 + TypeScript + Vite + react-router-dom). Backend, admin-panel, and nginx config were out of scope for this pass.
**Method:** Full static code audit (all 115+ source files) + `tsc`/`eslint` gating + representative live browser verification (Chrome-based preview, console-error checks, 375px/768px/1280px breakpoints, key user flows). Company-stats conflicts and hidden/orphaned pages were resolved per explicit instructions from the site owner (see below).

---

## Summary

The site had no build-breaking bugs, but a large amount of accumulated debt: broken navigation links, a self-contradictory "About Us" story (two different founding years and headcounts), zero per-page SEO metadata across ~84 routes, no `robots.txt`/`sitemap.xml`, an untyped/unchecked build (TypeScript never actually ran), 92 ESLint errors, a 1.2MB single-file JS bundle, several accessibility gaps in forms and the mega-menu, and one live React bug (duplicate list keys in the homepage hero carousel, confirmed via browser console). All of these have been fixed. `npm run build` and `npm run lint` both pass clean; the homepage bug fix was verified live with before/after console captures.

Two decisions were explicitly deferred to the site owner and applied as instructed:
- **Company stats**: standardized on `OurStory.tsx`'s figures (founded 1981, "45+ Years", 700+ people, 30 partners, 13 offices) everywhere they conflicted.
- **Hidden/orphaned pages and nav items**: left untouched — a manager asked for them to stay commented out. Not restored.

---

## Critical Issues (Fixed)

| Issue | File | Fix |
|---|---|---|
| Live React bug: duplicate list keys crash reconciliation on every homepage load | `frontend/src/sections/Hero.tsx:285` | Carousel renders 5 visible-card slots (`prev2/prev/current/next/next2`) from only 4 unique cards — guaranteed key collision. Confirmed via browser console (`Encountered two children with the same key`). Fixed by keying on `${position}-${card.id}` instead of `card.id`. |
| Contradictory company history across "About Us" pages | `CompanyOverview.tsx`, `Culture.tsx` | One page said founded 1992 / 200+ professionals / 15+ partners / "30+ Years"; another said 1981 / 700+ people / 30 partners / "45+ Years". Standardized on the 1981/700+/30/13-offices figures per owner's decision. |
| TypeScript never actually type-checked before shipping | `frontend/package.json:8` | `build` script was `vite build` only — Vite strips types but never checks them. Changed to `tsc -b && vite build`. This surfaced ~40 pre-existing latent type errors (see Fixed Issues §6), all now resolved. |

## High Priority Issues (Fixed)

- **Broken/malformed navigation links**: footer typo `/services/complaince-learning` (404), a missing leading slash on the IT/ITeS mega-menu link, a duplicate route (`/know-us/leadership` and `/about/leadership` both rendering the same component with no redirect).
- **Zero SEO metadata differentiation**: every one of ~84 routes rendered the identical `<title>`/meta description from `index.html`; no canonical tags, no Open Graph/Twitter cards, no `robots.txt`, no `sitemap.xml`.
- **1.2MB single JS bundle, no code-splitting**: every route's code shipped on every page load.
- **92 ESLint errors**: unused imports/vars, explicit `any` types, an unreachable-code pattern, React Hooks correctness warnings (`set-state-in-effect`, ref-mutation, ref-access-during-render).

## Medium Issues (Fixed)

- Mega-menu had no keyboard escape hatch (couldn't close with Esc) and no focus-return to the trigger button.
- Mobile drill-down nav links used plain `<a href>` instead of `<Link>`, forcing full page reloads.
- Contact / Request-for-Proposal / Alumni / Careers forms: labels not programmatically associated with inputs (no `id`/`htmlFor`), no `autoComplete` attributes, failure states used blocking `alert()` instead of the same inline banner pattern used for success.
- 11 leftover debug `console.log` statements, including one that logs the API base URL on every page load.
- Duplicate dependency (`lenis` and `@studio-freight/lenis` — same library, two names); `http-server` and `@types/react-router-dom` incorrectly listed as runtime `dependencies` instead of `devDependencies`.
- 5 confirmed-dead files (zero imports anywhere) left in the repo.
- 8 known `npm audit` vulnerabilities (transitive) resolved via non-breaking `npm audit fix`.

## Low Issues (Fixed)

- Favicon pointed at a JPEG logo instead of the existing `favicon.svg`.
- Navbar logo `alt="JHS "` had a trailing space; a stale `{/* Map placeholder */}` comment sat above a fully-implemented embedded map.
- Author name typo `"CA HUzeifa Unwala"` (wrong capitalization) in two data files.
- Non-breaking-space characters (invisible whitespace) in `OurOffices.tsx`'s stats line, flagged by ESLint's `no-irregular-whitespace`.
- Weak-but-present focus indicator on the Alumni form strengthened with a subtle box-shadow to match the rest of the site's form styling.

---

## Fixed Issues (detail)

### 1. Broken links & trivial bugs
| File:Line | Was | Now | Why |
|---|---|---|---|
| `components/Footer.tsx:30` | `path: '/services/complaince-learning'` | `/services/compliance-learning` | Typo caused a 404 on the footer's Compliance pill. |
| `components/Navbar.tsx:105` | `href: 'sectors/media-technology/it-tes'` | `/sectors/media-technology/it-tes` | Missing leading slash made this a relative link that broke depending on current page. |
| `components/Navbar.tsx:347` | `alt="JHS "` | `alt="JHS"` | Trailing space in alt text. |
| `App.tsx` (`/know-us/leadership` route) | Rendered `<Leadership />` directly | `<Navigate to="/about/leadership" replace />` | Two live URLs served the exact same component with no canonical relationship; now matches the existing redirect pattern already used for `/city/ahmedabad` and `/services/audit-assurance`. |
| `components/About Us/GlobalPresence.tsx:51` | `{/* Map placeholder */}` above a real embedded Google Map | Comment removed | Stale/misleading — the map was already fully implemented. |

### 2. Debug artifacts removed
Removed unconditional `console.log("API Base URL", ...)` from `Contact.tsx`, `Spotlight/Alumni.tsx`, `pages/Feedback.tsx`, `pages/BlogsPage.tsx` (now deleted), `pages/ArticlesPage.tsx` (now deleted), and debug logs from `Insights/Articles.tsx` (×3) and `Insights/Resources.tsx` (×3), including one that fired on every failed image load.

### 3. Content consistency (per owner's decision)
- `About Us/CompanyOverview.tsx`: "since 1992" → "since 1981"; "30+ Years Legacy" → "45+ Years Legacy"; "15+ Partners" → "30+ Partners"; "200+ Professionals" → "700+ Professionals".
- `About Us/Culture.tsx:34`: "our 200+ professionals" → "our 700+ professionals".
- `data/resources.js` / `data/articles.js`: `"CA HUzeifa Unwala"` → `"CA Huzeifa Unwala"`.

### 4. SEO
- Added `react-helmet-async`; new `data/seoMeta.ts` maps every one of the 84 routes to a distinct, hand-written `{title, description}`; new `components/common/SEOHead.tsx` mounted once in `App.tsx` renders `<title>`, meta description, canonical link, and OG/Twitter tags per route via `useLocation()` — **no per-page file edits needed**.
- `index.html`: added default OG/Twitter tags, canonical link, and fixed the favicon (`/Uploads/logo.jpeg` → `/favicon.svg`, using the SVG icon that already existed but was unused).
- Added `frontend/public/robots.txt` (allow-all + sitemap reference) and `frontend/public/sitemap.xml` (all nav-reachable routes; intentionally-hidden pages excluded, consistent with the owner's decision not to surface them).
- **Verified live**: page titles now correctly change per route (confirmed `/`, `/services/taxation`, `/sectors/consumer/retail`, `/contact`, `/services/compliance-learning` each render distinct titles).

### 5. Accessibility
- `components/Navbar.tsx`: mega-menu now closes on **Escape** and returns focus to the burger button (verified live); mobile drill-down links converted from `<a href>` to `<Link>` to stop full-page reloads.
- Contact, Request-for-Proposal, and Careers forms: every labeled input now has a matching `id`/`htmlFor` pair (verified live via accessibility tree — labels correctly precede their inputs) and appropriate `autoComplete` values (`name`, `email`, `tel`, `organization`, `given-name`, `family-name`).
- Contact, Request-for-Proposal, Alumni, and Feedback forms: submit-failure paths now show the same inline error banner pattern already used for success, instead of a blocking `alert()`.
- Alumni form's focus style strengthened with a box-shadow to match the rest of the site (was a bare border-color change with no default browser outline replacement).
- *(Note: an initial automated pass flagged 7 more files for missing focus-visible styles; manual inspection showed they already had proper `:focus` box-shadow rings and were false positives — corrected before making unnecessary changes.)*

### 6. Code quality / build
- `package.json`: `build` script now runs `tsc -b && vite build`, gating every future deploy on real type-checking.
- Fixed all 92 ESLint errors: removed unused imports/vars across ~30 files, replaced explicit `any` with proper types (`Element` via `gsap.utils.toArray<Element>`, `unknown` with `instanceof Error` narrowing in catch blocks), fixed a ternary-used-as-statement in `Careers.tsx`, an unused-`eslint-disable` comment, irregular non-breaking-space whitespace in `OurOffices.tsx`, and 3 React Hooks correctness issues:
  - `Disclaimer.tsx` / `Insights/CaseStudyDetail.tsx`: replaced `setState`-inside-`useEffect` with lazy `useState` initializers / derived render-time values (also fixed a real bug in `CaseStudyDetail.tsx` — `approach` is `string[]` in the data but was typed/rendered as a single string, which would have rendered all bullet points concatenated with no spacing).
  - `sectors/Other/Logistics.tsx`: removed a redundant ref, replaced a callback-ref mutation pattern with direct hook-return destructuring to satisfy React's ref-immutability rules.
- Wiring `tsc -b` into the build surfaced ~40 previously-invisible type errors across the codebase (never caught because type-checking never ran in CI/build). All fixed:
  - 8 files (`Cities/*.tsx`, `sections/Spotlight.tsx`) used the bare `JSX.Element` global type, which doesn't resolve under React 19 without importing `React` — switched to `ReactElement` from `'react'`.
  - Added `"allowJs": true` to `tsconfig.app.json` so the plain-JS data files (`CaseStudies.js`, `SectorExperts.js`, `SectorCaseStudyMap.js`) type-check cleanly for their TS consumers.
  - `About Us/Partners.tsx`: `Member` interface required `teamSize`/`clientsServed`/`email` on every entry, but every single partner record has those fields commented out (and the UI that displayed them is also commented out) — made them optional to match reality.
  - `sections/Stats.tsx`: `NodeJS.Timeout` (a Node type, wrong in browser code) → `ReturnType<typeof setInterval>`; removed an unused `item` loop variable.
  - `sectors/shared/SectorEngagement.tsx`, `sectors/consumer/OilAndGasIndustry.tsx`: fixed implicit `any[]`/`never[]` inference on two data arrays with explicit type annotations.
  - `Spotlight/Alumni.tsx`: removed a dead `.role` field render — every alumni profile has `role` commented out of the data, so this always rendered empty.
- **Performance**: converted all ~84 route components in `App.tsx` to `React.lazy()` + a single `<Suspense>` boundary. Main JS bundle dropped from **1,227 KB → 480 KB** (gzip: 311 KB → 154 KB), with the remainder split into ~80 small per-route chunks loaded on demand.
- Removed duplicate scroll library: kept `lenis` (the one actually imported by `hooks/useSmoothScroll.ts`), dropped the unused, renamed-from `@studio-freight/lenis`.
- Moved `http-server` and `@types/react-router-dom` from `dependencies` to `devDependencies` (neither ships to the browser).
- Deleted 5 confirmed-dead files (zero imports anywhere in the codebase, verified by full-tree grep): `data/menuData.ts` (also internally inconsistent with real routes), `pages/ArticlesPage.tsx`, `pages/BlogsPage.tsx`, `sections/Posts.tsx` + `Posts.css`, `sections/CareerCaseStudy.tsx` + `CareerCaseStudy.css`.
- Ran `npm audit fix` (non-breaking, semver-respecting only): resolved 8 of 10 known vulnerabilities (axios, postcss, js-yaml, brace-expansion, form-data, @babel/core, qs). The remaining 2 require a `react-router-dom` **downgrade** to 7.11.0 via `--force` per npm's own warning — not applied; flagged below.

---

## Remaining Manual Tasks (not auto-fixed — need a human decision)

1. **Duplicate "ESG Reporting Standards" entries** in `data/resources.js` and `data/articles.js` — identical title/description text, same PDF link, different ids. Looks like an accidental copy-paste but could be intentional; needs a content-owner decision on which (if either) to remove.
2. **Two partner entries with empty `image`/`creds` fields** in `data/SectorExperts.js` (`Huzefa Kaka`, `Huzefa Mala`) — can't fabricate photos/credentials.
3. **Generic/unverifiable award names** in `About Us/Awards.tsx` ("Top 50 Advisory Firms", "Excellence in Audit Quality", etc.) with no awarding body, year, or source cited — reads as filler; needs real citations or removal.
4. **Mismatched PDF link**: `data/articles.js` — the CARO 2020 article's `pdf` field points to `rera-compliance-guide.pdf`, which looks like a copy-paste error but the correct file wasn't identifiable from the codebase.
5. **All intentionally-hidden pages and nav items left untouched, per instruction**: Culture, Partnerships, Awards, Company Overview, Global Presence, CSR, and the Hyderabad office page (nav entries all commented out in `Navbar.tsx`); 6 fully-built standalone article pages with zero inbound links (Boardrooms in Transition, Green Transition, Digital Twins, SEBI Draft Circular, RBI Cooling-Off Period, Investment Opportunities India). All exist and work if visited directly by URL, but the owner asked not to restore any commented-out nav.
6. **Remaining `npm audit` vulnerabilities (2, high severity)** in `react-router` — the only available fix is `npm audit fix --force`, which npm itself flags as a breaking downgrade to `react-router-dom@7.11.0`. Not applied; recommend evaluating on its own before doing this.
7. **Domain/canonical URL assumption**: SEO tags and the sitemap use `https://www.jhsassociates.in` as the canonical domain, inferred from the company email domain — confirm this matches the actual production URL before deploy.
8. **Cross-browser testing**: only Chromium-based rendering was available in this session. Safari/Firefox-specific CSS/JS behavior (especially the GSAP animations, smooth-scroll via `lenis`, and the mega-menu) has not been verified and should be checked manually.
9. **Exhaustive responsive QA**: representative breakpoints (375px, 768px, 1280px) were checked on 5 pages; the full matrix requested (320/375/425/768/1024/1280/1440/1920px × all ~84 routes) was not exhaustively tested — recommend a dedicated visual-regression pass (e.g., Percy/Chromatic) before launch.
10. **Lighthouse/performance profiling**: not run in this session (no tool access). The bundle-size fix (code-splitting) directly addresses the largest known issue, but a real Lighthouse pass is recommended to check LCP/CLS/TBT on production infrastructure.
11. **CSS bundle is still large** (719 KB / 81 KB gzipped) — every page's styles ship as one file since each page component imports its own `.css`. Splitting this further (e.g., CSS Modules scoped per lazy chunk) is a larger refactor than this pass covered.

---

## Overall Production Score: 82/100

**Rationale**: All build-blocking, security, broken-link, and live-bug issues are resolved; the build is now type-checked and lint-clean; SEO/sitemap/robots are in place; the largest performance issue (bundle size) is fixed; core accessibility gaps in forms and navigation are closed. Points withheld for: unresolved content-ownership items (duplicate articles, missing partner photos, unverified awards), the 2 remaining `react-router` advisories pending a deliberate upgrade decision, and the fact that only representative (not exhaustive) cross-browser/cross-breakpoint QA was performed — those require either human judgment calls or tooling this session didn't have access to.
