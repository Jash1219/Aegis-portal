import type { ValidationScopeCardProps } from "@/types/explainability";

export function ValidationScopeCard({
  engineName,
  engineDescription,
}: ValidationScopeCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-md flex flex-col gap-xs font-data-mono text-data-mono">
      <div className="flex items-center gap-sm text-on-surface-variant">
        <span className="text-on-surface-variant">[SCOPE]</span>
        <span className="text-primary font-bold">{engineName}</span>
      </div>
      <p className="text-on-surface-variant leading-relaxed pl-[4.5rem]">
        {engineDescription}
      </p>
    </div>
  );
}
