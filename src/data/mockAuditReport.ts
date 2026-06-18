import type { HistoricalAuditReport } from "@/types/audit";

export const MOCK_AUDIT_REPORT: HistoricalAuditReport = {
  reportId: "AEG-RPT-SYNTH-2026-001",
  classification: "Demonstration Audit Report (Synthetic Data)",
  generatedAt: "2026-06-18T10:00:00+05:30",
  disclaimer:
    "Generated using synthetic, non-production data for demonstration purposes.",
  methodology: {
    scope:
      "Portfolio-wide retrospective analysis of 20 synthetic invoice transactions processed by the AEGIS Verification Engine. Each transaction was evaluated across five deterministic rules engines covering spatiotemporal physics, cryptographic deduplication, GSTIN structural integrity, temporal sequence logic, and GST rate matrix compliance.",
    coverage:
      "Full-spectrum coverage: transit physics validation, duplicate financing detection, GSTIN geometry analysis, invoice-EWB chronology verification, tax rate matrix conformance, and HSN semantic classification.",
    period: "FY 2026-27 (Synthetic Cycle 1)",
    sampleSize: 20,
  },
  attribution: {
    primaryEngineTrigger:
      "Spatiotemporal Physics Engine — 4 of 6 HIGH-severity anomalies originated from physically implausible transit declarations, indicating systematic fabrication of e-way bill distances.",
    concentrationInsight:
      "82.3% of total capital-at-risk (₹42,67,000) is concentrated in anomalies detected by the Spatiotemporal Physics Engine and the GST Rate Engine, suggesting that invoice fabrication and tax-rate misclassification are the dominant risk vectors in this portfolio.",
  },
  portfolioMetrics: {
    totalInvoicesReviewed: 20,
    totalFaceValueINR: 12500000,
    totalAnomaliesDetected: 6,
    totalCapitalAtRiskINR: 5185000,
    enginesDeployed: 6,
  },
  findings: [
    {
      id: "FND-SYNTH-001",
      title: "Transit Physics Violation — Distance Implausible for Mode",
      description:
        "Invoice INV-SYNTH-001 declares a transport distance of 3,200 km via road with an e-way bill validity of 14 hours. The implied average speed of 228.6 km/h far exceeds the physically plausible maximum of 80 km/h for commercial freight transport.",
      severity: "HIGH",
      associatedValueINR: 1850000,
      detectionDelta: {
        legacySystem: "Standard OCR + Rule-based Ledger Check",
        reasonMissed:
          "Legacy systems verify only document presence and arithmetic consistency. They do not cross-reference declared distance against temporal validity windows or modal speed limits.",
        evidenceBurden:
          "Requires integration of geospatial route APIs and temporal physics modelling unavailable in standard ERP-ledger stacks.",
      },
      businessImpact:
        "Capital exposure of ₹18,50,000 on a single fabricated transit claim. If funded, the NBFC would carry unsecured risk against non-existent goods.",
      recommendedAction:
        "Escalate for manual review: cross-reference with geospatial toll data and request third-party logistics verification before consideration.",
      requiredEvidence:
        "Third-party GPS toll manifest, supplier-signed delivery receipt, and physical inspection certificate.",
      engineName: "Spatiotemporal Physics Engine",
      findingExplanation:
        "Declared distance of 3,200 km over 14 hours implies 228.6 km/h — physically unattainable for commercial road transport. Anomaly classified as HIGH severity.",
    },
    {
      id: "FND-SYNTH-002",
      title: "GST Rate Matrix Mismatch — HSN 8471 Declared at 5%",
      description:
        "Invoice INV-SYNTH-002 for laptop computers (HSN 8471) declares a GST rate of 5%. The statutory rate for HSN 8471 under the GST council rate matrix is 18%. The 13% differential indicates potential misclassification to reduce tax liability.",
      severity: "HIGH",
      associatedValueINR: 1270000,
      detectionDelta: {
        legacySystem: "Manual HSN Code Verification",
        reasonMissed:
          "Legacy processes rely on self-reported HSN codes and do not perform cross-referenced rate-matrix lookups against the declared GST percentage. A manual auditor would need to maintain an up-to-date rate matrix — often overlooked.",
        evidenceBurden:
          "Requires an indexed, version-controlled GST rate matrix database integrated at the point of invoice ingestion.",
      },
      businessImpact:
        "Under-declared GST liability of ₹1,27,000. If unchallenged, the supplier may claim excess Input Tax Credit, increasing the NBFC's indirect tax exposure.",
      recommendedAction:
        "Flag for compliance review. Request corrected invoice with rate 18% or seek revised HSN classification certificate from the supplier.",
      requiredEvidence:
        "Revised tax invoice at correct GST rate, HSN classification certificate from a Chartered Accountant.",
      engineName: "GST Rate Engine",
      findingExplanation:
        "Declared GST rate of 5% does not match the statutory rate of 18% for HSN 8471 (computers & peripherals). Differential of 13% indicates probable misclassification.",
    },
    {
      id: "FND-SYNTH-003",
      title: "Reverse Chronology — EWB Precedes Invoice Date",
      description:
        "Invoice INV-SYNTH-003 dated 15-Jun-2026 has an associated e-way bill generated on 12-Jun-2026. The e-way bill predates the invoice by 3 days, which is logically impossible — goods cannot be dispatched before the invoice is raised.",
      severity: "HIGH",
      associatedValueINR: 950000,
      detectionDelta: {
        legacySystem: "Date-field Character Match",
        reasonMissed:
          "Legacy OCR systems extract date strings and verify format validity but do not establish a temporal dependency graph between invoice date and e-way bill generation timestamp.",
        evidenceBurden:
          "Requires cross-document temporal sequence analysis with business-rule understanding of the invoice → dispatch → e-way bill lifecycle.",
      },
      businessImpact:
        "Exposure of ₹9,50,000 on a post-dated documentation scheme. If unnoticed, the NBFC finances a transaction where the supporting documentation chronology is fabricated.",
      recommendedAction:
        "Escalate for forensic review. Flag as potential documentation fabrication. Request original timestamp logs from the supplier's ERP.",
      requiredEvidence:
        "Original ERP audit logs for invoice creation and e-way bill generation, supplier affidavit on document chronology.",
      engineName: "Temporal Sequence Engine",
      findingExplanation:
        "EWB generated 12-Jun-2026 precedes invoice date 15-Jun-2026 by 3 days. Reverse chronology indicates post-dated documentation.",
    },
    {
      id: "FND-SYNTH-004",
      title: "HSN-Product Semantic Mismatch",
      description:
        "Invoice INV-SYNTH-004 declares HSN code 8471 (electronics — computers) but the product description reads 'Cotton yarn'. The HSN code 8471 falls under electronics, while cotton yarn is classified under HSN 5205 (textiles).",
      severity: "MODERATE",
      associatedValueINR: 620000,
      detectionDelta: {
        legacySystem: "Self-declared HSN without verification",
        reasonMissed:
          "Standard invoice processing accepts the supplier-declared HSN code at face value. No semantic cross-reference is performed between the HSN category and the product description text.",
        evidenceBurden:
          "Requires a trained semantic classifier or HSN-product ontology database to detect mismatches between declared codes and product descriptions.",
      },
      businessImpact:
        "Misclassification of HSN code may lead to incorrect GST rate application, affecting ITC claims. Potential exposure of ₹62,000 in tax differential.",
      recommendedAction:
        "Request corrected HSN classification. Verify product description against supplier's GST registration certificate.",
      requiredEvidence:
        "Corrected invoice with accurate HSN code, supplier GST registration certificate showing principal goods class.",
      engineName: "HSN Semantic Classifier",
      findingExplanation:
        "HSN 8471 maps to 'electronics' category but product description 'Cotton yarn' suggests textiles (HSN 5205). Semantic mismatch detected at MODERATE severity.",
    },
    {
      id: "FND-SYNTH-005",
      title: "Duplicate Invoice Submission — Hash Collision",
      description:
        "Invoice INV-SYNTH-005 matches the SHA-256 hash of invoice INV-SYNTH-DUP-1 previously submitted in this portfolio. The normalized invoice number and IRN hash are identical, indicating a repeat submission for duplicate financing.",
      severity: "ABSOLUTE",
      associatedValueINR: 495000,
      detectionDelta: {
        legacySystem: "Sequential Invoice Number Check",
        reasonMissed:
          "Legacy deduplication relies on exact invoice number matching. If the supplier resubmits with a different invoice number but identical IRN hash, the duplicate is not detected.",
        evidenceBurden:
          "Requires cryptographic hash indexing of all historical IRNs and invoice payloads, with real-time lookup at submission.",
      },
      businessImpact:
        "Attempted duplicate financing of ₹4,95,000. If undetected, the same invoice would be financed twice, creating unsecured double exposure.",
      recommendedAction:
        "Block financing immediately. Log supplier for pattern monitoring. Require manual underwriting for all future submissions from this entity.",
      requiredEvidence:
        "Historical submission records, IRN hash match certificate, supplier notification of rejection.",
      engineName: "Deduplication Core",
      findingExplanation:
        "SHA-256 hash of INV-SYNTH-005 collides with previously financed INV-SYNTH-DUP-1. Absolute severity — duplicate financing attempt blocked.",
    },
    {
      id: "FND-SYNTH-006",
      title: "GSTIN State Code — Invalid Prefix 99",
      description:
        "Invoice INV-SYNTH-006 declares supplier GSTIN '99ABCDE1234F5Z6'. The first two characters '99' do not correspond to any valid Indian state or union territory code (valid range: 01–38). The GSTIN fails structural validation.",
      severity: "MODERATE",
      associatedValueINR: 0,
      detectionDelta: {
        legacySystem: "GSTIN Format Regex Check",
        reasonMissed:
          "Standard format validation checks the 15-character alphanumeric pattern but does not verify that the state code prefix falls within the Gazette-notified range of 01–38.",
        evidenceBurden:
          "Requires a state-code lookup table integrated at the point of GSTIN entry, with rejection of out-of-range codes.",
      },
      businessImpact:
        "Invoice cannot be processed for financing as the GSTIN is structurally invalid. No ITC can be claimed against this entity. Potential shell supplier indicator.",
      recommendedAction:
        "Reject invoice. Request valid GSTIN from the supplier. Flag supplier GSTIN for compliance review.",
      requiredEvidence:
        "Valid GSTIN certificate from the supplier, verification against GST portal.",
      engineName: "GSTIN Structural Analyser",
      findingExplanation:
        "State code '99' in GSTIN is outside the valid range (01–38). Structural validation failed. MODERATE severity — zero capital at risk but high operational impact.",
    },
  ],
};
