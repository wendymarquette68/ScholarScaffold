import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import LockedStage from '../components/common/LockedStage';
import SectionAlert from '../components/common/SectionAlert';
import { saveProposalDraft as apiSaveProposalDraft } from '../services/api';
import { ProposalDraft } from '../types';
import { History, BookMarked } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { REVIEW_THRESHOLDS } from '../config/pilotConfig';

const proposalSections = [
  { key: 'title' as const, label: 'Title' },
  { key: 'background' as const, label: 'Background' },
  { key: 'problemStatement' as const, label: 'Problem Statement' },
  { key: 'purposeResearchQuestion' as const, label: 'Purpose / Research Question' },
  { key: 'literatureSynthesis' as const, label: 'Literature Synthesis' },
  { key: 'significance' as const, label: 'Significance' },
  { key: 'preliminaryQuestions' as const, label: 'Preliminary Questions' },
];

export default function ProposalPage() {
  const { isProposalUnlocked, reviewProgress, articles } = useUser();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProposalDraft>({
    version: 1,
    title: '',
    background: '',
    problemStatement: '',
    purposeResearchQuestion: '',
    literatureSynthesis: '',
    significance: '',
    preliminaryQuestions: '',
  });
  const [saving, setSaving] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [versions] = useState([{ version: 1, date: '2024-01-15' }]);

  const includedArticles = articles.filter(a => a.reviewComplete && a.review?.inclusionDecision === 'include');

  if (!isProposalUnlocked) {
    return (
      <PageWrapper title="Proposal Builder" subtitle="Build your research proposal">
        <LockedStage
          title="Proposal Builder"
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

  const updateDraft = (field: keyof ProposalDraft, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const openAnnotationModal = (field: string) => {
    setActiveField(field);
    setShowAnnotationModal(true);
  };

  const insertAnnotation = (text: string) => {
    if (activeField) {
      setDraft(prev => ({ ...prev, [activeField]: (prev as unknown as Record<string, string>)[activeField] + '\n\n' + text }));
    }
    setShowAnnotationModal(false);
  };

  return (
    <PageWrapper title="Proposal Builder" subtitle="Build your research proposal">
      <GuidanceBanner
        title="What to do here"
        storageKey="proposal_guide"
        steps={[
          'Write each section of your research proposal in the text boxes below.',
          'Click "Insert from Annotation" on any section to pull in key findings or significance from your reviewed articles.',
          'Click "Save Draft" regularly to preserve your work.',
          'Yellow coaching prompts below each section help you think critically about your writing.',
          'When ready, click "Submit for Rubric Evaluation" to get scored feedback and a revision roadmap.',
        ]}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              {versions.map(v => (
                <span key={v.version} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  Draft {v.version} — {v.date}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                setSaving(true);
                try {
                  await apiSaveProposalDraft('', { ...draft, version: 1 });
                } finally { setSaving(false); }
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={async () => {
                setSaving(true);
                try {
                  await apiSaveProposalDraft('', { ...draft, version: 1 });
                  navigate('/rubric');
                } catch {
                  alert('Failed to save draft. Please try again.');
                } finally { setSaving(false); }
              }}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving & Submitting...' : 'Submit for Rubric Evaluation'}
            </button>
          </div>
        </div>

        {proposalSections.map(section => (
          <div key={section.key} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">{section.label}</h2>
              <button
                onClick={() => openAnnotationModal(section.key)}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <BookMarked className="w-4 h-4" /> Insert from Review Notes
              </button>
            </div>
            {section.key === 'title' ? (
              <input
                type="text"
                value={draft[section.key]}
                onChange={e => updateDraft(section.key, e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            ) : (
              <textarea
                value={draft[section.key]}
                onChange={e => updateDraft(section.key, e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-y"
              />
            )}
            <div className="mt-2 space-y-1">
              <SectionAlert type="coaching" message="Are you interpreting or summarizing?" />
              {section.key === 'background' && <SectionAlert type="warning" message="Does this claim have a citation?" />}
              {section.key === 'purposeResearchQuestion' && <SectionAlert type="coaching" message="Is this population consistent with your research question?" />}
            </div>
          </div>
        ))}
      </div>

      {showAnnotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Insert from Review Notes</h2>
            <p className="text-sm text-gray-500 mb-4">Click on a finding or significance statement below to insert it into your proposal section. These are pulled from your completed article reviews.</p>
            {includedArticles.length === 0 ? (
              <p className="text-gray-500">No included articles available.</p>
            ) : (
              <div className="space-y-3">
                {includedArticles.map(article => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-2">{article.title}</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => insertAnnotation(article.review?.keyFindings || '')}
                        className="w-full text-left text-xs bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <strong>Key Findings:</strong> {article.review?.keyFindings?.substring(0, 100)}...
                      </button>
                      <button
                        onClick={() => insertAnnotation(article.review?.significance || '')}
                        className="w-full text-left text-xs bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <strong>Significance:</strong> {article.review?.significance?.substring(0, 100)}...
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowAnnotationModal(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
