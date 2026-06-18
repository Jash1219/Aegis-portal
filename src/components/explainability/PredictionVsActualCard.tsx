import { cn } from "@/lib/utils";
import type { PredictionVsActualCardProps } from "@/types/explainability";

const verdictColors: Record<string, string> = {
  PASS: "text-secondary",
  FAIL: "text-error",
  INCONCLUSIVE: "text-yellow-400",
};

export function PredictionVsActualCard({
  predictedState,
  actualState,
}: PredictionVsActualCardProps) {
  const match = predictedState === actualState;

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Prediction vs Actual
      </span>
      <div
        className={cn(
          "grid grid-cols-2 gap-md p-md rounded border",
          match
            ? "border-secondary/20 bg-secondary/5"
            : "border-error/20 bg-error/5",
        )}
      >
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Predicted
          </span>
          <span
            className={cn(
              "font-data-mono text-headline-md font-bold",
              verdictColors[predictedState],
            )}
          >
            {predictedState}
          </span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Actual
          </span>
          <span
            className={cn(
              "font-data-mono text-headline-md font-bold",
              verdictColors[actualState],
            )}
          >
            {actualState}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Result:
        </span>
        <span
          className={cn(
            "font-data-mono text-data-mono",
            match ? "text-secondary" : "text-error",
          )}
        >
          {match ? "MATCH" : "VARIANCE DETECTED"}
        </span>
      </div>
    </div>
  );
}
