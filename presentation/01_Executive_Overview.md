# ScholarScaffold — Proof of Concept

## Executive Overview for Stakeholders

---

## The Problem

Health professions students consistently struggle with foundational research skills:

- **Cannot distinguish** research design from analytic method
- **Cannot evaluate** evidence strength or identify study limitations
- **Summarize instead of synthesize** when writing literature reviews
- **Experience scope drift** — proposals lose focus across drafts
- **Skip critical evaluation** — accepting findings at face value
- **Lack structured revision skills** — don't know what to fix or how

These gaps persist across undergraduate and early graduate programs, resulting in weak proposals that fail to demonstrate scholarly competence.

---

## The Solution

**ScholarScaffold** is an AI-guided research literacy and scholarly proposal development platform that trains students through a structured pipeline:

```
Research Strategy → Design Literacy → Article Review (10x) → Bibliography → Proposal → Rubric Scoring → Revision
```

Each stage **must be completed before the next unlocks**, ensuring students build skills in the correct order — the same way an experienced mentor would guide them.

---

## What Makes This Different

| Traditional Approach | ScholarScaffold |
|---------------------|-----------------|
| Students jump straight to writing | Structured pipeline enforces skill building first |
| Faculty catches errors after submission | Real-time feedback at every stage |
| No way to measure improvement | Rubric scores Draft 1 vs Draft 2 quantitatively |
| Generic writing tools | Purpose-built for health professions research |
| No inclusion/exclusion training | Enforces minimum 5 include, 2 exclude with justification |
| Design literacy assumed | Mandatory module with quiz before article reviews |

---

## The Pipeline (6 Stages)

### Stage 1: Research Strategy Coach
Students build database search strategies with keyword builders, Boolean operators, and filter recommendations. The system generates copy-ready search strings for PubMed, CINAHL, and other health sciences databases.

### Stage 2: Research Design Literacy Module
Before reviewing any articles, students must demonstrate understanding of:
- Quantitative designs (RCT, Cohort, Case-Control, Cross-Sectional, Descriptive)
- Qualitative designs (Phenomenology, Grounded Theory, Case Study, Ethnography)
- Evidence synthesis methods (Systematic Review, Meta-Analysis)
- Analytic strategies (Manual coding, CAQDAS, Algorithmic triangulation)

Students must pass a quiz to proceed.

### Stage 3: Article Reviews (10 Required)
Each review follows a structured format:
- **Structured Summary** — research question, design, sample, findings
- **Evidence Evaluation** — strength rating, validity issues, 3+ limitations
- **Inclusion Decision** — scored on relevance, evidence strength, argument contribution
- **Required Reflections** — why include/exclude, biggest limitation, intended function

Distribution requirement: minimum 5 included, minimum 2 excluded.

### Stage 4: Annotated Bibliography
Auto-generated from included articles with APA formatting, summary, critical evaluation, and relevance paragraphs.

### Stage 5: Proposal Builder
Unlocks only after 10 reviews with proper distribution. Sections include: Title, Background, Problem Statement, Purpose/Research Question, Literature Synthesis, Significance, and Preliminary Questions. Features insert-from-annotation, scope guardrails, and version history.

### Stage 6: Rubric Scoring & Revision Engine
Evaluates proposals across 7 dimensions (1–4 scale):
1. Thesis Clarity
2. Scope Precision
3. Evidence Integration
4. Synthesis Depth
5. Methodological Awareness
6. Structural Completeness
7. Citation Presence

Generates: construct-level scores, narrative feedback, top 3 priority fixes, revision roadmap, and draft comparison view.

---

## Primary Success Metric

**Improvement in rubric score from Draft 1 to Draft 2.**

This is measurable, objective, and directly tied to learning outcomes.

### Secondary Metrics
- Completion rate of 10 article reviews
- Proper inclusion/exclusion discrimination
- Research design identification accuracy
- Time-on-task metrics
- Revision engagement

---

## Current Status: Proof of Concept Complete

| Component | Status |
|-----------|--------|
| Frontend (React + TypeScript + Tailwind) | ✅ Built and deployed |
| Backend (Python + Flask + SQLAlchemy) | ✅ Built and deployed |
| User authentication (JWT) | ✅ Working |
| Research Strategy Coach | ✅ Functional |
| Design Literacy Module + Quiz | ✅ Functional |
| Article Review Builder | ✅ Functional |
| Annotated Bibliography | ✅ Functional |
| Proposal Builder | ✅ Functional |
| Rubric Scoring Engine (7 dimensions) | ✅ Functional |
| Pipeline gate logic (stage locking) | ✅ Working |
| IRB-compatible consent logging | ✅ Working |
| Live deployment | ✅ Accessible online |

---

## Try It Now

**Live URL:** https://dashing-torrone-78de6c.netlify.app

| Login | Password | Experience |
|-------|----------|------------|
| student@university.edu | password123 | Pre-completed stages (see full pipeline) |
| test@university.edu | password123 | Fresh start (experience the full flow) |

---

## IRB Compatibility

ScholarScaffold is designed with IRB-compliant data collection in mind:
- Consent flag required before any research data logging
- Collected data: review count, inclusion/exclusion ratio, design identification accuracy, draft versions, rubric score improvement, time-on-task, revision engagement
- **No grading decisions occur inside the system**
- All data is associated with anonymizable user IDs

---

## Phase 2 Opportunities

- Zotero export integration
- Synthesis matrix visualization
- Student confidence dashboard
- Faculty analytics dashboard
- Multi-course support
- Live database API integration (PubMed, CINAHL)

---

## Contact

**Dr. Wendy Whitner, PhD, MPH, LSSBB**
College of Health Professions
