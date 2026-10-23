/** Shared learning-domain types for the planB learning app. */

export type VerificationStatus = 'verified' | 'needs_review' | 'outdated';

export type KnowledgeCardType =
  | 'concept'
  | 'rule'
  | 'process'
  | 'caution'
  | 'example';

export type KnowledgeCategory =
  | 'basics'
  | 'recommendation_bonus'
  | 'team_bonus'
  | 'qualification'
  | 'levels'
  | 'volume'
  | 'other';

/** Official source document metadata. */
export interface SourceDocument {
  id: string;
  title: string;
  version: string;
  market: string;
  validFrom?: string;
  validTo?: string;
  /** Page numbers referenced in the app (1-based, as printed). */
  pages?: number[];
  fileName?: string;
  status: VerificationStatus;
  notes?: string;
}

export interface SourceRef {
  sourceId: string;
  pages?: number[];
  note?: string;
}

/** Separates educational explanation from official wording. */
export interface KnowledgeCard {
  id: string;
  title: string;
  category: KnowledgeCategory;
  type: KnowledgeCardType;
  /** Plain-language explanation for newcomers. */
  plainExplanation: string;
  /** Official / near-official formulation from the source, if available. */
  officialWording?: string;
  conditions?: string[];
  exceptions?: string[];
  examples?: string[];
  commonMistakes?: string[];
  sources: SourceRef[];
  relatedIds?: string[];
  status: VerificationStatus;
}

export interface CalculationStep {
  label: string;
  detail: string;
  value?: number | string;
}

export interface CalculationExample {
  id: string;
  title: string;
  description: string;
  inputs: Record<string, number | number[] | string>;
  steps: CalculationStep[];
  expected: {
    recommendationBonus: number;
    teamBonus: number;
    selectedBonus: 'recommendation' | 'team';
    selectedAmount: number;
    ownLevelPercent: number;
    totalBb: number;
  };
  sources: SourceRef[];
  status: VerificationStatus;
  /** Reminder that figures are educational illustrations, not income guarantees. */
  disclaimer: string;
}

export interface LearningQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Zero-based index of the correct option. */
  correctIndex: number;
  explanation: string;
  sources: SourceRef[];
  status: VerificationStatus;
}

export interface LearningProgress {
  moduleId: string;
  completedTaskIds: string[];
  quizResults: Record<string, { selectedIndex: number; correct: boolean }>;
  scenarioResults: Record<string, { passed: boolean; at: string }>;
  updatedAt: string;
}

export interface LearningModuleMeta {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  status: 'available' | 'planned';
  whatYouGet: string[];
}
