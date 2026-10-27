import React, { useState } from 'react';
import { Sun, Moon, Calendar, Download, Check, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { SkinAnalysisResult } from '../types/skinAnalysis.ts';

interface SkincareRoutineSectionProps {
  analysis: SkinAnalysisResult;
}

export const SkincareRoutineSection: React.FC<SkincareRoutineSectionProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'weekly'>('morning');
  const [copiedReport, setCopiedReport] = useState(false);

  const handleExportReport = () => {
    const reportText = `
AURABEAUTY · PERFECT CORP AI CLINICAL SKIN REPORT
==================================================
Date: ${new Date(analysis.analyzedAt).toLocaleDateString()}
Analysis ID: ${analysis.analysisId}
Overall Skin Health: ${analysis.overallScore}/100
Skin Age: ${analysis.skinAge} (Chronological: ${analysis.chronologicalAgeEstimate})
Skin Type: ${analysis.skinType} - ${analysis.skinTypeDescription}

SEGMENT BREAKDOWN:
- Forehead: ${analysis.segments.forehead.zoneScore}/100 (${analysis.segments.forehead.status})
- Nose & T-Zone: ${analysis.segments.nose.zoneScore}/100 (${analysis.segments.nose.status})
- Left Cheek: ${analysis.segments.left_cheek.zoneScore}/100 (${analysis.segments.left_cheek.status})
- Right Cheek: ${analysis.segments.right_cheek.zoneScore}/100 (${analysis.segments.right_cheek.status})
- Chin: ${analysis.segments.chin.zoneScore}/100 (${analysis.segments.chin.status})
- Under-Eyes: ${analysis.segments.under_eyes.zoneScore}/100 (${analysis.segments.under_eyes.status})

RECOMMENDED AM ROUTINE:
${analysis.routine.morning.map((s) => `[Step ${s.step}] ${s.productName} (${s.keyActives.join(', ')}) -> Focus on: ${s.targetZones.join(', ')}`).join('\n')}

RECOMMENDED PM ROUTINE:
${analysis.routine.evening.map((s) => `[Step ${s.step}] ${s.productName} (${s.keyActives.join(', ')}) -> Focus on: ${s.targetZones.join(', ')}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div id="routine" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold">
            Dermatological Protocol
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-display mt-0.5">
            Personalized Segment-Targeted Skincare Routine
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Formulated specifically to balance your {analysis.skinType.toLowerCase()} profile and targeted concerns
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          {copiedReport ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied Clinical Report</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export Skin Report</span>
            </>
          )}
        </button>
      </div>

      {/* Routine Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'morning'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Morning Protocol</span>
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'evening'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span>Evening Recovery</span>
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'weekly'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          <span>Weekly Focus</span>
        </button>
      </div>

      {/* Routine Cards List */}
      {activeTab === 'morning' && (
        <div className="space-y-3">
          {analysis.routine.morning.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-stone-400">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-stone-900">
                      {item.productName}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-normal">
                    {item.instructions}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.keyActives.map((active, aIdx) => (
                      <span
                        key={aIdx}
                        className="text-[10px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60"
                      >
                        {active}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/60">
                <div className="text-[10px] font-mono uppercase text-stone-400">Target Zones</div>
                <div className="text-xs font-medium text-rose-700 mt-0.5">
                  {item.targetZones.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'evening' && (
        <div className="space-y-3">
          {analysis.routine.evening.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-stone-400">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-stone-900">
                      {item.productName}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-normal">
                    {item.instructions}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.keyActives.map((active, aIdx) => (
                      <span
                        key={aIdx}
                        className="text-[10px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60"
                      >
                        {active}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/60">
                <div className="text-[10px] font-mono uppercase text-stone-400">Target Zones</div>
                <div className="text-xs font-medium text-rose-700 mt-0.5">
                  {item.targetZones.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.routine.weeklyTreatments.map((treatment, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-stone-900 font-display">
                  {treatment.name}
                </h4>
                <span className="text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                  {treatment.frequency}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-normal">
                {treatment.activeNotes}
              </p>
              <div className="text-[11px] text-stone-500 font-mono pt-1">
                Target: {treatment.target}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
