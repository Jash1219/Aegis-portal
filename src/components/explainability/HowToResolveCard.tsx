import type { HowToResolveCardProps } from "@/types/explainability";

export function HowToResolveCard({
  resolutionCriteria,
  secondaryProofs,
}: HowToResolveCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        How to Resolve
      </span>
      <ul className="flex flex-col gap-sm">
        {resolutionCriteria.map((criterion, index) => (
          <li
            key={index}
            className="flex items-start gap-sm font-data-mono text-data-mono text-on-surface"
          >
            <span className="text-on-surface-variant shrink-0">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <span>{criterion}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-start gap-sm bg-[#0a0a0a] border border-[#222222] rounded p-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant shrink-0">
          Secondary Proofs:
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {secondaryProofs}
        </span>
      </div>
    </div>
  );
}
