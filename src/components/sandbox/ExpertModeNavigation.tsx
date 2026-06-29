"use client";

import { useMemo } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EngineDef } from "@/types/sandbox";
import { getValidationsByEngineId, getExperimentByValidationId } from "@/config/experimentRegistry";

interface ExpertModeNavigationProps {
  engines: EngineDef[];
  activeValidationId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onValidationSelect: (validationId: string) => void;
  onEngineExpand: (engineId: string) => void;
  expandedEngineId: string | null;
}

export default function ExpertModeNavigation({
  engines,
  activeValidationId,
  searchQuery,
  onSearchChange,
  onValidationSelect,
  onEngineExpand,
  expandedEngineId,
}: ExpertModeNavigationProps) {
  const filteredEngines = useMemo(() => {
    if (!searchQuery.trim()) return engines.map((e) => ({ engine: e, validations: getValidationsByEngineId(e.id) }));
    const lower = searchQuery.toLowerCase();
    return engines
      .map((e) => {
        const validations = getValidationsByEngineId(e.id).filter(
          (v) =>
            v.name.toLowerCase().includes(lower) ||
            v.purpose.toLowerCase().includes(lower),
        );
        return { engine: e, validations };
      })
      .filter((item) => item.validations.length > 0);
  }, [engines, searchQuery]);

  return (
    <div className="flex flex-col gap-md">
      <div className="relative">
        <Search className="absolute left-md top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search validations..."
          className="w-full h-10 rounded-lg border border-[#222222] bg-[#0a0a0a] text-primary font-body-sm text-body-sm pl-xl pr-md py-sm outline-none transition-colors focus-visible:border-primary placeholder:text-on-surface-variant/40"
        />
      </div>

      <div className="flex flex-col gap-xs">
        {filteredEngines.map(({ engine, validations }) => (
          <div
            key={engine.id}
            className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => onEngineExpand(expandedEngineId === engine.id ? "" : engine.id)}
              className="w-full flex items-center justify-between px-md py-sm cursor-pointer hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="flex items-center gap-sm min-w-0">
                {expandedEngineId === engine.id ? (
                  <ChevronDown className="h-3.5 w-3.5 text-on-surface-variant shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-on-surface-variant shrink-0" />
                )}
                <span className="font-body-sm text-body-sm text-primary truncate">
                  {engine.engineName}
                </span>
              </div>
              <span className="font-data-mono text-data-mono text-on-surface-variant text-xs shrink-0 ml-sm">
                {validations.length}
              </span>
            </button>

            {expandedEngineId === engine.id && (
              <div className="border-t border-[#222222]">
                {validations.map((validation) => {
                  const isActive = activeValidationId === validation.id;
                  const isGolden = validation.isGoldenPath;
                  const exp = getExperimentByValidationId(validation.id);
                  const isRoadmap = exp?.lifecycle === "ROADMAP";
                  return (
                    <button
                      key={validation.id}
                      onClick={() => onValidationSelect(validation.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-md py-sm text-left transition-colors cursor-pointer border-b border-[#222222]/50 last:border-b-0",
                        isActive
                          ? "bg-primary/10 border-l-2 border-l-primary"
                          : "hover:bg-white/[0.02] border-l-2 border-l-transparent",
                      )}
                    >
                      <div className="flex items-center gap-sm min-w-0">
                        <span className="font-data-mono text-data-mono text-on-surface-variant text-xs shrink-0">
                          {validation.id}
                        </span>
                        <span
                          className={cn(
                            "font-body-xs text-body-xs truncate",
                            isActive ? "text-primary" : "text-on-surface",
                            isRoadmap ? "text-on-surface-variant/50" : "",
                          )}
                        >
                          {isRoadmap ? `🔒 Beneficiary Bank Account Duplicate Detection` : validation.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-sm shrink-0 ml-sm">
                        {isRoadmap && (
                          <span className="font-data-mono text-data-mono text-[10px] text-yellow-500/60 border border-dashed border-yellow-500/30 px-sm py-[1px] rounded">
                            ROADMAP
                          </span>
                        )}
                        {isGolden && (
                          <span className="font-data-mono text-data-mono text-[10px] text-primary bg-primary/10 px-sm py-[1px] rounded">
                            GOLDEN
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
