import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import SectionAlert from '../components/common/SectionAlert';
import { researchDesigns } from '../data/mockData';
import { ArticleReview } from '../types';
import { Trash2, Plus, ArrowRight, CheckCircle } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { REVIEW_THRESHOLDS } from '../config/pilotConfig';

// Expected design strength ranges for coaching feedback
const designStrengthExpected: Record<string, { min: number; max: number; label: string }> = {
  'Randomized Controlled Trial': { min: 4, max: 5, label: 'very strong (gold standard for causation)' },
  'Systematic Review': { min: 4, max: 5, label: 'very strong (highest level of evidence synthesis)' },
  'Meta-Analysis': { min: 4, max: 5, label: 'very strong (statistical synthesis of multiple studies)' },
  'Cohort Study': { min: 3, max: 4, label: 'strong (good for associations, not causation)' },
  'Case-Control Study': { min: 2, max: 3, label: 'moderate (useful but susceptible to recall bias)' },
  'Cross-Sectional Study': { min: 2, max: 3, label: 'low-moderate (snapshot, no temporal sequence)' },
  'Descriptive Study': { min: 1, max: 2, label: 'low (hypothesis-generating only)' },
  'Phenomenology': { min: 3, max: 4, label: 'strong for understanding lived experience (not ranked on quantitative hierarchies)' },
  'Grounded Theory — Classic (Glaserian)': { min: 3, max: 4, label: 'strong for data-driven theory development' },
  'Grounded Theory — Constructivist (Charmazian)': { min: 3, max: 4, label: 'strong for contextual, interpretive theory' },
  'Grounded Theory — Straussian/Corbinian': { min: 3, max: 4, label: 'strong for systematic theory development' },
  'Case Study': { min: 2, max: 3, label: 'moderate (rich but limited generalizability)' },
  'Ethnography': { min: 3, max: 4, label: 'strong for cultural understanding' },
  'Quasi-Experimental': { min: 3, max: 4, label: 'moderate-high (approximates RCT but lacks random assignment)' },
  'Mixed Methods': { min: 3, max: 5, label: 'varies (depends on rigor of both components and integration)' },
};

const vagueLimitationTerms = ['small sample', 'bias', 'limited', 'more research'];

const emptyReview: ArticleReview = {
  researchQuestion: '', studyDesign: '', sample: '', keyFindings: '', significance: '',
  designStrengthRating: 3, internalValidityIssues: '', externalValidityIssues: '',
  limitations: [''], applicabilityToScope: '',
  relevanceScore: 3, evidenceStrengthScore: 3, argumentContributionScore: 3,
  whyIncludeExclude: '', biggestLimitation: '', intendedUse: '',
  inclusionDecision: 'include',
};

