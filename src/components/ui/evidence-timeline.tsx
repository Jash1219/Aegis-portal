import { cn } from "@/lib/utils";

type TimelineStatus =
  | "PASSED"
  | "FINDINGS_DETECTED"
  | "DEGRADED"
  | "UNAVAILABLE"
  | "SKIPPED";

const DOT_COLORS: Record<TimelineStatus, string> = {
  PASSED: "bg-emerald-400",
  FINDINGS_DETECTED: "bg-amber-400",
  DEGRADED: "bg-orange-400",
  UNAVAILABLE: "bg-on-surface-variant",
  SKIPPED: "bg-on-surface-variant/50",
};

const STATUS_LABELS: Record<TimelineStatus, string> = {
  PASSED: "Passed",
  FINDINGS_DETECTED: "Findings Detected",
  DEGRADED: "Degraded",
  UNAVAILABLE: "Unavailable",
  SKIPPED: "Skipped",
};

const STEPS = [
  { key: "schemaValidation", label: "Schema Validation" },
  { key: "deterministicRules", label: "Deterministic Rules" },
  { key: "governmentVerification", label: "Government Verification" },
  { key: "supplierIntelligence", label: "Supplier Intelligence" },
  { key: "verdictAssembly", label: "Verdict Assembly" },
] as const;

interface EvidenceTimelineProps {
  schemaValidation: TimelineStatus;
  deterministicRules: TimelineStatus;
  governmentVerification: TimelineStatus;
  supplierIntelligence: TimelineStatus;
  verdictAssembly: TimelineStatus;
  className?: string;
}

export function EvidenceTimeline({
  schemaValidation,
  deterministicRules,
  governmentVerification,
  supplierIntelligence,
  verdictAssembly,
  className,
}: EvidenceTimelineProps) {
  const statuses: Record<string, TimelineStatus> = {
    schemaValidation,
    deterministicRules,
    governmentVerification,
    supplierIntelligence,
    verdictAssembly,
  };

  return (
    <div className={cn("surface-card rounded-lg p-4 space-y-0", className)}>
      {STEPS.map((step, i) => {
        const status = statuses[step.key];
        const dotColor = DOT_COLORS[status];
        const statusLabel = STATUS_LABELS[status];
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("w-3 h-3 rounded-full shrink-0 mt-1", dotColor)} />
              {!isLast && <div className="w-px flex-1 bg-border" />}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <div className="text-body-sm text-foreground">{step.label}</div>
              <div className="text-data-mono text-on-surface-variant">{statusLabel}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
