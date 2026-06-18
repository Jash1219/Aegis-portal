"use client";

import type { ReplayContext } from "@/types/sandbox";

interface ReplayModeBannerProps {
  context: ReplayContext | null;
}

export default function ReplayModeBanner({ context }: ReplayModeBannerProps) {
  if (!context) return null;

  return (
    <div className="w-full border-l-4 border-amber-500 bg-amber-500/5 rounded-lg p-lg flex flex-col gap-md">
      <div className="flex items-center gap-sm">
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="font-label-caps text-label-caps text-amber-400 uppercase tracking-widest">
          Replay Mode: Executing Custom Portfolio Artifact
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-md font-data-mono text-data-mono">
        <div className="flex flex-col gap-xs">
          <span className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-widest">
            Anomaly ID
          </span>
          <span className="text-primary">{context.anomalyId}</span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-widest">
            Invoice
          </span>
          <span className="text-primary">{context.invoiceNumber}</span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-widest">
            Supplier GSTIN
          </span>
          <span className="text-primary">{context.supplierGstin}</span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-widest">
            Validation
          </span>
          <span className="text-primary">{context.validationId}</span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-widest">
            Replay Time
          </span>
          <span className="text-primary">{new Date(context.replayTimestamp).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
