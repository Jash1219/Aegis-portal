import { RuleReference } from "@/components/ui/rule-reference";

const PRODUCTION_RULES = [
  {
    family: "Entity Integrity",
    rules: [
      { anomalyCode: "ANOM-GST-FMT-001", ruleName: "GST Format Validation", ruleFamily: "Entity Integrity", productionStatus: "Production", phaseIntroduced: "Phase 1", whatItChecks: "Validates that the supplier GSTIN conforms to the standard 15-character alphanumeric format prescribed by the GST Network.", statutoryBasis: "GST Act, Section 16", findingsProduced: "ANOM-GST-FMT-001" },
      { anomalyCode: "ANOM-PAN-CONS-002", ruleName: "PAN Consistency", ruleFamily: "Entity Integrity", productionStatus: "Production", phaseIntroduced: "Phase 1", whatItChecks: "Verifies that the PAN embedded within the GSTIN matches the supplier's registered PAN across government databases.", statutoryBasis: "GST Act, Section 16; Income Tax Act, Section 139A", findingsProduced: "ANOM-PAN-CONS-002" },
      { anomalyCode: "ANOM-SUP-REG-008", ruleName: "Supplier Registration Verification", ruleFamily: "Entity Integrity", productionStatus: "Production", phaseIntroduced: "Phase 1", whatItChecks: "Confirms that the supplier is actively registered on the GST portal and that the registration has not been cancelled or suspended.", statutoryBasis: "GST Act, Section 22", findingsProduced: "ANOM-SUP-REG-008" },
    ],
  },
  {
    family: "Tax Arithmetic",
    rules: [
      { anomalyCode: "ANOM-AMT-TRN-001", ruleName: "Invoice Value vs Turnover", ruleFamily: "Tax Arithmetic", productionStatus: "Production", phaseIntroduced: "Phase 1", whatItChecks: "Compares the invoice value against the supplier's declared turnover to detect potential revenue suppression or invoice inflation.", statutoryBasis: "GST Act, Section 31", findingsProduced: "ANOM-AMT-TRN-001" },
      { anomalyCode: "ANOM-HSN-CLS-009", ruleName: "HSN Classification Validation", ruleFamily: "Tax Arithmetic", productionStatus: "Production", phaseIntroduced: "Phase 1", whatItChecks: "Validates that the HSN code declared on the invoice falls within a recognised chapter and is consistent with the product description.", statutoryBasis: "GST Act, Schedule — Tariff Classification", findingsProduced: "ANOM-HSN-CLS-009" },
    ],
  },
  {
    family: "Temporal Consistency",
    rules: [
      { anomalyCode: "ANOM-INV-DAT-010", ruleName: "Invoice Date Chronology", ruleFamily: "Temporal Consistency", productionStatus: "Production", phaseIntroduced: "Phase 2", whatItChecks: "Ensures the invoice date falls within the expected filing period and does not precede the supplier's GST registration date.", statutoryBasis: "GST Act, Section 31", findingsProduced: "ANOM-INV-DAT-010" },
    ],
  },
  {
    family: "Duplicate Detection",
    rules: [
      { anomalyCode: "ANOM-DUP-INV-011", ruleName: "Duplicate Invoice Detection", ruleFamily: "Duplicate Detection", productionStatus: "Production", phaseIntroduced: "Phase 2", whatItChecks: "Identifies invoices with identical supplier GSTIN, invoice reference, and invoice value submitted within a configurable lookback window.", statutoryBasis: "GST Act, Section 31", findingsProduced: "ANOM-DUP-INV-011" },
    ],
  },
  {
    family: "Government Enrichment",
    rules: [
      { anomalyCode: "ANOM-GOV-VER-012", ruleName: "Government Data Cross-Verification", ruleFamily: "Government Enrichment", productionStatus: "Production", phaseIntroduced: "Phase 2", whatItChecks: "Cross-references invoice data fields with corresponding values retrieved from GST Portal, Income Tax Portal, and MCA databases.", statutoryBasis: "GST Act; Income Tax Act; Companies Act, 2013", findingsProduced: "ANOM-GOV-VER-012" },
      { anomalyCode: "ANOM-ADDR-MIS-003", ruleName: "Address Mismatch Detection", ruleFamily: "Government Enrichment", productionStatus: "Production", phaseIntroduced: "Phase 1", whatItChecks: "Compares the supplier address declared on the invoice with the registered address on the GST portal and flags discrepancies.", statutoryBasis: "GST Act, Section 16", findingsProduced: "ANOM-ADDR-MIS-003" },
    ],
  },
];

