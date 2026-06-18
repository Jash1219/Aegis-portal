"use client";

import type { EngineAttribution, SupplierConcentration } from "@/types/portfolio";

interface SystemicAttributionPanelProps {
  attribution: EngineAttribution[];
  supplierConcentration: SupplierConcentration[];
}

function formatExposure(n: number): string {
  if (n >= 1_00_00_000) return "₹" + (n / 1_00_00_000).toFixed(1) + "Cr";
  if (n >= 1_00_000) return "₹" + (n / 1_00_000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function HorizontalBar({
  label,
  value,
  pct,
  maxPct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  maxPct: number;
  color: string;
}) {
  const width = maxPct > 0 ? (pct / maxPct) * 100 : 0;
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <span className="font-body-sm text-body-sm text-on-surface truncate max-w-[240px]">
          {label}
        </span>
        <div className="flex items-center gap-md">
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            {value}
          </span>
          <span className="font-data-mono text-data-mono text-on-surface-variant w-12 text-right">
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(width, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function SystemicAttributionPanel({
  attribution,
  supplierConcentration,
}: SystemicAttributionPanelProps) {
  const maxEnginePct = Math.max(
    ...attribution.map((a) => a.percentageOfTotalExposure),
    0.01,
  );

  const topSuppliers = supplierConcentration.slice(0, 8);
  const maxSupplierPct = Math.max(
    ...topSuppliers.map((s) => s.percentageOfTotalExposure),
    0.01,
  );

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Plane 2 — Systemic Attribution
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        {/* Engine Attribution */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Systemic Risk by Engine
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Anomaly exposure distribution across detection engines. Higher
            concentration indicates systemic failure vectors.
          </p>
          <div className="flex flex-col gap-md pt-sm">
            {attribution
              .filter((a) => a.anomalyCount > 0)
              .map((engine) => (
                <HorizontalBar
                  key={engine.engineId}
                  label={engine.engineName}
                  value={`${engine.anomalyCount} anomalies · ${formatExposure(engine.exposureValueINR)}`}
                  pct={engine.percentageOfTotalExposure}
                  maxPct={maxEnginePct}
                  color="bg-primary"
                />
              ))}
          </div>
        </div>

        {/* Supplier Concentration */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Top Flagged Entities
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Suppliers sorted by anomaly count and flagged exposure. A single
            GSTIN driving 8+ anomalies indicates a bad-actor cluster.
          </p>
          <div className="flex flex-col gap-md pt-sm">
            {topSuppliers.length === 0 && (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                No anomalous suppliers detected.
              </span>
            )}
            {topSuppliers.map((supplier) => (
              <HorizontalBar
                key={supplier.supplierGstin}
                label={supplier.supplierGstin}
                value={`${supplier.anomalyCount} anomalies · ${formatExposure(supplier.exposureValueINR)}`}
                pct={supplier.percentageOfTotalExposure}
                maxPct={maxSupplierPct}
                color={
                  supplier.anomalyCount >= 5
                    ? "bg-error"
                    : supplier.anomalyCount >= 3
                      ? "bg-yellow-400"
                      : "bg-secondary"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
