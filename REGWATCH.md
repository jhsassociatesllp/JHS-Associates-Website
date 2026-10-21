# Reg-Watch

Regulatory circulars and notifications (SEBI, RBI, MCA, GST, Income Tax, FEMA, IRDAI) uploaded from the admin panel.

## Admin: Admin Panel -> CONTENT -> Reg-Watch
1. **+ New Update** - title, short summary, regulator, circular date, optional reference no., status, the **PDF** (required, max 10 MB) and an optional cover image (max 5 MB).
2. **Published** updates are public; **Draft** is hidden. Use Unpublish / Publish to switch.
3. **View PDF** previews the file (drafts too). Edit lets you replace the PDF / image. Delete removes the update and its files.

## Website
- Navbar -> Insights -> **Reg-Watch** (`/reg-watch`), with a filter by regulator.
- The **newest published** update is featured as a card in the home page hero carousel.
- Reading / downloading the PDF needs a site sign-in (same rule as White Papers); each download is logged.

## Security
- Only Admin / Super Admin can create, edit, delete or preview drafts.
- Real PDFs only (file signature checked), size limits, images re-encoded to WebP.
- Files are only served when they belong to a published update.

Files are stored in the `reg_watch_files` collection (not GridFS).
