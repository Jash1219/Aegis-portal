"use client";

import { AlertTriangle } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioMetricsGrid from "@/components/portfolio/PortfolioMetricsGrid";
import SystemicAttributionPanel from "@/components/portfolio/SystemicAttributionPanel";
import FindingsTriageTable from "@/components/portfolio/FindingsTriageTable";

export default function PortfolioPage() {
  const { dataset, isLoading, error } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
        <div className="max-w-7xl mx-auto flex flex-col gap-lg">
          {/* Skeleton header */}
          <div className="h-10 w-72 bg-[#111111] rounded-lg animate-pulse" />
          {/* Skeleton metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-[#111111] border border-[#222222] rounded-lg animate-pulse"
              />
            ))}
          </div>
          {/* Skeleton attribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-[#111111] border border-[#222222] rounded-lg animate-pulse"
              />
            ))}
          </div>
          {/* Skeleton table */}
          <div className="h-96 bg-[#111111] border border-[#222222] rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#111111] border border-error/20 rounded-lg p-xl">
            <AlertTriangle className="h-10 w-10 text-error mb-md" />
            <span className="font-data-mono text-data-mono text-error mb-sm">
              PORTFOLIO GENERATION FAILED
            </span>
            <p className="font-body-sm text-body-sm text-error text-center max-w-md">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!dataset) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-lg">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Portfolio Analysis
          </h1>
        </div>

        {/* Plane 0 — Audit Methodology & Scope */}
        <PortfolioHeader methodology={dataset.methodology} />

        {/* Plane 1 — Macro Exposure */}
        <PortfolioMetricsGrid metrics={dataset.metrics} />

        {/* Plane 2 — Systemic Attribution */}
        <SystemicAttributionPanel
          attribution={dataset.attribution}
          supplierConcentration={dataset.supplierConcentration}
        />

        {/* Plane 3 — Findings Triage Table */}
        <FindingsTriageTable anomalies={dataset.anomalies} />
      </div>
    </div>
  );
}
