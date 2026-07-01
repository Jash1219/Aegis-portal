"use client";

import { Lock } from "lucide-react";
import type { ExperimentContract } from "@/types/sandbox";
import { getValidationById } from "@/config/experimentRegistry";

interface RoadmapSectionProps {
  experiments: ExperimentContract[];
}

export default function RoadmapSection({ experiments }: RoadmapSectionProps) {
  if (experiments.length === 0) return null;

  const grouped: Record<string, ExperimentContract[]> = {};
  for (const exp of experiments) {
    const engine = exp.engineName;
    if (!grouped[engine]) grouped[engine] = [];
    grouped[engine].push(exp);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        <span className="font-label-caps text-label-caps text-yellow-500/80 tracking-[0.2em] uppercase shrink-0 flex items-center gap-sm">
          <Lock className="h-3.5 w-3.5" />
          Enterprise Roadmap
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {Object.entries(grouped).map(([engine, exps]) => (
          <div
            key={engine}
            className="bg-[#111111] border border-dashed border-yellow-500/20 rounded-lg overflow-hidden"
          >
            <div className="px-md py-sm bg-yellow-500/5 border-b border-dashed border-yellow-500/20">
              <span className="font-label-caps text-label-caps text-yellow-400/80">
                {engine}
              </span>
            </div>
            <div className="flex flex-col">
              {exps.map((exp) => {
                const validation = getValidationById(exp.id);
                return (
                  <div
                    key={exp.id}
                    className="px-md py-sm border-b border-[#222222]/50 last:border-b-0 flex flex-col gap-xs"
                  >
                    <div className="flex items-center gap-sm">
                      <Lock className="h-3 w-3 text-yellow-500/40 shrink-0" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant/60 line-clamp-1">
                        {validation?.name ?? exp.title}
                      </span>
                      <span className="ml-auto font-data-mono text-[10px] text-yellow-500/60 border border-dashed border-yellow-500/30 px-1.5 py-0.5 rounded shrink-0">
                        ROADMAP
                      </span>
                    </div>
                    <span className="font-body-xs text-body-xs text-on-surface-variant/40 line-clamp-2">
                      {validation?.purpose ?? exp.purpose}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
