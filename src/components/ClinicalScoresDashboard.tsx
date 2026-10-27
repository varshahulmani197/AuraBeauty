import React from 'react';
import {
  Sparkles,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ConcernMetric, SkinAnalysisResult, SkinConcernType } from '../types/skinAnalysis.ts';

interface ClinicalScoresDashboardProps {
  analysis: SkinAnalysisResult;
  highlightedConcernType: string | null;
  onSelectConcern: (type: SkinConcernType | null) => void;
}

export const ClinicalScoresDashboard: React.FC<ClinicalScoresDashboardProps> = ({
  analysis,
  highlightedConcernType,
  onSelectConcern,
}) => {
  const getSeverityBadge = (level: ConcernMetric['severityLevel']) => {
    switch (level) {
      case 'healthy':
        return (
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Healthy Range
          </span>
        );
      case 'moderate':
        return (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            Moderate Concern
          </span>
        );
      case 'concern':
        return (
          <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            Needs Treatment
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-KPI Executive Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Overall Score */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Overall Skin Score</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {analysis.overallScore}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Top 18% in peer demographic
          </p>
        </div>

        {/* Skin Age */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Skin Age</span>
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {analysis.skinAge}
            </span>
            <span className="text-xs text-stone-500">
              (Chronological: {analysis.chronologicalAgeEstimate})
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-600 font-medium">
            {analysis.skinAge <= analysis.chronologicalAgeEstimate
              ? `Biologically ${analysis.chronologicalAgeEstimate - analysis.skinAge} yrs younger`
              : `Signs of accelerated environmental aging`}
          </p>
        </div>

        {/* Skin Type */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Skin Type</span>
            <Layers className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-stone-900 truncate">
            {analysis.skinType}
          </div>
          <p className="mt-1 text-xs text-stone-500 truncate">
            {analysis.skinTypeDescription}
          </p>
        </div>

        {/* API Diagnostic Standard */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>API Compliance</span>
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-2 text-sm font-semibold text-stone-900 font-mono flex items-center gap-1.5">
            <span>Perfect Corp {analysis.perfectCorpEngine.apiVersion}</span>
          </div>
          <p className="mt-1 text-xs text-stone-500 font-mono">
            Confidence: {(analysis.perfectCorpEngine.accuracyConfidence * 100).toFixed(1)}% · {analysis.perfectCorpEngine.processingTimeMs}ms
          </p>
        </div>
      </div>

      {/* Clinical Concern Breakdown Grid */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              Clinical Concern Diagnostics (10-Factor Scan)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any concern to highlight its affected segments on your facial scan
            </p>
          </div>

          {highlightedConcernType && (
            <button
              onClick={() => onSelectConcern(null)}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium underline self-start sm:self-auto cursor-pointer"
            >
              Clear Concern Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.concernsSummary.map((concern) => {
            const isSelected = highlightedConcernType === concern.type;
            return (
              <div
                key={concern.type}
                onClick={() =>
                  onSelectConcern(isSelected ? null : concern.type)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/40 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                      <span>{concern.name}</span>
                      {getSeverityBadge(concern.severityLevel)}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-normal">
                      {concern.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                      {concern.score}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">/100</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mt-3 w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      concern.score >= 85
                        ? 'bg-emerald-500'
                        : concern.score >= 75
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${concern.score}%` }}
                  />
                </div>

                {/* Target Segments affected */}
                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-mono">
                    Affects: {concern.primaryAffectedSegments.join(', ')}
                  </span>
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Insight
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
