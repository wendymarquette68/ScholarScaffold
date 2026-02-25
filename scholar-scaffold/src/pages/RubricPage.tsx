import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import LockedStage from '../components/common/LockedStage';
import { submitForRubricScoring, getRubricResults } from '../services/api';
import { RubricResult, RubricDimension } from '../types';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

const dimensionLabels: Record<string, string> = {
  thesisClarity: 'Thesis Clarity',
  scopePrecision: 'Scope Precision',
  evidenceIntegration: 'Evidence Integration',
  synthesisDepth: 'Synthesis Depth',
  methodologicalAwareness: 'Methodological Awareness',
  structuralCompleteness: 'Structural Completeness',
  citationPresence: 'Citation Presence',
};

function resultToDimensions(result: RubricResult): RubricDimension[] {
  return Object.entries(result.scores).map(([key, score]) => ({
    key,
    name: dimensionLabels[key] || key,
    score,
    maxScore: 4,
    feedback: result.narrativeFeedback[key] || '',
  }));
}

export default function RubricPage() {
  const { isProposalUnlocked, reviewProgress, user } = useUser();
  const navigate = useNavigate();
  const [result, setResult] = useState<RubricResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isProposalUnlocked && user) {
      getRubricResults(user.id, 1).then(r => { if (r) setResult(r); });
    }
  }, [isProposalUnlocked, user]);

  if (!isProposalUnlocked) {
    return (
      <PageWrapper title="Rubric Scoring & Revision" subtitle="Evaluate and improve your proposal">
        <LockedStage
          title="Rubric Scoring"
          requirements={[
            '10 article reviews completed',
            'Minimum 5 articles marked Include',
            'Minimum 2 articles marked Exclude',
          ]}
          currentProgress={{
            '10 article reviews completed': { current: reviewProgress.total, required: 10 },
            'Minimum 5 articles marked Include': { current: reviewProgress.included, required: 5 },
            'Minimum 2 articles marked Exclude': { current: reviewProgress.excluded, required: 2 },
          }}
        />
      </PageWrapper>
    );
  }

  const handleScore = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await submitForRubricScoring(user.id, 1);
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to score proposal.');
      }
    } catch {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <PageWrapper title="Rubric Scoring & Revision" subtitle="Evaluate and improve your proposal">
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl space-y-4">
          <p className="text-gray-500">No rubric evaluation yet. Submit your proposal for scoring.</p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={handleScore}
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Scoring...</span> : 'Score My Proposal'}
          </button>
        </div>
      </PageWrapper>
    );
  }

  const dimensions = resultToDimensions(result);
  const totalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  const maxTotal = dimensions.reduce((sum, d) => sum + d.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotal) * 100);

  return (
    <PageWrapper title="Rubric Scoring & Revision" subtitle="Draft 1 Evaluation">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-primary-600 mb-1">{percentage}%</div>
          <div className="text-gray-500">Overall Score: {totalScore}/{maxTotal}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map(dim => (
            <div key={dim.key} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{dim.name}</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${
                      n <= dim.score ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>{n}</div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{dim.feedback}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-800">Top 3 Priority Fixes</h2>
          </div>
          <ol className="space-y-2">
            {result.priorityFixes.map((fix, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-amber-800">{fix}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Revision Roadmap</h2>
          <ol className="space-y-3">
            {result.revisionRoadmap.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Draft Comparison</h2>
          <p className="text-sm text-gray-500">Submit Draft 2 to see a side-by-side comparison with score changes highlighted.</p>
        </div>

        <button
          onClick={() => navigate('/proposal')}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Proposal
        </button>
      </div>
    </PageWrapper>
  );
}
