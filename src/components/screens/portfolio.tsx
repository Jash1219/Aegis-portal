import { ManualReviewItem } from "@/components/ui/manual-review-item";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import type { TriangulateResponse, CheckResult } from "@/types/aegis";

const MOCK_VERIFICATIONS: TriangulateResponse[] = [
  {
    verification_id: "V-PORTFOLIO-001",
    client_reference_id: "INV-DEL-2024-0421",
    verdict: "FAIL",
    checks: [
      { check_id: "CHK-001", status: "FAILED", severity: "HIGH", anomaly: { code: "ANOM-GST-FMT-001" } },
      { check_id: "CHK-002", status: "FAILED", severity: "MEDIUM", anomaly: { code: "ANOM-PAN-CONS-002" } },
      { check_id: "CHK-003", status: "FAILED", severity: "LOW", anomaly: { code: "ANOM-ADDR-MIS-003" } },
      { check_id: "CHK-004", status: "FAILED", severity: "LOW", anomaly: { code: "ANOM-HSN-MIS-004" } },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-002",
    client_reference_id: "INV-MUM-2024-0893",
    verdict: "INCONCLUSIVE",
    checks: [
      { check_id: "CHK-005", status: "PASSED", severity: "MEDIUM" },
      { check_id: "CHK-006", status: "PENDING", severity: "HIGH", anomaly: { code: "ANOM-GST-VAL-005" } },
      { check_id: "CHK-007", status: "PENDING", severity: "HIGH", anomaly: { code: "ANOM-TRN-RAT-006" } },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-003",
    client_reference_id: "INV-BLR-2024-1127",
    verdict: "FAIL",
    checks: [
      { check_id: "CHK-008", status: "FAILED", severity: "CRITICAL", anomaly: { code: "ANOM-AMT-TRN-001" } },
      { check_id: "CHK-009", status: "FAILED", severity: "HIGH", anomaly: { code: "ANOM-PAN-STAT-007" } },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-004",
    client_reference_id: "INV-HYD-2024-0056",
    verdict: "PASS",
    checks: [
      { check_id: "CHK-010", status: "PASSED", severity: "LOW" },
      { check_id: "CHK-011", status: "PASSED", severity: "LOW" },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-005",
    client_reference_id: "INV-PUN-2024-2310",
    verdict: "INCONCLUSIVE",
    checks: [
      { check_id: "CHK-012", status: "PASSED", severity: "MEDIUM" },
      { check_id: "CHK-013", status: "PENDING", severity: "HIGH", anomaly: { code: "ANOM-SUP-REG-008" } },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-006",
    client_reference_id: "INV-CHE-2024-0678",
    verdict: "FAIL",
    checks: [
      { check_id: "CHK-014", status: "FAILED", severity: "HIGH", anomaly: { code: "ANOM-GST-FMT-001" } },
      { check_id: "CHK-015", status: "FAILED", severity: "MEDIUM", anomaly: { code: "ANOM-HSN-CLS-009" } },
      { check_id: "CHK-016", status: "FAILED", severity: "MEDIUM", anomaly: { code: "ANOM-ADDR-MIS-003" } },
      { check_id: "CHK-017", status: "FAILED", severity: "LOW", anomaly: { code: "ANOM-PAN-CONS-002" } },
      { check_id: "CHK-018", status: "FAILED", severity: "LOW", anomaly: { code: "ANOM-GST-VAL-005" } },
      { check_id: "CHK-019", status: "FAILED", severity: "LOW", anomaly: { code: "ANOM-TRN-RAT-006" } },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-007",
    client_reference_id: "INV-KOL-2024-1542",
    verdict: "PASS",
    checks: [
      { check_id: "CHK-020", status: "PASSED", severity: "LOW" },
    ] satisfies CheckResult[],
  },
  {
    verification_id: "V-PORTFOLIO-008",
    client_reference_id: "INV-AHM-2024-0395",
    verdict: "FAIL",
    checks: [
      { check_id: "CHK-021", status: "FAILED", severity: "CRITICAL", anomaly: { code: "ANOM-AMT-TRN-001" } },
      { check_id: "CHK-022", status: "FAILED", severity: "HIGH", anomaly: { code: "ANOM-GST-FMT-001" } },
      { check_id: "CHK-023", status: "FAILED", severity: "HIGH", anomaly: { code: "ANOM-PAN-STAT-007" } },
      { check_id: "CHK-024", status: "FAILED", severity: "MEDIUM", anomaly: { code: "ANOM-HSN-CLS-009" } },
    ] satisfies CheckResult[],
  },
];

const SUPPLIER_STATES: Record<string, string> = {
  "V-PORTFOLIO-001": "Delhi",
  "V-PORTFOLIO-002": "Maharashtra",
  "V-PORTFOLIO-003": "Karnataka",
  "V-PORTFOLIO-004": "Telangana",
  "V-PORTFOLIO-005": "Punjab",
  "V-PORTFOLIO-006": "Tamil Nadu",
  "V-PORTFOLIO-007": "West Bengal",
  "V-PORTFOLIO-008": "Gujarat",
};

const INVOICE_VALUES: Record<string, number> = {
  "V-PORTFOLIO-001": 1250000,
  "V-PORTFOLIO-002": 875000,
  "V-PORTFOLIO-003": 3450000,
  "V-PORTFOLIO-004": 520000,
  "V-PORTFOLIO-005": 1980000,
  "V-PORTFOLIO-006": 2760000,
  "V-PORTFOLIO-007": 410000,
  "V-PORTFOLIO-008": 5120000,
};

const DAYS_IN_QUEUE: Record<string, number> = {
  "V-PORTFOLIO-001": 3,
  "V-PORTFOLIO-002": 7,
  "V-PORTFOLIO-003": 1,
  "V-PORTFOLIO-004": 0,
  "V-PORTFOLIO-005": 5,
  "V-PORTFOLIO-006": 2,
  "V-PORTFOLIO-007": 0,
  "V-PORTFOLIO-008": 4,
};

const HSN_CHAPTERS: Record<string, string> = {
  "V-PORTFOLIO-001": "84",
  "V-PORTFOLIO-002": "73",
  "V-PORTFOLIO-003": "85",
  "V-PORTFOLIO-004": "39",
  "V-PORTFOLIO-005": "62",
  "V-PORTFOLIO-006": "84",
  "V-PORTFOLIO-007": "48",
  "V-PORTFOLIO-008": "84",
};

const SUBMISSION_DATES: Record<string, string> = {
  "V-PORTFOLIO-001": "2026-06-25",
  "V-PORTFOLIO-002": "2026-06-20",
  "V-PORTFOLIO-003": "2026-06-28",
  "V-PORTFOLIO-004": "2026-06-29",
  "V-PORTFOLIO-005": "2026-06-22",
  "V-PORTFOLIO-006": "2026-06-26",
  "V-PORTFOLIO-007": "2026-06-30",
  "V-PORTFOLIO-008": "2026-06-24",
};

const INVOICE_DATES: Record<string, string> = {
  "V-PORTFOLIO-001": "2026-06-20",
  "V-PORTFOLIO-002": "2026-06-15",
  "V-PORTFOLIO-003": "2026-06-22",
  "V-PORTFOLIO-004": "2026-06-25",
  "V-PORTFOLIO-005": "2026-06-18",
  "V-PORTFOLIO-006": "2026-06-21",
  "V-PORTFOLIO-007": "2026-06-28",
  "V-PORTFOLIO-008": "2026-06-19",
};

const GOVERNMENT_ENRICHMENTS: Record<string, string> = {
  "V-PORTFOLIO-001": "GST: Verified",
  "V-PORTFOLIO-002": "GST: Pending",
  "V-PORTFOLIO-003": "GST: Verified / IT: Verified",
  "V-PORTFOLIO-004": "GST: Verified",
  "V-PORTFOLIO-005": "GST: Discrepancy",
  "V-PORTFOLIO-006": "GST: Verified / IT: Pending",
  "V-PORTFOLIO-007": "GST: Verified",
  "V-PORTFOLIO-008": "GST: Verified / IT: Verified / MCA: Verified",
};

function formatInvoiceValue(paise: number): string {
  const lakhs = paise / 100000;
  return `${lakhs.toFixed(1)}L`;
}

function getAnomalyCodes(verification: TriangulateResponse): string[] {
  return (
    verification.checks
      ?.filter((c) => c.anomaly?.code)
      .map((c) => c.anomaly!.code!) ?? []
  );
}

function getPrimaryAnomalyCode(verification: TriangulateResponse): string {
  return getAnomalyCodes(verification)[0] ?? "\u2014";
}

function formatCr(paise: number): string {
  const cr = paise / 10000000;
  return `\u20B9${cr.toFixed(1)}Cr`;
}

export function PortfolioScreen() {
  const queueItems = MOCK_VERIFICATIONS.filter(
    (v) => v.verdict === "FAIL" || v.verdict === "INCONCLUSIVE",
  );

  const queueTotalValue = queueItems.reduce(
    (sum, v) => sum + (INVOICE_VALUES[v.verification_id ?? ""] ?? 0),
    0,
  );

  const passCount = MOCK_VERIFICATIONS.filter(
    (v) => v.verdict === "PASS",
  ).length;

  const queueCountMap = { FAIL: 0, INCONCLUSIVE: 0 };
  for (const v of queueItems) {
    if (v.verdict === "FAIL") queueCountMap.FAIL++;
    if (v.verdict === "INCONCLUSIVE") queueCountMap.INCONCLUSIVE++;
  }

  return (
    <div className="space-y-8">
      {/* Section A — Manual Review Queue */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant">
            Manual Review Queue — {queueItems.length} invoices requiring human attention |{" "}
            {formatCr(queueTotalValue)} total value
          </span>
          <span className="text-body-sm text-on-surface-variant">
            {queueCountMap.FAIL} FAIL / {queueCountMap.INCONCLUSIVE} INCONCLUSIVE
          </span>
        </div>
        <div className="space-y-2">
          {queueItems.map((v) => (
            <ManualReviewItem
              key={v.verification_id}
              invoiceReference={v.client_reference_id ?? "N/A"}
              supplierState={
                SUPPLIER_STATES[v.verification_id ?? ""] ?? "Unknown"
              }
              invoiceValue={formatInvoiceValue(
                INVOICE_VALUES[v.verification_id ?? ""] ?? 0,
              )}
              primaryAnomalyCode={getPrimaryAnomalyCode(v)}
              allAnomalyCodes={getAnomalyCodes(v)}
              daysInQueue={DAYS_IN_QUEUE[v.verification_id ?? ""] ?? 0}
              verdict={v.verdict ?? "FAIL"}
              href="#"
            />
          ))}
        </div>
      </section>

      {/* Section B — Verification Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant">
            Verification Table
          </span>
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Filter
            </span>
            <span className="text-on-surface-variant">|</span>
            <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Sort
            </span>
            <span className="text-on-surface-variant">|</span>
            <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Export
            </span>
          </div>
        </div>
        <div className="surface-card rounded-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Submission Date
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Invoice Date
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Supplier State
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  HSN Chapter
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Verdict
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Anomaly Codes
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Invoice Value
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Government Enrichment
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VERIFICATIONS.map((v) => (
                <tr
                  key={v.verification_id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {SUBMISSION_DATES[v.verification_id ?? ""] ?? "\u2014"}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {INVOICE_DATES[v.verification_id ?? ""] ?? "\u2014"}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {SUPPLIER_STATES[v.verification_id ?? ""] ?? "\u2014"}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {HSN_CHAPTERS[v.verification_id ?? ""] ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {v.verdict && <VerdictBadge verdict={v.verdict} />}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {getAnomalyCodes(v).length > 0
                      ? getAnomalyCodes(v).join(", ")
                      : "\u2014"}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-medium">
                    {formatInvoiceValue(
                      INVOICE_VALUES[v.verification_id ?? ""] ?? 0,
                    )}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {GOVERNMENT_ENRICHMENTS[v.verification_id ?? ""] ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href="#"
                      className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section C — Period Summary */}
      <section>
        <details className="group">
          <summary className="text-label-caps text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none list-none flex items-center gap-2 before:content-['\25B6'] before:inline-block before:transition-transform group-open:before:rotate-90">
            Period Summary
          </summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface-card rounded-lg p-4 space-y-1">
              <span className="text-label-caps text-on-surface-variant block">
                Total Invoices
              </span>
              <span className="text-data-mono text-foreground text-lg">
                {MOCK_VERIFICATIONS.length}
              </span>
              <span className="text-body-sm text-on-surface-variant block">
                This period
              </span>
            </div>
            <div className="surface-card rounded-lg p-4 space-y-1">
              <span className="text-label-caps text-on-surface-variant block">
                Total Value
              </span>
              <span className="text-data-mono text-foreground text-lg">
                {formatCr(
                  MOCK_VERIFICATIONS.reduce(
                    (s, v) => s + (INVOICE_VALUES[v.verification_id ?? ""] ?? 0),
                    0,
                  ),
                )}
              </span>
              <span className="text-body-sm text-on-surface-variant block">
                Aggregate invoice value
              </span>
            </div>
            <div className="surface-card rounded-lg p-4 space-y-1">
              <span className="text-label-caps text-on-surface-variant block">
                Pass Rate
              </span>
              <span className="text-data-mono text-foreground text-lg">
                {Math.round(
                  (passCount / MOCK_VERIFICATIONS.length) * 100,
                )}
                %
              </span>
              <span className="text-body-sm text-on-surface-variant block">
                {passCount} of {MOCK_VERIFICATIONS.length} clean
              </span>
            </div>
            <div className="surface-card rounded-lg p-4 space-y-1">
              <span className="text-label-caps text-on-surface-variant block">
                Queue Resolution
              </span>
              <span className="text-data-mono text-foreground text-lg">
                {queueItems.length}
              </span>
              <span className="text-body-sm text-on-surface-variant block">
                Items pending manual review
              </span>
            </div>
          </div>
        </details>
      </section>
    </div>
  );
}
