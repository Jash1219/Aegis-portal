import { cn } from "@/lib/utils";
import type { BusinessImpactCardProps } from "@/types/explainability";

export function BusinessImpactCard({
  impactStatement,
  verdict,
}: BusinessImpactCardProps) {
  const isFail = verdict === "FAIL";

  return (
    <div
      className={cn(
        "bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm",
        isFail && "critical-glow border-error/30",
      )}
    >
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Business Impact
      </span>
      <p
        className={cn(
          "font-body-lg text-body-lg leading-relaxed",
          isFail ? "text-error" : "text-primary",
        )}
      >
        {impactStatement}
      </p>
    </div>
  );
}
