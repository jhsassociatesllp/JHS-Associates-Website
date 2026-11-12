# Response to the IT team's penetration-test report (19 October 2026)

Report: *Advanced Penetration Testing & Risk Assessment* by Gauhar Nasim Akhtar (IT & Security Administrator).
Legend: **DONE** = fixed in the code and covered by an automatic test. **IT** = needs the server, the hosting panel, DNS or Cloudflare (it cannot be fixed from code). The steps for each IT item are below.

## 1. Status of every finding

| # | Finding (report) | Severity | Status | What it comes down to |
|---|---|---|---|---|
| D | Attack Chain D: upload -> stored XSS -> admin / CRM takeover | 9.3 Critical | **DONE** | `/api/articles/upload` needs an admin login. Every image is decoded and re-encoded to WebP, so `.html`, `.svg` and `.js` can never be stored. PDFs must be real PDFs. Nothing in the website or admin panel renders stored HTML (`dangerouslySetInnerHTML` is not used anywhere). Tokens are revoked on logout (server-side blacklist). Test: `backend/tests/test_vapt_report_oct2026.py`, `test_logout_revokes_token.py`, `test_admin_logout_revokes_token.py`. |
| F-01 | 57 of 74 API routes with no login (PUT / DELETE) | 9.1 Critical | **DONE** | Today 118 of 170 operations need a login. The 52 that don't are public pages (articles, jobs, events ... GET) and the public forms and sign-in (POST). **No PUT / PATCH / DELETE route is public.** `test_auth_coverage.py` and `test_open_routes_allowlist.py` fail the build if one is added. |
| PII-01 | Client data readable without login (`/api/contact/`, `/alumni/`, `/proposal/`) | 7.5 High | **DONE** | These and 13 more client-data routes (feedback, users, applications, appointments, exports, dashboard ...) answer 401 to anonymous users and to ordinary signed-in visitors. Proposals, contacts and others need Super Admin or HR Admin. Test: `test_vapt_report_oct2026.py`. |
| CLOUD-01 | Origin IP answers the internet directly, bypassing Cloudflare | 7.5 High | **IT** | Firewall change. Script and steps in section 2. |
| HOST-01 | MySQL 5.7 (end of life) on port 3306 and WHM / cPanel / FTP ports open to the internet | 7.4 High | **IT** | Server change. Steps in section 3. (This website uses MongoDB, not MySQL.) |
| C | DMARC is `p=none` (domain spoofing) | 5.3 Medium | **IT** | DNS change. Exact records in section 4. |

Also flagged by us, the same kind of problem as HOST-01 and **more urgent**: the MongoDB server (`45.198.225.149:27017`) answers connections from the internet and the connection string has no user name or password. See section 3b.

## 2. CLOUD-01: let only Cloudflare reach the web ports

1. In Cloudflare -> DNS, check every record for the website, admin panel and staging shows the **orange cloud (Proxied)**. If one is grey, the firewall step below would take that site offline.
2. In Cloudflare -> SSL/TLS set **Full (strict)**, and switch on **Always Use HTTPS**.
3. Print the firewall commands (this only prints, it changes nothing):
   ```bash
   python ops/cloudflare_firewall_commands.py          # ufw commands
   python ops/cloudflare_firewall_commands.py --list   # just the address ranges (for aaPanel / the Hostinger firewall page)
   ```
4. On the server (as root) first allow yourself: `ufw allow from <office IP> to any port 22`. Then run the printed commands, then `ufw enable`. On Hostinger or aaPanel, add the same ranges for ports 80 and 443 in their firewall page and remove any "allow all" rule for those ports.
5. Restrict the aaPanel / WHM panel (port **8888** for aaPanel) to the office IP only. Never leave it open to everyone.
6. Test from a phone on mobile data (not the office):
   - `http://<origin IP>` and `https://<origin IP>` must **time out**.
   - `https://jhsassociates.in`, `https://admin.jhsassociates.in` and `https://staging.jhsassociates.in` must still open.
7. Optional extra: Cloudflare -> SSL/TLS -> Origin Server -> **Authenticated Origin Pulls**.

## 3. HOST-01: MySQL, WHM, cPanel, FTP (server `103.211.216.223`)

1. **MySQL port 3306:** in `/etc/my.cnf` set `bind-address=127.0.0.1`, restart MySQL, and block 3306 in the firewall. From outside, `telnet 103.211.216.223 3306` must fail.
2. **Upgrade MySQL 5.7 -> 8.0:** take a full backup first (`mysqldump --all-databases`), upgrade (WHM -> MySQL Upgrade, or the hosting provider), then test every site on that server. If nothing important still runs on it, retire the server instead.
3. **WHM / cPanel / Webmail ports (2082, 2083, 2086, 2087, 2095, 2096):** allow only the office IP (CSF firewall or the provider firewall). Turn on **cPHulk Brute Force Protection** (WHM -> Security Center). Turn on two-factor sign-in for the WHM root and cPanel accounts. Change the root password.
4. **FTP (port 21):** turn it off and use SFTP (SSH) instead. If FTP must stay, restrict it to the office IP.
5. 13,121 domains on one shared server is a reason to move the firm's sites to a server of their own.

