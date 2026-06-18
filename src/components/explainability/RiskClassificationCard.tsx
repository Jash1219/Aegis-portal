import { cn } from "@/lib/utils";
import type { RiskClassificationCardProps } from "@/types/explainability";

const riskConfig = {
  LOW: {
    text: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    label: "LOW",
  },
  MODERATE: {
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "MODERATE",
  },
  HIGH: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "HIGH",
  },
  ABSOLUTE: {
    text: "text-error",
    bg: "bg-error/10",
    border: "border-error/30",
    label: "ABSOLUTE",
  },
};

export function RiskClassificationCard({
  level,
  justification,
}: RiskClassificationCardProps) {
  const style = riskConfig[level];
  const isSevere = level === "HIGH" || level === "ABSOLUTE";

  return (
    <div
      className={cn(
        "rounded-lg p-md flex items-start gap-md",
        style.bg,
        style.border,
        isSevere && "border",
        !isSevere && "border border-[#222222]",
      )}
    >
      <span
        className={cn(
          "font-data-mono text-data-mono px-sm py-xs rounded shrink-0",
          style.bg,
          style.text,
        )}
      >
        {style.label}
      </span>
      <p className={cn("font-body-sm text-body-sm leading-relaxed", style.text)}>
        {justification}
      </p>
    </div>
  );
}
