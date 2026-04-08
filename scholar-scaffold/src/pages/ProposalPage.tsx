import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import LockedStage from '../components/common/LockedStage';
import SectionAlert from '../components/common/SectionAlert';
import { saveProposalDraft as apiSaveProposalDraft, getProposalVersion, getSearchStrategy, logResearchData } from '../services/api';
import { ProposalDraft } from '../types';
import { History, BookMarked, Save } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { REVIEW_THRESHOLDS } from '../config/pilotConfig';

const emptyDraft: ProposalDraft = {
  version: 1,
  title: '',
  background: '',
  problemStatement: '',
  purposeResearchQuestion: '',
  theoreticalFramework: '',
  literatureSynthesis: '',
  proposedMethodology: '',
  significance: '',
  preliminaryQuestions: '',
};

type SectionKey = keyof Omit<ProposalDraft, 'id' | 'userId' | 'version' | 'submittedForRubric' | 'createdAt' | 'updatedAt'>;

const proposalSections: { key: SectionKey; label: string; placeholder: string; coaching: string[]; isTitle?: boolean }[] = [
  {
    key: 'title',
    label: 'Title',
    placeholder: 'e.g., The Effect of Mindfulness Interventions on Anxiety Among Undergraduate Students',
    coaching: [
      'Is your title specific enough to describe the research without being a full sentence?',
      'Does it include your population and the main variable or phenomenon?',
    ],
    isTitle: true,
  },
  {
    key: 'background',
    label: 'Background',
    placeholder: 'Establish what is known about this topic. Introduce key concepts, statistics, and prior research. Every claim should cite a source (e.g., Smith et al., 2022).',
    coaching: [
      'Have you established what is already known about this topic?',
      'Have you identified the gap in the literature that your research addresses?',
      'Does every claim cite a source from your article reviews?',
    ],
  },
  {
    key: 'problemStatement',
    label: 'Problem Statement',
    placeholder: 'Clearly state the specific problem your research addresses. Who is affected, why does it matter, and what makes it significant enough to study?',
    coaching: [
      'Is the problem clearly defined and supported by evidence?',
      'Have you explained who is affected and why the problem matters?',
      'Is the problem specific enough to be studied empirically?',
    ],
  },
  {
    key: 'purposeResearchQuestion',
    label: 'Research Questions & Hypotheses',
    placeholder: 'State your primary research question(s). For quantitative research, also state your hypothesis. For qualitative research, state the phenomenon you are exploring.',
    coaching: [
      'Is your research question specific and answerable through empirical research?',
      'Quantitative: state a directional or null hypothesis.',
      'Qualitative: clearly name the phenomenon and why it warrants exploration.',
      'Ensure consistency with your background and problem statement.',
    ],
  },
  {
    key: 'theoreticalFramework',
    label: 'Theoretical / Conceptual Framework',
    placeholder: 'Identify the theory or conceptual model that guides your research (e.g., Social Cognitive Theory, Health Belief Model). Explain how it connects to your research question and why it is appropriate.',
    coaching: [
      'What theory or model underpins your research?',
      'How does the framework connect your key variables or phenomena?',
      'Why is this framework — and not another — the right fit for your question?',
      'Cite the original theorist(s) by name (e.g., Bandura, 1977).',
    ],
  },
  {
    key: 'literatureSynthesis',
    label: 'Literature Synthesis',
    placeholder: 'Synthesize your reviewed articles into 2–3 themes. Do NOT summarize each article one by one. Instead: group findings by theme, compare and contrast studies, and identify what the literature collectively tells us — and where the gaps are.',
    coaching: [
      'Organize by theme, not by article (e.g., "Studies examining X consistently found Y (Author A, 2020; Author B, 2021)...").',
      'Are you comparing and contrasting sources, or just listing them?',
      'Have you identified 2–3 recurring themes across your reviewed articles?',
      'Have you explicitly identified the gap that your research fills?',
    ],
  },
  {
    key: 'proposedMethodology',
    label: 'Proposed Methodology',
    placeholder: 'Describe your proposed research design and methods:\n1. Research design and rationale\n2. Sampling strategy and participant criteria\n3. Data collection instruments or procedures\n4. Data analysis approach\n5. Ethical considerations',
    coaching: [
      'What research design will you use and why is it the best fit for your question?',
      'How will you recruit participants? What are your inclusion and exclusion criteria?',
      'What instruments or measures will you use? Are they validated?',
      'How will you analyze the data (e.g., regression, thematic analysis, ANOVA)?',
      'Address potential threats to validity and how you will mitigate them.',
    ],
  },
  {
    key: 'significance',
    label: 'Significance & Expected Contributions',
    placeholder: 'Explain why this research matters. Describe the theoretical contribution (new knowledge for the field) and the practical contribution (how findings could be applied). Who benefits, and how?',
    coaching: [
      'Who specifically benefits from this research (practitioners, policymakers, students, patients)?',
      'What is the theoretical contribution — what new knowledge does this add to the field?',
      'What is the practical contribution — how could findings be applied in real-world settings?',
    ],
  },
  {
    key: 'preliminaryQuestions',
    label: 'Limitations & Future Directions',
    placeholder: 'Identify potential limitations of your proposed study (e.g., sample size, self-report bias, single-site setting). Explain how these might affect validity. Then describe 1–2 future research directions your study raises.',
    coaching: [
      'What are the potential methodological limitations of your proposed study?',
      'How might these limitations affect the internal or external validity of your findings?',
      'What future research questions does your study raise for the field?',
    ],
  },
];

