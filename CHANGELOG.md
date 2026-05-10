# ScholarScaffold — Changelog

All notable changes to this project are documented here.
Format: `[version] — date — description`

---

## [0.5.2] — 2026-05-10

### IRB Consent Form — Compliance Gaps Patched + DOCX for IRB Submission

Patched five missing elements in the in-app consent form to align with Common Rule requirements, and generated a Word document version of the consent form for the IRB application package.

**Changes to `ConsentModal.tsx`:**
- Updated crisis hotline from retired "National Suicide Prevention Lifeline / 1-800-273-8255" to current "988 Suicide and Crisis Lifeline / call or text 988"
- Added research data retention language: data retained 3 years post-publication then securely destroyed
- Added withdrawal data removal: participants may request their data excluded upon written/emailed request to PI
- Added PI right to discontinue: standard language about researcher's right to stop a participant's involvement
- Added confidentiality caveat: "absolute confidentiality cannot be guaranteed" (required Common Rule language)

**New files:**
- `IRB_Consent_Form_ScholarScaffold.docx` — full consent form formatted for IRB submission, includes paper signature block
- `scripts/generate_consent_docx.py` — script that regenerates the DOCX from source if content changes

**Files changed:**
- `scholar-scaffold/src/components/common/ConsentModal.tsx`
- `scripts/generate_consent_docx.py` (new)
- `IRB_Consent_Form_ScholarScaffold.docx` (new)

---

## [0.5.1] — 2026-04-25

### Consent Screen — Full IRB Information Sheet

Replaced the abbreviated consent language with the complete Study Information Sheet from `ScholarScaffold_IRB_InfoSheet.docx` (Expedited Category 7), verbatim across all 12 sections.

- Sections 1–11 render in the scrollable body
- Section 12 (Online Consent Statement) renders as a 5-bullet list in the sticky footer, immediately above the YES/NO buttons
- Added "Print or save a copy" button (calls `window.print()`) for IRB compliance — participants are entitled to retain a copy
- Contact cards in Section 11 display PI, Co-I, and IRB Chair with correct office name (Office of Sponsored Programs and Research)
- Phone numbers for PI and Co-I remain as `[Phone]` placeholder — must be filled in before going live

**Files changed:**
- `scholar-scaffold/src/components/common/ConsentModal.tsx`

---

## [0.5.0] — 2026-04-25

### IRB-Compliant Consent Screen — Full Rebuild

Replaced the placeholder consent modal with a full IRB-approved consent screen. The new screen displays the complete Towson University IRB consent language verbatim and stores a structured consent record in a dedicated database table.

**UI changes:**
- `ConsentModal.tsx` rewritten: scrollable content area with sticky footer — consent statement and YES/NO buttons always visible at the bottom regardless of scroll position. Mobile-responsive with stacked buttons on small screens.
- `ConsentPage.tsx` updated: NO path now shows a brief confirmation screen ("full access to ScholarScaffold as a course tool, not enrolled in research dataset") before forwarding to dashboard. YES path navigates directly to dashboard.

**Data changes:**
- New `consent_records` table with fields: `user_id`, `consented` (boolean), `consent_timestamp`, `platform_version`. Created automatically on next deploy via `db.create_all()`.
- Consent endpoint (`POST /api/auth/consent`) now writes a `ConsentRecord` row in addition to updating `users.consent_flag`. `platform_version` sent from frontend via `PLATFORM_VERSION` constant in `pilotConfig.ts`.
- `users.consent_flag` preserved — still used by `ConsentGate` to enforce the one-time-only routing rule.
- No research data collected or stored for users where `consented = false` (enforced at `backend/routes/irb.py`).

**Files changed:**
- `backend/models/consent_record.py` (new)
- `backend/models/__init__.py`
- `backend/routes/auth.py`
- `scholar-scaffold/src/config/pilotConfig.ts`
- `scholar-scaffold/src/services/api.ts`
- `scholar-scaffold/src/components/common/ConsentModal.tsx`
- `scholar-scaffold/src/pages/ConsentPage.tsx`

---

## [0.4.0] — 2026-04-08

