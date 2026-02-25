import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';

export default function AddArticlePage() {
  const { user, addArticle } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    journal: '',
    doi: '',
    abstract: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle = {
      id: `article-${Date.now()}`,
      userId: user?.id || '',
      ...formData,
      reviewComplete: false,
    };
    addArticle(newArticle);
    navigate(`/articles/${newArticle.id}`);
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageWrapper title="Add New Article" subtitle="Enter article metadata to begin your review">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">DOI or URL</label>
          <input
            type="text"
            value={formData.doi}
            onChange={e => updateField('doi', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="10.xxxx/xxxxx or https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
          <textarea
            value={formData.abstract}
            onChange={e => updateField('abstract', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none h-32 resize-none"
            placeholder="Paste the article abstract here..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Save & Begin Review
          </button>
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </PageWrapper>
  );
}
