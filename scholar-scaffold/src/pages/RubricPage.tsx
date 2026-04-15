import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import LockedStage from '../components/common/LockedStage';
import { submitForRubricScoring, getRubricResults, getDraftComparison } from '../services/api';
import { RubricResult, RubricDimension } from '../types';
import { AlertTriangle, ArrowLeft, ArrowUp, ArrowDown, Minus, CheckCircle, Loader2 } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { REVIEW_THRESHOLDS, PROPOSAL_COMPLETION_THRESHOLD } from '../config/pilotConfig';

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

interface ComparisonData {
  draft1: RubricResult | null;
  draft2: RubricResult | null;
}

export default function RubricPage() {
  const { isProposalUnlocked, reviewProgress, user } = useUser();
  const navigate = useNavigate();
  const [result, setResult] = useState<RubricResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isProposalUnlocked && user) {
      getRubricResults(user.id, 1).then(r => { if (r) setResult(r); });
      getDraftComparison(user.id).then(data => {
        if (data?.draft1 && data?.draft2) setComparison(data);
      }).catch(() => {});
    }
  }, [isProposalUnlocked, user]);

  if (!isProposalUnlocked) {
    return (
      <PageWrapper title="Rubric Scoring & Revision" subtitle="Evaluate and improve your proposal">
        <LockedStage
          title="Rubric Scoring"
          requirements={[
            `${REVIEW_THRESHOLDS.totalRequired} article reviews completed`,
            `Minimum ${REVIEW_THRESHOLDS.includeRequired} articles marked Include`,
            `Minimum ${REVIEW_THRESHOLDS.excludeRequired} articles marked Exclude`,
          ]}
          currentProgress={{
            [`${REVIEW_THRESHOLDS.totalRequired} article reviews completed`]: { current: reviewProgress.total, required: REVIEW_THRESHOLDS.totalRequired },
            [`Minimum ${REVIEW_THRESHOLDS.includeRequired} articles marked Include`]: { current: reviewProgress.included, required: REVIEW_THRESHOLDS.includeRequired },
            [`Minimum ${REVIEW_THRESHOLDS.excludeRequired} articles marked Exclude`]: { current: reviewProgress.excluded, required: REVIEW_THRESHOLDS.excludeRequired },
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
        <GuidanceBanner
          title="What to do here"
          storageKey="rubric_guide"
          steps={[
            'Click "Score My Proposal" to submit your draft for automated evaluation.',
            'Review your scores across 7 dimensions (Thesis Clarity, Evidence Integration, etc.).',
            'Read the Top 3 Priority Fixes to know exactly what to improve first.',
            'Follow the Revision Roadmap, then return to the Proposal Builder to revise and resubmit.',
          ]}
        />
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
  const averageScore = totalScore / dimensions.length;
  const isReady = averageScore >= PROPOSAL_COMPLETION_THRESHOLD;

  return (
    <PageWrapper title="Rubric Scoring & Revision" subtitle="Draft 1 Evaluation">
      <div className="space-y-6">

        {/* Completion status banner */}
        {isReady ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">Proposal Ready</p>
              <p className="text-sm text-green-700 mt-0.5">
                Your proposal meets the quality threshold (average {averageScore.toFixed(1)}/4.0).
                Export it and submit to your instructor or advisor.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Keep Revising</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Current average: {averageScore.toFixed(1)}/4.0. Address the priority fixes below, return to the Proposal Builder, and resubmit for Draft 2 scoring.
              </p>
            </div>
          </div>
        )}

        {/* Overall score */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-primary-600 mb-1">{percentage}%</div>
          <div className="text-gray-500">Overall Score: {totalScore}/{maxTotal}</div>
        </div>

        {/* Dimension cards */}
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

        {/* Priority fixes */}
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

        {/* Revision roadmap */}
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

        {/* Draft comparison */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Draft Comparison</h2>
          {comparison?.draft1 && comparison?.draft2 ? (
            <DraftComparisonView draft1={comparison.draft1} draft2={comparison.draft2} />
          ) : (
            <p className="text-sm text-gray-500">
              Revise your proposal and submit Draft 2 to see a side-by-side score comparison here.
            </p>
          )}
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

function DraftComparisonView({ draft1, draft2 }: { draft1: RubricResult; draft2: RubricResult }) {
  const dims = Object.keys(dimensionLabels);

  const d1Total = dims.reduce((sum, k) => sum + (draft1.scores[k as keyof typeof draft1.scores] || 0), 0);
  const d2Total = dims.reduce((sum, k) => sum + (draft2.scores[k as keyof typeof draft2.scores] || 0), 0);
  const maxTotal = dims.length * 4;
  const d1Pct = Math.round((d1Total / maxTotal) * 100);
  const d2Pct = Math.round((d2Total / maxTotal) * 100);
  const overallDelta = d2Pct - d1Pct;

  return (
    <div className="space-y-4">
      <div className={`rounded-xl p-4 text-center ${overallDelta > 0 ? 'bg-green-50 border border-green-200' : overallDelta < 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
        <p className="text-sm font-semibold text-gray-700 mb-1">Overall Score Change</p>
        <p className={`text-2xl font-bold ${overallDelta > 0 ? 'text-green-700' : overallDelta < 0 ? 'text-red-700' : 'text-gray-600'}`}>
          {d1Pct}% → {d2Pct}% {overallDelta > 0 ? `(+${overallDelta}%)` : overallDelta < 0 ? `(${overallDelta}%)` : '(no change)'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-2 font-semibold text-gray-700">Dimension</th>
              <th className="pb-2 font-semibold text-gray-500 text-center">Draft 1</th>
              <th className="pb-2 font-semibold text-gray-500 text-center">Change</th>
              <th className="pb-2 font-semibold text-gray-700 text-center">Draft 2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dims.map(key => {
              const s1 = draft1.scores[key as keyof typeof draft1.scores] || 0;
              const s2 = draft2.scores[key as keyof typeof draft2.scores] || 0;
              const delta = s2 - s1;
              return (
                <tr key={key} className="py-1">
                  <td className="py-2.5 text-gray-700">{dimensionLabels[key]}</td>
                  <td className="py-2.5 text-center text-gray-400">{s1}/4</td>
                  <td className="py-2.5 text-center">
                    {delta > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-green-600 font-semibold">
                        <ArrowUp className="w-3 h-3" />+{delta}
                      </span>
                    ) : delta < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-red-600 font-semibold">
                        <ArrowDown className="w-3 h-3" />{delta}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-gray-400">
                        <Minus className="w-3 h-3" />0
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-semibold text-gray-800">{s2}/4</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
