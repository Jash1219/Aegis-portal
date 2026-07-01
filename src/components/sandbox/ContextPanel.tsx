"use client";

import type { ValidationDef, ExperimentContract } from "@/types/sandbox";

interface ContextPanelProps {
  validation: ValidationDef | undefined;
  experiment: ExperimentContract;
}

export default function ContextPanel({ validation, experiment }: ContextPanelProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Context
      </span>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {validation?.purpose ?? experiment.purpose}
      </p>
      <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md flex flex-col gap-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Business Context
        </span>
        <p className="font-body-sm text-body-sm text-on-surface">
          {validation?.businessContext ?? experiment.businessContext}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-secondary">
            Pass Example
          </span>
          <span className="font-data-mono text-data-mono text-on-surface bg-[#0a0a0a] border border-[#222222] rounded px-sm py-xs">
            {validation?.passExample ?? experiment.passExample}
          </span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-error">
            Fail Example
          </span>
          <span className="font-data-mono text-data-mono text-error bg-[#0a0a0a] border border-error/20 rounded px-sm py-xs">
            {validation?.failExample ?? experiment.failExample}
          </span>
        </div>
      </div>
      {validation?.detectionDelta && (
        <div className="bg-[#0a0a0a] border border-yellow-500/20 rounded p-md flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-yellow-400 uppercase tracking-widest">
            Detection Delta
          </span>
          <div className="flex flex-col gap-xs">
            <span className="font-body-sm text-body-sm text-yellow-400/80">
              {validation.detectionDelta.reasonMissed}
            </span>
            <span className="font-body-xs text-body-xs text-on-surface-variant/60">
              Legacy: {validation.detectionDelta.legacySystem}
            </span>
            <span className="font-body-xs text-body-xs text-on-surface-variant/60">
              Evidence: {validation.detectionDelta.evidenceBurden}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
