import { cn } from "@/lib/utils";
import type { GovernmentDataSource } from "@/types/aegis";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const GOVERNMENT_DATA_SOURCE_LABELS: Record<GovernmentDataSource, string> = {
  GST_PORTAL: "GST Portal",
  INCOME_TAX_PORTAL: "Income Tax Portal",
  MCA: "MCA",
  BANK: "Bank Statement",
  MANUAL_UPLOAD: "Manual Upload",
  ERP: "ERP",
  CREDIT_BUREAU: "Credit Bureau",
  PUBLIC_RECORD: "Public Record",
};

interface SourceBadgeProps {
  dataSource: GovernmentDataSource;
  sourceName: string;
  accessMethod: string;
  dataTimestamp: string;
}

export function SourceBadge({ dataSource, sourceName, accessMethod, dataTimestamp }: SourceBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
            "border-transparent bg-blue-500/15 text-blue-400",
          )}
        >
          {GOVERNMENT_DATA_SOURCE_LABELS[dataSource]}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p><span className="font-medium">Source:</span> {sourceName}</p>
          <p><span className="font-medium">Access:</span> {accessMethod}</p>
          <p><span className="font-medium">Timestamp:</span> {dataTimestamp}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
