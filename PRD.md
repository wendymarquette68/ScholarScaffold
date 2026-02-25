ScholarScaffold
Product Requirements Document (PRD)
CONCEPT

App Name: ScholarScaffold (Working Title)

Core Purpose:
An AI-guided research literacy and scholarly proposal development platform that trains health professions students to systematically search, evaluate, organize, and synthesize research before drafting a proposal, and then supports rubric-aligned revision to improve academic quality.

Problem Solved:
Students struggle to:

Identify strong research

Understand research design

Distinguish research design from analytic method

Evaluate evidence strength

Avoid scope drift

Organize literature before writing

Write analytically instead of summarizing

Revise strategically

Primary User:
Undergraduate and early graduate students in the College of Health Professions.

Primary Success Metric:
Improvement in proposal rubric score from Draft 1 to Draft 2.

Secondary Metrics:

Completion of 10 article reviews

Proper inclusion/exclusion discrimination

Research design identification accuracy

Core Proof Mechanism:
A structured Research → Review (10 articles) → Annotate → Build → Revise pipeline that produces measurable improvement.

PHASE 1 CORE FEATURES
1. Research Strategy Coach
Purpose

Teach students how to build effective database searches.

User Sees

Keyword builder interface

Boolean operator generator

Filter recommendations

Database suggestions

Copy-ready search string

Background

System logs search strings

Stores keyword combinations

Data Stored

Topic

Generated search terms

Timestamp

Feedback

Alerts for vague population

Suggestions for refinement

2. Research Design Literacy Module (Mandatory Before Reviews)
Purpose

Ensure students understand research design before reviewing articles.

Content Includes

Quantitative Designs

Randomized Controlled Trial

Cohort

Case-Control

Cross-Sectional

Descriptive

Qualitative Designs

Phenomenology

Grounded Theory

Case Study

Ethnography

Evidence Synthesis

Systematic Review

Meta-Analysis

Analytic Strategies

Manual coding

Intercoder reliability

CAQDAS

Computational bias mitigation

Frequency analysis

Algorithmic triangulation

User Sees

Design explanations

Evidence hierarchy visualization

Interactive identification checks

Background

Tracks design classification accuracy

Data Stored

Quiz responses

Accuracy score

Feedback

Immediate correction

Clarification of design vs analysis

3. Article Review Builder (10 Required)
Unlock Requirement

Minimum 10 completed reviews.

Distribution Required

Minimum 5 Include

Minimum 2 Exclude

Remaining flexible

Article Review Structure
A. Structured Summary

Research question

Study design

Sample

Key findings

Significance

B. Evidence Evaluation

Design strength rating

Internal validity issues

External validity issues

Minimum 3 limitations

Applicability to scope

C. Inclusion Decision Engine

Dimensions Scored

Relevance

Evidence Strength

Argument Contribution

Required Reflection

Why include or exclude?

Biggest limitation?

Intended function in proposal?

User Sees

Step-by-step guided interface
Progress tracker: “7 of 10 Reviews Completed”

Background

Enforces minimum critique depth

Validates design identification

Tracks inclusion/exclusion distribution

Data Stored

Full review text

Inclusion status

Scores

Revision timestamps

Feedback

Flags shallow critique

Flags design inconsistency

Scope misalignment alerts

4. Annotated Bibliography Generator
Condition

Only available for articles marked “Include.”

User Sees

APA entry builder

Summary paragraph

Critical evaluation paragraph

Relevance paragraph

Background

Pulls content from Review Card.

Data Stored

Citation metadata

Annotation text

Feedback

APA structural reminders

Missing evaluation flags

5. Proposal Builder (Locked Until 10 Reviews Complete)
Unlock Logic

System verifies:

10 reviews complete

Distribution requirement met

Required Sections

Title

Background

Problem Statement

Purpose / Research Question

Literature Synthesis

Significance

Preliminary Questions

Features

Insert-from-annotation

Scope guardrails

Citation reminders

Version history

Background

Monitors scope drift

Tracks revision cycles

Data Stored

Draft versions

Edit timestamps

Feedback

Inline coaching:

“Is this population consistent?”

“Is this claim supported?”

“Are you interpreting or summarizing?”

6. Rubric Scoring + Revision Engine
Scoring Dimensions

Thesis clarity

Scope precision

Evidence integration

Synthesis depth

Methodological awareness

Structural completeness

Citation presence

Output

Construct-level scores

Narrative feedback

Top 3 priority fixes

Revision roadmap

Draft comparison view

Background

Rule-based scoring logic

Improvement tracking

Data Stored

Rubric scores

Flagged issues

Revision metrics

SCOPE BOUNDARIES
In Scope (Phase 1)

Research Strategy Coach

Research Design Literacy Module

10 structured Article Reviews

Inclusion/exclusion enforcement

Annotated bibliography generator

Proposal builder

Rubric engine

IRB-compatible logging

Out of Scope

Live database API integration

Full citation manager

Plagiarism detection

AI full-paper generation

Faculty dashboard

Multi-course support

Nice-to-Haves (Phase 2+)

Zotero export

Synthesis matrix visualization

Confidence dashboard

Faculty analytics

TECH STACK

Front-End
React + TypeScript + Tailwind CSS

Back-End
Python + Flask

Database
Supabase (PostgreSQL)

Authentication
Supabase Auth

Architecture

Front-end handles UI and workflow logic

Back-end handles evaluation and scoring

Database stores drafts, reviews, analytics

Consent flag required for research logging

USER FLOW (Happy Path)

User logs in and optionally consents to research participation.

Starts project.

Completes Research Strategy Coach.

Completes Research Design Literacy Module.

Adds first article.

Completes Article Review workflow.

Repeats until 10 reviews complete.

Distribution requirement validated.

Proposal Builder unlocks.

Draft 1 written.

Rubric evaluation run.

Feedback and revision roadmap generated.

Draft 2 written.

Improvement comparison displayed.

Export final draft.

IRB DATA STRUCTURE

Collected for consented users:

Review count

Inclusion/exclusion ratio

Design identification accuracy

Draft versions

Rubric score improvement

Time-on-task metrics

Revision engagement

No grading decisions occur inside system.