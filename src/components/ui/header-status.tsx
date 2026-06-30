import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { GovernmentVerificationStatus } from "@/types/aegis";

const headerStatusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        VERIFIED:
          "border-transparent bg-emerald-500/15 text-emerald-400",
        NOT_FOUND:
          "border-transparent bg-amber-500/15 text-amber-400",
        DISCREPANCY:
          "border-transparent bg-red-500/15 text-red-400",
        PENDING:
          "border-transparent bg-blue-500/15 text-blue-400",
        UNAVAILABLE:
          "border-transparent bg-on-surface/10 text-on-surface-variant",
      },
    },
    defaultVariants: {
      variant: "UNAVAILABLE",
    },
  },
);

const DOT_COLORS: Record<GovernmentVerificationStatus, string> = {
  VERIFIED: "bg-emerald-400",
  NOT_FOUND: "bg-amber-400",
  DISCREPANCY: "bg-red-400",
  PENDING: "bg-blue-400",
  UNAVAILABLE: "bg-on-surface-variant",
};

const STATUS_LABELS: Record<GovernmentVerificationStatus, string> = {
  VERIFIED: "Verified",
  NOT_FOUND: "Not Found",
  DISCREPANCY: "Discrepancy",
  PENDING: "Pending",
  UNAVAILABLE: "Unavailable",
};

interface HeaderStatusProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status: GovernmentVerificationStatus;
}

export function HeaderStatus({ status, className, ...props }: HeaderStatusProps) {
  return (
    <button
      type="button"
      className={cn(headerStatusVariants({ variant: status }), className)}
      {...props}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", DOT_COLORS[status])} />
      <span>{STATUS_LABELS[status]}</span>
    </button>
  );
}
