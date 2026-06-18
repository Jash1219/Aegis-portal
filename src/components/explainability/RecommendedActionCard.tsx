import type { RecommendedActionCardProps } from "@/types/explainability";

export function RecommendedActionCard({
  actionType,
  requiredEvidence,
}: RecommendedActionCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Recommended Action
      </span>
      <p className="font-body-lg text-body-lg text-primary leading-relaxed">
        {actionType}
      </p>
      <div className="flex items-start gap-sm bg-[#0a0a0a] border border-[#222222] rounded p-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant shrink-0">
          Required Evidence:
        </span>
        <span className="font-body-sm text-body-sm text-on-surface">
          {requiredEvidence}
        </span>
      </div>
    </div>
  );
}
