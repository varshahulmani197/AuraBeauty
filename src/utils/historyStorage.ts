import { SkinAnalysisResult } from '../types/skinAnalysis.ts';

export interface SkinHistoryEntry {
  id: string;
  date: string; // Display date e.g. "Oct 3"
  fullDate: string; // ISO string
  overallScore: number;
  skinAge: number;
  chronologicalAge: number;
  moisture: number;
  oiliness: number;
  textureScore: number;
  skinType: string;
  primaryConcern: string;
  thumbnailUrl?: string;
  notes?: string;
}

const STORAGE_KEY = 'aurabeauty_skin_history';

// Realistic 4-week clinical history showing barrier recovery progression
const DEFAULT_MOCK_HISTORY: SkinHistoryEntry[] = [
  {
    id: 'hist-1',
    date: 'Sep 26',
    fullDate: '2026-09-26T09:15:00.000Z',
    overallScore: 75,
    skinAge: 28,
    chronologicalAge: 26,
    moisture: 60,
    oiliness: 78,
    textureScore: 72,
    skinType: 'Combination',
    primaryConcern: 'Dehydration & T-Zone Pores',
    notes: 'Initial baseline scan before targeted routine adoption.',
  },
  {
    id: 'hist-2',
    date: 'Oct 03',
    fullDate: '2026-10-03T10:30:00.000Z',
    overallScore: 78,
    skinAge: 27,
    chronologicalAge: 26,
    moisture: 66,
    oiliness: 74,
    textureScore: 76,
    skinType: 'Combination',
    primaryConcern: 'Mild T-Zone Oiliness',
    notes: 'Added BHA 2% and Niacinamide serum.',
  },
  {
    id: 'hist-3',
    date: 'Oct 10',
    fullDate: '2026-10-10T08:45:00.000Z',
    overallScore: 80,
    skinAge: 26,
    chronologicalAge: 26,
    moisture: 72,
    oiliness: 70,
    textureScore: 79,
    skinType: 'Combination',
    primaryConcern: 'Infraorbital Shadowing',
    notes: 'Increased cellular hydration noted in lateral cheeks.',
  },
  {
    id: 'hist-4',
    date: 'Oct 17',
    fullDate: '2026-10-17T11:20:00.000Z',
    overallScore: 82,
    skinAge: 25,
    chronologicalAge: 26,
    moisture: 75,
    oiliness: 66,
    textureScore: 82,
    skinType: 'Combination',
    primaryConcern: 'Under-Eye Fatigue',
    notes: 'Pore diameters visually refined along nasal wings.',
  },
  {
    id: 'hist-5',
    date: 'Oct 24',
    fullDate: '2026-10-24T08:00:00.000Z',
    overallScore: 84,
    skinAge: 24,
    chronologicalAge: 26,
    moisture: 77,
    oiliness: 64,
    textureScore: 85,
    skinType: 'Combination',
    primaryConcern: 'Minimal Vascular Redness',
    notes: 'Optimal stratum corneum cohesion achieved.',
  },
];

export function getStoredHistory(): SkinHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_HISTORY));
      return DEFAULT_MOCK_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOCK_HISTORY;
  } catch (err) {
    console.warn('Failed to parse skin history from localStorage:', err);
    return DEFAULT_MOCK_HISTORY;
  }
}

export function saveAnalysisToHistory(
  analysis: SkinAnalysisResult,
  thumbnailUrl?: string
): SkinHistoryEntry[] {
  try {
    const existing = getStoredHistory();
    const now = new Date(analysis.analyzedAt || new Date());
    const displayDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Calculate average moisture & oiliness across segments
    const segmentList = Object.values(analysis.segments || {});
    const avgMoisture = segmentList.length
      ? Math.round(segmentList.reduce((acc, s) => acc + s.moisture, 0) / segmentList.length)
      : 75;
    const avgOiliness = segmentList.length
      ? Math.round(segmentList.reduce((acc, s) => acc + s.oiliness, 0) / segmentList.length)
      : 65;
    const avgTexture = segmentList.length
      ? Math.round(segmentList.reduce((acc, s) => acc + s.textureScore, 0) / segmentList.length)
      : 80;

    const newEntry: SkinHistoryEntry = {
      id: analysis.analysisId || `hist-${Date.now()}`,
      date: displayDate,
      fullDate: now.toISOString(),
      overallScore: analysis.overallScore,
      skinAge: analysis.skinAge,
      chronologicalAge: analysis.chronologicalAgeEstimate,
      moisture: avgMoisture,
      oiliness: avgOiliness,
      textureScore: avgTexture,
      skinType: analysis.skinType,
      primaryConcern:
        analysis.concernsSummary?.[0]?.name || 'Localized Barrier Calibration',
      thumbnailUrl,
      notes: analysis.summary ? analysis.summary.slice(0, 100) + '...' : undefined,
    };

    // Avoid duplicate entry if scanned in same minute
    const updated = [
      ...existing.filter((e) => e.id !== newEntry.id),
      newEntry,
    ].slice(-20); // Keep last 20

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save skin analysis to history:', err);
    return getStoredHistory();
  }
}

export function resetHistory(): SkinHistoryEntry[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_HISTORY));
  return DEFAULT_MOCK_HISTORY;
}