### IRB Research Logging — Full Wiring
- Wired `stage_enter` event logging on mount in all 5 pipeline pages (ResearchStrategyPage, DesignLiteracyPage, ArticleReviewPage, BibliographyPage, ProposalPage)
- Wired 5 completion events: `search_strategy_complete`, `design_literacy_complete`, `article_review_complete`, `proposal_draft_saved`, `rubric_submitted`
- `article_review_complete` payload includes: articleId, inclusionDecision, relevanceScore, evidenceStrengthScore, argumentContributionScore, designStrengthRating
- All logging calls are fire-and-forget — never blocks the user
- Stage-entry + stage-completion pair enables elapsed time calculation per stage (time-on-task)
- Added `CLAUDE.md` with standing instruction to auto-build admin data export when data collection begins
- Updated presentation docs (01, 02, 04) to reflect R1-level features and correct cold-start note

**Files changed:**
- `scholar-scaffold/src/pages/ResearchStrategyPage.tsx`
- `scholar-scaffold/src/pages/DesignLiteracyPage.tsx`
- `scholar-scaffold/src/pages/ArticleReviewPage.tsx`
- `scholar-scaffold/src/pages/BibliographyPage.tsx`
- `scholar-scaffold/src/pages/ProposalPage.tsx`
- `presentation/01_Executive_Overview.md`
- `presentation/02_Demo_Script.md`
- `presentation/04_One_Page_Handout.md`
- `CLAUDE.md` (new)

---

## [0.3.0] — 2026-04-07

### R1-Level Proposal Builder + Research Question Formulation

#### Proposal Builder — Full Rebuild
- Expanded from 7 to 9 sections: added Theoretical/Conceptual Framework and Proposed Methodology
- Both R1-level sections highlighted with badge and distinct border styling
- Per-section coaching prompts (3–5 specific, actionable prompts per section)
- Literature Synthesis section explicitly coaches theme-based synthesis (not article-by-article)
- Proposed Methodology coaches on design rationale, sampling, instruments, analysis, validity
- Live word count per section
- Draft loads from server on mount — pre-populates all fields from saved draft
- If no draft exists but Research Strategy has a research question, pre-populates Section 4
- `saveStatus`: idle / saved / error with 3-second auto-clear on success
- "Insert from Review Notes" modal expanded to 6 fields: research question, key findings, significance, intended use, biggest limitation, applicability to scope
- Save as New Version button for real version tracking

#### Research Strategy — Research Question Step
- Added Step 2: research question formulation between Topic Definition and Keyword Builder
- PICO, PEO, General Relationship, and Descriptive/Exploratory framework templates shown
- Quick-fill buttons auto-populate templates with student's population
- Real-time coaching: checks for question mark, specificity (>40 chars), population mention
- Research question saved to backend and carried forward into Proposal Builder Section 4

#### Backend — New DB Columns
- `search_strategies.research_question` column added via `migrate.py`
- `proposal_drafts.theoretical_framework` column added via `migrate.py`
- `proposal_drafts.proposed_methodology` column added via `migrate.py`
- `migrate.py` added to `build.sh` so columns deploy automatically on Render

#### Rubric Engine Updates
- `score_structural_completeness`: updated to score across 9 sections (was 7)
- `score_methodological_awareness`: added `methodology` parameter, bonus score for dedicated methodology section >100 chars
- `score_proposal`: passes theoreticalFramework and proposedMethodology to scoring functions

**Files changed:**
- `scholar-scaffold/src/pages/ProposalPage.tsx` (complete rewrite)
- `scholar-scaffold/src/pages/ResearchStrategyPage.tsx`
- `scholar-scaffold/src/types/index.ts`
- `backend/models/proposal_draft.py`
- `backend/models/search_strategy.py`
- `backend/routes/proposal.py`
- `backend/routes/research_strategy.py`
- `backend/services/rubric_engine.py`
- `backend/migrate.py` (new)
- `backend/build.sh`

---

## [0.2.0] — 2026-03-15

### Pilot Feedback Fixes + Data Persistence + Reviewer Fixes