const R1_SECTIONS: SectionKey[] = ['theoreticalFramework', 'proposedMethodology'];

export default function ProposalPage() {
  const { isProposalUnlocked, reviewProgress, articles } = useUser();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProposalDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [activeField, setActiveField] = useState<SectionKey | null>(null);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [loadingDraft, setLoadingDraft] = useState(true);

  const includedArticles = articles.filter(a => a.reviewComplete && a.review?.inclusionDecision === 'include');

  useEffect(() => {
    if (!isProposalUnlocked) { setLoadingDraft(false); return; }

    logResearchData('', 'stage_enter', { stage: 'proposal_builder' });

    const loadData = async () => {
      try {
        const [existingDraft, strategy] = await Promise.all([
          getProposalVersion('', 1),
          getSearchStrategy(''),
        ]);

        if (existingDraft) {
          setDraft({ ...emptyDraft, ...existingDraft });
          setCurrentVersion(existingDraft.version || 1);
        } else if (strategy?.researchQuestion) {
          setDraft(prev => ({ ...prev, purposeResearchQuestion: strategy.researchQuestion || '' }));
        }
      } catch {
        // Silently fail — user starts with empty draft
      } finally {
        setLoadingDraft(false);
      }
    };

    loadData();
  }, [isProposalUnlocked]);

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

  if (loadingDraft) {
    return (
      <PageWrapper title="Proposal Builder" subtitle="Loading your draft...">
        <div className="text-center py-16 text-gray-400">Loading your saved draft...</div>
      </PageWrapper>
    );
  }

  const updateDraft = (field: SectionKey, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
    setSaveStatus('idle');
  };

  const saveDraft = async (version = currentVersion) => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      await apiSaveProposalDraft('', { ...draft, version });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      logResearchData('', 'proposal_draft_saved', { version });
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const submitForRubric = async () => {
    await saveDraft(currentVersion);
    logResearchData('', 'rubric_submitted', { version: currentVersion });
    navigate('/rubric');
  };

  const saveAsNewVersion = async () => {
    const newVersion = currentVersion + 1;
    await saveDraft(newVersion);
    setCurrentVersion(newVersion);
  };

  const openAnnotationModal = (field: SectionKey) => {
    setActiveField(field);
    setShowAnnotationModal(true);
  };

  const insertAnnotation = (text: string) => {
    if (activeField) {
      const current = (draft[activeField] as string) || '';
      setDraft(prev => ({
        ...prev,
        [activeField as string]: current + (current ? '\n\n' : '') + text,
      }));
      setSaveStatus('idle');
    }
    setShowAnnotationModal(false);
  };

  return (
    <PageWrapper title="Proposal Builder" subtitle={`Draft ${currentVersion}`}>
      <GuidanceBanner
        title="What to do here"
        storageKey="proposal_guide"
        steps={[
          'Work through all 9 sections. Your research question from the Strategy Coach is pre-loaded in Section 4.',
          'Sections marked "R1 Level" (Theoretical Framework and Proposed Methodology) are new — they prepare you to write at graduate and faculty research standards.',
          'Click "Insert from Review Notes" to pull findings, significance, or intended use from your article reviews.',
          'Save often — your draft persists to the server so it will be here when you return.',
          'When ready, submit for rubric evaluation to get scored feedback across 7 dimensions.',
        ]}
      />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Draft {currentVersion}</span>
          {currentVersion > 1 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Revised</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {saveStatus === 'saved' && <span className="text-xs text-green-600 font-medium">✓ Saved</span>}
          {saveStatus === 'error' && <span className="text-xs text-red-600 font-medium">Save failed — check connection</span>}
          {currentVersion >= 1 && (
            <button onClick={saveAsNewVersion} disabled={saving}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
              Save as Draft {currentVersion + 1}
            </button>
          )}
          <button onClick={() => saveDraft()} disabled={saving}
            className="flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={submitForRubric} disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
            Submit for Rubric Evaluation
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {proposalSections.map((section, idx) => {
          const value = (draft[section.key] as string) || '';
          const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
          const isR1 = R1_SECTIONS.includes(section.key);

          return (
            <div key={section.key} className={`bg-white border rounded-xl p-6 ${isR1 ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {idx + 1} of {proposalSections.length}
                    </span>
                    {isR1 && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">R1 Level</span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.label}</h2>
                </div>
                <button
                  onClick={() => openAnnotationModal(section.key)}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
                >
                  <BookMarked className="w-4 h-4" /> Insert from Review Notes
                </button>
              </div>

              {section.isTitle ? (
                <input
                  type="text"
                  value={value}
                  onChange={e => updateDraft(section.key, e.target.value)}
                  placeholder={section.placeholder}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              ) : (
                <textarea
                  value={value}
                  onChange={e => updateDraft(section.key, e.target.value)}
                  placeholder={section.placeholder}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-y ${
                    isR1 ? 'h-44' : section.key === 'literatureSynthesis' || section.key === 'proposedMethodology' ? 'h-52' : 'h-36'
                  }`}
                />
              )}

              <div className="flex items-start justify-between mt-2 gap-4">
                <div className="space-y-1 flex-1">
                  {section.coaching.map((prompt, i) => (
                    <SectionAlert key={i} type="coaching" message={prompt} />
                  ))}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 mt-1">{wordCount} words</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button onClick={() => saveDraft()} disabled={saving}
          className="flex items-center gap-1.5 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={submitForRubric} disabled={saving}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
          Submit for Rubric Evaluation
        </button>
      </div>

      {showAnnotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Insert from Review Notes</h2>
            <p className="text-sm text-gray-500 mb-4">
              Click any item to insert it into your <strong>{proposalSections.find(s => s.key === activeField)?.label}</strong> section.
            </p>
            {includedArticles.length === 0 ? (
              <p className="text-gray-500 text-sm">No included articles yet. Complete article reviews first.</p>
            ) : (
              <div className="space-y-4">
                {includedArticles.map(article => (
                  <div key={article.id} className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-0.5">{article.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{article.authors} ({article.year})</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Research Question', value: article.review?.researchQuestion },
                        { label: 'Key Findings', value: article.review?.keyFindings },
                        { label: 'Significance', value: article.review?.significance },
                        { label: 'Intended Use in Proposal', value: article.review?.intendedUse },
                        { label: 'Biggest Limitation', value: article.review?.biggestLimitation },
                        { label: 'Applicability to Scope', value: article.review?.applicabilityToScope },
                      ].filter(item => item.value).map(item => (
                        <button
                          key={item.label}
                          onClick={() => insertAnnotation(`[${article.authors?.split(',')[0]} et al., ${article.year}] ${item.value}`)}
                          className="w-full text-left text-xs bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary-200 p-2.5 rounded-lg transition-colors"
                        >
                          <span className="font-semibold text-gray-600">{item.label}:</span>{' '}
                          <span className="text-gray-700">
                            {item.value?.substring(0, 150)}{(item.value?.length || 0) > 150 ? '...' : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowAnnotationModal(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
