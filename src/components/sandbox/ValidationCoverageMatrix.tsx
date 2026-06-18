"use client";

import { cn } from "@/lib/utils";
import type { EngineDef, VisibilityMode } from "@/types/sandbox";
import { getValidationsByEngineId } from "@/config/experimentRegistry";

interface ValidationCoverageMatrixProps {
  engines: EngineDef[];
  visibilityMode: VisibilityMode;
  activeValidationId: string | null;
  onValidationSelect: (validationId: string) => void;
}

export default function ValidationCoverageMatrix({
  engines,
  visibilityMode,
  activeValidationId,
  onValidationSelect,
}: ValidationCoverageMatrixProps) {
  const visibleEngines =
    visibilityMode === "EXECUTIVE"
      ? engines.filter((e) => e.visibilityLevel === "EXECUTIVE_AND_EXPERT")
      : engines;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-md">
      {visibleEngines.map((engine) => {
        const validations = getValidationsByEngineId(engine.id);
        const goldenPath = validations.find((v) => v.isGoldenPath);
        const isActive = goldenPath ? activeValidationId === goldenPath.id : false;
        const validationCount = validations.length;

        return (
          <button
            key={engine.id}
            onClick={() => {
              if (goldenPath) onValidationSelect(goldenPath.id);
            }}
            className={cn(
              "bg-[#111111] border rounded-lg p-lg flex flex-col gap-sm text-left transition-all cursor-pointer hover:bg-[#161616]",
              isActive
                ? "border-primary/50 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)]"
                : "border-[#222222]",
            )}
          >
            <span className="font-label-caps text-label-caps text-primary truncate">
              {engine.engineName}
            </span>
            <span className="font-body-xs text-body-xs text-on-surface-variant line-clamp-2">
              {engine.purpose}
            </span>
            <div className="flex items-center gap-sm mt-auto pt-sm border-t border-[#222222]">
              <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">
                {validationCount} validation{validationCount !== 1 ? "s" : ""}
              </span>
              {goldenPath && (
                <span
                  className={cn(
                    "font-data-mono text-data-mono text-xs px-sm py-[1px] rounded",
                    "bg-primary/10 text-primary",
                  )}
                >
                  Golden Path
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
