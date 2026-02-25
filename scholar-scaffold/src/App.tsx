import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { BookOpen } from 'lucide-react';
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
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
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/research-strategy"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResearchStrategyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/design-literacy"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DesignLiteracyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ArticleListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddArticlePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ArticleReviewPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bibliography"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BibliographyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposal"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProposalPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rubric"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RubricPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
