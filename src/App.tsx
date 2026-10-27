/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  Layers,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { SelfieUploadModal } from './components/SelfieUploadModal.tsx';
import { InteractiveFaceCanvas } from './components/InteractiveFaceCanvas.tsx';
import { SegmentAnalysisDetail } from './components/SegmentAnalysisDetail.tsx';
import { ClinicalScoresDashboard } from './components/ClinicalScoresDashboard.tsx';
import { SkincareRoutineSection } from './components/SkincareRoutineSection.tsx';
import { ApiSettingsModal } from './components/ApiSettingsModal.tsx';
import { AnalysisProgressStepper, LifecycleStep } from './components/AnalysisProgressStepper.tsx';
import { SkinHistoryChart } from './components/SkinHistoryChart.tsx';
import { RagChatbot } from './components/RagChatbot.tsx';
import { MyShelfSection } from './components/MyShelfSection.tsx';
import {
  SkinHistoryEntry,
  getStoredHistory,
  saveAnalysisToHistory,
  resetHistory,
} from './utils/historyStorage.ts';
import { SAMPLE_PROFILES } from './data/sampleProfiles.ts';
import {
  SkinAnalysisResult,
  SkinZoneId,
  SkinConcernType,
} from './types/skinAnalysis.ts';

// Initial preloaded clinical diagnosis for Elena Rostova sample profile
const INITIAL_ANALYSIS: SkinAnalysisResult = {
  analysisId: 'PC-SA-INIT-ELENA',
  analyzedAt: new Date().toISOString(),
  overallScore: 84,
  skinAge: 24,
  chronologicalAgeEstimate: 26,
  skinType: 'Combination',
  skinTypeDescription:
    'Mild sebum concentration in T-Zone (forehead & nose) with normal-to-dry balanced barrier along lateral cheeks and jawline.',
  summary:
    'Epidermal analysis demonstrates superior cellular turnover and barrier cohesion, with localized follicular dilation across the nasal bridge, trace periorbital fatigue shadowing, and well-hydrated lateral zygomatic arches.',
  segments: {
    forehead: {
      id: 'forehead',
      name: 'Forehead Zone',
      zoneScore: 82,
      status: 'mild_concern',
      center: { x: 50, y: 22 },
      boundingBox: { x: 22, y: 12, width: 56, height: 20 },
      polygonPoints: '22,12 78,12 74,32 26,32',
      moisture: 72,
      oiliness: 68,
      textureScore: 80,
      detectedConcerns: [
        {
          type: 'wrinkles',
          label: 'Horizontal Expression Micro-creases',
          severity: 'minimal',
          score: 85,
          details: 'Subtle superficial dynamic furrows visible under bright directional illumination.',
        },
        {
          type: 'oiliness',
          label: 'T-Zone Sebum Sheen',
          severity: 'mild',
          score: 75,
          details: 'Moderate sebaceous gland activity noted across the central glabella area.',
        },
      ],
      clinicalNotes:
        'Glabella and forehead exhibit moderate oiliness. Micro-relief is smooth with minimal hyperpigmentation.',
      recommendedActives: ['Niacinamide (5%)', 'Zinc PCA', 'Lightweight Gel Moisturizer'],
    },
    nose: {
      id: 'nose',
      name: 'Nose & Central T-Zone',
      zoneScore: 78,
      status: 'mild_concern',
      center: { x: 50, y: 48 },
      boundingBox: { x: 38, y: 36, width: 24, height: 24 },
      polygonPoints: '43,36 57,36 60,60 40,60',
      moisture: 65,
      oiliness: 76,
      textureScore: 74,
      detectedConcerns: [
        {
          type: 'pores',
          label: 'Enlarged Follicular Openings',
          severity: 'moderate',
          score: 72,
          details: 'Pores dilated around nasal wings and apex due to natural lipid accumulation.',
        },
        {
          type: 'spots',
          label: 'Sebaceous Filaments',
          severity: 'mild',
          score: 79,
          details: 'Visible localized follicular oxidization at the nasal apex.',
        },
      ],
      clinicalNotes:
        'Pore diameter slightly expanded. Recommended gentle salicylic acid exfoliation 2-3x weekly.',
      recommendedActives: ['Salicylic Acid (BHA 2%)', 'Witch Hazel extract', 'Clay Purifying Mask'],
    },
    left_cheek: {
      id: 'left_cheek',
      name: 'Left Cheek Segment',
      zoneScore: 88,
      status: 'optimal',
      center: { x: 30, y: 56 },
      boundingBox: { x: 18, y: 44, width: 25, height: 26 },
      polygonPoints: '20,44 42,46 38,70 18,65',
      moisture: 84,
      oiliness: 42,
      textureScore: 89,
      detectedConcerns: [
        {
          type: 'redness',
          label: 'Faint Capillary Reactivity',
          severity: 'minimal',
          score: 87,
          details: 'Trace erythema along malar prominence, consistent with normal vascular response.',
        },
        {
          type: 'spots',
          label: 'Minor UV Freckling',
          severity: 'minimal',
          score: 88,
          details: 'Isolated pinpoint melanin clusters under surface epidermal layer.',
        },
      ],
      clinicalNotes:
        'Superior epidermal barrier strength, even skin tone, and balanced lipid level.',
      recommendedActives: ['Centella Asiatica', 'Ceramides NP/AP', 'Broad-Spectrum SPF 50+'],
    },
    right_cheek: {
      id: 'right_cheek',
      name: 'Right Cheek Segment',
      zoneScore: 87,
      status: 'optimal',
      center: { x: 70, y: 56 },
      boundingBox: { x: 57, y: 44, width: 25, height: 26 },
      polygonPoints: '58,46 80,44 82,65 62,70',
      moisture: 82,
      oiliness: 45,
      textureScore: 88,
      detectedConcerns: [
        {
          type: 'texture',
          label: 'Smooth Micro-relief',
          severity: 'minimal',
          score: 90,
          details: 'Uniform cellular turnover observed with minimal textural roughness.',
        },
        {
          type: 'redness',
          label: 'Subtle Thermal Flushing',
          severity: 'minimal',
          score: 86,
          details: 'Mild transient warmth in mid-cheek quadrant.',
        },
      ],
      clinicalNotes:
        'Well-hydrated stratum corneum. High cellular bounce and luminous reflectance.',
      recommendedActives: ['Hyaluronic Acid 3D Matrix', 'Squalane', 'Vitamin E Antioxidant'],
    },
    chin: {
      id: 'chin',
      name: 'Chin & Mandibular Zone',
      zoneScore: 85,
      status: 'optimal',
      center: { x: 50, y: 80 },
      boundingBox: { x: 34, y: 70, width: 32, height: 18 },
      polygonPoints: '35,70 65,70 60,88 40,88',
      moisture: 75,
      oiliness: 55,
      textureScore: 84,
      detectedConcerns: [
        {
          type: 'texture',
          label: 'Mild Mandibular Roughness',
          severity: 'minimal',
          score: 82,
          details: 'Slight micro-texture variation around the lower lip indentation.',
        },
      ],
      clinicalNotes:
        'Good collagen firmness along jawline with clean mandibular contours.',
      recommendedActives: ['Azelaic Acid (10%)', 'Panthenol (Pro-Vitamin B5)', 'Peptide Complex'],
    },
    under_eyes: {
      id: 'under_eyes',
      name: 'Peri-Orbital & Under-Eye',
      zoneScore: 76,
      status: 'mild_concern',
      center: { x: 50, y: 40 },
      boundingBox: { x: 24, y: 34, width: 52, height: 12 },
      polygonPoints: '24,35 44,36 44,46 25,44 M 56,36 76,35 75,44 56,46',
      moisture: 68,
      oiliness: 28,
      textureScore: 78,
      detectedConcerns: [
        {
          type: 'dark_circles',
          label: 'Vascular Fatigue Shadowing',
          severity: 'mild',
          score: 74,
          details: 'Sub-orbital venous pooling visible through fine periorbital skin.',
        },
        {
          type: 'wrinkles',
          label: 'Dehydration Fine Lines',
          severity: 'minimal',
          score: 80,
          details: 'Faint lateral crow creases intensified by moisture deficit.',
        },
      ],
      clinicalNotes:
        'Thin delicate skin requires targeted peptide nourishment and vasoconstrictive caffeine.',
      recommendedActives: ['Caffeine (5%) + EGCG', 'Palmitoyl Tripeptide-38', 'Multi-weight Hyaluronic Acid'],
    },
  },
  concernsSummary: [
    {
      type: 'spots',
      name: 'Spots & Hyperpigmentation',
      score: 85,
      severityLevel: 'healthy',
      description: 'Low density of localized sun freckling and epidermal melanin deposits.',
      primaryAffectedSegments: ['left_cheek', 'nose'],
      clinicalInsight: 'Melanin distribution is predominantly uniform. Regular SPF protection prevents darkening.',
    },
    {
      type: 'wrinkles',
      name: 'Wrinkles & Fine Lines',
      score: 83,
      severityLevel: 'healthy',
      description: 'Superficial dynamic expression lines limited to the upper forehead and peri-orbital creases.',
      primaryAffectedSegments: ['forehead', 'under_eyes'],
      clinicalInsight: 'Skin elasticity maintains fast rebound. Retinoid or peptide stimulation will preserve dermal matrix.',
    },
    {
      type: 'texture',
      name: 'Texture & Smoothness',
      score: 84,
      severityLevel: 'healthy',
      description: 'Fine cellular micro-relief with minimal roughness index.',
      primaryAffectedSegments: ['nose', 'chin'],
      clinicalInsight: 'Surface smoothness is within the upper 80th percentile for the demographic cohort.',
    },
    {
      type: 'dark_circles',
      name: 'Dark Circles & Periorbital Tone',
      score: 74,
      severityLevel: 'moderate',
      description: 'Moderate blue-purple vascular shadow concentrated in the infraorbital trough.',
      primaryAffectedSegments: ['under_eyes'],
      clinicalInsight: 'Infraorbital dermis is thin; microcirculation support via caffeine and hydration improves radiance.',
    },
    {
      type: 'redness',
      name: 'Redness & Erythema',
      score: 86,
      severityLevel: 'healthy',
      description: 'Minimal capillary dilation; localized mild warmth across the malar area.',
      primaryAffectedSegments: ['left_cheek', 'right_cheek'],
      clinicalInsight: 'Barrier functions normally without signs of rosacea or inflammatory flare.',
    },
    {
      type: 'oiliness',
      name: 'Oiliness & Sebum Balance',
      score: 75,
      severityLevel: 'moderate',
      description: 'Elevated lipid excretion across forehead and nose, contrasting with dry perimeter.',
      primaryAffectedSegments: ['forehead', 'nose'],
      clinicalInsight: 'Characteristic of classic combination profile. Balancing cleanser and niacinamide will normalize output.',
    },
    {
      type: 'moisture',
      name: 'Moisture & Barrier Hydration',
      score: 77,
      severityLevel: 'healthy',
      description: 'Normal water content with slight trans-epidermal deficit around orbital zone.',
      primaryAffectedSegments: ['under_eyes', 'chin'],
      clinicalInsight: 'Humectant layers (glycerin + hyaluronic acid) will lock in deep cellular water.',
    },
    {
      type: 'pores',
      name: 'Pore Size & Clarity',
      score: 73,
      severityLevel: 'moderate',
      description: 'Noticeable follicular dilation clustered at the nasal bridge and inner cheeks.',
      primaryAffectedSegments: ['nose'],
      clinicalInsight: 'Follicular clearing using lipophilic BHA helps refine pore wall appearance.',
    },
    {
      type: 'radiance',
      name: 'Radiance & Luminescence',
      score: 88,
      severityLevel: 'healthy',
      description: 'Healthy natural light reflectance with vivid vitality.',
      primaryAffectedSegments: ['left_cheek', 'right_cheek'],
      clinicalInsight: 'Even surface light reflection indicates strong cellular cohesion.',
    },
    {
      type: 'firmness',
      name: 'Firmness & Elasticity',
      score: 86,
      severityLevel: 'healthy',
      description: 'High dermal recoil rate along the lower third jawline and zygomatic arch.',
      primaryAffectedSegments: ['chin', 'left_cheek', 'right_cheek'],
      clinicalInsight: 'Collagen fiber alignment is structurally resilient.',
    },
  ],
  routine: {
    morning: [
      {
        step: '1',
        category: 'cleanse',
        productName: 'Gentle Amino Acid Foaming Wash',
        keyActives: ['Sodium Cocoyl Glycinate', 'Glycerin', 'Green Tea Extract'],
        targetZones: ['forehead', 'nose', 'chin', 'left_cheek', 'right_cheek'],
        instructions: 'Lather with tepid water for 45 seconds focusing gently on the T-zone.',
      },
      {
        step: '2',
        category: 'treat',
        productName: 'Targeted Niacinamide + Zinc Serum',
        keyActives: ['Niacinamide (5%)', 'Zinc PCA (1%)', 'Hyaluronic Acid'],
        targetZones: ['forehead', 'nose'],
        instructions: 'Apply 3 drops onto T-Zone to regulate sebum output and tighten pore contours.',
      },
      {
        step: '3',
        category: 'treat',
        productName: 'Caffeine & Peptide Awakening Eye Fluid',
        keyActives: ['Caffeine (5%)', 'Matrixyl 3000', 'Centella Asiatica'],
        targetZones: ['under_eyes'],
        instructions: 'Gently tap along the orbital bone using ring finger from inner to outer corner.',
      },
      {
        step: '4',
        category: 'hydrate',
        productName: 'Barrier Restorative Ceramide Gel Cream',
        keyActives: ['Ceramides NP/EOP', 'Panthenol (2%)', 'Squalane'],
        targetZones: ['left_cheek', 'right_cheek', 'chin', 'forehead'],
        instructions: 'Massage evenly into face and neck for weightless, non-comedogenic hydration.',
      },
      {
        step: '5',
        category: 'protect',
        productName: 'Broad Spectrum Invisible Fluid SPF 50+ PA++++',
        keyActives: ['Mexoryl 400', 'Vitamin E', 'Silica Sebum Absorber'],
        targetZones: ['forehead', 'nose', 'left_cheek', 'right_cheek', 'chin', 'under_eyes'],
        instructions: 'Apply generous two-finger length as final morning layer before any cosmetic application.',
      },
    ],
    evening: [
      {
        step: '1',
        category: 'cleanse',
        productName: 'Squalane Lipid Cleansing Emulsion',
        keyActives: ['Plant-derived Squalane', 'Bisabolol'],
        targetZones: ['forehead', 'nose', 'left_cheek', 'right_cheek', 'chin', 'under_eyes'],
        instructions: 'Dissolves SPF, airborne pollutants, and oxidized sebum without stripping lipids.',
      },
      {
        step: '2',
        category: 'treat',
        productName: 'Encapsulated Retinal & Peptide Complex',
        keyActives: ['Retinaldehyde (0.05%)', 'Copper Peptides', 'Allantoin'],
        targetZones: ['forehead', 'left_cheek', 'right_cheek', 'chin'],
        instructions: 'Apply pea-sized amount 3 nights a week to stimulate dermal collagen and cellular turnover.',
      },
      {
        step: '3',
        category: 'hydrate',
        productName: 'Deep Moisture Recovery Night Balm',
        keyActives: ['Beta-Glucan', 'Ceramide Complex', 'Shea Butter Fractions'],
        targetZones: ['left_cheek', 'right_cheek', 'chin'],
        instructions: 'Seal moisture into lateral face to prevent overnight trans-epidermal moisture loss.',
      },
    ],
    weeklyTreatments: [
      {
        name: 'BHA 2% Liquid Exfoliating Treatment',
        frequency: 'Twice a week (T-Zone focus)',
        target: 'Nose & Forehead follicular congestion',
        activeNotes: 'Penetrates oil-filled pores to dissolve micro-comedones and dead keratinocytes.',
      },
      {
        name: 'Hydrogel Cold Plumping Eye Mask',
        frequency: 'Once weekly or prior to events',
        target: 'Peri-orbital microcirculation and fatigue',
        activeNotes: 'Immediate cooling sensation diminishes vascular swelling and smooths fine dehydration crinkles.',
      },
    ],
  },
  perfectCorpEngine: {
    apiVersion: 'v2.4.1-pro',
    engineType: 'gemini_vision_clinical_engine',
    isLiveApiKey: false,
    accuracyConfidence: 0.964,
    processingTimeMs: 420,
    modelVersion: 'YouCam-Clinical-AI-Vision-v4',
  },
};

