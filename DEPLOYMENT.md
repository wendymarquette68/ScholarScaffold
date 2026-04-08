# ScholarScaffold — Deployment Reference

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend (share this)** | https://dashing-torrone-78de6c.netlify.app |
| **Backend API** | https://scholarscaffold.onrender.com |
| **Backend Health Check** | https://scholarscaffold.onrender.com/api/health |
| **GitHub Repository** | https://github.com/wendymarquette68/ScholarScaffold |

---

## Test Credentials

| Email | Password | Description |
|-------|----------|-------------|
| student@university.edu | password123 | Pre-completed stages |
| test@university.edu | password123 | Fresh start |

---

## Where to Manage Each Service

### Frontend — Netlify
- **Dashboard:** https://app.netlify.com
- **Team:** WendstormXR
- **Account:** wendy@wendstormxr.com
- **Site name:** dashing-torrone-78de6c
- **Deploy method:** Manual (drag-and-drop of `dist` folder)
- **To redeploy:** Run this in the `scholar-scaffold` folder, then drag the `dist` folder into Netlify:
  ```powershell
  $env:VITE_API_URL="https://scholarscaffold.onrender.com/api"; npm run build
  ```

### Backend — Render
- **Dashboard:** https://dashboard.render.com
- **Service name:** ScholarScaffold
- **Runtime:** Python 3 (Free tier — cold start ~30s on first request)
- **Region:** Oregon (US West)
- **Root directory:** backend
- **Build command:** `pip install -r requirements.txt && python migrate.py && python seed.py`
- **Start command:** `gunicorn wsgi:app`
- **Auto-deploys** from GitHub `main` branch
- **Note:** Free tier sleeps after inactivity. First login may take up to 30 seconds. Upgrade to Starter ($7/mo) to eliminate cold start.

### GitHub
- **Repository:** https://github.com/wendymarquette68/ScholarScaffold
- **Account:** wendymarquette68
- **Branch:** main
- **To push updates:**
  ```powershell
  git add -A
  git commit -m "description of changes"
  git push
  ```
  Render will auto-redeploy the backend. For frontend, you must manually rebuild and drag-drop to Netlify.

---

## Environment Variables

### Backend (set in Render dashboard)
| Key | Value |
|-----|-------|
| SECRET_KEY | scholar-scaffold-prod-secret-2026 |
| FLASK_ENV | production |

### Frontend (set at build time)
| Key | Value |
|-----|-------|
| VITE_API_URL | https://scholarscaffold.onrender.com/api |

---

## Important Notes
- **SQLite is ephemeral** on Render — data resets on every redeploy. The seed script recreates test users each time.
- **For persistent data**, add a PostgreSQL database (Render or Supabase) and set the `DATABASE_URL` env var.
- **Frontend is NOT auto-deployed** from GitHub since it uses manual deploy. You must rebuild and drag-drop after code changes.
