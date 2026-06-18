import type { WhyThisMattersCardProps } from "@/types/explainability";

export function WhyThisMattersCard({
  concept,
  businessValue,
  riskMitigated,
}: WhyThisMattersCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Why This Matters
        </span>
        <h4 className="font-headline-md text-headline-md text-primary">
          {concept}
        </h4>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
        {businessValue}
      </p>
      <div className="flex items-start gap-sm bg-[#0a0a0a] border border-[#222222] rounded p-md">
        <span className="font-label-caps text-label-caps text-secondary shrink-0">
          Risk Mitigated:
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {riskMitigated}
        </span>
      </div>
    </div>
  );
}
