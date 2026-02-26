# ScholarScaffold — Summer 2026 Development Plan

## Goal
Bring ScholarScaffold from **proof of concept** to **IRB-ready for Fall 2026 deployment** with real student participants.

---

## Current State (as of February 2026)

- All 6 pipeline stages built and functional in UI
- Backend API deployed on Render (Starter plan, always on)
- Frontend deployed on Netlify (free tier)
- JWT authentication with bcrypt password hashing
- IRB consent gate enforced before any pipeline access
- Pipeline gating enforces correct stage progression
- IRB data logging endpoint exists (`/api/irb/log`, consent-gated)

### Known Gaps
- SQLite database resets on every backend redeploy (data loss)
- Some pipeline stage data doesn't reliably persist across sessions
- IRB logging not yet tested end-to-end
- No data export/anonymization for researchers
- No password reset flow
- No admin dashboard for researcher oversight

---

## Phase 1: Database Migration (Week 1)
**Priority: CRITICAL — nothing else matters without persistent data**

| Task | Details | Est. Time |
|------|---------|-----------|
| Provision PostgreSQL database | Use Render's managed PostgreSQL or Supabase free tier | 1 hour |
| Update `DATABASE_URL` env var on Render | Point backend to PostgreSQL instead of SQLite | 30 min |
| Run database migrations | Ensure all tables create correctly in PostgreSQL | 2 hours |
| Test data persistence | Create account, add data, redeploy, verify data survives | 2 hours |
| Update seed script | Ensure test users still get created on fresh database | 1 hour |

**Deliverable:** Student data survives backend redeploys and server restarts.

---

## Phase 2: Full Data Persistence (Weeks 2–3)
**Priority: CRITICAL — students will lose work without this**

| Task | Details | Est. Time |
|------|---------|-----------|
| Research Strategy — save/restore | Ensure topic, keywords, databases, search string persist to backend and reload on login | 4 hours |
| Design Literacy — save/restore | Persist quiz completion status and restore on session restore | 2 hours |
| Article Reviews — full round-trip | Verify articles and reviews save to backend and reload correctly on refresh | 4 hours |
| Annotated Bibliography — backend persistence | Ensure edited annotations save and reload | 3 hours |
| Proposal Builder — draft persistence | Verify draft save/load works across sessions, version history persists | 4 hours |
| Rubric Scoring — results persistence | Ensure rubric results load on return visits | 2 hours |
| Session restore — all stages | On JWT restore, fetch ALL user data (not just user profile) | 4 hours |

**Deliverable:** A student can log out, come back a week later, and all their work is exactly where they left it.

---

## Phase 3: IRB Data Logging (Week 3)
**Priority: HIGH — required for research data collection**

| Task | Details | Est. Time |
|------|---------|-----------|
| Audit IRB logging endpoint | Verify `/api/irb/log` correctly checks `consent_flag` before recording | 2 hours |
| Add logging calls to each stage | Log key interactions: stage entry, quiz attempts, review submissions, proposal saves, rubric scores | 4 hours |
| Verify consent gating | Test that users who declined consent generate NO log entries | 2 hours |
| Timestamp and session tracking | Ensure all log entries include UTC timestamp, user ID, and session ID | 2 hours |
| Log data schema documentation | Document exactly what data points are collected (needed for IRB application) | 2 hours |

**Deliverable:** When a consented student uses the app, all meaningful interactions are logged. When a non-consented student uses the app, zero data is logged.

---

## Phase 4: Researcher Data Export (Week 4)
**Priority: HIGH — you need to analyze the data you collect**

| Task | Details | Est. Time |
|------|---------|-----------|
| Admin authentication | Create a researcher/admin role that can access export tools | 3 hours |
| Export IRB logs as CSV | Endpoint to download all consent-gated interaction logs | 3 hours |
| Export user progress as CSV | Endpoint to download anonymized pipeline completion data | 3 hours |
| Anonymization | Strip or hash personally identifiable information (email, name) in exports | 2 hours |
| Export documentation | Document what each field means for your research analysis | 2 hours |

**Deliverable:** You can download a CSV of anonymized research data for analysis.

---

## Phase 5: Security & Reliability (Week 5)
**Priority: MEDIUM — important for real students but not blocking IRB approval**

| Task | Details | Est. Time |
|------|---------|-----------|
| Password reset flow | "Forgot password" with email link (or temporary code) | 4 hours |
| Rate limiting | Prevent brute-force login attempts | 2 hours |
| Input validation hardening | Server-side validation on all endpoints | 3 hours |
| Error handling review | Ensure no unhandled errors crash the server | 2 hours |
| HTTPS verification | Confirm all traffic is encrypted end-to-end | 1 hour |
| Session expiration | Auto-logout after reasonable inactivity period | 2 hours |

**Deliverable:** The app is secure enough for real student data.

---

## Phase 6: Pilot Test (Weeks 6–7)
**Priority: HIGH — catch problems before 30+ students hit them**

| Task | Details | Est. Time |
|------|---------|-----------|
| Recruit 3–5 pilot testers | Colleagues, TAs, or willing students | — |
| Create pilot test script | Step-by-step instructions for testers to complete the full pipeline | 2 hours |
| Collect feedback | Usability issues, confusing wording, bugs | — |
| Fix critical issues | Address anything that would block a real student | 1 week |
| Document known limitations | For IRB application and student onboarding | 2 hours |

**Deliverable:** Confidence that the app works for real users in a real setting.

---

## Phase 7: Final Polish (Week 8)
**Priority: MEDIUM — quality of life improvements**

| Task | Details | Est. Time |
|------|---------|-----------|
| Onboarding/help text | First-time user guidance in each stage | 3 hours |
| Mobile responsiveness | Ensure the app works on tablets (students may use them) | 4 hours |
| Print/export bibliography | Students should be able to export their annotated bibliography | 3 hours |
| Print/export proposal | Students should be able to export their proposal draft | 3 hours |

**Deliverable:** A polished, student-ready application.

---

## Timeline Summary

| Phase | Weeks | Focus |
|-------|-------|-------|
| 1 — Database Migration | Week 1 | PostgreSQL setup |
| 2 — Data Persistence | Weeks 2–3 | All stages save/restore reliably |
| 3 — IRB Logging | Week 3 | Consent-gated data collection |
| 4 — Data Export | Week 4 | Researcher CSV downloads |
| 5 — Security | Week 5 | Hardening for real users |
| 6 — Pilot Test | Weeks 6–7 | Real user testing and fixes |
| 7 — Final Polish | Week 8 | UX improvements and export features |

**Total: ~8 weeks at part-time pace (10–15 hours/week)**
**Or ~4 weeks at full-time pace**

---

## For Your IRB Application

You can reference this plan to show the IRB committee that:
1. The platform exists and is functional (include the live URL)
2. A concrete development plan addresses all data integrity and security requirements
3. Consent gating is already implemented and will be verified before deployment
4. A pilot test is planned before any participant data collection begins
5. Data export and anonymization procedures are planned

---

## Monthly Cost During Development & Deployment

| Service | Cost |
|---------|------|
| Render backend (Starter) | $7/month |
| Render PostgreSQL (Starter) | $7/month (when added) |
| Netlify frontend | $0/month |
| GitHub | $0/month |
| **Total** | **$7–14/month** |
