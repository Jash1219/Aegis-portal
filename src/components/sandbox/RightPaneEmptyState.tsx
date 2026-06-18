"use client";

export default function RightPaneEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#111111] border border-[#222222] rounded-lg p-xl text-center">
      <div className="flex flex-col items-center gap-md max-w-md">
        <div className="w-16 h-16 rounded-full border border-[#222222] bg-[#0a0a0a] flex items-center justify-center">
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            1
          </span>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Select Experiment
        </span>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Choose a validation experiment from the left pane to begin.
        </p>
        <div className="w-full border-t border-[#222222] my-sm" />
        <div className="flex flex-col items-center gap-md">
          <div className="w-16 h-16 rounded-full border border-[#222222] bg-[#0a0a0a] flex items-center justify-center">
            <span className="font-data-mono text-data-mono text-on-surface-variant">
              2
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Predict Outcome
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Set your expected verdict before running the engine.
          </p>
        </div>
        <div className="w-full border-t border-[#222222] my-sm" />
        <div className="flex flex-col items-center gap-md">
          <div className="w-16 h-16 rounded-full border border-[#222222] bg-[#0a0a0a] flex items-center justify-center">
            <span className="font-data-mono text-data-mono text-on-surface-variant">
              3
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Run Validation
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Execute the deterministic engine and compare your prediction against the result.
          </p>
        </div>
      </div>
    </div>
  );
}
