"use client";

import { FileText } from "lucide-react";

export default function ReportViewer() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#222222]">
      <object
        data="/historical_audit_report.pdf#toolbar=0&navpanes=0"
        type="application/pdf"
        className="h-full w-full"
        aria-label="Historical Audit Report"
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-500">
            Your browser does not support PDFs.
          </p>
          <a
            href="/historical_audit_report.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <FileText className="h-4 w-4" />
            Download the Report
          </a>
        </div>
      </object>
    </div>
  );
}
