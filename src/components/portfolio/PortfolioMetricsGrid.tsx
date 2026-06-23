"use client";

import type { PortfolioMetrics, DataQualityTelemetry } from "@/types/portfolio";
import EvaluationCoverageCard from "./EvaluationCoverageCard";

interface PortfolioMetricsGridProps {
  metrics: PortfolioMetrics;
  dataQuality?: DataQualityTelemetry;
}

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function formatCompact(n: number): string {
  if (n >= 1_00_00_000) return "₹" + (n / 1_00_00_000).toFixed(1) + "Cr";
  if (n >= 1_00_000) return "₹" + (n / 1_00_000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}

function MetricCard({ label, value, subtext, highlight }: MetricCardProps) {
  return (
    <div
      className={`bg-[#111111] border rounded-lg p-lg flex flex-col gap-sm ${highlight ? "border-error/30" : "border-[#222222]"}`}
    >
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`font-data-mono text-headline-md ${highlight ? "text-error" : "text-primary"}`}
      >
        {value}
      </span>
      {subtext && (
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {subtext}
        </span>
      )}
    </div>
  );
}

export default function PortfolioMetricsGrid({
  metrics,
  dataQuality,
}: PortfolioMetricsGridProps) {

  const flaggedPct =
    metrics.totalInvoices > 0
      ? ((metrics.flaggedInvoices / metrics.totalInvoices) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Plane 1 — Macro Exposure
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
        <MetricCard
          label="Total Invoices"
          value={metrics.totalInvoices.toLocaleString()}
          subtext={`${metrics.cleanInvoices} clean / ${metrics.flaggedInvoices} flagged`}
        />
        <MetricCard
          label="Evaluated Portfolio Value"
          value={formatCompact(metrics.evaluatedValueINR)}
          subtext={`Total face value across ${metrics.totalInvoices} invoices`}
        />
        <MetricCard
          label="Flagged Value at Risk"
          value={formatINR(metrics.flaggedValueINR)}
          subtext={`${metrics.flaggedInvoices} flagged invoices (${flaggedPct}% of portfolio)`}
          highlight
        />
        <MetricCard
          label="Critical Anomalies"
          value={metrics.criticalAnomalies.toString()}
          subtext="HIGH or ABSOLUTE severity findings requiring immediate investigation"
          highlight
        />
        {dataQuality && <EvaluationCoverageCard telemetry={dataQuality} />}
      </div>
    </div>
  );
}
