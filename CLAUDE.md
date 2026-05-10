# ScholarScaffold — Claude Code Instructions

## Project Overview
ScholarScaffold is a research literacy and proposal development app for health professions students at Towson University. The goal is to support the university's R2→R1 Carnegie classification mission by grooming students and emerging faculty in rigorous research skills.

**Frontend:** React + TypeScript + Tailwind CSS → deployed on Netlify
**Backend:** Python + Flask + SQLAlchemy → deployed on Render (free tier, cold-start delay ~30s)
**Database:** PostgreSQL (production), SQLite (local dev)
**Auth:** JWT stored in localStorage
**Repo:** https://github.com/wendymarquette68/ScholarScaffold
**Live URL:** https://scholarscaffold.netlify.app

---

## Git — STANDING INSTRUCTION

After completing any set of changes, commit and push to GitHub automatically. No need to ask first.
- Stage only the files that were changed (never `git add -A` blindly)
- Write a clear, concise commit message describing what changed and why
- Push to the current branch (`git push`)

---

## Changelog — STANDING INSTRUCTION

After completing any set of changes in a session, update `CHANGELOG.md` with a new version entry. Include:
- Version number (increment patch for fixes, minor for features)
- Date
- What changed and why
- Files affected

---

## IRB Research Data Export — STANDING INSTRUCTION

When Wendy says any of the following:
- "collect the research data"
- "export the IRB data"
- "download participant data"
- "it's time to pull the data"
- or anything similar about extracting study data

**Automatically do the following without waiting to be asked:**

1. Build a protected admin export endpoint in `backend/routes/admin_export.py`
   - Route: `GET /admin/export/irb`
   - Protected by a hardcoded admin token (prompt Wendy to set one as a Render environment variable `ADMIN_EXPORT_TOKEN`)
   - Returns all IRB log data joined with user consent status as CSV
   - Only includes users where `consent_flag = true`
   - Columns: user_id, email (anonymizable), event_type, payload (expanded), created_at

2. Build a Python download script at `scripts/download_irb_data.py`
   - Accepts the admin token and backend URL as arguments
   - Saves output as `irb_export_YYYY-MM-DD.csv` in the current directory
   - Prints a summary: how many users, how many events, date range

3. Register the new blueprint in `backend/app.py`

4. Remind Wendy to set `ADMIN_EXPORT_TOKEN` in Render environment variables before deploying

5. After the endpoint is built and deployed, Wendy can run:
   ```
   python scripts/download_irb_data.py --token YOUR_TOKEN --url https://scholarscaffold.onrender.com
   ```

---

## Key Architectural Notes

- **Data persistence pattern:** Every page must call the API *and* update local React context state. Never update only one side.
- **New DB columns:** Add to `backend/migrate.py` using try/except ALTER TABLE — never rely on Flask-Migrate CLI on Render.
- **IRB logging:** All events are fire-and-forget (`logResearchData` in api.ts). Never await them in a way that blocks UX.
- **Pilot mode:** `VITE_PILOT_MODE=true` in `.env.pilot`. Pilot config lives in `scholar-scaffold/src/config/pilotConfig.ts`.
- **Review thresholds:** Controlled in `pilotConfig.ts` — do not hardcode elsewhere.
- **preliminary_questions** DB column stores "Limitations & Future Directions" content (name mismatch from original design — data is correct, column name is legacy).

---

## Pending Work (as of April 2026)

- [ ] Admin data export endpoint (build when data collection begins)
- [ ] Enforce Research Strategy as prerequisite for Design Literacy (Dr. Davenport recommendation)
- [ ] Pre-loaded demo/seed articles for new testers
- [ ] Mobile layout fix (sidebar breaks on small screens)
- [ ] Password reset functionality
