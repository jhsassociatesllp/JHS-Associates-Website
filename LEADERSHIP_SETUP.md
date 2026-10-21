# Leadership Management – Setup & Usage Guide

## 1. Run everything locally (from `F:\Maaz\JHS-Associates-Website`)

Use three terminals. Stop any dev servers running from another folder first
(e.g. `F:\Maaz\My Projects\...`) – they don't contain these changes.

| Terminal | Folder | Command | URL |
|---|---|---|---|
| Backend | `backend` | `python run.py` | http://localhost:8001/api/docs |
| Website | `frontend` | `npm run dev` | http://localhost:5173/about/leadership |
| Admin Panel | `admin-panel` | `npm run dev` | http://localhost:5174 |

Both front ends proxy `/api` to port **8001**. If the admin login shows
"Login failed" with a **502** in the browser console, the backend (terminal 1)
is not running.

## 2. Load the existing data (once)

```
cd backend
python seed_leadership.py
```

Adds the 37 existing people. Safe to re-run – existing people are skipped, so
admin edits are never overwritten. (Already run against the configured database.)

## 3. Use the Admin Panel

1. Open the Admin Panel and sign in as a **super_admin** or **admin**
   (HR admins don't see this page).
2. Sidebar → **CONTENT → Leadership**.
3. **Add Member**: fill name, education, description, email, LinkedIn, location,
   tick **Leadership Roles** (at least one), Services, Sectors, choose Status and
   Display Order, upload a photo, **Add Member**.
4. **Edit / Delete** from the table. Inactive people are hidden from the website.

### Role rules
| Person | Tick |
|---|---|
| Normal partner | Partner |
| Governance Council + partner | Partner + Governance Council |
| Advisory board member | Advisory Board Member |
| Associate | Associate |

- Governance Council members always appear in the "Governance Council" row.
- **Page Section** = heading for everyone else (e.g. "Gujarat Partners").
- **Expertise Tags** = the small tags on the profile card (comma-separated).
- Lower **Display Order** appears first.

### Where each field shows up on the website
| Admin field | Shown on |
|---|---|
| Roles, Page Section, Expertise Tags, Display Order | Leadership page |
| **Show on City Pages** (Mumbai, Gujarat, Bengaluru, Chennai, Delhi, Kolkata, Hyderabad, Global) | That city's partner cards (and its "Expert Partners" count) |
| **Sectors** | The matching sector page's "Meet Our ... Specialists" cards |
| Photo, Education, Location, Email, LinkedIn | Everywhere the person appears (Leadership, cities, sectors, service popups) |
| Status = Inactive | Hidden from every page, including the service popups |

Service popups keep their hand-picked partner lists per point; the details inside each card
(photo, qualifications, specialities, email, LinkedIn) come from the admin records.
Within a page, people appear in Display Order.

## Services, sub-services & sectors (Admin Panel → CONTENT → Services & Sectors)

- **Services tab:** pick a service (Assurance, Consulting, …) to edit its name and its sub-services
  (title + short description). Add, remove and re-order sub-services with the ▲ ▼ ✕ buttons, then **Save changes**.
  The service pages on the website show these sub-services (first half on the left, second half on the right).
- **Assign partners:** Leadership → edit a person → tick the service, then tick the sub-services they handle.
  Clicking a sub-service on the website opens the popup listing exactly the partners ticked for it.
- **Sectors tab:** add, rename, re-order or delete sectors. They appear as the "Sectors" checkboxes on the Leadership form.
- Renaming or deleting a service/sector updates the people tagged with it automatically.
- A brand-new *service* or *sector* shows up in the admin and Leadership form straight away, but it
  needs its own page on the website to be visible to visitors (the existing 7 service pages and 24 sector pages are already wired).

## 4. Check the website
Open `/about/leadership`. Changes show after a page refresh.

## 5. Deployment
Deploy backend, frontend and admin panel, then run `python seed_leadership.py`
once against the production database.
