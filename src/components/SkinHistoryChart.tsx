import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  History,
  Calendar,
  Sparkles,
  Droplets,
  Activity,
  RotateCcw,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';
import { SkinHistoryEntry, resetHistory } from '../utils/historyStorage.ts';
import { SkinAnalysisResult } from '../types/skinAnalysis.ts';

interface SkinHistoryChartProps {
  history: SkinHistoryEntry[];
  onResetHistory: () => void;
  onLogCurrentScan: () => void;
  currentAnalysis: SkinAnalysisResult;
}

export const SkinHistoryChart: React.FC<SkinHistoryChartProps> = ({
  history,
  onResetHistory,
  onLogCurrentScan,
  currentAnalysis,
}) => {
  const [activeMetric, setActiveMetric] = useState<'overall' | 'barrier' | 'age'>('overall');
  const [selectedEntry, setSelectedEntry] = useState<SkinHistoryEntry | null>(null);

  // Compute stats
  const initialScore = history.length > 0 ? history[0].overallScore : 75;
  const latestScore = history.length > 0 ? history[history.length - 1].overallScore : 84;
  const scoreDelta = latestScore - initialScore;
  const avgScore = history.length
    ? (history.reduce((acc, h) => acc + h.overallScore, 0) / history.length).toFixed(1)
    : '81.0';

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: SkinHistoryEntry = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-stone-700/80 shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between pb-1 border-b border-stone-800">
            <span className="font-semibold text-rose-300 font-display flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-rose-400" />
              {data.date}
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              {new Date(data.fullDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-300">Overall Skin Score:</span>
            <span className="font-mono font-bold text-white text-sm">
              {data.overallScore}
              <span className="text-[10px] text-stone-400 font-normal">/100</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>Skin Age:</span>
            <span className="text-stone-200">{data.skinAge} yrs (Chrono: {data.chronologicalAge})</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-0.5">
            <span>Moisture / Sebum:</span>
            <span className="text-stone-200">{data.moisture}% / {data.oiliness}%</span>
          </div>

          {data.primaryConcern && (
            <div className="text-[10px] text-rose-300/90 truncate pt-1 border-t border-stone-800">
              Primary: {data.primaryConcern}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="history" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-rose-600" />
            <span>Biometric Tracking Timeline</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-display mt-0.5">
            Skin History & Health Score Trend
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Longitudinal progression of your overall skin score across clinical intake scans
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onLogCurrentScan}
            className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Add current analysis into history"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Current Scan</span>
          </button>
          <button
            onClick={onResetHistory}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default 4-week sample history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4-KPI Trend Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
          <div className="text-[11px] font-mono uppercase text-stone-500 flex items-center justify-between">
            <span>Latest Overall Score</span>
            <Sparkles className="w-3 h-3 text-rose-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {latestScore}
            </span>
            <span className="text-xs text-stone-400 font-mono">/100</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts over timeline
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
          <div className="text-[11px] font-mono uppercase text-stone-500">
            Average Score
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {avgScore}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            Across {history.length} logged intake sessions
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
          <div className="text-[11px] font-mono uppercase text-stone-500 flex items-center justify-between">
            <span>Biological Delta</span>
            <Calendar className="w-3 h-3 text-rose-500" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {currentAnalysis.chronologicalAgeEstimate - currentAnalysis.skinAge >= 0
              ? `-${currentAnalysis.chronologicalAgeEstimate - currentAnalysis.skinAge} yrs`
              : `+${currentAnalysis.skinAge - currentAnalysis.chronologicalAgeEstimate} yrs`}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Skin age: {currentAnalysis.skinAge} yrs</span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
          <div className="text-[11px] font-mono uppercase text-stone-500 flex items-center justify-between">
            <span>Barrier Hydration</span>
            <Droplets className="w-3 h-3 text-sky-500" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {history[history.length - 1]?.moisture || 77}%
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            Sebum balance: {history[history.length - 1]?.oiliness || 64}%
          </div>
        </div>
      </div>

      {/* Metric Mode Switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveMetric('overall')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeMetric === 'overall'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Overall Skin Score
          </button>
          <button
            onClick={() => setActiveMetric('barrier')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeMetric === 'barrier'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Droplets className="w-3 h-3 text-sky-500" />
            <span>Moisture & Sebum</span>
          </button>
          <button
            onClick={() => setActiveMetric('age')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeMetric === 'age'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Activity className="w-3 h-3 text-amber-500" />
            <span>Skin Age vs Chronological</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-mono flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            Skin Score (0-100)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-stone-400 inline-block" />
            Target (85+)
          </span>
        </div>
      </div>

      {/* Main Recharts Area Chart Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="oilGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0eeee" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#78716c"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#e7e5e4' }}
              dy={5}
            />

            <YAxis
              domain={activeMetric === 'age' ? [15, 45] : [55, 100]}
              stroke="#78716c"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#e7e5e4' }}
              ticks={activeMetric === 'age' ? [18, 24, 30, 36, 42] : [60, 70, 80, 90, 100]}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Target 85 Reference Line */}
            {activeMetric === 'overall' && (
              <ReferenceLine
                y={85}
                stroke="#a8a29e"
                strokeDasharray="4 4"
                label={{
                  value: 'Optimal Barrier (85)',
                  fill: '#78716c',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'monospace',
                }}
              />
            )}

            {activeMetric === 'overall' && (
              <Area
                type="monotone"
                dataKey="overallScore"
                name="Overall Score"
                stroke="#e11d48"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                activeDot={{ r: 6, fill: '#be123c', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {activeMetric === 'barrier' && (
              <>
                <Area
                  type="monotone"
                  dataKey="moisture"
                  name="Moisture Level"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#moistureGradient)"
                  activeDot={{ r: 5, fill: '#0369a1', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="oiliness"
                  name="Sebum / Oil"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#oilGradient)"
                  activeDot={{ r: 5, fill: '#b45309', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </>
            )}

            {activeMetric === 'age' && (
              <>
                <Area
                  type="monotone"
                  dataKey="skinAge"
                  name="Biological Skin Age"
                  stroke="#9333ea"
                  strokeWidth={2}
                  fill="#f3e8ff"
                  activeDot={{ r: 5, fill: '#7e22ce', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="chronologicalAge"
                  name="Chronological Age"
                  stroke="#71717a"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  fill="transparent"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Scans Log Table / Cards */}
      <div className="pt-2 border-t border-stone-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">
          Historical Intake Log ({history.length} Scans)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {history.map((entry) => {
            const isSelected = selectedEntry?.id === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(isSelected ? null : entry)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/40 shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900 font-display">
                    {entry.date}
                  </span>
                  <span className="text-xs font-bold font-mono text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.2 rounded">
                    {entry.overallScore}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-stone-500 font-mono">
                  Skin Age: {entry.skinAge}y
                </div>
                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                  {entry.primaryConcern}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
