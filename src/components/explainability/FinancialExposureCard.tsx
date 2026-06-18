import type { FinancialExposureCardProps } from "@/types/explainability";

export function FinancialExposureCard({
  valueIdentified,
  varianceType,
}: FinancialExposureCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        {varianceType}
      </span>
      <span className="font-data-mono text-display-lg text-primary font-bold tracking-tight">
        {valueIdentified}
      </span>
    </div>
  );
}
