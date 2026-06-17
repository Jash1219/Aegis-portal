import { AlertTriangle, Download } from "lucide-react";
import ReportViewer from "@/components/report/ReportViewer";
import ReportAnnotations from "@/components/report/ReportAnnotations";

export default function AuditReportPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24 text-[#EDEDED]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-3 text-2xl font-semibold tracking-tight">
            Audit Report
          </h1>

          <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-400">
                SAMPLE HISTORICAL AUDIT REPORT
              </p>
              <p className="mt-0.5 text-xs text-amber-400/80">
                Generated Using Synthetic Demonstration Data
              </p>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-[#A0A0A0]">
            This artifact is the final deliverable of an AEGIS Pilot Engagement.
            It presents a comprehensive portfolio risk assessment based on 20
            synthetic invoice transactions processed by the AEGIS Verification
            Engine. Each finding is accompanied by cryptographic proof and
            mathematical evidence, enabling risk teams to trace capital leakage
            to its exact source.
          </p>

          <a
            href="/historical_audit_report.pdf"
            download
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#222222] bg-[#111111] px-3 py-1.5 text-xs text-[#A0A0A0] transition-colors hover:border-[#444444] hover:text-[#EDEDED]"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </a>
        </div>

        {/* Report Content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-1/3">
            <ReportAnnotations />
          </div>
          <div className="min-h-0 flex-1 lg:h-[calc(100vh-18rem)]">
            <ReportViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
