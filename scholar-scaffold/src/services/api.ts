import { Article, ArticleReview, ProposalDraft, RubricResult, ReviewProgress, SearchStrategy } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('scholar_token', token);
  } else {
    localStorage.removeItem('scholar_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('scholar_token');
  }
  return authToken;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

// Auth
export async function loginUser(email: string, password: string) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function registerUser(email: string, password: string, name: string) {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function getCurrentUser() {
  const res = await apiFetch('/auth/me');
  const data = await res.json();
  return data;
}

export async function saveConsentFlag(_userId: string, consent: boolean) {
  const res = await apiFetch('/auth/consent', {
    method: 'POST',
    body: JSON.stringify({ consent }),
  });
  return res.json();
}

// Research Strategy
export async function saveSearchStrategy(_userId: string, topicData: SearchStrategy) {
  const res = await apiFetch('/strategy', {
    method: 'POST',
    body: JSON.stringify(topicData),
  });
  return res.json();
}

export async function getSearchStrategy(_userId: string): Promise<SearchStrategy | null> {
  const res = await apiFetch('/strategy');
  const data = await res.json();
  return data.strategy || null;
}

export async function markStrategyComplete() {
  const res = await apiFetch('/strategy/complete', { method: 'POST' });
  return res.json();
}

// Design Literacy
export async function saveQuizResult(_userId: string, score: number, responses: Record<string, number>) {
  const res = await apiFetch('/literacy/quiz', {
    method: 'POST',
    body: JSON.stringify({ score, responses }),
  });
  return res.json();
}

export async function getModuleCompletionStatus(_userId: string) {
  const res = await apiFetch('/literacy/status');
  return res.json();
}

// Articles
export async function getArticles(_userId: string): Promise<Article[]> {
  const res = await apiFetch('/articles');
  const data = await res.json();
  return data.articles || [];
}

export async function getArticleById(articleId: string): Promise<Article | undefined> {
  const res = await apiFetch(`/articles/${articleId}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  return data.article;
}

export async function createArticle(_userId: string, articleData: Omit<Article, 'id' | 'userId' | 'reviewComplete' | 'review'>): Promise<Article> {
  const res = await apiFetch('/articles', {
    method: 'POST',
    body: JSON.stringify(articleData),
  });
  const data = await res.json();
  return data.article;
}

export async function updateArticle(articleId: string, articleData: Partial<Article>) {
  const res = await apiFetch(`/articles/${articleId}`, {
    method: 'PUT',
    body: JSON.stringify(articleData),
  });
  return res.json();
}

export async function saveArticleReview(articleId: string, reviewData: ArticleReview) {
  const res = await apiFetch(`/articles/${articleId}/review`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
  return res.json();
}

export async function getReviewProgress(_userId: string): Promise<ReviewProgress> {
  const res = await apiFetch('/articles/progress');
  const data = await res.json();
  return data.progress || { total: 0, included: 0, excluded: 0 };
}

// Bibliography
export async function getBibliography(_userId: string) {
  const res = await apiFetch('/bibliography');
  const data = await res.json();
  return data.bibliography || [];
}

export async function updateAnnotation(articleId: string, annotationData: Record<string, string>) {
  const res = await apiFetch(`/bibliography/${articleId}/annotation`, {
    method: 'PUT',
    body: JSON.stringify(annotationData),
  });
  return res.json();
}

// Proposal
export async function getProposalDrafts(_userId: string): Promise<ProposalDraft[]> {
  const res = await apiFetch('/proposal/drafts');
  if (!res.ok) return [];
  const data = await res.json();
  return data.drafts || [];
}

export async function saveProposalDraft(_userId: string, draftData: Partial<ProposalDraft>) {
  const res = await apiFetch('/proposal/drafts', {
    method: 'POST',
    body: JSON.stringify(draftData),
  });
  return res.json();
}

export async function getProposalVersion(_userId: string, versionNumber: number): Promise<ProposalDraft | null> {
  const res = await apiFetch(`/proposal/drafts/${versionNumber}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.draft || null;
}

export async function getProposalStatus() {
  const res = await apiFetch('/proposal/status');
  return res.json();
}

// Rubric
export async function submitForRubricScoring(_userId: string, version: number = 1) {
  const res = await apiFetch('/rubric/score', {
    method: 'POST',
    body: JSON.stringify({ version }),
  });
  return res.json();
}

export async function getRubricResults(_userId: string, draftVersion: number): Promise<RubricResult | null> {
  const res = await apiFetch(`/rubric/results/${draftVersion}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.result || null;
}

export async function getDraftComparison(_userId: string) {
  const res = await apiFetch('/rubric/comparison');
  return res.json();
}

// IRB Logging (only fires if consent_flag = true)
export async function logResearchData(_userId: string, eventType: string, payload: Record<string, unknown>) {
  const res = await apiFetch('/irb/log', {
    method: 'POST',
    body: JSON.stringify({ eventType, payload }),
  });
  return res.json();
}
