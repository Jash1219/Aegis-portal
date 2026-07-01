import type { TriangulateResponse, CheckResult } from "@/types/aegis";

const SAMPLE_REQUEST_FIELDS = [
  { name: "client_reference_id", type: "string", required: true, description: "Client-generated invoice identifier" },
  { name: "invoice_reference", type: "string", required: true, description: "Supplier invoice number" },
  { name: "supplier_gstin", type: "string", required: true, description: "Supplier GSTIN (15 characters)" },
  { name: "invoice_value_paise", type: "integer", required: true, description: "Invoice value in paise (1 INR = 100 paise)" },
  { name: "invoice_date", type: "string (YYYY-MM-DD)", required: true, description: "Invoice issuance date" },
  { name: "supplier_name", type: "string", required: false, description: "Supplier legal name for cross-verification" },
  { name: "hsn_code", type: "string", required: false, description: "HSN/SAC code for the primary product/service" },
  { name: "recipient_gstin", type: "string", required: true, description: "Recipient GSTIN" },
];

const SAMPLE_REQUEST_JSON: Record<string, unknown> = {
  client_reference_id: "INV-ABC-2024-001",
  invoice_reference: "INV-SUP-0421",
  supplier_gstin: "22AAAAA0000A1Z5",
  invoice_value_paise: 250000000,
  invoice_date: "2024-11-15",
  supplier_name: "Acme Corp Private Limited",
  hsn_code: "8471",
  recipient_gstin: "33BBBBB1111B2Z6",
};

