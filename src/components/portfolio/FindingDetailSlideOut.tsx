"use client";

import { useRouter } from "next/navigation";
import { X, Copy } from "lucide-react";
import type { PortfolioAnomaly } from "@/types/portfolio";
import type { ReplayContext } from "@/types/sandbox";
import { getValidationById } from "@/config/experimentRegistry";

interface FindingDetailSlideOutProps {
  anomaly: PortfolioAnomaly | null;
  onClose: () => void;
}

const severityStyles: Record<string, string> = {
  ABSOLUTE: "text-error border-error/30 bg-error/10",
  HIGH: "text-orange-400 border-orange-500/20 bg-orange-500/10",
  MODERATE: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
  LOW: "text-secondary border-secondary/20 bg-secondary/10",
};

const riskCategoryColors: Record<string, string> = {
  FRAUD: "text-error",
  COMPLIANCE: "text-yellow-400",
  FINANCIAL: "text-blue-400",
  OPERATIONAL: "text-on-surface-variant",
};

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export default function FindingDetailSlideOut({
  anomaly,
  onClose,
}: FindingDetailSlideOutProps) {
  const router = useRouter();
  if (!anomaly) return null;

  const a = anomaly;
  const validation = getValidationById(a.validationId);

  function handleReplay() {
    const replayId = crypto.randomUUID();

    const replayContext: ReplayContext = {
      anomalyId: a.id,
      invoiceNumber: a.invoiceNumber,
      supplierGstin: a.supplierGstin,
      validationId: a.validationId,
      replayTimestamp: new Date().toISOString(),
    };

    sessionStorage.setItem(
      `AEGIS_REPLAY_${replayId}`,
      JSON.stringify(a.rawPayload),
    );
    sessionStorage.setItem(
      `AEGIS_REPLAY_CONTEXT_${replayId}`,
      JSON.stringify(replayContext),
    );

    console.log("[REPLAY DEBUG] === Slideout Write ===");
    console.log("[REPLAY DEBUG] replayId:", replayId);
    console.log("[REPLAY DEBUG] anomaly.validationId:", a.validationId);
    console.log("[REPLAY DEBUG] replayContext:", JSON.stringify(replayContext));
    console.log("[REPLAY DEBUG] rawPayload:", JSON.stringify(a.rawPayload));

    router.push(
      `/sandbox?mode=expert&validationId=${a.validationId}&payloadSource=session&replayId=${replayId}`,
    );
  }

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 bg-black/50 z-[9999] transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          width: "28rem",
          zIndex: 10000,
          backgroundColor: "#111111",
          borderLeft: "1px solid #222222",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex flex-col min-h-full">
          {/* Header */}
          <div className="sticky top-0 bg-[#111111] border-b border-[#222222] p-lg flex items-center justify-between z-10">
            <div className="flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Anomaly Detail
              </span>
              <span className="font-data-mono text-data-mono text-primary">
                {anomaly.id}
              </span>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#222222] bg-[#0a0a0a] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              aria-label="Close detail panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 p-lg flex flex-col gap-lg">
            {/* Severity Badge */}
            <div className="flex items-center gap-sm">
              <span
                className={`font-data-mono text-data-mono px-sm py-xs rounded border ${severityStyles[anomaly.severity] ?? ""}`}
              >
                {anomaly.severity}
              </span>
              <span
                className={`font-label-caps text-label-caps ${riskCategoryColors[anomaly.riskCategory] ?? ""}`}
              >
                {anomaly.riskCategory}
              </span>
            </div>

            {/* 1. What happened? */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-md flex flex-col gap-sm">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
                What happened?
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {anomaly.findingSummary}
              </p>
              <div className="flex items-center gap-sm text-on-surface-variant font-data-mono text-data-mono">
                <span>Validation: {anomaly.validationId}</span>
                <span>·</span>
                <span>Engine: {anomaly.parentEngineId}</span>
              </div>
            </div>

            {/* 2. Why does it matter? */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-md flex flex-col gap-sm">
              <span className="font-label-caps text-label-caps text-yellow-400 uppercase tracking-widest">
                Why does it matter?
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {validation?.businessContext ?? "No additional context available."}
              </p>
              {anomaly.flaggedValueINR > 0 && (
                <div className="flex items-center gap-sm pt-xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Financial Exposure
                  </span>
                  <span className="font-data-mono text-data-mono text-error">
                    {formatINR(anomaly.flaggedValueINR)}
                  </span>
                </div>
              )}
            </div>

            {/* 3. Why would legacy systems miss this? */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-md flex flex-col gap-sm">
              <span className="font-label-caps text-label-caps text-orange-400 uppercase tracking-widest">
                Why would legacy systems miss this?
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {validation?.detectionDelta?.reasonMissed ??
                  "Conventional rule-based systems lack the cross-referential and semantic analysis capabilities required to detect this anomaly pattern."}
              </p>
              {validation?.detectionDelta?.legacySystem && (
                <span className="font-body-sm text-body-sm text-on-surface-variant pt-xs">
                  Legacy approach:{" "}
                  {validation.detectionDelta.legacySystem}
                </span>
              )}
            </div>

            {/* 4. What should investigators do next? */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-md flex flex-col gap-sm">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                Recommended Action
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {anomaly.recommendedAction}
              </p>
            </div>

            {/* Invoice Metadata */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-md flex flex-col gap-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Linked Invoice
              </span>
              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Invoice
                  </span>
                  <span className="font-data-mono text-data-mono text-on-surface">
                    {anomaly.invoiceNumber}
                  </span>
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Date
                  </span>
                  <span className="font-data-mono text-data-mono text-on-surface">
                    {anomaly.invoiceDate}
                  </span>
                </div>
                <div className="flex flex-col gap-xs col-span-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Supplier GSTIN
                  </span>
                  <span className="font-data-mono text-data-mono text-on-surface">
                    {anomaly.supplierGstin}
                  </span>
                </div>
              </div>
            </div>

            {/* Replay Status */}
            <div className="flex items-center gap-sm bg-[#0a0a0a] border border-[#222222] rounded-lg p-md">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-body-sm text-body-sm text-secondary">
                Replay-ready payload available
              </span>
            </div>

            {/* Replay Button */}
            <button
              onClick={handleReplay}
              className="w-full h-12 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-400 font-label-caps text-label-caps flex items-center justify-center gap-sm transition-colors hover:bg-amber-500/10 cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              Replay in Sandbox
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
