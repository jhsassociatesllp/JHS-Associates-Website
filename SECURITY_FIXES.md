# Security fixes - status against the audit report

Legend: DONE = changed in the code, tested. YOU = needs your server / accounts (cannot be done from code).

## Critical
| ID | Status | What was done / what to do |
|---|---|---|
| C0 MongoDB open to internet | **YOU** | Close port 27017 to everyone except the app server, enable auth, use a DB user in `MONGODB_URL`. Also the server's `admins`, `appointments` and `fs.files` collections are currently damaged - have them repaired / restored. |
| C1 Site token = admin token | DONE | Admin API accepts only tokens typed `admin`; admin login issues them. Signing up with an admin's email is refused. (Email verification for password sign-ups is still open - see "Not done".) |
| C2 Unprotected write routes | DONE | knowledge, newsletters, whitepapers, regulatory, excellencia, blogs: create/edit/delete need Admin or Super Admin. `edited_by` now comes from the login. Admin pages send the token. `backend/tests/test_auth_coverage.py` fails if any write route is left open. |
| C3 Plain-text admin passwords / brute force | DONE | Passwords are checked with bcrypt; old plain-text ones are upgraded to a hash on the next login. 5 wrong logins per account (or 20 per IP) lock for 15 min. Same for site-user login. Admin MFA (TOTP) not done. **YOU:** after the first login, change every admin password to a strong one. |
| C4 Chatbot `/api/reindex` | DONE | Needs `API_KEY` (disabled if unset), only our own https site URLs, generic errors, blocked in nginx, container runs as non-root. |
| C5 `GET /api/proposal/` public | DONE | Super Admin / HR Admin only. |
| C6 Secrets in git | PARTLY | Removed the commented Firebase key, untracked `__pycache__` and `.claude/worktrees`, no real secret is in code any more. **YOU:** rotate SECRET_KEY, SMTP, MSG91, OpenAI, Pinecone keys and restrict the old Firebase key in Google Cloud; scrub git history if the repo was ever shared; enable GitHub secret scanning. |

## High
| ID | Status | Notes |
|---|---|---|
| H1 Uploads | DONE | Every image upload is decoded and re-encoded to WebP (the original is never stored); PDFs must be real PDFs; size limits 10 MB image / 20 MB PDF; uploaded images get a sandbox CSP header. |
| H2 CORS | DONE | Only the real site / admin hosts (list in `CORS_ORIGINS`, localhost only when `APP_ENV=development`); no credentials. |
| H3 Tokens | PARTLY | Site / careers / consulting sessions shortened from 30 days to 24 hours. Cookie-based refresh tokens and token revocation not done. |
| H4 Headers / HTTPS | PARTLY | nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS added in the site and admin nginx configs and on the API. CSP is **Report-Only** (watch the browser console, then rename to enforce). **YOU:** HTTP->HTTPS redirect and Cloudflare "Always HTTPS / HSTS". |
| H5 Swagger public | DONE | `/api/docs` and `/api/openapi.json` are off unless `APP_ENV=development` (the deploy sets `APP_ENV` from the branch). |
| H6 Rate limits / IP | PARTLY | Real client IP is no longer taken from a spoofable header; contact, alumni, feedback, sign-up, login, OTP and events are rate-limited. CAPTCHA (Cloudflare Turnstile) not added - needs your Cloudflare keys. |
| H7 HTML in emails | DONE | Every user value in email bodies is escaped; subject and recipient name cannot carry line breaks. |

## Medium / Low
| ID | Status | Notes |
|---|---|---|
| M1 SECRET_KEY fallback | **YOU** | Still falls back to a random key with a warning (so a missing secret cannot take the site down). Make sure `SECRET_KEY` is set in GitHub for both environments, then ask to make it fail-fast. |
| M2 Roles | DONE | No-role admins get least privilege (Admin, not Super Admin); feedback is Super Admin / HR only. |
| M3-M5 Limits / pagination | PARTLY | Upload limits done; pagination of every list not done. |
| M4 Verbose errors | DONE | Server errors return "Internal server error"; details go to the log. |
| M6 Chatbot abuse | NOT DONE | Per-IP limits / OpenAI budget guard still to do. |
| M7 Data minimisation | PARTLY | `IP_HASH_SALT` setting added for hashing IPs (falls back to SECRET_KEY). |
| M8 Admin exposure | PARTLY | noindex + X-Frame-Options added. **YOU:** put the admin host behind Cloudflare Access or an IP allow-list. |
| M9 Containers | PARTLY | Backend and chatbot run as non-root; `.dockerignore` added. Dependency pinning / CI scans not done. |
| L1 dangerouslySetInnerHTML | DONE | Removed. |
| L3 / L4 Junk, helper scripts | DONE | pycache untracked; helper scripts no longer contain or print passwords. |
| L5-L8 OAuth origins, CI/CD keys, deploy secrets, audit log | **YOU / NOT DONE** | See the report. |

## After deploying
- Every admin must log in again (old admin tokens have no type and are rejected).
- Set `APP_ENV=development` only on your own computer.
- To enforce the CSP: in `frontend/nginx.conf` and `admin-panel/nginx.conf` rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy` once the console shows no legitimate blocks.
