# Cookie Consent – how it works

## Visitor experience
1. First visit: the website notice (disclaimer) appears; once accepted, the cookie notice follows.
2. The visitor picks **Accept all**, **Reject non-essential**, or **Customize** (turn *Preferences* on/off).
3. The choice is remembered for **12 months** (cookie `jhs_cookie_consent`; the disclaimer cookie `jhs_disclaimer_accepted` also lasts 12 months).
4. They can change their mind any time from **Cookie Settings** in the footer.
5. Visitors are asked again if the policy version changes (`POLICY_VERSION` in `frontend/src/utils/cookieConsent.ts` and `backend/app/schemas/cookie_consent.py`).

## Categories
| Category | What it covers | Consent |
|---|---|---|
| Strictly necessary | consent cookie, website-notice acknowledgement, sign-in session | not needed, always on |
| Preferences | the chosen site language is remembered across visits | optional; if off, the language only lasts for the visit |

## What is recorded (Admin Panel → COMMUNICATIONS → Cookie Consent)
Totals of accepted / rejected / customised, acceptance rate, a 30-day chart, and a table of choices
(random reference, choice, preferences on/off, browser + device type, page, date, expiry) with CSV export.

## Privacy & security
- Visitors are identified only by a random anonymous id; no name, email or IP address is stored (only a keyed one-way hash of the IP, used to block abuse).
- The raw user-agent is not stored — only browser / device type.
- Records delete themselves after 365 days (database TTL index).
- The public endpoint validates every field, rejects bad input, and is rate-limited (12 requests/min per visitor IP).
- Admin endpoints require a logged-in super_admin / admin; CSV export neutralises spreadsheet-formula injection.
- Cookies are first-party, `SameSite=Lax`, `Secure` on https, path `/`, `Max-Age` 365 days.
  (They are readable by the page script because the banner needs to read them — they hold no secrets.)