### 3b. MongoDB (not in the report, but the same risk, and the data is client data)
1. Edit `mongod.conf`: `security.authorization: enabled` and `net.bindIp: 127.0.0.1,<private IP of the app server>`.
2. Create an admin user and a separate application user with rights only on the website database.
3. Firewall port 27017 so only the app server's IP can reach it.
4. Put the user name and password in the GitHub secrets `MONGODB_URL` and `MONGODB_URL_MAIN` (`mongodb://user:password@host:27017/?authSource=...`). Redeploy.
5. Rotate `SECRET_KEY` and the admin passwords, because the data was reachable.

## 4. DMARC (domain spoofing)

What the public DNS shows today:
- `_dmarc.jhsassociates.in`: `v=DMARC1; p=none; rua=mailto:admin@jhsassociates.in; fo=1; adkim=s; aspf=s`  (only monitors, blocks nothing)
- SPF ends in `-all` and covers Outlook, Zoho and MailerLite. Good.
- DKIM for Microsoft 365 (selector1 / selector2) is published. Good. The website's own email (Microsoft Graph, sent as connect@) is signed by it.

Move to blocking in steps, so real mail (newsletters from MailerLite, Zoho mail) does not land in spam:
1. **Week 1:** change the DMARC TXT record to
   `v=DMARC1; p=quarantine; pct=25; rua=mailto:admin@jhsassociates.in; fo=1; adkim=r; aspf=r`
   Read the daily reports sent to `rua`. Any real sender that fails (MailerLite or Zoho) needs its **DKIM for jhsassociates.in** turned on in that service.
2. **Week 2:** when the reports are clean, set `pct=100`. This is the report's recommendation.
3. **Later:** `p=reject`.
Change it where the DNS lives (Cloudflare -> DNS, or the domain registrar).

## 5. Other points from the report, answered

- **"Internal employee email leaked":** the partners' work addresses (for example `name@jhsassociates.in`) are shown on the Leadership / Offices pages on purpose. Remove any you do not want public. The default sender address in `backend/app/config/settings.py` was an employee's address; it is now empty (the server's real values come from the GitHub secrets).
- **Tokens in localStorage:** the admin token lives in the browser's `localStorage`. With no way to run injected script (no HTML rendering, strict upload checks, enforced CSP, 8-hour sessions, server-side revocation) the report's chain cannot be repeated. Moving to cookie-only sessions would be a bigger change; say if you want it.

## 6. Run the checks

```bash
cd backend
python tests/test_vapt_report_oct2026.py
python tests/test_auth_coverage.py
python tests/test_open_routes_allowlist.py
```

## 7. Rate limits in the admin panel (added after the IT admin's note)

Before, only logins were limited (5 wrong passwords lock an account for 15 minutes) and the public forms. Everything else in the admin panel could be called without limit. Now there are three layers, and none of them changes how the panel looks or works.

| Layer | Where | Limit |
|---|---|---|
| Edge (nginx, admin panel) | `admin-panel/nginx.conf` | Sign-in 10 a minute per visitor (plus a burst of 5). Excel / ZIP downloads 6 a minute (burst 3). All other `/api/` calls 600 a minute (burst 100), at most 40 open connections. |
| Edge (nginx, main site) | `nginx/default.conf.template` | Admin sign-in through the main site's address: same 10 a minute. API ceiling 900 a minute per visitor. |
| API (FastAPI) | `backend/app/utils/ratelimit.py` | Each admin **account**: 300 calls a minute, 120 changes a minute, 12 downloads per 5 minutes (so two admins in one office never share a budget). Each visitor address: 900 calls a minute. An address that is refused (401 / 403) 60 times in 5 minutes is paused for the rest of the window. |

When a limit is passed the answer is **429 Too Many Requests** with a `Retry-After` header, and the sign-in page says how long to wait. nginx counts the real visitor (not our own proxies) by trusting the Docker network, aaPanel and Cloudflare.

Tune without changing code (GitHub secrets / server environment, then redeploy): `RATE_LIMIT_ADMIN_PER_MIN`, `RATE_LIMIT_ADMIN_WRITE_PER_MIN`, `RATE_LIMIT_EXPORT_PER_5MIN`, `RATE_LIMIT_IP_PER_MIN`, `RATE_LIMIT_REFUSED_PER_5MIN`. `RATE_LIMIT_ENABLED=false` switches the API layer off (do not use except to diagnose a problem).

How to check it (after deploy), from any computer:
```bash
# 8 quick wrong sign-ins from one address: the first 6 get 401, then 429
for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w "%{http_code} " -X POST https://admin.jhsassociates.in/api/admin/login -H "Content-Type: application/json" -d '{"email":"nobody@example.com","password":"wrong-password"}'; done; echo
```
Run that from your own network only, and expect your own address to be paused for about a minute afterwards.
Automatic tests: `backend/tests/test_rate_limit.py`.
