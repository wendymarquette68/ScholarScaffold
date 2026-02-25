# ScholarScaffold — Frontend Build Plan (Phase 1)

## Project Overview

**App Name:** ScholarScaffold  
**Purpose:** An AI-guided research literacy and scholarly proposal development platform for health professions students.  
**Primary User:** Undergraduate and early graduate students in the College of Health Professions.  
**Primary Success Metric:** Improvement in proposal rubric score from Draft 1 to Draft 2.

---

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Python + Flask (scaffold placeholder fetch functions only in Phase 1)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Services file:** `src/services/api.ts` — all backend calls go here as placeholder fetch functions

---

## Critical Workflow Rules (Must Be Enforced in UI)

These are non-negotiable gates. The UI must enforce all of them:

1. **Research Design Literacy Module must be completed before Article Reviews unlock.**
2. **Proposal Builder is locked until ALL of the following are true:**
   - 10 Article Reviews are completed
   - Minimum 5 articles marked "Include"
   - Minimum 2 articles marked "Exclude"
3. **Annotated Bibliography only displays articles marked "Include."**
4. **Consent modal appears once at first login — choice is saved to user profile.**
5. **Progress tracker is visible throughout: "X of 10 Reviews Completed"**

---

## Pages to Build

### 1. `/login` — Login Page
- Email + password login form
- Link to register
- Supabase Auth placeholder
- On successful login → redirect to `/consent` if first login, else `/dashboard`

### 2. `/consent` — Research Consent Page
- Shown **once** at first login only
- Explains what data will be collected for IRB research study
- Two clear buttons: **"I Consent"** and **"I Do Not Consent"**
- Both choices save a `consent_flag` (true/false) to user profile
- Both redirect to `/dashboard` after choice is made
- Note: App experience is **identical** regardless of consent choice

### 3. `/dashboard` — Main Dashboard
- Welcome message with student name
- Pipeline progress visualization showing all 6 stages:
  - Research Strategy Coach
  - Research Design Literacy Module
  - Article Reviews (X of 10)
  - Annotated Bibliography
  - Proposal Builder (locked icon if not unlocked)
  - Rubric Scoring & Revision
- Each stage shows: Not Started / In Progress / Complete status
- Locked stages display a padlock icon with unlock requirement tooltip
- Quick stats bar: Reviews completed, Included articles, Excluded articles

### 4. `/research-strategy` — Research Strategy Coach
- **Step 1: Topic Input**
  - Text field: "What is your research topic?"
  - Text field: "Who is your population?"
  - Alert if population field is vague (placeholder logic)
- **Step 2: Keyword Builder**
  - Display generated keyword suggestions based on topic
  - Allow student to add/remove keywords
  - Boolean operator selector (AND, OR, NOT)
  - Filter recommendations (date range, peer-reviewed, etc.)
- **Step 3: Database Suggestions**
  - Display recommended databases (PubMed, CINAHL, PsycINFO, etc.)
  - Short description of each
- **Step 4: Search String Generator**
  - Assembles keywords + operators into a copy-ready search string
  - "Copy to Clipboard" button
- Mark stage complete button → updates dashboard progress

### 5. `/design-literacy` — Research Design Literacy Module
- **REQUIRED before Article Reviews unlock**
- Tabbed or accordion layout covering:
  - **Quantitative Designs:** RCT, Cohort, Case-Control, Cross-Sectional, Descriptive
  - **Qualitative Designs:** Phenomenology, Grounded Theory, Case Study, Ethnography
  - **Evidence Synthesis:** Systematic Review, Meta-Analysis
  - **Analytic Strategies:** Manual coding, Intercoder reliability, CAQDAS, Computational bias mitigation, Frequency analysis, Algorithmic triangulation
- Each design includes:
  - Plain-language explanation
  - When it is used
  - Strength in evidence hierarchy
- **Evidence Hierarchy Visualization** — pyramid graphic showing levels of evidence
- **Interactive Quiz** (minimum 5 questions):
  - Given a description, identify the research design
  - Immediate feedback on each answer
  - Distinguish design vs. analytic method questions included
  - Score tracked
- Module marked complete only after quiz is passed (placeholder: score >= 70%)
- Completion unlocks Article Reviews on dashboard

### 6. `/articles` — Article Review List Page
- Shows all added articles with status badges (Included / Excluded / In Progress)
- Progress tracker: **"X of 10 Reviews Completed"** prominently displayed
- Distribution tracker: "Included: X | Excluded: X" (minimums shown)
- **"Add New Article"** button → goes to `/articles/new`
- Click any article → goes to `/articles/:id`
- Lock message shown if Design Literacy Module not complete

### 7. `/articles/new` — Add New Article
- Input fields:
  - Article title
  - Authors
  - Year of publication
  - Journal name
  - DOI or URL
  - Abstract (text area)
- Save → creates article record → redirects to `/articles/:id` to begin review

### 8. `/articles/:id` — Article Review Builder
Three-section guided workflow:

