import type { ValidationCoverageCardProps } from "@/types/explainability";
import { EngineDefinitionCard } from "./EngineDefinitionCard";

export function ValidationCoverageCard({
  engines,
}: ValidationCoverageCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Validation Coverage
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {engines.map((engine, index) => (
          <EngineDefinitionCard key={index} {...engine} />
        ))}
      </div>
    </div>
  );
}
