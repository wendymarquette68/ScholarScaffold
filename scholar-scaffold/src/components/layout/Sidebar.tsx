import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
  LayoutDashboard, Search, GraduationCap, FileText,
  BookMarked, Edit3, ClipboardCheck, Lock
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, alwaysAccessible: true },
  { path: '/research-strategy', label: 'Research Strategy', icon: Search, alwaysAccessible: true },
  { path: '/design-literacy', label: 'Design Literacy', icon: GraduationCap, alwaysAccessible: true },
  { path: '/articles', label: 'Article Reviews', icon: FileText, requiresDesignLiteracy: true },
  { path: '/bibliography', label: 'Annotated Bibliography', icon: BookMarked, requiresDesignLiteracy: true },
  { path: '/proposal', label: 'Proposal Builder', icon: Edit3, requiresProposalUnlock: true },
  { path: '/rubric', label: 'Rubric Scoring', icon: ClipboardCheck, requiresProposalUnlock: true },
];

export default function Sidebar() {
  const { isArticleReviewsUnlocked, isProposalUnlocked } = useUser();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 fixed top-[57px] left-0 bottom-0 overflow-y-auto p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map(item => {
          const isLocked =
            (item.requiresDesignLiteracy && !isArticleReviewsUnlocked) ||
            (item.requiresProposalUnlock && !isProposalUnlocked);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isLocked
                    ? 'text-gray-400 hover:bg-gray-100'
                    : isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
