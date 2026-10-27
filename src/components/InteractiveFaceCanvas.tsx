import React, { useState, useRef } from 'react';
import { Eye, Layers, Flame, MapPin, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import { FaceSegment, SkinAnalysisResult, SkinZoneId } from '../types/skinAnalysis.ts';

interface InteractiveFaceCanvasProps {
  selfieUrl: string;
  analysis: SkinAnalysisResult;
  selectedSegmentId: SkinZoneId | null;
  onSelectSegment: (id: SkinZoneId) => void;
  highlightedConcernType: string | null;
}

export const InteractiveFaceCanvas: React.FC<InteractiveFaceCanvasProps> = ({
  selfieUrl,
  analysis,
  selectedSegmentId,
  onSelectSegment,
  highlightedConcernType,
}) => {
  const [viewMode, setViewMode] = useState<'zones' | 'heatmap' | 'pinpoints'>('zones');
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);
  const [hoveredSegmentId, setHoveredSegmentId] = useState<SkinZoneId | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const segmentKeys: SkinZoneId[] = [
    'forehead',
    'nose',
    'left_cheek',
    'right_cheek',
    'chin',
    'under_eyes',
  ];

  // Helper to color code segment by score
  const getZoneColor = (score: number, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return 'rgba(244, 63, 94, 0.45)'; // Rose-500
    if (isHovered) return 'rgba(251, 113, 133, 0.35)'; // Rose-400
    if (score >= 85) return 'rgba(34, 197, 94, 0.22)'; // Emerald
    if (score >= 75) return 'rgba(245, 158, 11, 0.25)'; // Amber
    return 'rgba(239, 68, 68, 0.30)'; // Red/Coral
  };

  const getStrokeColor = (score: number, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return '#f43f5e';
    if (isHovered) return '#fb7185';
    if (score >= 85) return '#22c55e';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
      {/* Canvas Top Controls Toolbar */}
      <div className="px-4 py-3 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 text-xs">
          <button
            onClick={() => setViewMode('zones')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'zones'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Facial Segments</span>
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'heatmap'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Biometric Heatmap</span>
          </button>
          <button
            onClick={() => setViewMode('pinpoints')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'pinpoints'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Concern Pinpoints</span>
          </button>
        </div>

        {/* View toggles & zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOriginalComparison(!showOriginalComparison)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showOriginalComparison
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
            title="Toggle between bare selfie and AI diagnostic overlay"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showOriginalComparison ? 'Overlay: Off' : 'Overlay: On'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.15))}
              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Face Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[460px] md:min-h-[540px] bg-stone-950 flex items-center justify-center overflow-hidden select-none"
      >
        <div
          className="relative transition-transform duration-200 origin-center max-w-md w-full aspect-[3/4] flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Selfie Image */}
          <img
            src={selfieUrl}
            alt="Facial Diagnostics Analysis"
            className="w-full h-full object-cover rounded-md pointer-events-none"
          />

          {/* SVG Overlay for Segments and Heatmaps */}
          {!showOriginalComparison && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full cursor-pointer"
            >
              <defs>
                {/* Heatmap Radial Gradients */}
                <radialGradient id="heat-tzone" cx="50%" cy="35%" r="35%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-cheeks" cx="30%" cy="56%" r="20%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-undereye" cx="50%" cy="40%" r="28%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Heatmap View Mode */}
              {viewMode === 'heatmap' && (
                <g className="transition-opacity duration-300">
                  <ellipse cx="50" cy="24" rx="28" ry="12" fill="url(#heat-tzone)" />
                  <ellipse cx="50" cy="48" rx="14" ry="14" fill="url(#heat-tzone)" />
                  <ellipse cx="30" cy="56" rx="14" ry="14" fill="url(#heat-cheeks)" />
                  <ellipse cx="70" cy="56" rx="14" ry="14" fill="url(#heat-cheeks)" />
                  <ellipse cx="50" cy="41" rx="26" ry="7" fill="url(#heat-undereye)" />
                  <ellipse cx="50" cy="80" rx="18" ry="10" fill="url(#heat-cheeks)" />
                </g>
              )}

              {/* Segment Wireframe & Interactive Polygons */}
              {segmentKeys.map((key) => {
                const seg: FaceSegment = analysis.segments[key];
                if (!seg) return null;

                const isSelected = selectedSegmentId === key;
                const isHovered = hoveredSegmentId === key;
                const hasHighlightedConcern =
                  highlightedConcernType &&
                  seg.detectedConcerns.some((c) => c.type === highlightedConcernType);

                const fillColor = getZoneColor(seg.zoneScore, isHovered, isSelected);
                const strokeColor = isSelected
                  ? '#f43f5e'
                  : hasHighlightedConcern
                  ? '#ec4899'
                  : getStrokeColor(seg.zoneScore, isHovered, isSelected);

                return (
                  <g
                    key={key}
                    onClick={() => onSelectSegment(key)}
                    onMouseEnter={() => setHoveredSegmentId(key)}
                    onMouseLeave={() => setHoveredSegmentId(null)}
                    className="cursor-pointer group"
                  >
                    {/* Bounding / Contour polygon */}
                    <polygon
                      points={seg.polygonPoints}
                      fill={viewMode === 'heatmap' ? 'transparent' : fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '0.85' : hasHighlightedConcern ? '0.75' : '0.45'}
                      strokeDasharray={isSelected ? undefined : '1.5 1'}
                      className="transition-all duration-150"
                    />

                    {/* Zone Center Label Pin */}
                    {viewMode === 'zones' && (
                      <g transform={`translate(${seg.center.x}, ${seg.center.y})`}>
                        <circle
                          r={isSelected ? '2.8' : '2.2'}
                          fill={isSelected ? '#f43f5e' : '#1c1917'}
                          stroke="#ffffff"
                          strokeWidth="0.5"
                        />
                        <text
                          textAnchor="middle"
                          dy="0.8"
                          fontSize="1.6"
                          fill="#ffffff"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {seg.zoneScore}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Concern Pinpoints Mode */}
              {viewMode === 'pinpoints' && (
                <g>
                  {segmentKeys.flatMap((key) => {
                    const seg = analysis.segments[key];
                    if (!seg) return [];
                    return seg.detectedConcerns.map((concern, idx) => {
                      const offsetX = (idx - 0.5) * 6;
                      const isHighlighted = highlightedConcernType === concern.type;
                      return (
                        <g
                          key={`${key}-${concern.type}-${idx}`}
                          transform={`translate(${seg.center.x + offsetX}, ${seg.center.y})`}
                          onClick={() => onSelectSegment(key)}
                        >
                          <circle
                            r={isHighlighted ? '2.5' : '1.8'}
                            fill={concern.severity === 'high' ? '#ef4444' : concern.severity === 'moderate' ? '#f59e0b' : '#3b82f6'}
                            stroke="#ffffff"
                            strokeWidth="0.4"
                            className="animate-pulse"
                          />
                        </g>
                      );
                    });
                  })}
                </g>
              )}
            </svg>
          )}

          {/* Active Hover / Selection Floating Badge HUD */}
          {selectedSegmentId && analysis.segments[selectedSegmentId] && (
            <div className="absolute bottom-3 inset-x-3 bg-stone-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-stone-700/80 shadow-lg flex items-center justify-between text-xs pointer-events-none">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-300">
                    {analysis.segments[selectedSegmentId].name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
                    {analysis.segments[selectedSegmentId].status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-3 font-mono">
                  <span>Moisture: {analysis.segments[selectedSegmentId].moisture}%</span>
                  <span>Sebum: {analysis.segments[selectedSegmentId].oiliness}%</span>
                  <span>Texture: {analysis.segments[selectedSegmentId].textureScore}/100</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold font-mono text-white">
                  {analysis.segments[selectedSegmentId].zoneScore}
                  <span className="text-xs text-stone-400 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-rose-400 font-medium">Zone Health Score</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Segment Selector Quick Strip */}
      <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap">
          Click zone to focus:
        </span>
        <div className="flex items-center gap-1.5">
          {segmentKeys.map((key) => {
            const seg = analysis.segments[key];
            const isSelected = selectedSegmentId === key;
            return (
              <button
                key={key}
                onClick={() => onSelectSegment(key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-rose-300'
                }`}
              >
                <span>{seg?.name.split(' ')[0]}</span>
                <span className="font-mono text-[11px] opacity-80">
                  {seg?.zoneScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
