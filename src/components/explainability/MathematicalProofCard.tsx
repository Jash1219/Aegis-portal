import type { MathematicalProofCardProps } from "@/types/explainability";

export function MathematicalProofCard({
  formula,
  variables,
  calculatedResult,
}: MathematicalProofCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-lg flex flex-col gap-md font-mono">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Mathematical Proof
      </span>
      <div className="font-data-mono text-data-mono text-on-surface-variant bg-[#000000] border border-[#222222] rounded p-md overflow-x-auto">
        <code>{formula}</code>
      </div>
      <div className="grid grid-cols-2 gap-sm">
        {Object.entries(variables).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between bg-[#000000] border border-[#222222] rounded px-sm py-xs"
          >
            <span className="font-data-mono text-data-mono text-on-surface-variant">
              {key}
            </span>
            <span className="font-data-mono text-data-mono text-primary">
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#222222] pt-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Result
        </span>
        <span className="font-data-mono text-data-mono text-secondary font-bold">
          {calculatedResult}
        </span>
      </div>
    </div>
  );
}
