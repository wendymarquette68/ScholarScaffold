import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Article, ReviewProgress, PipelineStage, StageStatus } from '../types';
import { getArticles, setAuthToken, getAuthToken, getCurrentUser } from '../services/api';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  reviewProgress: ReviewProgress;
  pipelineStages: PipelineStage[];
  isProposalUnlocked: boolean;
  isArticleReviewsUnlocked: boolean;
  updateConsentFlag: (consent: boolean) => void;
  completeDesignLiteracy: () => void;
  completeSearchStrategy: () => void;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Restore session from stored JWT token on app load
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    getCurrentUser()
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          return getArticles(data.user.id);
        }
        return [];
      })
      .then(arts => setArticles(Array.isArray(arts) ? arts : []))
      .catch(() => {
        setAuthToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    // Fetch articles from backend
    getArticles(userData.id).then(arts => setArticles(arts)).catch(() => setArticles([]));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setArticles([]);
    setAuthToken(null);
  }, []);

  const updateConsentFlag = useCallback((consent: boolean) => {
    setUser(prev => prev ? { ...prev, consentFlag: consent } : null);
  }, []);

  const completeDesignLiteracy = useCallback(() => {
    setUser(prev => prev ? { ...prev, designLiteracyComplete: true } : null);
  }, []);

  const completeSearchStrategy = useCallback(() => {
    setUser(prev => prev ? { ...prev, searchStrategyComplete: true } : null);
  }, []);

  const addArticle = useCallback((article: Article) => {
    setArticles(prev => [...prev, article]);
  }, []);

  const updateArticle = useCallback((updatedArticle: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
  }, []);

  const completedReviews = articles.filter(a => a.reviewComplete);
  const reviewProgress: ReviewProgress = {
    total: completedReviews.length,
    included: completedReviews.filter(a => a.review?.inclusionDecision === 'include').length,
    excluded: completedReviews.filter(a => a.review?.inclusionDecision === 'exclude').length,
  };

  const isArticleReviewsUnlocked = user?.designLiteracyComplete ?? false;
  const isProposalUnlocked =
    reviewProgress.total >= 10 &&
    reviewProgress.included >= 5 &&
    reviewProgress.excluded >= 2;

  const getStageStatus = (stageId: string): StageStatus => {
    switch (stageId) {
      case 'search-strategy':
        return user?.searchStrategyComplete ? 'complete' : 'not_started';
      case 'design-literacy':
        return user?.designLiteracyComplete ? 'complete' : 'not_started';
      case 'article-reviews':
        if (!isArticleReviewsUnlocked) return 'locked';
        if (reviewProgress.total >= 10) return 'complete';
        if (reviewProgress.total > 0) return 'in_progress';
        return 'not_started';
      case 'bibliography':
        if (!isArticleReviewsUnlocked) return 'locked';
        if (reviewProgress.included > 0) return 'in_progress';
        return 'not_started';
      case 'proposal':
        return isProposalUnlocked ? 'not_started' : 'locked';
      case 'rubric':
        return isProposalUnlocked ? 'not_started' : 'locked';
      default:
        return 'not_started';
    }
  };

  const pipelineStages: PipelineStage[] = [
    { id: 'search-strategy', name: 'Research Strategy Coach', status: getStageStatus('search-strategy'), path: '/research-strategy' },
    { id: 'design-literacy', name: 'Research Design Literacy', status: getStageStatus('design-literacy'), path: '/design-literacy' },
    { id: 'article-reviews', name: `Article Reviews (${reviewProgress.total} of 10)`, status: getStageStatus('article-reviews'), path: '/articles', unlockRequirement: 'Complete Research Design Literacy Module' },
    { id: 'bibliography', name: 'Annotated Bibliography', status: getStageStatus('bibliography'), path: '/bibliography', unlockRequirement: 'Complete Research Design Literacy Module' },
    { id: 'proposal', name: 'Proposal Builder', status: getStageStatus('proposal'), path: '/proposal', unlockRequirement: '10 reviews (min 5 Include, 2 Exclude)' },
    { id: 'rubric', name: 'Rubric Scoring & Revision', status: getStageStatus('rubric'), path: '/rubric', unlockRequirement: '10 reviews (min 5 Include, 2 Exclude)' },
  ];

  return (
    <UserContext.Provider value={{
      user, setUser, isAuthenticated, isLoading, login, logout,
      articles, setArticles, reviewProgress, pipelineStages,
      isProposalUnlocked, isArticleReviewsUnlocked,
      updateConsentFlag, completeDesignLiteracy, completeSearchStrategy,
      addArticle, updateArticle,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
