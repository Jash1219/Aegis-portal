import { cn } from "@/lib/utils";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import type { Verdict } from "@/types/aegis";

const MAX_VISIBLE_BADGES = 4;

interface ManualReviewItemProps {
  invoiceReference: string;
  supplierState: string;
  invoiceValue: string | number;
  primaryAnomalyCode: string;
  allAnomalyCodes: string[];
  daysInQueue: number;
  verdict: Verdict;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function ManualReviewItemContent({
  invoiceReference,
  supplierState,
  invoiceValue,
  primaryAnomalyCode,
  allAnomalyCodes,
  daysInQueue,
  verdict,
}: Omit<ManualReviewItemProps, "href" | "onClick">) {
  const visible = allAnomalyCodes.slice(0, MAX_VISIBLE_BADGES);
  const overflow = allAnomalyCodes.length - MAX_VISIBLE_BADGES;

  return (
    <>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-4 min-w-0 flex-[2]">
          <span className="text-data-mono text-foreground truncate">
            {invoiceReference.length > 12
              ? `${invoiceReference.slice(0, 12)}\u2026`
              : invoiceReference}
          </span>
          <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
            {supplierState}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-[3] min-w-0">
          <span className="text-body-sm text-foreground whitespace-nowrap font-medium">
            \u20B9{invoiceValue}
          </span>
          <span className="text-data-mono text-on-surface-variant whitespace-nowrap">
            {primaryAnomalyCode}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-[2] min-w-0">
          {visible.map((code) => (
            <span
              key={code}
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
                "border-transparent bg-on-surface/10 text-on-surface-variant",
              )}
            >
              {code}
            </span>
          ))}
          {overflow > 0 && (
            <span className="text-data-mono text-on-surface-variant whitespace-nowrap">
              +{overflow}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
          {daysInQueue}d
        </span>
        <VerdictBadge verdict={verdict} />
      </div>
    </>
  );
}

export function ManualReviewItem(props: ManualReviewItemProps) {
  const { href, onClick, className } = props;
  const content = (
    <ManualReviewItemContent
      invoiceReference={props.invoiceReference}
      supplierState={props.supplierState}
      invoiceValue={props.invoiceValue}
      primaryAnomalyCode={props.primaryAnomalyCode}
      allAnomalyCodes={props.allAnomalyCodes}
      daysInQueue={props.daysInQueue}
      verdict={props.verdict}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "surface-card rounded-lg px-4 py-3 flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity",
          className,
        )}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "surface-card rounded-lg px-4 py-3 w-full flex items-center gap-4 text-left cursor-pointer hover:opacity-80 transition-opacity",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "surface-card rounded-lg px-4 py-3 flex items-center gap-4",
        className,
      )}
    >
      {content}
    </div>
  );
}
