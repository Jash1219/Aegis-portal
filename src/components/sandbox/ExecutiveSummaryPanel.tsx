import type { PresentationProps } from "@/types/sandbox";
import { VerdictHeroCard } from "@/components/explainability/VerdictHeroCard";
import { BusinessImpactCard } from "@/components/explainability/BusinessImpactCard";

interface ExecutiveSummaryPanelProps {
  data: PresentationProps;
}

export default function ExecutiveSummaryPanel({
  data,
}: ExecutiveSummaryPanelProps) {
  return (
    <div className="bg-[#111111] border-2 border-primary/20 rounded-xl p-xl shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] inner-glow flex flex-col gap-lg">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <span className="font-label-caps text-label-caps text-primary uppercase tracking-[0.15em]">
          Executive Summary
        </span>
      </div>
      <VerdictHeroCard
        verdict={data.verdict}
        headline={data.headline}
        explanation={data.explanation}
      />
      <BusinessImpactCard
        impactStatement={data.impactStatement}
        verdict={data.verdict}
      />
      <div className="flex items-center gap-sm pt-md border-t border-primary/10">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Engine:
        </span>
        <span className="font-data-mono text-data-mono text-primary font-semibold">
          {data.engineName}
        </span>
      </div>
    </div>
  );
}
