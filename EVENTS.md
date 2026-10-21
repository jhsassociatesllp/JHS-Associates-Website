# Event Registration System

## Admin: Admin Panel → CONTENT → Events
1. **Create Event** – title, type (Excellencia / Knowledge Setu / Office Event / Webinar / Other), summary, description, date & time (enter in IST), format (Online/Offline/Hybrid), venue, **Join link** (Zoom/Meet/Teams – private), capacity (0 = unlimited), registration deadline, host, status (Draft / Published / Cancelled).
2. **Registrations** button → see everyone who registered (search, mark **Attended**, remove, **Export CSV**).
3. **Copy link** → shareable page `/events/<id>`.
4. Optional **External registration URL**: if set, the website's Register button opens your own link (Google Form etc.) instead of the built-in form.

## Website (what visitors see)
- Hero pill + "Upcoming Event" card on the home page (soonest published event, with countdown).
- Navbar → Insights → **Events** (`/events`): upcoming + past events.
- Event page: details, registration form, add-to-calendar. After registering the visitor gets a reference number, the join link (also emailed).

## Security
- Join link never appears in public listings – only after successful registration.
- Seats reserved atomically (no overbooking); one registration per email per event.
- Rate limits per IP, honeypot anti-bot field, consent checkbox, input validation.
- IPs stored only as hashes; emails HTML-escaped; CSV export guards against formula injection.
- Admin endpoints require Admin / Super Admin login. Only http(s) links accepted.
- Draft events are hidden from the public.
