"use client";

import type { PortfolioDataset } from "@/types/portfolio";

interface PortfolioHeaderProps {
  methodology: PortfolioDataset["methodology"];
}

export default function PortfolioHeader({ methodology }: PortfolioHeaderProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Plane 0
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>
      <h2 className="font-headline-md text-headline-md text-primary">
        {methodology.scope}
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {methodology.coverage}
      </p>
      <div className="flex flex-wrap gap-lg pt-sm">
        <div className="flex flex-col gap-xs">
          <span className="font-data-mono text-data-mono text-primary">
            {methodology.transactionsEvaluated.toLocaleString()}
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Transactions Evaluated
          </span>
        </div>
        <div className="w-px bg-[#222222]" />
        <div className="flex flex-col gap-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Classification
          </span>
          <span className="font-body-sm text-body-sm text-secondary">
            {methodology.classification}
          </span>
        </div>
      </div>
    </div>
  );
}
