import { SkinAnalysisResult } from './skinAnalysis.ts';

export type ProductVerdictStatus = 'green_light' | 'caution' | 'hard_stop';

export interface IngredientAuditItem {
  name: string;
  inciName?: string;
  role: 'hero_active' | 'comedogenic_risk' | 'barrier_irritant' | 'neutral_support' | 'conflict_active';
  comedogenicRating?: number; // 0-5 scale
  irritancyRating?: number; // 0-5 scale
  matchNote: string;
  conflictWithUserProfile?: boolean;
  targetBenefit?: string;
}

export interface ProductAnalysisVerdict {
  productId: string;
  productName: string;
  brandName?: string;
  productCategory: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'mask' | 'treatment';
  verdictStatus: ProductVerdictStatus;
  verdictHeadline: string;
  verdictSummary: string;
  compatibilityScore: number; // 0-100%
  recommendedFrequency: string; // e.g. "Daily AM & PM", "2x weekly at night", "Discontinue use"
  segmentSpecificAdvice: string; // e.g. "Safe on lateral cheeks, but avoid on active T-zone pores"
  keyActiveHighlights: string[];
  flaggedConcerns: string[];
  ingredientDetails: IngredientAuditItem[];
  rawIngredientList: string;
  analyzedAt: string;
  imageUrl?: string;
}

export interface StoredShelfProduct extends ProductAnalysisVerdict {
  savedAt: string;
  userNotes?: string;
}
