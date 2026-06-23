"use client";

import type { DataQualityTelemetry } from "@/types/portfolio";

interface EvaluationCoverageCardProps {
  telemetry: DataQualityTelemetry;
}

export default function EvaluationCoverageCard({
  telemetry,
}: EvaluationCoverageCardProps) {
  const pct = telemetry.evaluableCoveragePercent;
  const isLow = pct < 60;
  const isWarning = pct >= 60 && pct < 80;

  const valueClass = isLow
    ? "text-error"
    : isWarning
      ? "text-amber-400"
      : "text-primary";

  const footerBorderClass = isLow
    ? "border-error/20"
    : isWarning
      ? "border-amber-400/20"
      : "border-[#222222]";

  const footerBgClass = isLow
    ? "bg-error/5"
    : isWarning
      ? "bg-amber-400/5"
    : "bg-transparent";

  const footerTextClass = isLow
    ? "text-error font-bold"
    : isWarning
      ? "text-amber-400"
      : "text-on-surface-variant";

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Coverage Score
      </span>
      <span
        className={`font-data-mono text-headline-md ${valueClass}`}
      >
        {pct}%
      </span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">
        {telemetry.successfulEvaluations} of{" "}
        {telemetry.totalEvaluationsAttempted} evaluations successful
      </span>
      <div
        className={`-mx-lg -mb-lg mt-sm px-lg py-sm rounded-b-lg border-t ${footerBorderClass} ${footerBgClass}`}
      >
        <span className={`font-data-mono text-data-mono ${footerTextClass}`}>
          {isLow ? (
            <>Data quality compromised — proceed with caution</>
          ) : isWarning ? (
            <>{telemetry.missingEvidenceKeys.length} missing evidence field(s): {telemetry.missingEvidenceKeys.join(", ")}</>
          ) : (
            <>All evidence dimensions available</>
          )}
        </span>
      </div>
    </div>
  );
}