const ROADMAP_RULES = [
  { anomalyCode: "ANOM-BEN-OWN-013", ruleName: "Beneficial Ownership Verification", ruleFamily: "Entity Integrity", productionStatus: "Roadmap", phaseIntroduced: "Phase 3", whatItChecks: "Traces the ultimate beneficial ownership of the supplier entity through MCA and public registry data.", statutoryBasis: "Companies Act, 2013; PMLA", findingsProduced: "ANOM-BEN-OWN-013" },
  { anomalyCode: "ANOM-CROSS-REF-014", ruleName: "Cross-Entity Reference Check", ruleFamily: "Duplicate Detection", productionStatus: "Roadmap", phaseIntroduced: "Phase 3", whatItChecks: "Detects invoices referencing related-party transactions or circular trading patterns across multiple suppliers.", statutoryBasis: "GST Act; Income Tax Act", findingsProduced: "ANOM-CROSS-REF-014" },
  { anomalyCode: "ANOM-RTGS-VAL-015", ruleName: "RTGS Payment Validation", ruleFamily: "Tax Arithmetic", productionStatus: "Roadmap", phaseIntroduced: "Phase 3", whatItChecks: "Validates that the invoice payment amount matches the RTGS/NEFT transfer recorded in the banking system.", statutoryBasis: "RBI Guidelines; GST Act", findingsProduced: "ANOM-RTGS-VAL-015" },
];

