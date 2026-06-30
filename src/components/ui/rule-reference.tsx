import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RuleReferenceProps {
  anomalyCode: string;
  ruleName: string;
  ruleFamily: string;
  productionStatus: string;
  phaseIntroduced: string;
  whatItChecks: string;
  statutoryBasis: string;
  findingsProduced: string;
}

export function RuleReference({
  anomalyCode,
  ruleName,
  ruleFamily,
  productionStatus,
  phaseIntroduced,
  whatItChecks,
  statutoryBasis,
  findingsProduced,
}: RuleReferenceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={cn(
          "text-data-mono text-emerald-400 underline underline-offset-2 decoration-emerald-400/40",
          "hover:text-emerald-300 cursor-pointer",
        )}
      >
        {anomalyCode}
      </button>

      <dialog
        ref={dialogRef}
        className="surface-card rounded-xl p-0 backdrop:bg-black/60 max-w-lg w-full open:flex"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-caps text-on-surface-variant">
              Rule Definition
            </span>
            <button
              type="button"
              onClick={close}
              className="text-on-surface-variant hover:text-foreground cursor-pointer text-body-sm"
              aria-label="Close rule definition"
            >
              Close
            </button>
          </div>

          <dl className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 text-body-sm">
            <dt className="text-on-surface-variant">Rule Name</dt>
            <dd className="text-foreground font-medium">{ruleName}</dd>

            <dt className="text-on-surface-variant">Rule Family</dt>
            <dd className="text-foreground">{ruleFamily}</dd>

            <dt className="text-on-surface-variant">Production Status</dt>
            <dd className="text-foreground">{productionStatus}</dd>

            <dt className="text-on-surface-variant">Phase Introduced</dt>
            <dd className="text-foreground">{phaseIntroduced}</dd>

            <dt className="text-on-surface-variant">What It Checks</dt>
            <dd className="text-foreground">{whatItChecks}</dd>

            <dt className="text-on-surface-variant">Statutory Basis</dt>
            <dd className="text-foreground">{statutoryBasis}</dd>

            <dt className="text-on-surface-variant">Findings Produced</dt>
            <dd className="text-foreground">{findingsProduced}</dd>
          </dl>
        </div>
      </dialog>
    </>
  );
}
