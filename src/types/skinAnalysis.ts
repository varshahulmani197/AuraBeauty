/**
 * Perfect Corp YouCam AI Skin Analysis Data Types & Schema
 */

export type SkinZoneId = 
  | 'forehead' 
  | 'left_cheek' 
  | 'right_cheek' 
  | 'nose' 
  | 'chin' 
  | 'under_eyes';

export type SkinConcernType =
  | 'spots'
  | 'wrinkles'
  | 'texture'
  | 'dark_circles'
  | 'redness'
  | 'oiliness'
  | 'moisture'
  | 'pores'
  | 'radiance'
  | 'firmness'
  | 'acne';

export interface DetectedConcernItem {
  type: SkinConcernType;
  label: string;
  severity: 'minimal' | 'mild' | 'moderate' | 'high';
  score: number; // 0-100 scale (100 = flawless/optimal)
  details: string;
}

export interface FaceSegment {
  id: SkinZoneId;
  name: string;
  zoneScore: number; // 0-100 (100 = pristine)
  status: 'optimal' | 'mild_concern' | 'attention_needed';
  // Relative percentages on face viewport [0-100]
  center: { x: number; y: number };
  boundingBox: { x: number; y: number; width: number; height: number };
  polygonPoints: string; // e.g. "20,15 80,15 75,35 25,35"
  moisture: number; // 0-100
  oiliness: number; // 0-100
  textureScore: number; // 0-100
  detectedConcerns: DetectedConcernItem[];
  clinicalNotes: string;
  recommendedActives: string[];
}

export interface ConcernMetric {
  type: SkinConcernType;
  name: string;
  score: number; // 0-100
  severityLevel: 'healthy' | 'moderate' | 'concern';
  description: string;
  primaryAffectedSegments: SkinZoneId[];
  clinicalInsight: string;
}

export interface RoutineStep {
  step: string;
  category: 'cleanse' | 'prep' | 'treat' | 'hydrate' | 'protect';
  productName: string;
  keyActives: string[];
  targetZones: SkinZoneId[];
  instructions: string;
}

export interface SkinAnalysisResult {
  analysisId: string;
  analyzedAt: string;
  overallScore: number; // 0-100
  skinAge: number;
  chronologicalAgeEstimate: number;
  skinType: 'Normal' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive';
  skinTypeDescription: string;
  summary: string;
  segments: Record<SkinZoneId, FaceSegment>;
  concernsSummary: ConcernMetric[];
  routine: {
    morning: RoutineStep[];
    evening: RoutineStep[];
    weeklyTreatments: Array<{ name: string; frequency: string; target: string; activeNotes: string }>;
  };
  perfectCorpEngine: {
    apiVersion: string;
    engineType: 'perfect_corp_cloud_api' | 'gemini_vision_clinical_engine' | 'calibrated_biometric_model';
    isLiveApiKey: boolean;
    accuracyConfidence: number;
    processingTimeMs: number;
    modelVersion: string;
  };
}

export interface AnalysisRequestPayload {
  image: string; // base64 data url or base64
  perfectCorpApiKey?: string;
  chronologicalAge?: number;
  genderFocus?: 'all' | 'female' | 'male';
}
