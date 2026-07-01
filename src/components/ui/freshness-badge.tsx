import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface FreshnessBadgeProps {
  dataTimestamp: string;
  isStatic?: boolean;
}

function formatRelativeTime(isoTimestamp: string, isStatic?: boolean): string {
  if (isStatic) return "Static";

  const now = Date.now();
  const then = new Date(isoTimestamp).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 0) return "Live";

  if (diffSeconds < 60) return "Live";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} old`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} old`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} old`;
}

export function FreshnessBadge({ dataTimestamp, isStatic }: FreshnessBadgeProps) {
  const label = formatRelativeTime(dataTimestamp, isStatic);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
            label === "Live" || label === "Static"
              ? "border-transparent bg-emerald-500/15 text-emerald-400"
              : "border-transparent bg-amber-500/15 text-amber-400",
          )}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {dataTimestamp}
      </TooltipContent>
    </Tooltip>
  );
}
