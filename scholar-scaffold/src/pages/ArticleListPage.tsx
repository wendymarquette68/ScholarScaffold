import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import ProgressTracker from '../components/common/ProgressTracker';
import LockedStage from '../components/common/LockedStage';
import { Plus, FileText, Trash2, Pencil } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';

export default function ArticleListPage() {
  const { articles, isArticleReviewsUnlocked, deleteArticle } = useUser();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent, articleId: string, title: string) => {
    e.preventDefault();
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteArticle(articleId);
  };

  if (!isArticleReviewsUnlocked) {
    return (
      <PageWrapper title="Article Reviews" subtitle="Review 10 articles to unlock the Proposal Builder">
        <LockedStage
          title="Article Reviews"
          requirements={['Complete the Research Design Literacy Module']}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Article Reviews" subtitle="Review 10 articles to unlock the Proposal Builder">
      <GuidanceBanner
        title="What to do here"
        storageKey="article_list_guide"
        steps={[
          'Click "Add New Article" (button above) to enter an article\'s details. After saving, you will be taken directly to the review form.',
          'On the review form, complete all 3 sections: A (Structured Summary), B (Evidence Evaluation), and C (Inclusion Decision), then click Submit.',
          'Return here and repeat steps 1–2 for each article. You need 10 total reviews with at least 5 Include and 2 Exclude decisions.',
          'Once requirements are met, the Proposal Builder will unlock automatically.',
        ]}
      />
      <div className="space-y-6">
        <ProgressTracker />
        <div className="flex justify-end">
          <Link
            to="/articles/new"
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Article
          </Link>
        </div>
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No articles added yet. Click "Add New Article" to begin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(article => (
              <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/articles/${article.id}`} className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-500">{article.authors} ({article.year})</p>
                    <p className="text-sm text-gray-400">{article.journal}</p>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {article.reviewComplete ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        article.review?.inclusionDecision === 'include'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {article.review?.inclusionDecision === 'include' ? 'Included' : 'Excluded'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        In Progress
                      </span>
                    )}
                    <button
                      onClick={() => navigate(`/articles/${article.id}/edit`)}
                      title="Edit article info"
                      className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => handleDelete(e, article.id, article.title)}
                      title="Delete article"
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
