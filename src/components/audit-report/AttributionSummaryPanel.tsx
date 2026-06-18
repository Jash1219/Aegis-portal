import type { Attribution } from "@/types/audit";

interface AttributionSummaryPanelProps {
  attribution: Attribution;
}

export default function AttributionSummaryPanel({
  attribution,
}: AttributionSummaryPanelProps) {
  return (
    <div className="bg-[#111111] border border-primary/20 rounded-lg p-xl flex flex-col gap-lg">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-error rounded-full" />
        <span className="font-label-caps text-label-caps text-error uppercase tracking-[0.15em]">
          Attribution Analysis — Systemic Risk Concentration
        </span>
      </div>

      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Primary Engine Trigger
          </span>
          <p className="font-body-lg text-body-lg text-primary leading-relaxed">
            {attribution.primaryEngineTrigger}
          </p>
        </div>

        <div className="h-px bg-[#222222]" />

        <div className="flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Concentration Insight
          </span>
          <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md">
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              {attribution.concentrationInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
