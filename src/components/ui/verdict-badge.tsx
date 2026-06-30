import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Verdict } from "@/types/aegis";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const verdictBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        PASS: "border-transparent bg-emerald-500/15 text-emerald-400",
        INCONCLUSIVE: "border-transparent bg-amber-500/15 text-amber-400",
        FAIL: "border-transparent bg-red-500/15 text-red-400",
      },
    },
    defaultVariants: {
      variant: "FAIL",
    },
  },
);

const VERDICT_TOOLTIPS: Record<Verdict, string> = {
  PASS: "This verification completed successfully. No deterministic validation failures were identified.",
  INCONCLUSIVE: "This verification could not be conclusively determined. Manual review may be required.",
  FAIL: "One or more deterministic validation checks failed during verification.",
};

interface VerdictBadgeProps {
  verdict: Verdict;
}

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(verdictBadgeVariants({ variant: verdict }))}>
          {verdict}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {VERDICT_TOOLTIPS[verdict]}
      </TooltipContent>
    </Tooltip>
  );
}
