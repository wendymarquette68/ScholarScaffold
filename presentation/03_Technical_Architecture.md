# ScholarScaffold — Technical Architecture Brief

## For Computer Information Science Stakeholders

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                       │
│                                                          │
│   React 18 + TypeScript + Tailwind CSS + React Router    │
│   Hosted on Netlify (CDN, global edge)                   │
│                                                          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (REST API)
                         │ Bearer JWT Authentication
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    FLASK BACKEND                          │
│                                                          │
│   Python 3 + Flask 3.0 + SQLAlchemy ORM                  │
│   Gunicorn WSGI Server                                   │
│   Hosted on Render (Free Tier)                           │
│                                                          │
│   ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│   │ Auth Routes  │  │ Data Routes  │  │ Scoring Engine│  │
│   │ (JWT/bcrypt) │  │ (8 blueprints│  │ (Rule-based)  │  │
│   └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
└────────────────────────┬────────────────────────────────┘
                         │ SQLAlchemy ORM
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                               │
│                                                          │
│   SQLite (Proof of Concept)                              │
│   → PostgreSQL (Production via Supabase/Render)          │
│                                                          │
│   9 Models: User, Article, ArticleReview, Annotation,    │
│   SearchStrategy, QuizResult, ProposalDraft,             │
│   RubricResult, IrbLog                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Component-based UI with type safety |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Routing** | React Router v6 | Client-side SPA routing |
| **Icons** | Lucide React | Lightweight icon library |
| **State** | React Context + useState | Lightweight state management (no Redux) |
| **Backend** | Python + Flask 3.0 | REST API server |
| **ORM** | Flask-SQLAlchemy | Database abstraction layer |
| **Auth** | PyJWT + bcrypt | JWT token generation + password hashing |
| **CORS** | Flask-CORS | Cross-origin request handling |
| **Migration** | Flask-Migrate (Alembic) | Database schema versioning |
| **WSGI** | Gunicorn | Production-grade Python web server |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Relational data storage |
| **Frontend Host** | Netlify | Static site CDN with global edge |
| **Backend Host** | Render | Cloud application platform |
| **Version Control** | Git + GitHub | Source code management |

---

## API Architecture

### Authentication (`/api/auth/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Email/password login, returns JWT |
| `/api/auth/register` | POST | New user registration |
| `/api/auth/me` | GET | Current user from JWT token |
| `/api/auth/consent` | POST | Record IRB consent decision |

### Research Strategy (`/api/strategy/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/strategy/` | GET/POST | Get or save search strategy |
| `/api/strategy/complete` | POST | Mark strategy stage complete |

### Design Literacy (`/api/literacy/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/literacy/quiz` | POST | Submit quiz answers |
| `/api/literacy/status` | GET | Get quiz completion status |
| `/api/literacy/history` | GET | Get quiz attempt history |

### Articles (`/api/articles/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/articles/` | GET/POST | List or add articles |
| `/api/articles/<id>` | PUT/DELETE | Update or remove article |
| `/api/articles/<id>/review` | POST | Submit article review |
| `/api/articles/progress` | GET | Get review progress stats |

### Bibliography (`/api/bibliography/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bibliography/` | GET | Get included articles for bibliography |
| `/api/bibliography/<id>/annotation` | PUT | Update annotation |

### Proposal (`/api/proposal/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/proposal/` | GET/POST | Get or save proposal draft |
| `/api/proposal/unlock` | GET | Check if proposal is unlocked |

### Rubric (`/api/rubric/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rubric/score` | POST | Score proposal against rubric |
| `/api/rubric/results` | GET | Get scoring results |
| `/api/rubric/comparison` | GET | Compare Draft 1 vs Draft 2 |

### IRB Logging (`/api/irb/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/irb/log` | POST | Log research event (consent-gated) |

---

## Database Schema (9 Models)

### User
```
id, email, password_hash, name, consent_given, consent_date,
strategy_complete, literacy_complete, created_at
```

### Article
```
id, user_id, title, authors, year, journal, doi, url,
status (include/exclude/pending), created_at
```

### ArticleReview
```
id, article_id, user_id, research_question, study_design,
sample_description, key_findings, significance,
design_strength, internal_validity, external_validity,
limitations, relevance_score, evidence_score,
contribution_score, inclusion_rationale, biggest_limitation,
intended_function, created_at, updated_at
```

### SearchStrategy
```
id, user_id, topic, keywords, boolean_string, databases,
filters, created_at
```

### QuizResult
```
id, user_id, score, total_questions, passed, answers, created_at
```

### ProposalDraft
```
id, user_id, version, title, background, problem_statement,
purpose, literature_synthesis, significance,
preliminary_questions, created_at, updated_at
```

### RubricResult
```
id, user_id, proposal_id, scores (JSON), narrative_feedback (JSON),
priority_fixes (JSON), revision_roadmap, created_at
```

### Annotation
```
id, article_id, user_id, summary, evaluation, relevance, created_at
```

### IrbLog
```
id, user_id, event_type, event_data (JSON), created_at
```

---

## Rubric Scoring Engine

The scoring engine is **rule-based** (not AI/ML), evaluating proposals across 7 dimensions on a 1–4 scale:

| Dimension | What It Measures |
|-----------|-----------------|
| Thesis Clarity | Is the research question specific and arguable? |
| Scope Precision | Is the population, setting, and timeframe defined? |
| Evidence Integration | Are cited sources used to support claims? |
| Synthesis Depth | Does the student analyze across sources, not just summarize? |
| Methodological Awareness | Does the proposal acknowledge design limitations? |
| Structural Completeness | Are all required sections present and substantive? |
| Citation Presence | Are claims backed by in-text citations? |

**Output:** Construct-level scores, narrative feedback per dimension, top 3 priority fixes, and a revision roadmap.

---

## Security

- **Password hashing:** bcrypt with automatic salt generation
- **Authentication:** JWT tokens with expiration
- **Token storage:** Browser localStorage with Bearer header
- **CORS:** Configured for cross-origin API access
- **Consent gating:** IRB data logging requires explicit user consent
- **No PII in URLs:** All sensitive data in request bodies

---

## Pipeline Gate Logic

The frontend enforces a strict progression:

```
Consent → Research Strategy → Design Literacy → Article Reviews (10) → Bibliography → Proposal → Rubric
```

- Each stage checks the previous stage's completion via API
- Locked stages show a "locked" UI with explanation of requirements
- Article Reviews enforce distribution: min 5 include, min 2 exclude
- Proposal Builder requires 10 completed reviews + distribution met

---

## Codebase Structure

```
ScholarScaffold/
├── scholar-scaffold/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx                # Routes + protected route logic
│   │   ├── context/UserContext.tsx # Auth state + session management
│   │   ├── services/api.ts        # All API calls (centralized)
│   │   ├── types/index.ts         # TypeScript interfaces
│   │   ├── pages/                 # 12 page components
│   │   ├── components/            # Reusable UI components
│   │   └── data/mockData.ts       # Static reference data
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                       # Backend (Python + Flask)
│   ├── app.py                     # Flask app factory
│   ├── config.py                  # Dev/prod configuration
│   ├── wsgi.py                    # Gunicorn entry point
│   ├── seed.py                    # Database seeder
│   ├── models/                    # 9 SQLAlchemy models
│   ├── routes/                    # 8 API blueprint modules
│   ├── services/                  # Rubric scoring engine
│   └── requirements.txt           # Python dependencies
│
├── PRD.md                         # Product Requirements Document
├── progress.md                    # Build progress tracking
├── DEPLOYMENT.md                  # Deployment reference
└── debugplan.md                   # Bug tracking
```

---

## Deployment Architecture

```
GitHub (wendymarquette68/ScholarScaffold)
    │
    ├──→ Render (auto-deploy on push)
    │       Backend: scholarscaffold.onrender.com
    │       Python 3 + Gunicorn + SQLite
    │
    └──→ Netlify (manual deploy)
            Frontend: dashing-torrone-78de6c.netlify.app
            Static files served via global CDN
```

---

## Lines of Code

| Component | Files | Lines |
|-----------|-------|-------|
| Frontend (React/TypeScript) | ~30 | ~4,500 |
| Backend (Python/Flask) | ~25 | ~2,500 |
| Config & Docs | ~15 | ~2,200 |
| **Total** | **~70** | **~9,200** |

---

## Production Readiness Path

| Task | Status | Priority |
|------|--------|----------|
| Proof of concept | ✅ Complete | — |
| Live deployment | ✅ Complete | — |
| PostgreSQL migration | Planned | High |
| Loading states & error handling | Planned | Medium |
| Automated testing suite | Planned | Medium |
| CI/CD pipeline (GitHub Actions) | Planned | Medium |
| Custom domain | Planned | Low |
| Faculty dashboard | Phase 2 | Low |
