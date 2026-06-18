import type { InputExplainabilityCardProps } from "@/types/explainability";

export function InputExplainabilityCard({
  title,
  definition,
  businessContext,
  exampleValue,
  exampleFailure,
  children,
}: InputExplainabilityCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <div className="flex flex-col gap-sm">
        <h4 className="font-headline-md text-headline-md text-primary">
          {title}
        </h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {definition}
        </p>
      </div>
      <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md flex flex-col gap-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Business Context
        </span>
        <p className="font-body-sm text-body-sm text-on-surface">
          {businessContext}
        </p>
      </div>
      {children && <div className="flex flex-col gap-sm">{children}</div>}
      <div className="grid grid-cols-2 gap-md">
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-secondary">
            Valid Example
          </span>
          <span className="font-data-mono text-data-mono text-on-surface bg-[#0a0a0a] border border-[#222222] rounded px-sm py-xs">
            {exampleValue}
          </span>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-error">
            Failure Example
          </span>
          <span className="font-data-mono text-data-mono text-error bg-[#0a0a0a] border border-error/20 rounded px-sm py-xs">
            {exampleFailure}
          </span>
        </div>
      </div>
    </div>
  );
}
