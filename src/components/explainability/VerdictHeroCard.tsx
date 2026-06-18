import { cn } from "@/lib/utils";
import type { VerdictHeroCardProps } from "@/types/explainability";

const verdictConfig = {
  PASS: {
    bg: "bg-[rgba(78,222,163,0.1)]",
    border: "border-secondary/20",
    labelBg: "bg-secondary/10",
    labelText: "text-secondary",
    label: "VERIFIED",
  },
  FAIL: {
    bg: "bg-[rgba(255,180,171,0.1)]",
    border: "border-error/20",
    labelBg: "bg-error/10",
    labelText: "text-error",
    label: "FAILED",
  },
  INCONCLUSIVE: {
    bg: "bg-[rgba(255,200,100,0.1)]",
    border: "border-yellow-500/20",
    labelBg: "bg-yellow-500/10",
    labelText: "text-yellow-400",
    label: "INCONCLUSIVE",
  },
};

export function VerdictHeroCard({
  verdict,
  headline,
  explanation,
}: VerdictHeroCardProps) {
  const style = verdictConfig[verdict];

  return (
    <div
      className={cn(
        "bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md",
        style.bg,
        style.border,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-headline-lg text-headline-lg text-primary">
          {headline}
        </h3>
        <span
          className={cn(
            "font-label-caps text-label-caps px-sm py-xs rounded",
            style.labelBg,
            style.labelText,
          )}
        >
          {style.label}
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {explanation}
      </p>
    </div>
  );
}
