# New-insight email notifications

When a new **White Paper, Article, Newsletter, Regulatory update, Reg-Watch update, Knowledge resource, Excellencia entry or Podcast** is published in the admin panel, every website user who signed in with **Google** (verified email) and has not unsubscribed receives an email about it.

* **Cancel window:** the email is scheduled (default 10 minutes after publishing). Admin Panel -> CONTENT -> **Email Notifications** shows each send and lets you **Cancel** it or **Send now**, switch the feature off, change the wait time, and send yourself a **test** email.
* **Reg-Watch / Podcast drafts** send only when they are published (not for ordinary edits later).
* **Pace:** about 20 emails a minute from the background worker; progress is saved, so a restart continues where it stopped.
* **Unsubscribe:** every email has an Unsubscribe link (and the mail-app one-click header). The link opens `/unsubscribe`, where the visitor confirms with a button, and can subscribe again.
* **Security:** signed unsubscribe tokens, escaped content, only verified accounts, one job per item, admin-only controls, no recipient list is shown.
* **Settings:** `SITE_URL` (links in the email; the deploy sets it per branch) and `NOTIFY_WORKER_ENABLED` (set `false` on a computer that shares the live database so it never sends).
