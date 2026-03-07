import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import PipelineStatus from '../components/common/PipelineStatus';
import ProgressTracker from '../components/common/ProgressTracker';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { TrendingUp, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, reviewProgress } = useUser();

  const nextStep = (() => {
    if (!user?.searchStrategyComplete) return { label: 'Research Strategy Coach', path: '/research-strategy', hint: 'Define your research topic, keywords, and databases.' };
    if (!user?.designLiteracyComplete) return { label: 'Research Design Literacy', path: '/design-literacy', hint: 'Learn about research designs and pass the quiz to unlock Article Reviews.' };
    if (reviewProgress.total < 10) return { label: 'Article Reviews', path: '/articles', hint: `You have ${reviewProgress.total} of 10 reviews. Add and review more articles.` };
    if (reviewProgress.included < 5 || reviewProgress.excluded < 2) return { label: 'Article Reviews', path: '/articles', hint: `Need ${Math.max(0, 5 - reviewProgress.included)} more Include and ${Math.max(0, 2 - reviewProgress.excluded)} more Exclude to unlock Proposal.` };
    return { label: 'Proposal Builder', path: '/proposal', hint: 'All prerequisites met! Start building your research proposal.' };
  })();

  return (
    <PageWrapper title={`Welcome, ${user?.name}`} subtitle="Your research pipeline at a glance">
      <GuidanceBanner
        title="Welcome to ScholarScaffold!"
        storageKey="dashboard_welcome"
        steps={[
          'Research Strategy Coach — Define your topic, keywords, and databases to build a search strategy.',
          'Design Literacy Module — Learn about research designs and pass a short quiz (70% to proceed).',
          'Article Reviews — Add 10 articles and review each one (you need 5 Include + 2 Exclude decisions).',
          'Annotated Bibliography — Auto-generated from your included articles. Edit and refine entries.',
          'Proposal Builder — Draft your research proposal using your reviewed evidence.',
          'Rubric Scoring — Submit your proposal for feedback, priority fixes, and a revision roadmap.',
        ]}
      >
        <p className="mt-2 font-medium">Start with Step 1 below — the blue "Next Step" card tells you exactly where to go.</p>
      </GuidanceBanner>
      <div className="space-y-6">
        <Link to={nextStep.path} className="block bg-primary-50 border border-primary-200 rounded-xl p-5 hover:bg-primary-100 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">Next Step</div>
              <div className="text-lg font-bold text-primary-800">{nextStep.label}</div>
              <div className="text-sm text-primary-600 mt-1">{nextStep.hint}</div>
            </div>
            <ArrowRight className="w-6 h-6 text-primary-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{reviewProgress.total}</div>
              <div className="text-sm text-gray-500">Reviews Completed</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{reviewProgress.included}</div>
              <div className="text-sm text-gray-500">Articles Included</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{reviewProgress.excluded}</div>
              <div className="text-sm text-gray-500">Articles Excluded</div>
            </div>
          </div>
        </div>

        <ProgressTracker />
        <PipelineStatus />
      </div>
    </PageWrapper>
  );
}
