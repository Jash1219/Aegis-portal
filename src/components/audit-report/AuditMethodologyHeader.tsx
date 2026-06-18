import type { Methodology } from "@/types/audit";

interface AuditMethodologyHeaderProps {
  methodology: Methodology;
  classification: string;
  disclaimer: string;
}

export default function AuditMethodologyHeader({
  methodology,
  classification,
  disclaimer,
}: AuditMethodologyHeaderProps) {
  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.15em]">
          {classification}
        </span>
        <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
          Historical Audit Dashboard
        </h1>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-md">
        <span className="font-data-mono text-data-mono text-amber-400 shrink-0 mt-0.5">
          DISCLAIMER
        </span>
        <p className="font-body-sm text-body-sm text-amber-400/80 leading-relaxed">
          {disclaimer}
        </p>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary/60 rounded-full" />
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Audit Methodology &amp; Scope
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
          {methodology.scope}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div className="flex flex-col gap-xs bg-[#0a0a0a] border border-[#222222] rounded p-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Coverage
            </span>
            <span className="font-body-sm text-body-sm text-primary">
              {methodology.coverage}
            </span>
          </div>
          <div className="flex flex-col gap-xs bg-[#0a0a0a] border border-[#222222] rounded p-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Review Period
            </span>
            <span className="font-body-sm text-body-sm text-primary">
              {methodology.period}
            </span>
          </div>
          <div className="flex flex-col gap-xs bg-[#0a0a0a] border border-[#222222] rounded p-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Sample Size
            </span>
            <span className="font-data-mono text-data-mono text-primary">
              {methodology.sampleSize} invoices
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
