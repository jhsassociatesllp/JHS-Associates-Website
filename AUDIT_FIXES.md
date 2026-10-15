# v2 AI Audit – what was fixed (staging branch)

Status of every item in "JHS Website – Developer Remediation Report" (15 Oct 2026).
**Done** = changed in code and tested. **Needs you** = has to be set outside the code (Cloudflare, aaPanel, GitHub secrets).

## Done in code

| ID | What was changed |
|---|---|
| SEC-01 | Staging gets `X-Robots-Tag: noindex, nofollow, noarchive` and `robots.txt` = `Disallow: /` (nginx/default.conf.template, switched by `APP_ENV=staging`). Production is unchanged. |
| SEC-02 | CSP is now **enforced** (frontend/security-headers.conf), no `unsafe-inline` for scripts. Tested: home, contact, Google Translate and Google Sign-In script load with zero violations. |
| FRM-01 | Every public form: rate limit per IP (per minute + per hour), hidden honeypot field, optional Cloudflare Turnstile (off until keys are set). |
| FRM-02 | Careers upload validates all fields first and answers 422 (never 500). |
| FRM-03 | Resume is stored under a random name; visitor file name is display text only; must end in `.pdf`; `%PDF-` check; PDFs with JavaScript/attachments or over 30 pages are refused; admin download is `attachment` + `nosniff`. |
| FRM-04 | `<` and `>` rejected in all plain-text fields. Emails were already HTML-escaped; CSV exports already neutralise `= + - @`. |
| FRM-05 / 06 | Speciality, contact service, inquiry reason, qualification, profile, how-heard are fixed lists on the server. |
| FRM-07 | `maxLength` + live counters on the message boxes, same limits as the server (frontend/src/utils/formRules.ts). |
| FRM-08 | Booking reference is created by the server, shown on the page, stored, and put in the confirmation e-mail. |
| FRM-09 (part) | Tokens now carry `iat` + `jti`; **logout revokes the token on the server**; site session shortened 24 h → 8 h; warning if `SECRET_KEY` < 32 chars. |
| FRM-10 | 422 answers contain only field + message, never the submitted value. |
| FRM-11 | nginx: 64 KB default body, 9 MB only for the résumé upload. App also refuses JSON over 64 KB. |
| FRM-12 | Required Privacy-Policy checkbox on Contact, Proposal, Careers, Appointment, Feedback, Alumni; `consent` + `consent_at` stored. |
| FRM-13 | One shared validation module (front-end `formRules.ts`, back-end `utils/validation.py`); proposal message now required. |
| FRM-14 | Submit buttons ignore double clicks; same e-mail + text within 5 minutes is refused. |
| FRM-15 | OTP daily caps: 5 per mobile and 10 per account per 24 h (SMS-cost protection). |
| FRM-16 / 17 | `required`, `aria-invalid`, `aria-describedby`, `role="alert"` on errors; unnamed Feedback fields now have labels, ids and names. |
| HDR-01 | Unknown URLs now return real **HTTP 404** (route list generated at build time) and show a new "page not found" screen; `.env`, `.git`, `.map`, `.zip`, `.php` etc. always 404. |
| HDR-02 | Canonical / og / sitemap / robots all use `https://jhsassociates.in`. |
| HDR-03 | HSTS `max-age=31536000; includeSubDomains; preload`. |
| HDR-04 | `/.well-known/security.txt` added. |
| HDR-05 | No source maps in the build; hashed `/assets/*` cached for a year, `index.html` never; `npm audit fix` applied (frontend 0, chatbot 0, admin 4 left in Firebase's server library). |

Tests: `backend/tests/test_form_validation.py` and `backend/tests/test_logout_revokes_token.py` (no database needed). nginx configs were run in real nginx containers.

## Needs you (outside the code)

1. **SEC-01 – lock staging.** Put staging behind Cloudflare Access (or nginx basic auth / IP allow-list). Add a 301 from port 80 to https on the aaPanel site. In Google Cloud, give staging its own OAuth client.
2. **FRM-01 – Cloudflare.** Add WAF rate limiting for `/api/contact/`, `/api/proposal/`, `/api/careers/applications/upload` (e.g. 5/min, 30/h per IP). Create a Turnstile widget, then set GitHub secrets `TURNSTILE_SECRET` and `VITE_TURNSTILE_SITE_KEY`. Real client IP behind Cloudflare is `CF-Connecting-IP`.
3. **Duplicate Permissions-Policy** on production: remove one of the two (origin or Cloudflare).
4. **HDR-05** – the SOP page still embeds `mediumslateblue-louse-618680.hostingersite.com`; host that file on jhsassociates.in and change `SOP_URL` in `frontend/src/App.tsx` and the `frame-src` in `security-headers.conf`.
5. **FRM-09 (rest)** – moving the session to an HttpOnly cookie (or 15–60 min token + refresh) is a larger change that touches login, CORS and CSRF; not done here.
6. **FRM-08** – the page still says "Book an appointment" (no time slot, the team calls back). Rename to "Request a call back" if the owner prefers.
7. **Section 11 – delete the test data** on staging (contact/proposal/career/appointment records, the résumés named `shell.php`, the test Google user).
8. After deploy, test in this order: home, Contact, Careers upload, Book Appointment, Google Sign-In, language switch. Watch the browser console for CSP messages.
