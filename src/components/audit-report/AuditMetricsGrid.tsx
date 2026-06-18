import type { PortfolioMetrics } from "@/types/audit";
import { FinancialExposureCard } from "@/components/explainability/FinancialExposureCard";
import { RiskClassificationCard } from "@/components/explainability/RiskClassificationCard";

interface AuditMetricsGridProps {
  metrics: PortfolioMetrics;
}

export default function AuditMetricsGrid({ metrics }: AuditMetricsGridProps) {
  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-primary/60 rounded-full" />
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Portfolio Overview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <FinancialExposureCard
          valueIdentified={`₹${(metrics.totalFaceValueINR / 100000).toFixed(1)}L`}
          varianceType="Total Portfolio Face Value"
        />
        <FinancialExposureCard
          valueIdentified={`₹${(metrics.totalCapitalAtRiskINR / 100000).toFixed(1)}L`}
          varianceType="Total Capital at Risk"
        />
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Anomalies Detected
          </span>
          <span className="font-data-mono text-display-lg text-error font-bold tracking-tight">
            {metrics.totalAnomaliesDetected}
          </span>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Engines Deployed
          </span>
          <span className="font-data-mono text-display-lg text-primary font-bold tracking-tight">
            {metrics.enginesDeployed}
          </span>
        </div>
      </div>

      <RiskClassificationCard
        level={
          metrics.totalCapitalAtRiskINR > 5000000
            ? "ABSOLUTE"
            : metrics.totalCapitalAtRiskINR > 1000000
              ? "HIGH"
              : "MODERATE"
        }
        justification={`Portfolio-wide risk classification based on ${metrics.totalAnomaliesDetected} anomalies across ${metrics.totalInvoicesReviewed} invoices. Total capital at risk: ₹${(metrics.totalCapitalAtRiskINR / 100000).toFixed(1)}L.`}
      />
    </div>
  );
}