#### Pilot Tester Feedback
- ArticleListPage: clarified guidance steps — made clear that steps follow after clicking "Add New Article"
- AddArticlePage: added DOI import via CrossRef public API (no auth required) — auto-fills title, authors, year, journal
- ArticleReviewPage: added "Not specified (not clearly stated in article)" as first option in Study Design dropdown
- ArticleReviewPage: added "Not specified" placeholder guidance on Sample and Limitations fields
- ArticleListPage: added delete button (Trash2) with confirmation dialog per article row
- ArticleListPage: added edit button (Pencil) linking to `/articles/:id/edit`
- AddArticlePage: supports both create mode (`/articles/new`) and edit mode (`/articles/:id/edit`)
- App.tsx: added `/articles/:id/edit` route

#### Reviewer Feedback (Dr. Marsha Davenport)
- Sidebar: changed label from "Bibliography" to "Annotated Bibliography"
- LoginPage: added cold-start note — "First sign-in may take up to 30 seconds while the server starts up"

#### Critical Data Persistence Bug Fix
- All pipeline stages were updating only local React state — never calling backend APIs
- Fixed: ResearchStrategyPage now calls `saveSearchStrategy` and `markStrategyComplete` on complete
- Fixed: DesignLiteracyPage now calls `saveQuizResult` on submit
- Fixed: ArticleReviewPage now calls `saveArticleReview` on submit
- Fixed: BibliographyPage now calls `updateAnnotation` on save (was only calling `setEditingId(null)`)
- Added `deleteArticle` API function and `UserContext` implementation
- Added `apiCreateArticle` call in AddArticlePage create mode
- Added `apiUpdateArticle` call in AddArticlePage edit mode

#### ArticleReviewPage
- Added "Edit Article Info" link (Pencil icon) in article metadata card
- Added `submitting` and `submitError` states
- Coaching skip: `expectedRange` is undefined when studyDesign is "Not specified"

**Files changed:**
- `scholar-scaffold/src/pages/ArticleListPage.tsx`
- `scholar-scaffold/src/pages/AddArticlePage.tsx` (complete rewrite)
- `scholar-scaffold/src/pages/ArticleReviewPage.tsx`
- `scholar-scaffold/src/pages/BibliographyPage.tsx`
- `scholar-scaffold/src/pages/LoginPage.tsx`
- `scholar-scaffold/src/components/layout/Sidebar.tsx`
- `scholar-scaffold/src/services/api.ts`
- `scholar-scaffold/src/context/UserContext.tsx`
- `scholar-scaffold/src/App.tsx`
- `backend/routes/articles.py` (added DELETE endpoint)

---

## [0.1.0] — 2026-02-01

### Initial Proof of Concept — All 6 Pipeline Stages

#### Frontend (React + TypeScript + Tailwind CSS)
- Login, Register, Consent pages
- Dashboard with pipeline progress visualization and stage locking
- Research Strategy Coach (4 steps: topic, keywords, databases, search string)
- Research Design Literacy Module with tabbed content and quiz
- Article Review List page with progress tracker
- Add New Article page (manual entry)
- Article Review Builder — Sections A, B, C (structured summary, evidence evaluation, inclusion decision)
- Annotated Bibliography — auto-generated from included articles, editable, APA format
- Proposal Builder — 7 sections, insert-from-annotation, scope coaching, version history
- Rubric Scoring page — 7-dimension scores, narrative feedback, priority fixes, revision roadmap
- Sidebar navigation with stage status badges
- GuidanceBanner component with dismissible step-by-step instructions
- SectionAlert component (info, warning, coaching types)
- LockedStage component with progress requirements display
- Pipeline gating: Design Literacy required before Article Reviews; 10 reviews + distribution required before Proposal

#### Backend (Python + Flask + SQLAlchemy)
- User authentication with JWT and bcrypt
- Models: User, Article, ArticleReview, Annotation, SearchStrategy, QuizResult, ProposalDraft, RubricResult, IrbLog
- Routes: auth, articles, research_strategy, design_literacy, proposal, rubric, irb
- Rule-based rubric scoring engine across 7 dimensions (1–4 scale)
- IRB logging endpoint (consent-gated, accepts any eventType)
- Seed script with 2 test users
- SQLite for local dev, PostgreSQL-ready

#### Deployment
- Frontend: Netlify (manual deploy from `dist/`)
- Backend: Render (auto-deploys from GitHub `main`)
- Live URL: https://dashing-torrone-78de6c.netlify.app