export default function ArticleReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { articles, updateArticle } = useUser();
  const navigate = useNavigate();
  const article = articles.find(a => a.id === id);
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C'>('A');
  const [review, setReview] = useState<ArticleReview>(article?.review || emptyReview);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (article?.review) setReview(article.review);
  }, [article]);

  if (!article) {
    return <PageWrapper title="Article Not Found"><p>This article does not exist.</p></PageWrapper>;
  }

  const updateReview = (field: keyof ArticleReview, value: unknown) => {
    setReview(prev => ({ ...prev, [field]: value }));
  };

  const addLimitation = () => {
    setReview(prev => ({ ...prev, limitations: [...prev.limitations, ''] }));
  };

  const updateLimitation = (index: number, value: string) => {
    setReview(prev => ({
      ...prev,
      limitations: prev.limitations.map((l, i) => i === index ? value : l),
    }));
  };

  const removeLimitation = (index: number) => {
    if (review.limitations.length <= 1) return;
    setReview(prev => ({
      ...prev,
      limitations: prev.limitations.filter((_, i) => i !== index),
    }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!review.researchQuestion) errs.push('Research question is required');
    if (!review.studyDesign) errs.push('Study design is required');
    if (!review.sample) errs.push('Sample description is required');
    if (!review.keyFindings) errs.push('Key findings are required');
    if (!review.significance) errs.push('Significance is required');
    if (!review.internalValidityIssues) errs.push('Internal validity issues are required');
    if (!review.externalValidityIssues) errs.push('External validity issues are required');
    const filledLimitations = review.limitations.filter(l => l.trim().length > 0);
    if (filledLimitations.length < 3) errs.push('Minimum 3 limitations required');
    if (!review.applicabilityToScope) errs.push('Applicability to scope is required');
    if (!review.whyIncludeExclude) errs.push('Inclusion/exclusion rationale is required');
    if (!review.biggestLimitation) errs.push('Biggest limitation is required');
    if (!review.intendedUse) errs.push('Intended use is required');
    return errs;
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    const updatedArticle = { ...article, review, reviewComplete: true };
    updateArticle(updatedArticle);
    setSubmitted(true);
  };

  const sections = [
    { id: 'A' as const, label: 'A: Structured Summary' },
    { id: 'B' as const, label: 'B: Evidence Evaluation' },
    { id: 'C' as const, label: 'C: Inclusion Decision' },
  ];

  const allDesigns = researchDesigns.map(d => d.name);

  // Coaching: design-rating calibration
  const expectedRange = designStrengthExpected[review.studyDesign];
  const ratingMismatch = expectedRange && (
    review.designStrengthRating < expectedRange.min || review.designStrengthRating > expectedRange.max
  );

  // Coaching: vague limitation detection
  const vagueLimitations = review.limitations.filter(l =>
    l.trim().length > 0 && l.trim().length < 30 && vagueLimitationTerms.some(term => l.toLowerCase().includes(term))
  );

  // Coaching: inclusion/exclusion consistency
  const avgScore = (review.relevanceScore + review.evidenceStrengthScore + review.argumentContributionScore) / 3;
  const inclusionScoreMismatch =
    (review.inclusionDecision === 'include' && avgScore < 2.5) ||
    (review.inclusionDecision === 'exclude' && avgScore > 3.5);

  if (submitted) {
    const totalReviews = articles.filter(a => a.reviewComplete).length;
    const includedCount = articles.filter(a => a.reviewComplete && a.review?.inclusionDecision === 'include').length;
    const excludedCount = articles.filter(a => a.reviewComplete && a.review?.inclusionDecision === 'exclude').length;
    const proposalReady = totalReviews >= REVIEW_THRESHOLDS.totalRequired && includedCount >= REVIEW_THRESHOLDS.includeRequired && excludedCount >= REVIEW_THRESHOLDS.excludeRequired;

    return (
      <PageWrapper title="Review Submitted" subtitle={article.title}>
        <div className="max-w-lg mx-auto text-center space-y-6 py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Review Complete!</h2>
          <p className="text-gray-600">
            You marked this article as <strong className={review.inclusionDecision === 'include' ? 'text-green-600' : 'text-orange-600'}>{review.inclusionDecision}</strong>.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 space-y-1">
            <p><strong>{totalReviews}</strong> of {REVIEW_THRESHOLDS.totalRequired} reviews completed</p>
            <p><strong>{includedCount}</strong> of {REVIEW_THRESHOLDS.includeRequired} minimum includes</p>
            <p><strong>{excludedCount}</strong> of {REVIEW_THRESHOLDS.excludeRequired} minimum excludes</p>
          </div>

          {proposalReady ? (
            <Link to="/proposal" className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 transition-colors group">
              <div className="text-left">
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Unlocked!</div>
                <div className="text-sm font-bold text-green-800 mt-0.5">Proposal Builder is now available</div>
                <div className="text-xs text-green-600 mt-0.5">Start building your research proposal.</div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          ) : (
            <Link to="/articles/new" className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-xl p-4 hover:bg-primary-100 transition-colors group">
              <div className="text-left">
                <div className="text-xs font-semibold text-primary-500 uppercase tracking-wide">Next Step</div>
                <div className="text-sm font-bold text-primary-800 mt-0.5">Add Another Article</div>
                <div className="text-xs text-primary-600 mt-0.5">
                  {totalReviews < REVIEW_THRESHOLDS.totalRequired
                    ? `${REVIEW_THRESHOLDS.totalRequired - totalReviews} more reviews needed to unlock the Proposal Builder.`
                    : `Need ${Math.max(0, REVIEW_THRESHOLDS.includeRequired - includedCount)} more includes and ${Math.max(0, REVIEW_THRESHOLDS.excludeRequired - excludedCount)} more excludes.`}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          )}

          <button
            onClick={() => setSubmitted(false)}
            className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Edit Review
          </button>
          <Link to="/articles" className="inline-block text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Article List
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Article Review" subtitle={article.title}>
      <GuidanceBanner
        title="What to do here"
        storageKey="article_review_guide"
        steps={[
          'Section A: Structured Summary — Identify the research question, study design, sample, key findings, and significance.',
          'Section B: Evidence Evaluation — Rate design strength, assess internal/external validity, and list at least 3 limitations.',
          'Section C: Inclusion Decision — Score relevance, evidence, and argument contribution, then decide Include or Exclude.',
          'Click "Submit Review" when all fields are complete. Yellow coaching alerts help you improve as you go.',
        ]}
      />
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600"><strong>Authors:</strong> {article.authors} ({article.year})</p>
          <p className="text-sm text-gray-600"><strong>Journal:</strong> {article.journal}</p>
          {article.doi && <p className="text-sm text-gray-600"><strong>DOI:</strong> {article.doi}</p>}
        </div>

        <div className="flex gap-2">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === s.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Section A */}
        {activeSection === 'A' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Structured Summary</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Research Question *</label>
              <textarea value={review.researchQuestion} onChange={e => updateReview('researchQuestion', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Study Design *</label>
              <select value={review.studyDesign} onChange={e => updateReview('studyDesign', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="">Select a design...</option>
                {allDesigns.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Description *</label>
              <textarea value={review.sample} onChange={e => updateReview('sample', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Findings *</label>
              <textarea value={review.keyFindings} onChange={e => updateReview('keyFindings', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Significance *</label>
              <textarea value={review.significance} onChange={e => updateReview('significance', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div className="flex gap-2">
              <Link to="/articles" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Back to Article List
              </Link>
              <button onClick={() => { setActiveSection('B'); window.scrollTo(0, 0); }} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                Next: Evidence Evaluation
              </button>
            </div>
          </div>
        )}

        {/* Section B */}
        {activeSection === 'B' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Evidence Evaluation</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Design Strength Rating (1-5) *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => updateReview('designStrengthRating', n)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      review.designStrengthRating === n ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>{n}</button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">1 = Weak, 5 = Very Strong</p>
              {expectedRange && (
                <p className="text-xs text-blue-600 mt-1">
                  Typical range for {review.studyDesign}: <strong>{expectedRange.min}–{expectedRange.max}</strong> — {expectedRange.label}
                </p>
              )}
              {ratingMismatch && (
                <SectionAlert type="warning" message={`Your rating of ${review.designStrengthRating} for a ${review.studyDesign} is outside the typical range (${expectedRange.min}–${expectedRange.max}). This may be justified — if so, explain why in the validity sections below.`} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Validity Issues *</label>
              <textarea value={review.internalValidityIssues} onChange={e => updateReview('internalValidityIssues', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Validity Issues *</label>
              <textarea value={review.externalValidityIssues} onChange={e => updateReview('externalValidityIssues', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Limitations (minimum 3 required) *</label>
              {review.limitations.map((lim, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={lim} onChange={e => updateLimitation(i, e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder={`Limitation ${i + 1}`} />
                  {review.limitations.length > 1 && (
                    <button onClick={() => removeLimitation(i)} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addLimitation} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                <Plus className="w-4 h-4" /> Add Limitation
              </button>
              {review.limitations.filter(l => l.trim()).length < 3 && (
                <SectionAlert type="warning" message="You need at least 3 limitations to proceed." />
              )}
              {vagueLimitations.length > 0 && (
                <SectionAlert type="coaching" message="Some of your limitations seem vague (e.g., 'small sample' or 'bias'). Try to be more specific — what about the sample was small? What type of bias? How does it affect the findings?" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicability to Scope *</label>
              <textarea value={review.applicabilityToScope} onChange={e => updateReview('applicabilityToScope', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setActiveSection('A'); window.scrollTo(0, 0); }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">Back</button>
              <button onClick={() => { setActiveSection('C'); window.scrollTo(0, 0); }} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                Next: Inclusion Decision
              </button>
            </div>
          </div>
        )}

        {/* Section C */}
        {activeSection === 'C' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Inclusion Decision Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([['relevanceScore', 'Relevance to Topic'], ['evidenceStrengthScore', 'Evidence Strength'], ['argumentContributionScore', 'Argument Contribution']] as const).map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label} (1-5)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => updateReview(field, n)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          review[field] === n ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Why are you including or excluding this article? *</label>
              <textarea value={review.whyIncludeExclude} onChange={e => updateReview('whyIncludeExclude', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What is the biggest limitation of this study? *</label>
              <textarea value={review.biggestLimitation} onChange={e => updateReview('biggestLimitation', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How do you intend to use this article in your proposal? *</label>
              <textarea value={review.intendedUse} onChange={e => updateReview('intendedUse', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Decision *</label>
              <div className="flex gap-4">
                <button onClick={() => updateReview('inclusionDecision', 'include')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    review.inclusionDecision === 'include' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>Include</button>
                <button onClick={() => updateReview('inclusionDecision', 'exclude')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    review.inclusionDecision === 'exclude' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>Exclude</button>
              </div>
              {inclusionScoreMismatch && (
                <div className="mt-2">
                  <SectionAlert type="warning" message={
                    review.inclusionDecision === 'include'
                      ? `You're including this article but your average score is ${avgScore.toFixed(1)}/5, which is low. Make sure your rationale below explains why this article still belongs in your proposal despite low scores.`
                      : `You're excluding this article but your average score is ${avgScore.toFixed(1)}/5, which is high. Make sure your rationale below explains why this strong article doesn't fit your proposal.`
                  } />
                </div>
              )}
            </div>
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-medium text-red-700 mb-2">Please fix the following:</p>
                <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                  {errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => { setActiveSection('B'); window.scrollTo(0, 0); }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">Back</button>
              <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
