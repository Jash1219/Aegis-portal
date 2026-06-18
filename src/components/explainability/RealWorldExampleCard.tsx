import type { RealWorldExampleCardProps } from "@/types/explainability";

export function RealWorldExampleCard({
  scenario,
  actorBehavior,
  systemResponse,
}: RealWorldExampleCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Real-World Example
        </span>
        <h4 className="font-headline-md text-headline-md text-primary">
          {scenario}
        </h4>
      </div>
      <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md flex flex-col gap-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Actor Behavior
        </span>
        <p className="font-data-mono text-data-mono text-on-surface leading-relaxed">
          {actorBehavior}
        </p>
      </div>
      <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md flex flex-col gap-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          System Response
        </span>
        <p className="font-data-mono text-data-mono text-secondary leading-relaxed">
          {systemResponse}
        </p>
      </div>
    </div>
  );
}
