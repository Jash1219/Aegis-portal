export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-lg">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Institutional Security & Sovereign Data Attestation
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            This document describes the technical controls, data isolation
            guarantees, and verification procedures applicable to the AEGIS
            deterministic validation platform.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
            1. Sovereign Ingestion
          </span>
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            All ledger files uploaded to the AEGIS portal are processed
            entirely within browser RAM using the HTML5 FileReader API. No
            ledger artifacts — including raw CSV rows, parsed invoice fields, or
            evaluation results derived from customer data — are transmitted to
            any external network endpoint, logging service, or telemetry
            pipeline. The evaluation engine executes as a client-side
            deterministic function with zero network egress of customer
            payloads.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
            2. Zero Personally Identifiable Information (PII)
          </span>
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            The AEGIS canonical schema structurally excludes bank account
            numbers, PAN card identifiers, personal names, and any field that
            could individually identify a natural person. The ingestion
            normalizer rejects or ignores columns outside the declared schema.
            No PII is collected, stored, or processed at any stage of the
            validation lifecycle.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
            3. Empirical Verification (InfoSec Protocol)
          </span>
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            Your organisation&apos;s InfoSec team may independently verify the
            zero-egress claim by following this procedure:
          </p>
          <ol className="flex flex-col gap-sm pl-lg list-decimal font-body-sm text-body-sm text-on-surface leading-relaxed">
            <li>
              Open browser Developer Tools (<span className="font-data-mono text-data-mono">F12</span> or{" "}
              <span className="font-data-mono text-data-mono">Ctrl+Shift+I</span>).
            </li>
            <li>
              Navigate to the <span className="font-data-mono text-data-mono">Network</span> tab.
            </li>
            <li>
              Physically disconnect the machine from the internet (disable Wi-Fi
              / unplug Ethernet).
            </li>
            <li>
              Return to the AEGIS portal, navigate to{" "}
              <span className="font-data-mono text-data-mono">Portfolio Scan</span>, and upload a
              sample CSV ledger.
            </li>
            <li>
              Observe that evaluation completes successfully with zero network
              requests recorded in the DevTools Network tab.
            </li>
          </ol>
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            This offline-operating characteristic confirms that all ledger
            processing occurs client-side with no data leaving the browser
            context.
          </p>
        </div>

        <div className="border border-[#222222] rounded-lg p-lg bg-[#111111]">
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Last amended: June 2026. This attestation supersedes all prior
            verbal or written representations regarding the data handling
            posture of the AEGIS deterministic validation platform.
          </p>
        </div>
      </div>
    </div>
  );
}
