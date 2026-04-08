import { useState } from 'react';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import SectionAlert from '../components/common/SectionAlert';
import { Edit2, Save, AlertTriangle } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { updateAnnotation } from '../services/api';

const narrativeCite = (authors: string, year: number): string => {
  // Parse APA author strings like "Chen, L., Martinez, R., & Thompson, K."
  // Strategy: split on " & " first to separate last author, then split remaining by
  // the pattern "., " which separates "LastName, Initial." groups
  const cleaned = authors.replace(/\.$/, ''); // remove trailing period
  const ampersandParts = cleaned.split(/\s*&\s*/);
  const lastNames: string[] = [];

  for (const part of ampersandParts) {
    // Each part may contain multiple "LastName, X." entries separated by ", "
    // Match pattern: word(s) followed by comma and initials
    const authorMatches = part.match(/([A-Z][a-zA-Z'-]+),\s*[A-Z]\./g);
    if (authorMatches) {
      for (const match of authorMatches) {
        lastNames.push(match.split(',')[0].trim());
      }
    } else {
      // Fallback: just grab first word
      const first = part.trim().split(/[,\s]/)[0];
      if (first) lastNames.push(first);
    }
  }

  if (lastNames.length === 0) return `(${year})`;
  if (lastNames.length === 1) return `${lastNames[0]} (${year})`;
  if (lastNames.length === 2) return `${lastNames[0]} and ${lastNames[1]} (${year})`;
  return `${lastNames[0]} et al. (${year})`;
};

export default function BibliographyPage() {
  const { articles } = useUser();
  const includedArticles = articles.filter(a => a.reviewComplete && a.review?.inclusionDecision === 'include');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState({ summary: '', evaluation: '', relevance: '' });
  const [savingId, setSavingId] = useState<string | null>(null);

  const buildApa = (a: typeof includedArticles[0]) => {
    return `${a.authors} (${a.year}). ${a.title}. *${a.journal}*. ${a.doi ? `https://doi.org/${a.doi}` : ''}`;
  };

  const startEdit = (articleId: string, summary: string, evaluation: string, relevance: string) => {
    setEditingId(articleId);
    setEditText({ summary, evaluation, relevance });
  };

  const saveEdit = async (articleId: string) => {
    setSavingId(articleId);
    try {
      await updateAnnotation(articleId, editText);
    } catch {
      // Silently fail — annotation still visible in local state
    } finally {
      setSavingId(null);
      setEditingId(null);
    }
  };

  const isTooShort = (text: string) => text.length < 50;

  return (
    <PageWrapper title="Annotated Bibliography" subtitle="Generated from your included articles">
      <GuidanceBanner
        title="What to do here"
        storageKey="bibliography_guide"
        steps={[
          'Your bibliography is auto-generated from articles you marked "Include" during reviews.',
          'Each entry shows an APA citation, a summary, critical evaluation, and relevance statement.',
          'Click "Edit" on any entry to refine the text — the auto-generated text is a starting point.',
          'Watch for orange warnings on sections that are too short and need more detail.',
        ]}
      />
      {includedArticles.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500">No articles marked "Include" yet. Complete article reviews to generate your bibliography.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <SectionAlert type="info" message="APA Reminder: Entries should be in hanging indent format. Italicize journal names and volume numbers. Include DOI when available." />
          {includedArticles.map(article => {
            const review = article.review!;
            const cite = narrativeCite(article.authors, article.year);
            const summary = `${cite} examined ${review.researchQuestion.toLowerCase()} using a ${review.studyDesign.toLowerCase()} design with ${review.sample.toLowerCase()}. ${review.keyFindings}`;
            const evaluation = `The study employed a ${review.studyDesign.toLowerCase()} design rated ${review.designStrengthRating}/5 for design strength. ${review.internalValidityIssues} ${review.externalValidityIssues} Key limitations include: ${review.limitations.filter(l => l.trim()).join('; ')}.`;
            const relevance = `${review.whyIncludeExclude} ${review.intendedUse}`;
            const isEditing = editingId === article.id;

            return (
              <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="font-mono text-sm text-gray-800 leading-relaxed flex-1" style={{ textIndent: '-2rem', paddingLeft: '2rem' }}>
                    {buildApa(article)}
                  </div>
                  <button
                    onClick={() => isEditing ? saveEdit(article.id) : startEdit(article.id, summary, evaluation, relevance)}
                    disabled={savingId === article.id}
                    className="ml-4 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                  >
                    {isEditing
                      ? <><Save className="w-4 h-4" /> {savingId === article.id ? 'Saving...' : 'Save'}</>
                      : <><Edit2 className="w-4 h-4" /> Edit</>}
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Summary</h4>
                  {isEditing ? (
                    <textarea value={editText.summary} onChange={e => setEditText(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-primary-500 outline-none" />
                  ) : (
                    <p className="text-sm text-gray-600">{summary}</p>
                  )}
                  {isTooShort(isEditing ? editText.summary : summary) && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                      <AlertTriangle className="w-3 h-3" /> This section appears too short.
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Critical Evaluation</h4>
                  {isEditing ? (
                    <textarea value={editText.evaluation} onChange={e => setEditText(prev => ({ ...prev, evaluation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-primary-500 outline-none" />
                  ) : (
                    <p className="text-sm text-gray-600">{evaluation}</p>
                  )}
                  {isTooShort(isEditing ? editText.evaluation : evaluation) && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                      <AlertTriangle className="w-3 h-3" /> This section appears too short.
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Relevance</h4>
                  {isEditing ? (
                    <textarea value={editText.relevance} onChange={e => setEditText(prev => ({ ...prev, relevance: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-primary-500 outline-none" />
                  ) : (
                    <p className="text-sm text-gray-600">{relevance}</p>
                  )}
                  {isTooShort(isEditing ? editText.relevance : relevance) && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                      <AlertTriangle className="w-3 h-3" /> This section appears too short.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Export as Text (Placeholder)
          </button>
        </div>
      )}
    </PageWrapper>
  );
}
