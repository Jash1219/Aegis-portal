import type { ValidationFindingCardProps } from "@/types/explainability";

export function ValidationFindingCard({
  findingTitle,
  findingExplanation,
}: ValidationFindingCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-sm">
      <h4 className="font-headline-md text-headline-md text-primary">
        {findingTitle}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {findingExplanation}
      </p>
    </div>
  );
}
