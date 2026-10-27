import React from 'react';
import { Droplets, Activity, Sparkles, AlertCircle, CheckCircle2, Shield, Pill } from 'lucide-react';
import { FaceSegment } from '../types/skinAnalysis.ts';

interface SegmentAnalysisDetailProps {
  segment: FaceSegment;
  onFilterConcern?: (concernType: string) => void;
}

export const SegmentAnalysisDetail: React.FC<SegmentAnalysisDetailProps> = ({
  segment,
  onFilterConcern,
}) => {
  const getStatusBadge = (status: FaceSegment['status']) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Optimal Barrier
          </span>
        );
      case 'mild_concern':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Mild Concern
          </span>
        );
      case 'attention_needed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Needs Attention
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
      {/* Segment Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Localized Facial Zone
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-display mt-0.5">
            {segment.name}
          </h3>
          <div className="mt-2">{getStatusBadge(segment.status)}</div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-extrabold font-mono text-stone-900">
            {segment.zoneScore}
            <span className="text-sm font-normal text-stone-400">/100</span>
          </div>
          <div className="text-[11px] font-medium text-rose-600 mt-0.5">
            Zone Health Index
          </div>
        </div>
      </div>

      {/* Biometric Vital Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Moisture */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              Moisture
            </span>
            <span className="font-mono font-semibold text-stone-900">
              {segment.moisture}%
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${segment.moisture}%` }}
            />
          </div>
        </div>

        {/* Oiliness */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              Sebum / Oil
            </span>
            <span className="font-mono font-semibold text-stone-900">
              {segment.oiliness}%
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${segment.oiliness}%` }}
            />
          </div>
        </div>

        {/* Texture */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Smoothness
            </span>
            <span className="font-mono font-semibold text-stone-900">
              {segment.textureScore}/100
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${segment.textureScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-700 space-y-1">
        <div className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
          <Shield className="w-3.5 h-3.5 text-rose-600" />
          Clinical Assessment
        </div>
        <p className="leading-relaxed text-stone-600">{segment.clinicalNotes}</p>
      </div>

      {/* Detected Micro-Concerns */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
          Detected Concerns in this Zone ({segment.detectedConcerns.length})
        </h4>
        {segment.detectedConcerns.length === 0 ? (
          <div className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded-lg">
            No adverse dermatological concerns detected in this segment.
          </div>
        ) : (
          <div className="space-y-2">
            {segment.detectedConcerns.map((concern, idx) => (
              <div
                key={idx}
                onClick={() => onFilterConcern?.(concern.type)}
                className="p-3 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50/20 transition-all cursor-pointer flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span>{concern.label}</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded ${
                        concern.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : concern.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {concern.severity}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-1 leading-normal">
                    {concern.details}
                  </p>
                </div>
                <div className="text-right shrink-0 font-mono font-semibold text-stone-700">
                  {concern.score}
                  <span className="text-[10px] font-normal text-stone-400">/100</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Actives for this segment */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
          <Pill className="w-3.5 h-3.5 text-rose-600" />
          Targeted Active Ingredients
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {segment.recommendedActives.map((active, i) => (
            <span
              key={i}
              className="text-xs font-medium text-stone-800 bg-stone-100 border border-stone-200/80 px-2.5 py-1 rounded-md"
            >
              {active}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
