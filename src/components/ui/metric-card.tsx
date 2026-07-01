import { cn } from "@/lib/utils";

type DeltaDirection = "up" | "down" | "neutral";

interface DeltaIndicator {
  direction: DeltaDirection;
  value: string;
}

interface MetricCardProps {
  label: string;
  primaryMetric: string | number;
  deltaIndicator: DeltaIndicator;
  secondaryContext: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const DIRECTION_ARROW: Record<DeltaDirection, string> = {
  up: "\u2191",
  down: "\u2193",
  neutral: "\u2192",
};

const DIRECTION_STYLES: Record<DeltaDirection, string> = {
  up: "text-emerald-400",
  down: "text-red-400",
  neutral: "text-on-surface-variant",
};

function MetricCardInner({
  label,
  primaryMetric,
  deltaIndicator,
  secondaryContext,
}: Omit<MetricCardProps, "href" | "onClick" | "className">) {
  return (
    <>
      <div className="text-label-caps text-on-surface-variant">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-display-sm text-foreground font-semibold">
          {primaryMetric}
        </span>
        <span
          className={cn(
            "text-data-mono",
            DIRECTION_STYLES[deltaIndicator.direction],
          )}
        >
          {DIRECTION_ARROW[deltaIndicator.direction]} {deltaIndicator.value}
        </span>
      </div>
      <div className="mt-1 text-body-sm text-on-surface-variant">
        {secondaryContext}
      </div>
    </>
  );
}

export function MetricCard({
  label,
  primaryMetric,
  deltaIndicator,
  secondaryContext,
  href,
  onClick,
  className,
}: MetricCardProps) {
  const content = (
    <MetricCardInner
      label={label}
      primaryMetric={primaryMetric}
      deltaIndicator={deltaIndicator}
      secondaryContext={secondaryContext}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "surface-card rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity",
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
          "surface-card rounded-lg p-4 w-full text-left cursor-pointer hover:opacity-80 transition-opacity",
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
        "surface-card rounded-lg p-4",
        className,
      )}
    >
      {content}
    </div>
  );
}
