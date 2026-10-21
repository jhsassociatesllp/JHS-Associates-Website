# ATS Resume Match – how it works

## For HR (Admin Panel → Careers)
1. **Post / edit a vacancy.** Fill the usual fields and, optionally, **ATS Keywords** (comma separated, e.g.
   `statutory audit, internal audit, Ind AS, GST, MS Excel`). Keywords you list count double. The role description is analysed
   automatically as well. Editing a vacancy re-scores its existing applications.
2. **Applications tab.** Every application with a vacancy gets an **ATS score (0–100)** when it is submitted.
   - **Top matches — 60% and above** are listed first (highest score first).
   - **Below 60%** follow, then **unreadable resumes** (scanned/image PDFs — review manually), then general applications.
   - Tick **Top matches only (60%+)** to hide the rest.
3. **View** an application to see the breakdown: keywords & skills (60), job title (10), experience (15),
   qualifications (10), ATS-readable format (5), the words found / not found, and any warnings. **Re-score** recalculates it.
4. Applications received before this feature show **Not scored** — click **Score N older applications** once.

## For candidates (website → Careers → apply)
After choosing a vacancy and uploading the PDF resume, **Check my resume match** shows the score, the matching
keywords and tips. It is guidance only; nothing is saved and the candidate can still submit.

## Scoring rules
| Part | Points | What is checked |
|---|---|---|
| Keywords & skills | 60 | recruiter keywords (×2) + important words/phrases from the description found in the resume |
| Job title | 10 | the title's words appear in the resume (more weight near the top) |
| Experience | 15 | years found in the resume vs the vacancy's requirement |
| Qualifications | 10 | CA / CS / CMA / MBA / B.Com … named in the vacancy found in the resume |
| Format | 5 | readable text, email, phone, clear sections |

A score of **60 or more** is a match.

## Security & privacy
- Scoring runs on our own server — resumes are never sent to an outside AI service.
- Uploads must be a real PDF (file signature is checked, not just the declared type), 8 MB max; file names are sanitised.
- PDF reading is limited (first 15 pages, text size cap, 15-second time limit, runs off the main thread); encrypted / corrupt /
  image-only PDFs are flagged for manual review instead of failing.
- The score is computed on the server — the browser cannot supply or change it.
- Keyword stuffing (the same words repeated unusually often) is detected, flagged and reduces the keyword score.
- The candidate pre-check requires sign-in and is limited to 10 checks per hour per user.
- Only HR / super-admin accounts can see scores or re-score.
