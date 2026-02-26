/**
 * App.tsx — Main routing and layout for ScholarScaffold.
 *
 * Route protection layers (applied in order):
 *   1. ProtectedRoute — Requires authenticated user (redirects to /login)
 *   2. ConsentGate — Requires IRB consent decision (redirects to /consent)
 *   3. AppLayout — Wraps page content with Navbar + Sidebar
 *
 * The /consent route is protected but NOT consent-gated (users need to reach it).
 * Public routes (/login, /register) have no wrappers.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { FullPageSpinner } from './components/common/Spinner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConsentPage from './pages/ConsentPage';
import DashboardPage from './pages/DashboardPage';
import ResearchStrategyPage from './pages/ResearchStrategyPage';
import DesignLiteracyPage from './pages/DesignLiteracyPage';
import ArticleListPage from './pages/ArticleListPage';
import AddArticlePage from './pages/AddArticlePage';
import ArticleReviewPage from './pages/ArticleReviewPage';
import BibliographyPage from './pages/BibliographyPage';
import ProposalPage from './pages/ProposalPage';
import RubricPage from './pages/RubricPage';

/** Redirects unauthenticated users to /login. Shows nothing while session is restoring. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirects users to /consent if they haven't made an IRB consent decision yet. */
function ConsentGate({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  if (user && (user.consentFlag === null || user.consentFlag === undefined)) {
    return <Navigate to="/consent" replace />;
  }
  return <>{children}</>;
}

/** Standard page layout: top Navbar + left Sidebar + main content area. */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { isLoading } = useUser();

  if (isLoading) {
    return <FullPageSpinner label="Loading your workspace..." />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/consent"
        element={
          <ProtectedRoute>
            <ConsentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/research-strategy"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <ResearchStrategyPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/design-literacy"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <DesignLiteracyPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <ArticleListPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/new"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <AddArticlePage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/:id"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <ArticleReviewPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bibliography"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <BibliographyPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposal"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <ProposalPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rubric"
        element={
          <ProtectedRoute>
            <ConsentGate>
              <AppLayout>
                <RubricPage />
              </AppLayout>
            </ConsentGate>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
