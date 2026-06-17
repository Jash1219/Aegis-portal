import { ShieldCheck, Trash2, Lock } from "lucide-react";
import SystemDiagram from "@/components/architecture/SystemDiagram";
import EngineBreakdown from "@/components/architecture/EngineBreakdown";

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-16 pt-24 text-[#EDEDED]">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="mb-3 text-2xl font-semibold tracking-tight">
            Architecture & Trust
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#A0A0A0]">
            Deterministic, stateless infrastructure designed for absolute DPDP
            Act (2023) compliance.
          </p>
        </div>

        {/* Zero Retention Philosophy */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-[#EDEDED]">
              Zero-Retention Philosophy
            </h2>
          </div>
          <div className="space-y-3 rounded-lg border border-[#222222] bg-[#111111] p-5">
            <p className="text-sm leading-relaxed text-[#A0A0A0]">
              AEGIS does not store invoice JSONs, supplier PII, financial
              values, or any personally identifiable information. Every
              validation request is processed entirely in memory — the raw
              payload is discarded immediately after the verdict is generated.
            </p>
            <p className="text-sm leading-relaxed text-[#A0A0A0]">
              The only data persisted to the database are cryptographic
              SHA-256 hashes of invoice numbers and IRNs, along with their
              corresponding verification UUIDs. These hashes serve exclusively
              for idempotency deduplication — they cannot be reversed to
              recover the original values.
            </p>
            <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">
                  DPDP Act (2023) Aligned
                </p>
                <p className="mt-1 text-xs leading-relaxed text-blue-300/70">
                  By eliminating PII retention entirely, AEGIS removes the
                  data fiduciary obligations that create regulatory liability.
                  There is no data to breach, no consent to manage, and no
                  right-to-explanation enforceable against the verification
                  output.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Diagram */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-[#EDEDED]">
              Request Flow
            </h2>
          </div>
          <div className="rounded-lg border border-[#222222] bg-[#111111] p-6">
            <SystemDiagram />
          </div>
        </section>

        {/* Validation Engines */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-[#EDEDED]">
              Deterministic Validation Engines
            </h2>
          </div>
          <EngineBreakdown />
        </section>
      </div>
    </div>
  );
}
