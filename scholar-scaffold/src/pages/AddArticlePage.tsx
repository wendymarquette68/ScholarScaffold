import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { createArticle as apiCreateArticle, updateArticle as apiUpdateArticle } from '../services/api';
import { Search, Loader } from 'lucide-react';

export default function AddArticlePage() {
  const { user, addArticle, articles, updateArticle } = useUser();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const existingArticle = id ? articles.find(a => a.id === id) : undefined;

  const [formData, setFormData] = useState({
    title: existingArticle?.title || '',
    authors: existingArticle?.authors || '',
    year: existingArticle?.year || new Date().getFullYear(),
    journal: existingArticle?.journal || '',
    doi: existingArticle?.doi || '',
    abstract: existingArticle?.abstract || '',
  });

  const [doiInput, setDoiInput] = useState(existingArticle?.doi || '');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleImportDoi = async () => {
    const raw = doiInput.trim();
    if (!raw) return;
    // Strip URL prefix if pasted as full URL
    const doi = raw.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
    setImporting(true);
    setImportError('');
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
      if (!res.ok) throw new Error('DOI not found');
      const data = await res.json();
      const msg = data.message;
      const title = msg.title?.[0] || '';
      const authors = (msg.author || [])
        .map((a: { family?: string; given?: string }) =>
          a.family && a.given ? `${a.family}, ${a.given[0]}.` : a.family || ''
        )
        .join(', ');
      const year = msg.published?.['date-parts']?.[0]?.[0] || msg['published-print']?.['date-parts']?.[0]?.[0] || new Date().getFullYear();
      const journal = msg['container-title']?.[0] || msg['short-container-title']?.[0] || '';
      setFormData(prev => ({
        ...prev,
        title: title || prev.title,
        authors: authors || prev.authors,
        year: year || prev.year,
        journal: journal || prev.journal,
        doi,
      }));
    } catch {
      setImportError('Could not find article. Check the DOI and try again, or enter details manually.');
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      if (isEditMode && existingArticle) {
        await apiUpdateArticle(existingArticle.id, formData);
        updateArticle({ ...existingArticle, ...formData });
        navigate(`/articles/${existingArticle.id}`);
      } else {
        const saved = await apiCreateArticle(user?.id || '', formData);
        addArticle(saved);
        navigate(`/articles/${saved.id}`);
      }
    } catch {
      setSaveError('Failed to save. Please check your connection and try again.');
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageWrapper
      title={isEditMode ? 'Edit Article Info' : 'Add New Article'}
      subtitle={isEditMode ? 'Update the article metadata' : 'Enter article metadata to begin your review'}
    >
      {!isEditMode && (
        <GuidanceBanner
          title="What to do here"
          storageKey="add_article_guide"
          steps={[
            'Enter the article details from the published paper: title, authors (in APA format), year, and journal.',
            'Add the DOI or URL if available — this is optional but helpful for your bibliography.',
            'Optionally paste the abstract to have it available during your review.',
            'Click "Save & Begin Review" to proceed to the 3-part structured review.',
          ]}
        />
      )}

      {/* DOI Import */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 max-w-2xl">
        <p className="text-sm font-medium text-blue-800 mb-2">Import from DOI (optional)</p>
        <p className="text-xs text-blue-600 mb-3">Enter a DOI to auto-fill the article details. You can edit anything after importing.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={doiInput}
            onChange={e => setDoiInput(e.target.value)}
            placeholder="e.g. 10.1016/j.example.2023.01.001"
            className="flex-1 px-4 py-2 border border-blue-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="button"
            onClick={handleImportDoi}
            disabled={importing || !doiInput.trim()}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {importing ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {importing ? 'Fetching...' : 'Fetch Info'}
          </button>
        </div>
        {importError && <p className="text-xs text-red-600 mt-2">{importError}</p>}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => updateField('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Authors *</label>
          <input
            type="text"
            value={formData.authors}
            onChange={e => updateField('authors', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Last, F., Last, F., & Last, F."
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
            <input
              type="number"
              value={formData.year}
              onChange={e => updateField('year', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Journal Name *</label>
            <input
              type="text"
              value={formData.journal}
              onChange={e => updateField('journal', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DOI or URL <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="text"
            value={formData.doi}
            onChange={e => updateField('doi', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="10.xxxx/xxxxx or https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Abstract <span className="text-gray-400 font-normal">(optional — for your reference during review)</span></label>
          <textarea
            value={formData.abstract}
            onChange={e => updateField('abstract', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none h-32 resize-none"
            placeholder="Paste the article abstract here..."
          />
        </div>
        {saveError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{saveError}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save & Begin Review'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => navigate(isEditMode && existingArticle ? `/articles/${existingArticle.id}` : '/articles')}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </PageWrapper>
  );
}
