export interface User {
  id: string;
  email: string;
  name: string;
  consentFlag: boolean | null;
  designLiteracyComplete: boolean;
  searchStrategyComplete: boolean;
}

export interface Article {
  id: string;
  userId: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  abstract: string;
  reviewComplete: boolean;
  review?: ArticleReview;
}

export interface ArticleReview {
  // Section A: Structured Summary
  researchQuestion: string;
  studyDesign: string;
  sample: string;
  keyFindings: string;
  significance: string;
  // Section B: Evidence Evaluation
  designStrengthRating: number;
  internalValidityIssues: string;
  externalValidityIssues: string;
  limitations: string[];
  applicabilityToScope: string;
  // Section C: Inclusion Decision
  relevanceScore: number;
  evidenceStrengthScore: number;
  argumentContributionScore: number;
  whyIncludeExclude: string;
  biggestLimitation: string;
  intendedUse: string;
  inclusionDecision: 'include' | 'exclude';
}

export interface ProposalDraft {
  id?: string;
  userId?: string;
  version: number;
  title: string;
  background: string;
  problemStatement: string;
  purposeResearchQuestion: string;
  literatureSynthesis: string;
  significance: string;
  preliminaryQuestions: string;
  submittedForRubric?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RubricResult {
  id?: string;
  proposalDraftId?: string;
  scores: {
    thesisClarity: number;
    scopePrecision: number;
    evidenceIntegration: number;
    synthesisDepth: number;
    methodologicalAwareness: number;
    structuralCompleteness: number;
    citationPresence: number;
  };
  narrativeFeedback: Record<string, string>;
  priorityFixes: string[];
  revisionRoadmap: string[];
  createdAt?: string;
}

// Helper to convert RubricResult scores to dimension array for display
export interface RubricDimension {
  name: string;
  key: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ResearchDesign {
  name: string;
  category: 'quantitative' | 'qualitative' | 'synthesis' | 'analytic';
  description: string;
  whenUsed: string;
  evidenceStrength: string;
}

export interface SearchStrategy {
  topic: string;
  population: string;
  keywords: string[];
  operators: string[];
  filters: string[];
  searchString: string;
}

export type StageStatus = 'not_started' | 'in_progress' | 'complete' | 'locked';

export interface PipelineStage {
  id: string;
  name: string;
  status: StageStatus;
  path: string;
  unlockRequirement?: string;
}

export interface ReviewProgress {
  total: number;
  included: number;
  excluded: number;
}