export default function App() {
  const [selfieUrl, setSelfieUrl] = useState<string>(SAMPLE_PROFILES[0].imageDataUrl);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult>(INITIAL_ANALYSIS);
  const [selectedSegmentId, setSelectedSegmentId] = useState<SkinZoneId>('nose');
  const [highlightedConcernType, setHighlightedConcernType] = useState<SkinConcernType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lifecycleStep, setLifecycleStep] = useState<LifecycleStep>('routine');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState<boolean>(false);
  const [perfectCorpApiKey, setPerfectCorpApiKey] = useState<string>(() => {
    return localStorage.getItem('dermaura_pc_key') || '';
  });
  const [history, setHistory] = useState<SkinHistoryEntry[]>(() => getStoredHistory());

  const handleSaveApiKey = (key: string) => {
    setPerfectCorpApiKey(key);
    localStorage.setItem('dermaura_pc_key', key);
  };

  const handleLogCurrentScan = () => {
    const updated = saveAnalysisToHistory(analysis, selfieUrl);
    setHistory(updated);
  };

  const handleResetHistory = () => {
    const updated = resetHistory();
    setHistory(updated);
  };

  const handleStepClick = (step: LifecycleStep) => {
    setLifecycleStep(step);
    if (step === 'upload') {
      setIsUploadOpen(true);
    } else if (step === 'mapping') {
      document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 'analyzing') {
      document.getElementById('diagnostics')?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === 'routine') {
      document.getElementById('routine')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRunAnalysis = async (base64Image: string, age: number) => {
    setSelfieUrl(base64Image);
    setIsLoading(true);
    setLifecycleStep('upload');

    // Simulate animated step progression through the skin analysis lifecycle
    const timerMapping = setTimeout(() => {
      setLifecycleStep('mapping');
    }, 450);

    const timerAnalyzing = setTimeout(() => {
      setLifecycleStep('analyzing');
    }, 1100);

    try {
      const response = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          chronologicalAge: age,
          perfectCorpApiKey: perfectCorpApiKey.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result: SkinAnalysisResult = await response.json();
      setAnalysis(result);
      setSelectedSegmentId('nose');
      setLifecycleStep('routine');

      // Automatically store and append scan to local storage history
      const updatedHistory = saveAnalysisToHistory(result, base64Image);
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Skin analysis failed:', err);
      setLifecycleStep('routine');
    } finally {
      clearTimeout(timerMapping);
      clearTimeout(timerAnalyzing);
      setIsLoading(false);
    }
  };

  const activeSegment = analysis.segments[selectedSegmentId] || analysis.segments.forehead;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 font-sans">
      {/* Navigation Bar adhering to Top Bar Contract */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        activeSection="scanner"
        hasResult={true}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Kicker & Title */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>Dermatological Diagnostic Suite</span>
            <span aria-hidden="true">·</span>
            <span>Perfect Corp YouCam Standard</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              6 Facial Segments Calibrated
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-display">
                Facial Segment Skin Diagnostics
              </h1>
              <p className="mt-1 text-sm text-stone-600 max-w-2xl text-balance">
                High-precision biometric skin evaluation mapping hydration, sebum, pore clarity, and micro-texture across each localized zone of your face.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Camera className="w-4 h-4" />
                <span>Upload New Selfie</span>
              </button>
            </div>
          </div>
        </section>

        {/* Visual Progress Stepper Component: Upload -> Mapping -> Analyzing -> Routine Generation */}
        <section>
          <AnalysisProgressStepper
            currentStep={lifecycleStep}
            isLoading={isLoading}
            onStepClick={handleStepClick}
          />
        </section>

        {/* Diagnostic Hero Split (Interactive Face Canvas + Segment Breakdown) */}
        <section id="scanner" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Face Canvas with Overlays */}
          <div className="lg:col-span-7 space-y-3">
            <InteractiveFaceCanvas
              selfieUrl={selfieUrl}
              analysis={analysis}
              selectedSegmentId={selectedSegmentId}
              onSelectSegment={(id) => setSelectedSegmentId(id)}
              highlightedConcernType={highlightedConcernType}
            />
            <div className="flex items-center justify-between text-xs text-stone-500 px-2 font-mono">
              <span>Scan ID: {analysis.analysisId}</span>
              <span>Click any zone to inspect localized biometrics</span>
            </div>
          </div>

          {/* Right Column: Localized Segment Detail Panel */}
          <div id="segments" className="lg:col-span-5 space-y-4">
            <SegmentAnalysisDetail
              segment={activeSegment}
              onFilterConcern={(concernType) =>
                setHighlightedConcernType(
                  highlightedConcernType === concernType ? null : (concernType as SkinConcernType)
                )
              }
            />

            {/* Quick Diagnostic Clinical Overview Banner */}
            <div className="p-4 bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-600" />
                Full Face Diagnostic Summary
              </div>
              <p className="text-stone-600 leading-relaxed">{analysis.summary}</p>
            </div>
          </div>
        </section>

        {/* Global Clinical Scores Dashboard (10-Factor Radar & KPIs) */}
        <section id="diagnostics">
          <ClinicalScoresDashboard
            analysis={analysis}
            highlightedConcernType={highlightedConcernType}
            onSelectConcern={(type) => setHighlightedConcernType(type)}
          />
        </section>

        {/* MyShelf: Product Ingredient Analyzer & Cosmetic Safety Engine */}
        <section id="myshelf">
          <MyShelfSection currentAnalysis={analysis} />
        </section>

        {/* Skin History & Trend Visualization via Recharts */}
        <section id="history">
          <SkinHistoryChart
            history={history}
            onResetHistory={handleResetHistory}
            onLogCurrentScan={handleLogCurrentScan}
            currentAnalysis={analysis}
          />
        </section>

        {/* Personalized Skincare Protocol Section */}
        <section id="routine">
          <SkincareRoutineSection analysis={analysis} />
        </section>
      </main>

      {/* Footer adhering strictly to Anti-Slop Discipline */}
      <footer className="border-t border-stone-200 bg-white mt-12 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-display">AuraBeauty</span>
            <span aria-hidden="true">·</span>
            <span>Perfect Corp Skin Analysis API Schema Standard</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              API Key Setup
            </button>
            <a
              href="https://www.perfectcorp.com/business/products/ai-skin-analysis"
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 transition-colors"
            >
              Specification Docs
            </a>
            <span>© {new Date().getFullYear()} AuraBeauty Clinical Diagnostics</span>
          </div>
        </div>
      </footer>

      {/* Selfie Intake Modal (Upload / Webcam / Sample Profiles) */}
      <SelfieUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSelectImage={handleRunAnalysis}
        isLoading={isLoading}
      />

      {/* API Key & Architecture Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        apiKey={perfectCorpApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* RAG Chatbot for Skincare & Diagnostic Queries */}
      <RagChatbot currentAnalysis={analysis} />
    </div>
  );
}
