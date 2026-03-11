import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { BookOpen, LogOut } from 'lucide-react';
import { REVIEW_THRESHOLDS } from '../../config/pilotConfig';

export default function Navbar() {
  const { user, logout, isAuthenticated, reviewProgress } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2 text-primary-700 font-bold text-xl">
        <BookOpen className="w-6 h-6" />
        ScholarScaffold
      </Link>
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {reviewProgress.total} of {REVIEW_THRESHOLDS.totalRequired} Reviews
        </div>
        <span className="text-sm text-gray-600">
          {user?.name}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}
