# ScholarScaffold — Live Demo Script

## Presenter Guide

Use this script to walk stakeholders through the live prototype. Estimated time: 10–15 minutes.

---

## Before the Demo

1. Open the app in your browser (always-on server — no startup delay)
2. URL: **https://dashing-torrone-78de6c.netlify.app**
3. Have two browser tabs ready:
   - Tab 1: `student@university.edu` / `password123` (pre-completed — shows the full pipeline)
   - Tab 2: `test@university.edu` / `password123` (fresh start — shows the onboarding flow)

---

## Demo Flow

### Opening (1 min)

> "ScholarScaffold is a structured research literacy platform for health professions students. Instead of asking students to jump straight into writing a proposal, it walks them through a guided pipeline — the same way an experienced mentor would."

---

### 1. Login & Dashboard (1 min)

**Log in as `student@university.edu`**

**Show:**
- The dashboard with pipeline progress
- The sidebar navigation showing all 6 stages
- The "Next Step" guidance banner
- Review statistics (reviews completed, articles included/excluded)

**Say:**
> "After login, students see their dashboard with clear progress tracking. The system always tells them what to do next. They can't skip ahead — each stage unlocks only after the previous one is complete."

---

### 2. Research Strategy Coach (2 min)

**Click "Research Strategy" in sidebar**

**Show:**
- Keyword builder interface
- Boolean operator selection
- Search string generation

**Say:**
> "Students start by building a proper database search strategy. The system helps them construct Boolean search strings they can copy directly into PubMed or CINAHL. This teaches them how to search systematically instead of Googling random terms."

---

### 3. Design Literacy Module (2 min)

**Click "Design Literacy" in sidebar**

**Show:**
- Research design categories (Quantitative, Qualitative, Evidence Synthesis)
- Analytic strategies
- The quiz interface

**Say:**
> "Before students can review any articles, they must demonstrate they understand research design. This module covers quantitative designs like RCTs and cohort studies, qualitative approaches, and evidence synthesis methods. They must pass a quiz to proceed. This prevents the common problem of students reviewing articles without understanding what they're reading."

---

### 4. Article Reviews (2 min)

**Click "Article Reviews" in sidebar**

**Show:**
- Article list with inclusion/exclusion status
- A completed review showing structured summary, evidence evaluation, and inclusion decision
- Progress tracker (X of 10 reviews)
- Distribution requirements (min 5 include, min 2 exclude)

**Say:**
> "Each article goes through a structured review — summary, evidence evaluation, and an inclusion/exclusion decision with justification. Students must complete 10 reviews with at least 5 included and 2 excluded. This teaches critical evaluation, not just summarization."

---

### 5. Bibliography (1 min)

**Click "Bibliography" in sidebar**

**Show:**
- Auto-generated annotated bibliography from included articles
- APA formatting

**Say:**
> "The bibliography is automatically generated from included articles. Each entry has a summary, critical evaluation, and relevance paragraph — pulled from the student's own review work."

---

### 6. Proposal Builder (2 min)

**Click "Proposal Builder" in sidebar**

**Show:**
- Section-based editor (Title, Background, Problem Statement, etc.)
- Version history

**Say:**
> "The Proposal Builder only unlocks after 10 reviews are complete with proper distribution. This enforces the correct workflow — research first, write second. Students build their proposal section by section with scope guardrails."

---

### 7. Rubric Scoring Engine (2 min)

**Click "Rubric Scoring" in sidebar**

**Show:**
- 7-dimension scoring results (1–4 scale)
- Narrative feedback for each dimension
- Top 3 priority fixes
- Revision roadmap

**Say:**
> "This is the key innovation. The rubric engine scores the proposal across 7 research dimensions — thesis clarity, scope precision, evidence integration, synthesis depth, methodological awareness, structural completeness, and citation presence. Each dimension gets a 1–4 score with specific feedback. Students get a revision roadmap telling them exactly what to fix. When they revise and resubmit, we can measure the improvement from Draft 1 to Draft 2. That measurable improvement is our primary success metric."

---

### 8. Fresh Start Demo (Optional — 2 min)

**Switch to Tab 2 (`test@university.edu`)**

**Show:**
- Empty dashboard with locked stages
- Pipeline showing the required progression
- Gate logic preventing skipping ahead

**Say:**
> "Here's what a new student sees. Everything except Research Strategy is locked. They must complete each stage before the next one opens. This prevents the 'jump to writing' problem."

---

### Closing (1 min)

> "What you're seeing is a working proof of concept — fully functional, deployed, and accessible from any browser. The pipeline enforces the scholarly workflow that faculty teach but students skip. The rubric engine provides the measurable outcome we need for research validation. Phase 2 could include Zotero integration, faculty analytics, and multi-course support."

---

## Anticipated Questions

**Q: Does this replace faculty feedback?**
> No. ScholarScaffold provides structured guidance and automated scoring, but no grading decisions occur in the system. Faculty remain the final evaluators.

**Q: How is this different from a writing tool like Grammarly?**
> Grammarly checks grammar. ScholarScaffold teaches research methodology — how to search, evaluate evidence, make inclusion decisions, and synthesize literature. It's a research literacy tool, not a writing tool.

**Q: Is this IRB-compatible?**
> Yes. Consent is captured before any research data logging. Collected metrics include review counts, inclusion ratios, design identification accuracy, rubric scores, and revision engagement. All data is anonymizable.

**Q: What about data persistence?**
> The current proof of concept uses temporary storage for demonstration. Production deployment would use PostgreSQL for permanent data storage.

**Q: Can this scale to multiple courses?**
> The architecture supports it. Multi-course and faculty dashboard features are planned for Phase 2.

**Q: What tech stack is this built on?**
> React + TypeScript + Tailwind CSS (frontend), Python + Flask (backend), JWT authentication, and a rule-based rubric scoring engine. The codebase is on GitHub and deployable to standard cloud platforms.