const SAMPLE_RESPONSE: TriangulateResponse = {
  verification_id: "V-TRIANGULATE-SAMPLE-001",
  client_reference_id: "INV-ABC-2024-001",
  verdict: "FAIL",
  verdict_code: "ANOMALY_DETECTED",
  anomaly_severity: "HIGH",
  checks: [
    {
      check_id: "CHK-GST-001",
      check_name: "GST Format Validation",
      status: "FAILED",
      severity: "HIGH",
      anomaly: {
        code: "ANOM-GST-FMT-001",
        description: "GSTIN format does not match the standard 15-character alphanumeric pattern.",
      },
    },
    {
      check_id: "CHK-PAN-002",
      check_name: "PAN Consistency",
      status: "PASSED",
      severity: "MEDIUM",
      evidence: { pan: "ABCDE1234F", matched: true },
    },
    {
      check_id: "CHK-AMT-003",
      check_name: "Invoice Value vs Turnover",
      status: "FAILED",
      severity: "CRITICAL",
      evidence: { invoice_value: 2500000, declared_turnover: 12000000, ratio: 0.208 },
      anomaly: {
        code: "ANOM-AMT-TRN-001",
        description: "Invoice value exceeds 15% of declared annual turnover.",
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
  match_fields: [
    { field: "supplier_gstin", source: "GST_PORTAL", status: "match", confidence: 1.0 },
    { field: "supplier_name", source: "GST_PORTAL", status: "fuzzy_match", confidence: 0.87 },
    { field: "invoice_value", source: "ERP", status: "match", confidence: 1.0 },
  ],
};

const SCHEMA_FIELDS = [
  { name: "client_reference_id", type: "string", required: "Yes", description: "Client-generated invoice identifier" },
  { name: "invoice_reference", type: "string", required: "Yes", description: "Supplier invoice number" },
  { name: "supplier_gstin", type: "string", required: "Yes", description: "Supplier GSTIN" },
  { name: "invoice_value_paise", type: "integer", required: "Yes", description: "Invoice value in paise" },
  { name: "invoice_date", type: "string (YYYY-MM-DD)", required: "Yes", description: "Invoice issuance date" },
  { name: "supplier_name", type: "string", required: "No", description: "Supplier legal name" },
  { name: "hsn_code", type: "string", required: "No", description: "HSN/SAC code" },
  { name: "recipient_gstin", type: "string", required: "Yes", description: "Recipient GSTIN" },
];

const CSV_COLUMNS = [
  { column: "client_reference_id", description: "Client-generated invoice identifier", format: "Alphanumeric string", example: "INV-ABC-2024-001", required: "Yes" },
  { column: "invoice_reference", description: "Supplier invoice number", format: "Alphanumeric string", example: "INV-SUP-0421", required: "Yes" },
  { column: "supplier_gstin", description: "Supplier GSTIN", format: "15-character alphanumeric", example: "22AAAAA0000A1Z5", required: "Yes" },
  { column: "invoice_value_paise", description: "Invoice value in paise", format: "Integer (no decimals)", example: "250000000", required: "Yes" },
  { column: "invoice_date", description: "Invoice issuance date", format: "YYYY-MM-DD", example: "2024-11-15", required: "Yes" },
  { column: "supplier_name", description: "Supplier legal name", format: "String", example: "Acme Corp Pvt Ltd", required: "No" },
  { column: "hsn_code", description: "HSN/SAC code", format: "4-8 digit string", example: "8471", required: "No" },
  { column: "recipient_gstin", description: "Recipient GSTIN", format: "15-character alphanumeric", example: "33BBBBB1111B2Z6", required: "Yes" },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-data-mono text-body-sm text-foreground whitespace-pre leading-relaxed">
      {children}
    </pre>
  );
}

export function IntegrationScreen() {
  const findingsCount = SAMPLE_RESPONSE.checks?.length ?? 0;

  return (
    <div className="space-y-10">
      {/* Section 5A — API Explorer */}
      <section className="space-y-6">
        <span className="text-label-caps text-on-surface-variant block">
          API Explorer
        </span>

        {/* Authentication */}
        <div className="surface-card rounded-lg p-4 space-y-3">
          <span className="font-semibold text-body-sm text-foreground">
            Authentication
          </span>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            All API requests require authentication via an API key passed in the
            <code className="text-data-mono text-foreground"> x-api-key</code> request header. API keys are issued per
            environment and identify the calling application or client.
          </p>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            Sandbox keys are prefixed with <code className="text-data-mono text-foreground">ag_sandbox_</code> for
            testing and development. Production keys are issued separately after onboarding.
          </p>
          <CodeBlock>{'x-api-key: ag_sandbox_xxxxxxxxx'}</CodeBlock>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            All requests are idempotent. Replaying the same payload with the same
            <code className="text-data-mono text-foreground"> client_reference_id</code> returns the cached
            verification result without re-processing.
          </p>
        </div>

        {/* Endpoints */}
        <div className="surface-card rounded-lg p-4 space-y-3">
          <span className="font-semibold text-body-sm text-foreground">
            Endpoints
          </span>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3 py-2 border-b border-white/5">
              <span className="text-data-mono text-emerald-400 font-medium shrink-0">POST</span>
              <span className="text-data-mono text-foreground shrink-0">/v1/invoice/triangulate</span>
              <span className="text-body-sm text-on-surface-variant">Submit an invoice for supplier intelligence verification and anomaly detection.</span>
            </div>
            <div className="flex items-baseline gap-3 py-2 border-b border-white/5">
              <span className="text-data-mono text-emerald-400 font-medium shrink-0">POST</span>
              <span className="text-data-mono text-foreground shrink-0">/v1/ims/recommend</span>
              <span className="text-body-sm text-on-surface-variant">Generate invoice management recommendations based on verification outcomes.</span>
            </div>
            <div className="flex items-baseline gap-3 py-2">
              <span className="text-data-mono text-emerald-400 font-medium shrink-0">POST</span>
              <span className="text-data-mono text-foreground shrink-0">/v1/rate/validate</span>
              <span className="text-body-sm text-on-surface-variant">Validate pricing tier and rate card parameters for a given invoice.</span>
            </div>
          </div>
        </div>

        {/* Sample Request */}
        <div className="surface-card rounded-lg p-4 space-y-3">
          <span className="font-semibold text-body-sm text-foreground">
            Sample Request
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Field</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Type</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Required</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Description</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_REQUEST_FIELDS.map((f) => (
                  <tr key={f.name} className="border-b border-white/5 last:border-b-0">
                    <td className="text-data-mono text-foreground px-4 py-2 whitespace-nowrap">{f.name}</td>
                    <td className="text-body-sm text-on-surface-variant px-4 py-2 whitespace-nowrap">{f.type}</td>
                    <td className="text-body-sm px-4 py-2 whitespace-nowrap">
                      <span className={f.required ? "text-emerald-400" : "text-on-surface-variant"}>
                        {f.required ? "Required" : "Optional"}
                      </span>
                    </td>
                    <td className="text-body-sm text-on-surface-variant px-4 py-2">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock>{JSON.stringify(SAMPLE_REQUEST_JSON, null, 2)}</CodeBlock>
        </div>

        {/* Sample Response */}
        <div className="surface-card rounded-lg p-4 space-y-3">
          <span className="font-semibold text-body-sm text-foreground">
            Sample Response
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-label-caps text-on-surface-variant block">Verdict</span>
              <span className="text-data-mono text-red-400">{SAMPLE_RESPONSE.verdict}</span>
            </div>
            <div className="space-y-1">
              <span className="text-label-caps text-on-surface-variant block">Anomaly Severity</span>
              <span className="text-data-mono text-foreground">{SAMPLE_RESPONSE.anomaly_severity}</span>
            </div>
            <div className="space-y-1">
              <span className="text-label-caps text-on-surface-variant block">Findings</span>
              <span className="text-data-mono text-foreground">{findingsCount} checks</span>
            </div>
            <div className="space-y-1">
              <span className="text-label-caps text-on-surface-variant block">Processing Time</span>
              <span className="text-data-mono text-foreground">1.2s</span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-label-caps text-on-surface-variant block">Anomaly Summary</span>
            {SAMPLE_RESPONSE.checks
              ?.filter((c) => c.status === "FAILED")
              .map((c) => (
                <div key={c.check_id} className="flex items-center gap-2 text-body-sm text-foreground">
                  <span className="text-red-400">{c.severity}</span>
                  <span className="text-data-mono">{c.anomaly?.code}</span>
                  <span className="text-on-surface-variant">{c.anomaly?.description}</span>
                </div>
              ))}
          </div>
          <div className="space-y-2">
            <span className="text-label-caps text-on-surface-variant block">Supplier Intelligence</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {SAMPLE_RESPONSE.supplier_intelligence && (
                <>
                  <div className="text-body-sm text-on-surface-variant">GSTIN</div>
                  <div className="text-body-sm text-foreground col-span-2">{SAMPLE_RESPONSE.supplier_intelligence.gstin?.value}</div>
                  <div className="text-body-sm text-on-surface-variant">Source</div>
                  <div className="text-body-sm text-foreground">{SAMPLE_RESPONSE.supplier_intelligence.gstin?.sourceName}</div>
                  <div className="text-body-sm text-on-surface-variant">Legal Name</div>
                  <div className="text-body-sm text-foreground col-span-2">{SAMPLE_RESPONSE.supplier_intelligence.legalName?.value}</div>
                  <div className="text-body-sm text-on-surface-variant">Source</div>
                  <div className="text-body-sm text-foreground">{SAMPLE_RESPONSE.supplier_intelligence.legalName?.sourceName}</div>
                  <div className="text-body-sm text-on-surface-variant">Registration</div>
                  <div className="text-body-sm text-foreground col-span-2">{SAMPLE_RESPONSE.supplier_intelligence.registrationStatus?.value}</div>
                  <div className="text-body-sm text-on-surface-variant">Since</div>
                  <div className="text-body-sm text-foreground">{SAMPLE_RESPONSE.supplier_intelligence.registrationDate?.value}</div>
                </>
              )}
            </div>
          </div>
          <div className="text-body-sm text-on-surface-variant pt-2 border-t border-white/10">
            Payload hash: <span className="text-data-mono text-foreground">sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
          </div>
          <div className="flex items-center gap-4 text-body-sm text-on-surface-variant pt-1">
            <span>API: /api/v1/triangulate</span>
            <span>Status: 200 OK</span>
            <span>Engine: v1.0.0</span>
            <span>Schema: v1.0</span>
          </div>
        </div>

        {/* Schema Reference */}
        <div className="surface-card rounded-lg p-4 space-y-3">
          <span className="font-semibold text-body-sm text-foreground">
            Schema Reference
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Field Name</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Type</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Required</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Description</th>
                </tr>
              </thead>
              <tbody>
                {SCHEMA_FIELDS.map((f) => (
                  <tr key={f.name} className="border-b border-white/5 last:border-b-0">
                    <td className="text-data-mono text-foreground px-4 py-2 whitespace-nowrap">{f.name}</td>
                    <td className="text-body-sm text-on-surface-variant px-4 py-2 whitespace-nowrap">{f.type}</td>
                    <td className="text-body-sm px-4 py-2 whitespace-nowrap">
                      <span className={f.required === "Yes" ? "text-emerald-400" : "text-on-surface-variant"}>
                        {f.required}
                      </span>
                    </td>
                    <td className="text-body-sm text-on-surface-variant px-4 py-2">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 5B — CSV Format */}
      <section className="space-y-4">
        <span className="text-label-caps text-on-surface-variant block">
          CSV Format
        </span>
        <div className="surface-card rounded-lg p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Column Name</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Description</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Format</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Example</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">Required</th>
                </tr>
              </thead>
              <tbody>
                {CSV_COLUMNS.map((c) => (
                  <tr key={c.column} className="border-b border-white/5 last:border-b-0">
                    <td className="text-data-mono text-foreground px-4 py-2 whitespace-nowrap">{c.column}</td>
                    <td className="text-body-sm text-on-surface-variant px-4 py-2">{c.description}</td>
                    <td className="text-body-sm text-on-surface-variant px-4 py-2 whitespace-nowrap">{c.format}</td>
                    <td className="text-data-mono text-on-surface-variant px-4 py-2 whitespace-nowrap">{c.example}</td>
                    <td className="text-body-sm px-4 py-2 whitespace-nowrap">
                      <span className={c.required === "Yes" ? "text-emerald-400" : "text-on-surface-variant"}>
                        {c.required}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none inline-block">
            Download CSV Template
          </span>
        </div>
      </section>

      {/* Section 5C — Test Environment */}
      <section className="space-y-4">
        <span className="text-label-caps text-on-surface-variant block">
          Test Environment
        </span>
        <div className="surface-card rounded-lg p-4 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-body-sm text-amber-400">
            TEST ENVIRONMENT — all data is synthetic. No production invoices are processed here.
          </div>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            Use API keys prefixed with <code className="text-data-mono text-foreground">ag_sandbox_</code> to
            authenticate requests to the test environment. Sandbox keys provide access to synthetic supplier data
            and deterministic verification outcomes for integration testing.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-container-low p-4 flex items-center justify-center h-32">
              <span className="text-label-caps text-on-surface-variant">
                Portfolio View
              </span>
            </div>
            <div className="rounded-lg bg-surface-container-low p-4 flex items-center justify-center h-32">
              <span className="text-label-caps text-on-surface-variant">
                Analyst View
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
