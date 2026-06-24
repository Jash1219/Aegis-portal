"use client";

const RULE_MANIFEST = [
  { id: "V-TRANSIT-PHYSICS-001", engineFamily: "TRANSIT_PHYSICS", riskVector: "FRAUD", regulatoryIntent: "Verify declared transport distances are physically achievable within e-way bill validity windows to prevent fabricated shipment claims.", lifecycleState: "ACTIVE" as const, requiredHeaders: ["declared_distance_km"] },
  { id: "V-TRANSIT-PHYSICS-002", engineFamily: "TRANSIT_PHYSICS", riskVector: "FRAUD", regulatoryIntent: "Validate that the declared transport mode is appropriate for the distance and goods type to detect mode misrepresentation.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["declared_distance_km"] },
  { id: "V-TRANSIT-PHYSICS-003", engineFamily: "TRANSIT_PHYSICS", riskVector: "FRAUD", regulatoryIntent: "Confirm geographic plausibility of origin-destination pairs for the declared transport mode.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["declared_distance_km"] },
  { id: "V-DUP-FIN-001", engineFamily: "DUPLICATE_FINANCING", riskVector: "FRAUD", regulatoryIntent: "Detect invoice number resubmissions to prevent double-financing of the same receivable.", lifecycleState: "ACTIVE" as const, requiredHeaders: ["invoice_number"] },
  { id: "V-DUP-FIN-002", engineFamily: "DUPLICATE_FINANCING", riskVector: "FRAUD", regulatoryIntent: "Identify SHA-256 hash collisions between current and historical IRNs for cryptographic deduplication.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["invoice_number"] },
  { id: "V-DUP-FIN-003", engineFamily: "DUPLICATE_FINANCING", riskVector: "FRAUD", regulatoryIntent: "Flag beneficiary bank accounts shared across multiple suppliers to detect shell entity networks.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["invoice_number"] },
  { id: "V-GST-GEO-001", engineFamily: "GST_GEOMETRY", riskVector: "COMPLIANCE", regulatoryIntent: "Validate that the GSTIN state code prefix falls within the Gazette-notified range (01-38) to reject malformed registrations.", lifecycleState: "ACTIVE" as const, requiredHeaders: ["supplier_gstin"] },
  { id: "V-GST-GEO-002", engineFamily: "GST_GEOMETRY", riskVector: "COMPLIANCE", regulatoryIntent: "Verify the PAN segment embedded in the GSTIN follows the standard 5-letter-4-digit-1-letter format.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["supplier_gstin"] },
  { id: "V-GST-GEO-003", engineFamily: "GST_GEOMETRY", riskVector: "COMPLIANCE", regulatoryIntent: "Compute and verify the 15th character checksum per the published GSTIN verification algorithm.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["supplier_gstin"] },
  { id: "V-CHRONO-001", engineFamily: "CHRONOLOGY_OVERRIDE", riskVector: "FRAUD", regulatoryIntent: "Ensure invoice date precedes e-way bill generation date to detect post-dated documentation.", lifecycleState: "ACTIVE" as const, requiredHeaders: ["ewb_generated_at"] },
  { id: "V-CHRONO-002", engineFamily: "CHRONOLOGY_OVERRIDE", riskVector: "FRAUD", regulatoryIntent: "Confirm e-way bill generation precedes declared delivery date to prevent fabricated delivery receipts.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["ewb_generated_at"] },
  { id: "V-CHRONO-003", engineFamily: "CHRONOLOGY_OVERRIDE", riskVector: "FRAUD", regulatoryIntent: "Verify IRN generation timestamp is after the invoice date to detect data tampering.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["ewb_generated_at"] },
  { id: "V-RATE-001", engineFamily: "RATE_MATRIX", riskVector: "FINANCIAL", regulatoryIntent: "Confirm declared GST rate matches the statutory rate per the GST council rate matrix for the given HSN code.", lifecycleState: "ACTIVE" as const, requiredHeaders: ["hsn_code", "declared_gst_rate"] },
  { id: "V-RATE-002", engineFamily: "RATE_MATRIX", riskVector: "FINANCIAL", regulatoryIntent: "Test whether declared taxable value falls suspiciously close to a slab boundary indicating under-invoicing.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["hsn_code", "declared_gst_rate"] },
  { id: "V-RATE-003", engineFamily: "RATE_MATRIX", riskVector: "FINANCIAL", regulatoryIntent: "Verify applicable GST compensation cess is correctly calculated for the given HSN code.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["hsn_code", "declared_gst_rate"] },
  { id: "V-HSN-001", engineFamily: "HSN_LOGIC", riskVector: "COMPLIANCE", regulatoryIntent: "Evaluate semantic consistency between declared HSN code and product description using an HSN-product ontology.", lifecycleState: "ACTIVE" as const, requiredHeaders: ["hsn_code", "product_description"] },
  { id: "V-HSN-002", engineFamily: "HSN_LOGIC", riskVector: "COMPLIANCE", regulatoryIntent: "Verify the HSN code falls within the expected industry category based on supplier registered business classification.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["hsn_code", "product_description"] },
  { id: "V-HSN-003", engineFamily: "HSN_LOGIC", riskVector: "COMPLIANCE", regulatoryIntent: "Verify HSN digit depth (4-digit vs 6-digit vs 8-digit) is appropriate for invoice value and industry.", lifecycleState: "ROADMAP" as const, requiredHeaders: ["hsn_code", "product_description"] },
  { id: "V-GATEWAY-001", engineFamily: "SYSTEM_GATEWAY", riskVector: "OPERATIONAL", regulatoryIntent: "Validate GST portal connectivity and API response structural integrity for upstream system assurance.", lifecycleState: "ACTIVE" as const, requiredHeaders: [] },
  { id: "V-IDENTITY-001", engineFamily: "IDENTITY_ENTITY", riskVector: "OPERATIONAL", regulatoryIntent: "Cross-reference PAN embedded in GSTIN against Income Tax Department records to prevent identity fraud.", lifecycleState: "ACTIVE" as const, requiredHeaders: [] },
];

const RISK_COLORS: Record<string, string> = {
  FRAUD: "text-red-400",
  COMPLIANCE: "text-yellow-400",
  FINANCIAL: "text-blue-400",
  OPERATIONAL: "text-orange-400",
};

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-lg">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Rule Manifest
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Complete inventory of all AEGIS validation rules and their
            governance posture.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#222222]">
                <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                  Rule ID
                </th>
                <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                  Engine Family
                </th>
                <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                  Risk Vector
                </th>
                <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                  Regulatory Intent
                </th>
                <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                  Lifecycle
                </th>
              </tr>
            </thead>
            <tbody>
              {RULE_MANIFEST.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-[#222222] hover:bg-[#111111] transition-colors"
                >
                  <td className="font-data-mono text-data-mono text-primary px-sm py-md">
                    {rule.id}
                  </td>
                  <td className="font-body-sm text-body-sm text-on-surface px-sm py-md">
                    {rule.engineFamily}
                  </td>
                  <td className="px-sm py-md">
                    <span
                      className={`font-data-mono text-data-mono ${RISK_COLORS[rule.riskVector] ?? "text-on-surface"}`}
                    >
                      {rule.riskVector}
                    </span>
                  </td>
                  <td className="font-body-sm text-body-sm text-on-surface px-sm py-md max-w-md leading-relaxed">
                    {rule.regulatoryIntent}
                  </td>
                  <td className="px-sm py-md">
                    <span
                      className={`font-data-mono text-data-mono ${rule.lifecycleState === "ACTIVE" ? "text-emerald-400" : "text-on-surface-variant"}`}
                    >
                      {rule.lifecycleState}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-lg pt-sm">
          <div className="flex items-center gap-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              ACTIVE — 8 rules
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="h-2 w-2 rounded-full bg-on-surface-variant" />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              ROADMAP — 12 rules
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
