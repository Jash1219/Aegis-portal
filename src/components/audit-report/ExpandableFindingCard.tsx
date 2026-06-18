"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditFinding } from "@/types/audit";
import { BusinessImpactCard } from "@/components/explainability/BusinessImpactCard";
import { RecommendedActionCard } from "@/components/explainability/RecommendedActionCard";

const severityConfig = {
  LOW: { text: "text-secondary", bg: "bg-secondary/10", label: "LOW" },
  MODERATE: { text: "text-yellow-400", bg: "bg-yellow-500/10", label: "MODERATE" },
  HIGH: { text: "text-orange-400", bg: "bg-orange-500/10", label: "HIGH" },
  ABSOLUTE: { text: "text-error", bg: "bg-error/10", label: "ABSOLUTE" },
};

interface ExpandableFindingCardProps {
  finding: AuditFinding;
  defaultExpanded?: boolean;
}

export default function ExpandableFindingCard({
  finding,
  defaultExpanded = false,
}: ExpandableFindingCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const config = severityConfig[finding.severity];
  const isSevere = finding.severity === "HIGH" || finding.severity === "ABSOLUTE";

  return (
    <div
      className={cn(
        "bg-[#111111] border rounded-lg transition-colors",
        isSevere ? "border-error/20" : "border-[#222222]",
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-lg cursor-pointer hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-md flex-1 min-w-0">
          <span className={cn("font-data-mono text-data-mono shrink-0", config.text)}>
            {finding.id}
          </span>
          <div className="flex-1 min-w-0">
            <span className="font-body-sm text-body-sm text-primary line-clamp-1">
              {finding.title}
            </span>
          </div>
          <span
            className={cn(
              "font-data-mono text-data-mono px-sm py-xs rounded shrink-0",
              config.bg,
              config.text,
            )}
          >
            {config.label}
          </span>
          <span className="font-data-mono text-data-mono text-on-surface-variant shrink-0 tabular-nums">
            ₹{finding.associatedValueINR.toLocaleString("en-IN")}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-on-surface-variant shrink-0 ml-md" />
        ) : (
          <ChevronRight className="h-4 w-4 text-on-surface-variant shrink-0 ml-md" />
        )}
      </button>

      {expanded && (
        <div className="px-lg pb-lg flex flex-col gap-md border-t border-[#222222] pt-md">
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            {finding.description}
          </p>

          <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md flex flex-col gap-sm">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-yellow-500/60 rounded-full" />
              <span className="font-label-caps text-label-caps text-yellow-400 uppercase tracking-widest">
                Detection Delta — Why Legacy Systems Missed This
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
              <div className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  Legacy System
                </span>
                <span className="font-data-mono text-data-mono text-on-surface">
                  {finding.detectionDelta.legacySystem}
                </span>
              </div>
              <div className="flex flex-col gap-xs sm:col-span-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  Why Missed
                </span>
                <span className="font-body-sm text-body-sm text-on-surface">
                  {finding.detectionDelta.reasonMissed}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Evidence Burden
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-muted">
                {finding.detectionDelta.evidenceBurden}
              </span>
            </div>
          </div>

          <BusinessImpactCard
            impactStatement={finding.businessImpact}
            verdict="FAIL"
          />

          <RecommendedActionCard
            actionType={finding.recommendedAction}
            requiredEvidence={finding.requiredEvidence}
          />
        </div>
      )}
    </div>
  );
}
