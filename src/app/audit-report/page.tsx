import { MOCK_AUDIT_REPORT } from "@/data/mockAuditReport";
import AuditMethodologyHeader from "@/components/audit-report/AuditMethodologyHeader";
import AuditMetricsGrid from "@/components/audit-report/AuditMetricsGrid";
import AttributionSummaryPanel from "@/components/audit-report/AttributionSummaryPanel";
import ExpandableFindingCard from "@/components/audit-report/ExpandableFindingCard";
import PdfArtifactViewer from "@/components/audit-report/PdfArtifactViewer";

export default function AuditReportPage() {
  const report = MOCK_AUDIT_REPORT;

  return (
    <div className="flex flex-col gap-xl">
      {/* Plane 0: Methodology Header */}
      <AuditMethodologyHeader
        methodology={report.methodology}
        classification={report.classification}
        disclaimer={report.disclaimer}
      />

      {/* Plane 1: Portfolio Metrics */}
      <AuditMetricsGrid metrics={report.portfolioMetrics} />

      {/* Plane 1.5: Attribution Analysis */}
      <AttributionSummaryPanel attribution={report.attribution} />

      {/* Plane 2: Detailed Findings */}
      <div className="flex flex-col gap-md">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-error/40 to-transparent" />
          <span className="font-label-caps text-label-caps text-error tracking-[0.2em] uppercase shrink-0">
            Detailed Findings Repository
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-error/40 to-transparent" />
        </div>

        {report.findings.map((finding) => (
          <ExpandableFindingCard
            key={finding.id}
            finding={finding}
            defaultExpanded={
              finding.severity === "ABSOLUTE" || finding.severity === "HIGH"
            }
          />
        ))}
      </div>

      {/* Plane 3: Compliance Artifact */}
      <div className="flex flex-col gap-md">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-on-surface-variant/20 to-transparent" />
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] uppercase shrink-0">
            Compliance Artifact
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-on-surface-variant/20 to-transparent" />
        </div>
        <PdfArtifactViewer />
      </div>
    </div>
  );
}
