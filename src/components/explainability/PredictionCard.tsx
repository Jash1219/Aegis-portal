"use client";

import { cn } from "@/lib/utils";
import type { PredictionCardProps, VerdictState } from "@/types/explainability";

const states: { key: VerdictState; label: string }[] = [
  { key: "PASS", label: "PASS" },
  { key: "FAIL", label: "FAIL" },
  { key: "INCONCLUSIVE", label: "INCONCLUSIVE" },
];

const stateStyles: Record<VerdictState, { active: string; inactive: string }> =
  {
    PASS: {
      active: "bg-secondary text-on-secondary border-secondary",
      inactive: "text-on-surface-variant border-[#222222] hover:border-secondary/50",
    },
    FAIL: {
      active: "bg-error text-on-error border-error",
      inactive: "text-on-surface-variant border-[#222222] hover:border-error/50",
    },
    INCONCLUSIVE: {
      active: "bg-yellow-500 text-black border-yellow-500",
      inactive: "text-on-surface-variant border-[#222222] hover:border-yellow-500/50",
    },
  };

export function PredictionCard({
  selectedState,
  onSelect,
}: PredictionCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Predict Verdict
      </span>
      <div className="grid grid-cols-3 gap-sm">
        {states.map(({ key, label }) => {
          const isActive = selectedState === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                "font-label-caps text-label-caps py-sm px-md rounded border transition-all duration-150",
                isActive
                  ? stateStyles[key].active
                  : stateStyles[key].inactive,
                "cursor-pointer",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