export function GovernanceScreen() {
  return (
    <div className="space-y-10">
      {/* Section 6A — Data Handling */}
      <section className="space-y-4">
        <span className="text-label-caps text-on-surface-variant block">
          Data Handling
        </span>
        <div className="surface-card rounded-lg p-4 space-y-4 text-body-sm text-on-surface-variant leading-relaxed">
          <p>
            AEGIS receives invoice metadata submitted via API or CSV upload. The submitted data includes supplier GSTIN,
            recipient GSTIN, invoice reference, invoice value, invoice date, and optional fields such as HSN code and
            supplier name. No original invoice documents or attachments are processed.
          </p>
          <p>
            AEGIS stores verification results including verification IDs, verdicts, anomaly codes, evidence snapshots,
            and government verification status. Supplier intelligence data retrieved from government databases is cached
            for the duration of the verification session.
          </p>
          <p>
            AEGIS does <strong>not</strong> store borrower names, bank account details, personal identification data,
            or any sensitive personal information. Invoice metadata is retained for audit and reconciliation purposes
            in accordance with the data retention policy.
          </p>
          <p>
            AEGIS processes data in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act).
            All data handling is limited to what is necessary for invoice verification and supplier intelligence.
            No data is shared with third parties for purposes unrelated to the verification service.
          </p>
        </div>
      </section>

      {/* Section 6B — Architecture */}
      <section className="space-y-4">
        <span className="text-label-caps text-on-surface-variant block">
          Architecture
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-card rounded-lg p-4 space-y-2">
            <span className="font-semibold text-body-sm text-foreground">Verification Engine</span>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              The Verification Engine is the core processing layer that receives invoice payloads, orchestrates
              deterministic rule execution, and assembles verifiable evidence for each check. It enforces rule
              sequencing, manages check lifecycle, and produces structured anomaly findings with mathematical proofs
              where applicable.
            </p>
          </div>
          <div className="surface-card rounded-lg p-4 space-y-2">
            <span className="font-semibold text-body-sm text-foreground">Government Verification</span>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              The Government Verification layer handles secure API-based communication with authorised government
              data sources. It retrieves supplier registration details, filing status, and compliance information
              from the GST portal and other government systems. This layer operates as a read-only consumer and
              does not submit data to government systems.
            </p>
          </div>
          <div className="surface-card rounded-lg p-4 space-y-2">
            <span className="font-semibold text-body-sm text-foreground">Public Intelligence</span>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              The Public Intelligence layer aggregates information from publicly accessible and subscribed data
              sources to enrich supplier profiles. It provides contextual intelligence such as registration history,
              address verification, and legal entity status. This layer supplements government data with additional
              verification signals.
            </p>
          </div>
          <div className="surface-card rounded-lg p-4 space-y-2">
            <span className="font-semibold text-body-sm text-foreground">Resilience and Governance</span>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              The Resilience and Governance layer provides operational oversight including circuit breaker monitoring,
              audit logging, and integration management. It ensures system reliability through health checks and
              graceful degradation when external dependencies are unavailable. All system interactions are logged
              for auditability.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6C — Verification Capabilities */}
      <section className="space-y-6">
        <span className="text-label-caps text-on-surface-variant block">
          Verification Capabilities
        </span>

        {/* Production Capabilities */}
        <div className="space-y-6">
          <span className="font-semibold text-body-sm text-foreground block">
            Production Capabilities
          </span>
          {PRODUCTION_RULES.map((group) => (
            <div key={group.family} className="surface-card rounded-lg p-4 space-y-3">
              <span className="text-label-caps text-on-surface-variant block">
                {group.family}
              </span>
              <div className="space-y-2">
                {group.rules.map((rule) => (
                  <div key={rule.anomalyCode} className="flex items-center gap-3 text-body-sm">
                    <RuleReference
                      anomalyCode={rule.anomalyCode}
                      ruleName={rule.ruleName}
                      ruleFamily={rule.ruleFamily}
                      productionStatus={rule.productionStatus}
                      phaseIntroduced={rule.phaseIntroduced}
                      whatItChecks={rule.whatItChecks}
                      statutoryBasis={rule.statutoryBasis}
                      findingsProduced={rule.findingsProduced}
                    />
                    <span className="text-on-surface-variant">{rule.ruleName}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap Capabilities */}
        <div className="space-y-3">
          <span className="font-semibold text-body-sm text-foreground block">
            Roadmap Capabilities
          </span>
          <div className="surface-card rounded-lg p-4 space-y-3">
            {ROADMAP_RULES.map((rule) => (
              <div key={rule.anomalyCode} className="flex items-center gap-3 text-body-sm">
                <span className="text-data-mono text-amber-400 shrink-0">
                  ROADMAP — {rule.phaseIntroduced}
                </span>
                <RuleReference
                  anomalyCode={rule.anomalyCode}
                  ruleName={rule.ruleName}
                  ruleFamily={rule.ruleFamily}
                  productionStatus={rule.productionStatus}
                  phaseIntroduced={rule.phaseIntroduced}
                  whatItChecks={rule.whatItChecks}
                  statutoryBasis={rule.statutoryBasis}
                  findingsProduced={rule.findingsProduced}
                />
                <span className="text-on-surface-variant">{rule.ruleName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6D — Government Data Access */}
      <section className="space-y-4">
        <span className="text-label-caps text-on-surface-variant block">
          Government Data Access
        </span>
        <div className="surface-card rounded-lg p-4 space-y-4 text-body-sm text-on-surface-variant leading-relaxed">
          <p>
            AEGIS uses WhiteBooks as its authorised GSP (GST Suvidha Provider) to access the GST portal for supplier
            verification. WhiteBooks facilitates secure API-based retrieval of GST registration data, filing history,
            and compliance status. This integration is read-only and does not involve data submission to the GST
            portal on behalf of users.
          </p>
          <p>
            Government data accessed through this integration includes supplier GSTIN registration details, GST return
            filing status (GSTR-1, GSTR-3B), taxpayer name and address as registered with the GST Network, and PAN
            linkage information. Data is retrieved in real-time during verification and is not stored beyond the
            verification session unless required for audit compliance.
          </p>
          <p>
            Retrieved government information is used exclusively for anomaly detection, supplier intelligence
            enrichment, and verification evidence assembly. Government data is cached temporarily to avoid
            redundant API calls within the same verification session and is discarded according to the data
            retention policy.
          </p>
        </div>
      </section>

      {/* Section 6E — System Reliability */}
      <section className="space-y-4">
        <span className="text-label-caps text-on-surface-variant block">
          System Reliability
        </span>
        <div className="surface-card rounded-lg p-4 space-y-4 text-body-sm text-on-surface-variant leading-relaxed">
          <p>
            The circuit breaker monitors the availability of external government API endpoints and manages system
            behaviour during outages. In the <strong>Healthy</strong> state, all government data sources are
            accessible and verification proceeds normally. In the <strong>Degraded</strong> state, one or more
            government sources are temporarily unreachable; verification continues using cached or alternative
            data sources where available. In the <strong>Unavailable</strong> state, critical government data
            sources are unreachable and government-dependent checks are skipped.
          </p>
          <p>
            AEGIS integrates with client systems through two primary channels. The <strong>REST API</strong>
            provides programmatic access for real-time invoice verification, supporting JSON request and response
            payloads authenticated via API key. The <strong>CSV Upload</strong> option enables batch verification
            of multiple invoices through a file-based workflow.
          </p>
          <p className="text-foreground font-medium">
            AEGIS never returns a FAIL verdict solely because a government API was unavailable.
          </p>
        </div>
      </section>
    </div>
  );
}
