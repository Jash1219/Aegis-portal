import { VerdictBadge } from "@/components/ui/verdict-badge";
import { EvidenceCard } from "@/components/ui/evidence-card";
import { SupplierIntelligencePanel } from "@/components/ui/supplier-intelligence-panel";
import { EvidenceTimeline } from "@/components/ui/evidence-timeline";
import { IntegrityCertificate } from "@/components/ui/integrity-certificate";
import { HeaderStatus } from "@/components/ui/header-status";
import type { TriangulateResponse, CheckResult } from "@/types/aegis";

const MOCK_RESPONSE: TriangulateResponse = {
  verification_id: "V-TRANSIT-PHYSICS-001",
  client_reference_id: "INV-ABC-2024-001",
  verdict: "FAIL",
  checks: [
    {
      check_id: "CHK-GST-001",
      check_name: "GST Format Validation",
      status: "FAILED",
      severity: "HIGH",
      anomaly: {
        code: "ANOM-GST-FMT-001",
        description: "GSTIN format does not match the standard 15-character alphanumeric pattern (e.g., 22AAAAA0000A1Z5). The provided value contains invalid characters in positions 3-5.",
      },
    },
    {
      check_id: "CHK-PAN-002",
      check_name: "PAN Consistency",
      status: "PASSED",
      severity: "MEDIUM",
      evidence: {
        pan: "ABCDE1234F",
        matched: true,
      },
    },
    {
      check_id: "CHK-AMT-003",
      check_name: "Invoice Value vs Turnover",
      status: "FAILED",
      severity: "CRITICAL",
      evidence: {
        invoice_value: 2500000,
        declared_turnover: 12000000,
        ratio: 0.208,
      },
      anomaly: {
        code: "ANOM-AMT-TRN-001",
        description: "Invoice value exceeds 15% of the declared annual turnover for the given period. This may indicate revenue suppression or invoice inflation.",
        math_proof: {
          formula: "invoice_value / declared_turnover > 0.15",
          invoice_value: 2500000,
          declared_turnover: 12000000,
          threshold: 0.15,
          actual_ratio: 0.208,
        },
      },
    },
  ] satisfies CheckResult[],
  government_verification_status: "VERIFIED",
  supplier_intelligence: {
    gstin: {
      value: "22AAAAA0000A1Z5",
      dataSource: "GST_PORTAL",
      sourceName: "Government GST Database",
      accessMethod: "API",
      dataTimestamp: "2026-06-30T10:30:00Z",
    },
    legalName: {
      value: "Acme Corp Private Limited",
      dataSource: "GST_PORTAL",
      sourceName: "Government GST Database",
      accessMethod: "API",
      dataTimestamp: "2026-06-30T10:30:00Z",
    },
    address: {
      value: "42, Industrial Area, Sector 12, Bangalore, Karnataka 560001",
      dataSource: "GST_PORTAL",
      sourceName: "Government GST Database",
      accessMethod: "API",
      dataTimestamp: "2026-06-30T10:30:00Z",
    },
    registrationStatus: {
      value: "Active",
      dataSource: "GST_PORTAL",
      sourceName: "Government GST Database",
      accessMethod: "API",
      dataTimestamp: "2026-06-30T10:30:00Z",
    },
    registrationDate: {
      value: "2019-04-01",
      dataSource: "GST_PORTAL",
      sourceName: "Government GST Database",
      accessMethod: "API",
      dataTimestamp: "2026-06-30T10:30:00Z",
      isStatic: true,
    },
  },
};

export function VerificationDetailScreen() {
  const { verification_id, client_reference_id, verdict, checks, government_verification_status, supplier_intelligence } =
    MOCK_RESPONSE;

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-data-mono text-on-surface-variant">
              {verification_id}
            </div>
            <div className="text-body-sm text-on-surface-variant">
              Invoice: {client_reference_id}
            </div>
            <div className="text-body-sm text-on-surface-variant">
              Created: 2026-06-30T10:15:00Z
            </div>
            <div className="text-body-sm text-on-surface-variant">
              Processing Time: 1.2s
            </div>
          </div>
          <div className="flex items-center gap-3">
            {verdict && <VerdictBadge verdict={verdict} />}
            {government_verification_status && (
              <HeaderStatus status={government_verification_status} />
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <span className="text-label-caps text-on-surface-variant block">
          Findings
        </span>
        {checks?.map((check) => (
          <EvidenceCard key={check.check_id} checkResult={check} />
        ))}
      </section>

      <section>
        {supplier_intelligence && government_verification_status && (
          <SupplierIntelligencePanel
            supplierIntelligence={supplier_intelligence}
            governmentVerificationStatus={government_verification_status}
          />
        )}
      </section>

      <section>
        <details className="group">
          <summary className="text-label-caps text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
            Evidence Timeline
          </summary>
          <div className="mt-3">
            <EvidenceTimeline
              schemaValidation="PASSED"
              deterministicRules="FINDINGS_DETECTED"
              governmentVerification="PASSED"
              supplierIntelligence="PASSED"
              verdictAssembly="FINDINGS_DETECTED"
            />
          </div>
        </details>
      </section>

      <section>
        <IntegrityCertificate
          verificationId={verification_id ?? "N/A"}
          createdAt="2026-06-30T10:15:00Z"
          payloadHash="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          apiCallSummary="POST /api/v1/triangulate — 200 OK (1.2s)"
          apiVersion="v1"
          schemaVersion="v1.0"
          engineVersion="v1.0.0"
        />
      </section>
    </div>
  );
}