**Section A: Structured Summary**
- Research question (text area)
- Study design (dropdown: list all designs from Design Literacy Module)
- Sample description (text area)
- Key findings (text area)
- Significance (text area)

**Section B: Evidence Evaluation**
- Design strength rating (1–5 scale with labels)
- Internal validity issues (text area)
- External validity issues (text area)
- Limitations — minimum 3 required (dynamic add field, enforces minimum before allowing next section)
- Applicability to scope (text area)

**Section C: Inclusion Decision Engine**
- Three scored dimensions (1–5 sliders or dropdowns):
  - Relevance to topic
  - Evidence strength
  - Argument contribution
- Required reflection fields:
  - "Why are you including or excluding this article?" (text area, required)
  - "What is the biggest limitation of this study?" (text area, required)
  - "How do you intend to use this article in your proposal?" (text area, required)
- Final decision: **Include** or **Exclude** (radio button, required)
- Submit Review button

**Validation Rules:**
- Cannot submit without all required fields complete
- Cannot submit with fewer than 3 limitations
- Cannot submit without inclusion decision
- On submit: review marked complete, progress tracker updates

### 9. `/bibliography` — Annotated Bibliography Generator
- **Only shows articles marked "Include"**
- For each included article, display:
  - APA citation (auto-assembled from article metadata)
  - Summary paragraph (pulled from Structured Summary section of review)
  - Critical evaluation paragraph (pulled from Evidence Evaluation section)
  - Relevance paragraph (pulled from Inclusion Decision reflection)
- Edit button per annotation to refine text
- APA formatting reminders shown inline
- Flag displayed if any annotation section appears too short
- Export as text button (placeholder)

### 10. `/proposal` — Proposal Builder
- **LOCKED until:** 10 reviews complete + 5 Include + 2 Exclude minimums met
- If locked: show locked state with checklist of what still needs to be completed
- If unlocked: full proposal editor with sections:
  - Title
  - Background
  - Problem Statement
  - Purpose / Research Question
  - Literature Synthesis
  - Significance
  - Preliminary Questions
- **Features per section:**
  - "Insert from Annotation" button — opens modal to select and pull text from bibliography
  - Scope guardrail alerts: "Is this population consistent with your research question?"
  - Citation reminders: "Does this claim have a citation?"
  - Inline coaching prompts: "Are you interpreting or summarizing?"
- Version history panel (Draft 1, Draft 2, etc.)
- Save Draft button
- Submit for Rubric Evaluation button → goes to `/rubric`

### 11. `/rubric` — Rubric Scoring + Revision Engine
- Displays rubric evaluation results across 7 dimensions:
  - Thesis clarity
  - Scope precision
  - Evidence integration
  - Synthesis depth
  - Methodological awareness
  - Structural completeness
  - Citation presence
- Each dimension shows:
  - Score (1–4 scale)
  - Narrative feedback
- **Top 3 Priority Fixes** highlighted prominently
- **Revision Roadmap** — ordered list of recommended changes
- **Draft Comparison View** — side-by-side if Draft 2 exists (score changes highlighted)
- "Return to Proposal" button to begin revisions

---

## Component Library to Build

```
src/
  components/
    layout/
      Navbar.tsx
      Sidebar.tsx
      PageWrapper.tsx
    common/
      ProgressTracker.tsx        # "X of 10 Reviews Completed"
      PipelineStatus.tsx         # Dashboard stage progress visualization
      LockedStage.tsx            # Padlock UI with unlock tooltip
      StageStatusBadge.tsx       # Not Started / In Progress / Complete
      ConsentModal.tsx           # First login consent capture
      SectionAlert.tsx           # Scope drift / coaching alerts
    articles/
      ArticleCard.tsx            # Article list item with status badge
      ReviewSectionA.tsx         # Structured Summary form
      ReviewSectionB.tsx         # Evidence Evaluation form
      ReviewSectionC.tsx         # Inclusion Decision Engine
      LimitationsField.tsx       # Dynamic add field with minimum enforcement
    bibliography/
      AnnotationCard.tsx         # Single annotation display + edit
    proposal/
      ProposalSection.tsx        # Individual proposal section editor
      InsertFromAnnotation.tsx   # Modal to pull from bibliography
      InlineCoachingAlert.tsx    # Coaching prompts within editor
    rubric/
      RubricScoreCard.tsx        # Single dimension score + feedback
      RevisionRoadmap.tsx        # Priority fixes list
      DraftComparison.tsx        # Side-by-side draft view
    design-literacy/
      DesignCard.tsx             # Single research design explanation
      EvidenceHierarchy.tsx      # Pyramid visualization
      QuizQuestion.tsx           # Interactive quiz item
```

---

## Services (Placeholder Fetch Functions in `src/services/api.ts`)

Build these as placeholder functions that return mock data. Each will later connect to the Flask backend:

```typescript
// Auth
loginUser(email, password)
registerUser(email, password)
saveConsentFlag(userId, consent: boolean)

// Research Strategy
saveSearchStrategy(userId, topicData)
getSearchStrategy(userId)

// Design Literacy
saveQuizResult(userId, score, responses)
getModuleCompletionStatus(userId)

// Articles
getArticles(userId)
getArticleById(articleId)
createArticle(userId, articleData)
saveArticleReview(articleId, reviewData)
getReviewProgress(userId)  // returns { total, included, excluded }

// Bibliography
getBibliography(userId)  // only included articles
updateAnnotation(articleId, annotationData)

// Proposal
getProposalDrafts(userId)
saveProposalDraft(userId, draftData)
getProposalVersion(userId, versionNumber)

// Rubric
submitForRubricScoring(userId, draftText)
getRubricResults(userId, draftVersion)
getDraftComparison(userId)

// IRB Logging (only fires if consent_flag = true)
logResearchData(userId, eventType, payload)
```

---

## Mock Data to Include

Create `src/data/mockData.ts` with:

- 2 sample users (one consented, one not)
- 3 sample articles (2 included, 1 excluded) with completed reviews
- 1 sample annotated bibliography entry
- 1 sample proposal draft
- 1 sample rubric result
- Full list of research designs with descriptions for Design Literacy Module
- 5 sample quiz questions with answers

---

## Navigation & Routing

```
/ → redirect to /login
/login
/register
/consent
/dashboard
/research-strategy
/design-literacy
/articles
/articles/new
/articles/:id
/bibliography
/proposal
/rubric
```

**Route Guards:**
- All routes except `/login` and `/register` require authentication
- `/articles`, `/articles/new`, `/articles/:id` require Design Literacy Module complete
- `/proposal` requires 10 reviews complete + distribution met
- `/consent` only accessible once (redirects to dashboard if already completed)

---

## Progress Tracking

After each completed task, output to `progress.md`:

- [x] Project structure created
- [x] Tailwind configured
- [x] Routing set up
- [x] Mock data created
- [x] `api.ts` placeholder functions written
- [x] Login page
- [x] Consent page
- [x] Dashboard with pipeline visualization
- [x] Research Strategy Coach
- [x] Design Literacy Module with quiz
- [x] Article list page
- [x] Add new article page
- [x] Article Review Builder (all 3 sections)
- [x] Annotated Bibliography page
- [x] Proposal Builder (locked/unlocked states)
- [x] Rubric Scoring page
- [x] All components built
- [x] Route guards implemented
- [x] Workflow lock logic enforced

### Backend Development
- [x] Flask project structure created (`backend/`)
- [x] SQLAlchemy models (User, Article, ArticleReview, Annotation, SearchStrategy, QuizResult, ProposalDraft, RubricResult, IrbLog)
- [x] Auth endpoints (login, register, consent, JWT tokens)
- [x] Research Strategy endpoints (save/get/mark complete)
- [x] Design Literacy endpoints (save quiz, get status, quiz history)
- [x] Article endpoints (CRUD, review save, progress tracking)
- [x] Bibliography endpoints (get included articles, update annotations)
- [x] Proposal endpoints (save/get drafts, version management, unlock status)
- [x] Rubric scoring engine (rule-based 7-dimension scoring with feedback)
- [x] IRB logging endpoints (consent-gated event logging)
- [x] Frontend `api.ts` connected to real Flask endpoints
- [x] All 19 API smoke tests passing
- [x] SQLite database with seed data (2 test users)
- [x] TypeScript types updated to match backend response format

### Frontend-Backend Integration
- [x] Vite proxy configured (`/api` → Flask on port 5000)
- [x] Frontend `api.ts` uses relative `/api` paths (works with any proxy/host)
- [x] Login flow tested end-to-end (backend auth with JWT)
- [x] Consent flow tested (persists to database)
- [x] Research Strategy flow tested (saves/completes via API)
- [x] Design Literacy quiz flow tested (saves results via API)
- [x] Article creation + review flow tested (persists to database)
- [x] Next-step guidance added (Dashboard, Research Strategy, Design Literacy, Article Review)
- [x] Register page connected to backend API (confirm password, validation, error handling)
- [x] Persist login across browser refresh (JWT restored from localStorage → `/api/auth/me`)
- [x] App loading screen while session restores (prevents login page flash)

### Remaining
- [ ] Loading spinners on async operations
- [ ] Toast notifications for save confirmations
- [ ] Error boundary for unexpected errors
- [ ] Bibliography export (text/PDF)
- [ ] Proposal export (PDF)
- [ ] Deployment prep (environment configs, production build)

---

## Notes for AI Agent

- Use **TypeScript** throughout — no plain JS files
- Use **Tailwind CSS** for all styling — no separate CSS files
- Use **React Router v6** for routing
- All state management via **React useState/useContext** — no Redux needed
- The consent flag and pipeline unlock states should live in a **UserContext**
- Every locked feature must show a clear message explaining what is needed to unlock it
- Do not skip the workflow gate logic — it is central to how this app works
- Output each completed task to `progress.md` as you go