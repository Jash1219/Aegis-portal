import type { EngineDefinitionCardProps } from "@/types/explainability";

export function EngineDefinitionCard({
  engineName,
  purpose,
  triggerCondition,
}: EngineDefinitionCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm">
      <h4 className="font-headline-md text-headline-md text-primary">
        {engineName}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {purpose}
      </p>
      <div className="flex items-center gap-sm pt-sm border-t border-[#222222]">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Trigger:
        </span>
        <span className="font-data-mono text-data-mono text-primary">
          {triggerCondition}
        </span>
      </div>
    </div>
  );
}
