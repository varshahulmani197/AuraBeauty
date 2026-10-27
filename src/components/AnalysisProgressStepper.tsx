import React from 'react';
import { Upload, ScanFace, Sparkles, Check, ArrowRight, Wand2 } from 'lucide-react';

export type LifecycleStep = 'upload' | 'mapping' | 'analyzing' | 'routine';

interface AnalysisProgressStepperProps {
  currentStep: LifecycleStep;
  isLoading: boolean;
  onStepClick: (step: LifecycleStep) => void;
}

interface StepConfig {
  id: LifecycleStep;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'upload',
    label: 'Upload',
    subLabel: 'Selfie intake & calibration',
    icon: Upload,
  },
  {
    id: 'mapping',
    label: 'Mapping',
    subLabel: '6 facial zones landmarked',
    icon: ScanFace,
  },
  {
    id: 'analyzing',
    label: 'Analyzing',
    subLabel: '10-factor biometric scan',
    icon: Sparkles,
  },
  {
    id: 'routine',
    label: 'Routine Generation',
    subLabel: 'Custom active skincare protocol',
    icon: Wand2,
  },
];

export const AnalysisProgressStepper: React.FC<AnalysisProgressStepperProps> = ({
  currentStep,
  isLoading,
  onStepClick,
}) => {
  const getStepIndex = (step: LifecycleStep) => {
    switch (step) {
      case 'upload':
        return 0;
      case 'mapping':
        return 1;
      case 'analyzing':
        return 2;
      case 'routine':
        return 3;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-stone-100 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
            Skin Analysis Lifecycle
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-xs font-medium text-rose-600">
            {isLoading
              ? 'Processing Diagnostic Pipeline...'
              : 'All 4 Lifecycle Stages Synchronized'}
          </span>
        </div>

        <div className="text-[11px] font-mono text-stone-500">
          Stage {currentIndex + 1} of 4: <span className="font-semibold text-stone-800">{STEPS[currentIndex].label}</span>
        </div>
      </div>

      {/* Stepper Track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex || (!isLoading && currentIndex === 3);
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex && isLoading;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              disabled={isLoading}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative group flex items-start gap-3 ${
                isCurrent
                  ? 'border-rose-500 bg-rose-50/50 shadow-2xs ring-1 ring-rose-500/20'
                  : isCompleted
                  ? 'border-stone-200 bg-stone-50/60 hover:bg-stone-50 hover:border-stone-300'
                  : 'border-stone-200 bg-white opacity-70 hover:opacity-100'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? isLoading
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-rose-600 text-white'
                    : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-stone-900 font-display truncate">
                    {step.label}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    0{idx + 1}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">
                  {step.subLabel}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-medium ${
                      isCompleted && !isCurrent
                        ? 'text-emerald-700'
                        : isCurrent
                        ? 'text-rose-700 font-semibold'
                        : 'text-stone-400'
                    }`}
                  >
                    {isCompleted && !isCurrent
                      ? 'Completed'
                      : isCurrent
                      ? isLoading
                        ? 'Processing...'
                        : 'Active Stage'
                      : 'Pending'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
