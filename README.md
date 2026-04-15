# ScholarScaffold

**An AI-guided research literacy and scholarly proposal development platform for health professions students.**

Built to support Towson University's R2 → R1 Carnegie research classification mission by building a pipeline of students and emerging faculty capable of producing rigorous, publishable-quality research.

---

## Try It Now

**Live Demo:** https://dashing-torrone-78de6c.netlify.app

> First sign-in may take up to 30 seconds while the server wakes up. Subsequent actions are fast.

| Account | Email | Password | Notes |
|---------|-------|----------|-------|
| Demo student | student@university.edu | password123 | Pre-completed stages — see the full pipeline |
| Fresh start | test@university.edu | password123 | Blank account — experience the full flow |

---

## The Problem

Health professions students consistently struggle with foundational research skills:

- Cannot distinguish research design from analytic method
- Summarize findings instead of synthesizing across sources
- Skip or rush the literature review and jump straight to writing
- Experience scope drift — proposals lose focus across drafts
- Don't know what to revise after receiving feedback

These gaps persist across undergraduate and early graduate programs, resulting in weak proposals that fail to demonstrate scholarly competence.

---

## The Solution

ScholarScaffold enforces a structured **6-stage pipeline** — the same process an experienced research mentor would teach, built into the software. Each stage must be completed before the next unlocks. No skipping ahead.

```
Research Strategy → Design Literacy → Article Reviews (×10) → Bibliography → Proposal → Rubric Scoring
```

### Stage 1 — Research Strategy Coach
Students formulate a research question using PICO, PEO, or general research frameworks, then build systematic database search strings with Boolean operators and filter recommendations for PubMed, CINAHL, PsycINFO, and other health sciences databases.

### Stage 2 — Research Design Literacy Module
Before reviewing any articles, students must demonstrate understanding of quantitative designs (RCT, Cohort, Case-Control), qualitative designs (Phenomenology, Grounded Theory), and evidence synthesis methods (Systematic Review, Meta-Analysis). A quiz is required to proceed.

### Stage 3 — Article Reviews (10 Required)
Each review follows a structured 3-section format:
- **Structured Summary** — research question, design, sample, key findings
- **Evidence Evaluation** — design strength rating, validity issues, minimum 3 limitations
- **Inclusion Decision** — scored on relevance, evidence strength, and argument contribution, with required written justification

Distribution requirement: minimum 5 included, minimum 2 excluded.

### Stage 4 — Annotated Bibliography
Auto-generated from included articles in APA format, with summary, critical evaluation, and relevance paragraphs drawn from the student's own review work.

### Stage 5 — Proposal Builder
Unlocks only after 10 reviews with proper distribution. Nine sections including **Theoretical/Conceptual Framework** and **Proposed Methodology** — R1-level outputs designed to groom students and emerging faculty for graduate and grant-writing expectations. Features per-section coaching prompts, insert-from-annotation, live word count, and version history.

### Stage 6 — Rubric Scoring & Revision Engine
Scores proposals across 7 dimensions (1–4 scale): Thesis Clarity, Scope Precision, Evidence Integration, Synthesis Depth, Methodological Awareness, Structural Completeness, and Citation Presence. Generates narrative feedback, top 3 priority fixes, and a revision roadmap. Draft 1 vs Draft 2 comparison shows measurable improvement.

---

## Why It Works

| Student Problem | ScholarScaffold Solution |
|----------------|-------------------------|
| Can't tell research designs apart | Mandatory literacy module with quiz — gated before article reviews |
| Summarizes instead of synthesizes | Structured review forces critique depth and critical evaluation |
| Skips literature review, jumps to writing | Proposal locked until 10 reviews + distribution requirement met |
| No idea what to revise | Rubric scores + top 3 priority fixes + ordered revision roadmap |
| No measurable learning outcome | Draft 1 vs Draft 2 rubric score comparison |

---

## Primary Success Metric

**Measurable improvement in rubric score from Draft 1 to Draft 2.**

Secondary metrics: completion rate of 10 article reviews, proper inclusion/exclusion discrimination, research design identification accuracy, time-on-task, and revision engagement.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Routing | React Router v6 |
| State | React Context + useState |
| Backend | Python 3 + Flask 3.0 + SQLAlchemy |
| Auth | PyJWT + bcrypt |
| Database | SQLite (dev) / PostgreSQL (production) |
| Frontend Host | Netlify |
| Backend Host | Render |

---

## Repository Structure

```
ScholarScaffold/
├── scholar-scaffold/          # Frontend (React + TypeScript)
│   └── src/
│       ├── pages/             # 12 page components
│       ├── components/        # Reusable UI components
│       ├── context/           # Auth state + session management
│       ├── services/api.ts    # All API calls (centralized)
│       └── types/             # TypeScript interfaces
│
├── backend/                   # Backend (Python + Flask)
│   ├── models/                # 9 SQLAlchemy models
│   ├── routes/                # 8 API blueprint modules
│   └── services/              # Rubric scoring engine
│
├── presentation/              # Stakeholder documents
│   ├── 01_Executive_Overview.md
│   ├── 02_Demo_Script.md
│   ├── 03_Technical_Architecture.md
│   └── 04_One_Page_Handout.md
│
├── PRD.md                     # Product Requirements Document
├── CHANGELOG.md               # Version history
├── DEPLOYMENT.md              # Deployment reference
└── SUMMER_DEV_PLAN.md         # Roadmap to IRB-ready deployment
```

---

## Current Status

| Component | Status |
|-----------|--------|
| Frontend (React + TypeScript + Tailwind) | Complete and deployed |
| Backend (Python + Flask + SQLAlchemy) | Complete and deployed |
| User authentication (JWT + bcrypt) | Working |
| All 6 pipeline stages | Functional |
| Pipeline gate logic (stage locking) | Working |
| IRB-compatible consent logging | Working |
| Pilot testing (2 reviewers) | Complete |

**Known gaps being addressed:** PostgreSQL migration (SQLite resets on redeploy), password reset flow, mobile layout on small screens.

See [SUMMER_DEV_PLAN.md](SUMMER_DEV_PLAN.md) for the full roadmap to IRB-ready deployment.

---

## IRB Compatibility

ScholarScaffold is designed with IRB-compliant data collection:
- Consent gate required before any research data logging
- Non-consented users generate zero log entries
- Collected data: review count, inclusion/exclusion ratio, design identification accuracy, draft versions, rubric score improvement, time-on-task, revision engagement
- No grading decisions occur inside the system

---

## For Stakeholders

See the [`presentation/`](presentation/) folder for:
- [Executive Overview](presentation/01_Executive_Overview.md) — problem, solution, and current status
- [Demo Script](presentation/02_Demo_Script.md) — guided walkthrough of the live app
- [Technical Architecture](presentation/03_Technical_Architecture.md) — system design, API reference, database schema
- [One-Page Summary](presentation/04_One_Page_Handout.md) — printable overview

---

## Contact

**Dr. Wendy Whitner, PhD, MPH, LSSBB**
College of Health Professions, Towson University
wendy@wendstormxr.com
