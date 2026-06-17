export interface InputField {
  label: string;
  key: string;
  type: string;
  example: string | number | boolean | unknown[];
  validationRules: string;
}

export interface Experiment {
  id: string;
  title: string;
  engine: string;
  endpoint: string;
  businessDescription: string;
  inputFields: InputField[];
  goldenBasePayload: Record<string, unknown>;
  mutationRules: string;
  generatedPayloadExample: Record<string, unknown>;
  expectedVerdict: "PASS" | "INCONCLUSIVE" | "FAIL" | "REJECT" | "PEND" | "GSTIN_CHECKSUM_FAILURE";
  expectedAnomalyCodes: string[];
  expectedPlainEnglishResult: string;
  technicalDetailsOutput: Record<string, unknown>;
  auditReportMapping: {
    experiment: string;
    auditFinding: string;
    executiveSummaryLanguage: string;
  };
}

export const EXPERIMENT_MATRIX: Experiment[] = [
  {
    id: "EXP_01_GOLDEN_PASS",
    title: "Golden Baseline Validation",
    engine: "Core Orchestrator",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Validates a flawless invoice with mathematically perfect geometry, valid transit physics, and clean statutory markers to prove baseline eligibility.",
    inputFields: [
      { label: "Invoice Face Value (INR)", key: "invoice_face_value_inr", type: "number", example: 177000, validationRules: "Must be positive" },
      { label: "Distance (km)", key: "ewb_data_override.declared_distance_km", type: "number", example: 1500, validationRules: "Must be positive" }
    ],
    goldenBasePayload: {
      client_reference_id: "LOAN-APP-9921",
      invoice_number: "INV-2026-GOLD",
      irn: "b83c16827b5e8055dc87c7ebf051ebff07e33e9d3d3a04a11f20d2d3a3915bc6",
      invoice_face_value_inr: 177000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      declared_supply_type: "B2B",
      taxable_value: 150000,
      igst_amount: 27000,
      cgst_amount: 0,
      sgst_amount: 0,
      hsn_code: "9983",
      is_einvoice_mandated: true,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 1500,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30",
        part_b_updates: [{ updated_at: "2026-06-15T11:00:00+05:30", vehicle_number: "MH12AB1234", from_place: "Mumbai", reason_code: "1" }]
      }
    },
    mutationRules: "No mutation. The payload is sent exactly as generated to prove a clean PASS state.",
    generatedPayloadExample: {
      client_reference_id: "LOAN-APP-9921",
      invoice_number: "INV-2026-GOLD",
      irn: "b83c16827b5e8055dc87c7ebf051ebff07e33e9d3d3a04a11f20d2d3a3915bc6",
      invoice_face_value_inr: 177000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      declared_supply_type: "B2B",
      taxable_value: 150000,
      igst_amount: 27000,
      cgst_amount: 0,
      sgst_amount: 0,
      hsn_code: "9983",
      is_einvoice_mandated: true,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 1500,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30",
        part_b_updates: [{ updated_at: "2026-06-15T11:00:00+05:30", vehicle_number: "MH12AB1234", from_place: "Mumbai", reason_code: "1" }]
      }
    },
    expectedVerdict: "PASS",
    expectedAnomalyCodes: [],
    expectedPlainEnglishResult: "All chronological and physics checks cleared. Invoice exhibits flawless mathematical integrity and is eligible for funding.",
    technicalDetailsOutput: {
      verdict: "PASS",
      anomaly_severity: "NONE",
      audit_summary: { narrative: "Executed 5 checks. 5 passed, 0 failed, 0 inconclusive.", checks_passed: 5, checks_failed: 0, checks_inconclusive: 0 }
    },
    auditReportMapping: {
      experiment: "Golden Baseline Validation",
      auditFinding: "Clean Ledger Validation",
      executiveSummaryLanguage: "Record evaluated with zero mathematical or chronological anomalies. Cleared for capital deployment."
    }
  },
  {
    id: "EXP_02_GSTIN_CHECKSUM",
    title: "GSTIN Cryptographic Validation",
    engine: "GSTIN Structure & Math Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Validates that the 15-character GSTIN complies with the modulo-36 cryptographic check-digit algorithm to prevent fabricated counterparty identities.",
    inputFields: [
      { label: "Supplier GSTIN", key: "supplier_gstin", type: "string", example: "27AAPFU0939F1ZZ", validationRules: "Length 15, alphanumeric" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-GSTIN",
      invoice_face_value_inr: 1000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 800
    },
    mutationRules: "supplier_gstin: 27AAPFU0939F1ZV → 27AAPFU0939F1ZZ (Altered check digit)",
    generatedPayloadExample: {
      invoice_number: "INV-2026-GSTIN",
      invoice_face_value_inr: 1000,
      supplier_gstin: "27AAPFU0939F1ZZ",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 800
    },
    expectedVerdict: "GSTIN_CHECKSUM_FAILURE",
    expectedAnomalyCodes: ["GSTIN_CHECKSUM_FAILURE"],
    expectedPlainEnglishResult: "The supplier_gstin failed GSTN check-digit validation. Cryptographic mismatch detected.",
    technicalDetailsOutput: {
      error: "GSTIN_CHECKSUM_FAILURE",
      field: "supplier_gstin",
      expected_check_char: "V",
      provided_check_char: "Z",
      math_proof: { modulo_result: 14, checksum_index: 31 }
    },
    auditReportMapping: {
      experiment: "GSTIN Cryptographic Validation",
      auditFinding: "Counterparty Identity Failure",
      executiveSummaryLanguage: "Supplier identity fails cryptographic verification. Invoice origin is mathematically impossible."
    }
  },
  {
    id: "EXP_03_SELF_SUPPLY",
    title: "Self-Supply Detection",
    engine: "Arm's-Length Integrity Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Prevents circular trading by proving the supplier and financing recipient are distinct legal entities.",
    inputFields: [
      { label: "Supplier GSTIN", key: "supplier_gstin", type: "string", example: "27AAPFU0939F1ZV", validationRules: "Valid GSTIN format" },
      { label: "Buyer GSTIN", key: "buyer_gstin", type: "string", example: "27AAPFU0939F1ZV", validationRules: "Valid GSTIN format" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-SS",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000
    },
    mutationRules: "buyer_gstin: 24AAACC1206D1ZM → 27AAPFU0939F1ZV (Buyer matches Supplier)",
    generatedPayloadExample: {
      invoice_number: "INV-2026-SS",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "27AAPFU0939F1ZV",
      invoice_date: "2026-06-15",
      taxable_value: 40000
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["SELF_SUPPLY_DETECTED"],
    expectedPlainEnglishResult: "Supplier GSTIN and buyer GSTIN are identical on this invoice. Transaction fails arm's-length validation.",
    technicalDetailsOutput: {
      verdict: "FAIL",
      anomaly_severity: "HIGH",
      checks: [{ check_id: "self_supply_detection", anomaly: { code: "SELF_SUPPLY_DETECTED", math_proof: { check: "supplier_gstin === buyer_gstin", result: true } } }]
    },
    auditReportMapping: {
      experiment: "Self-Supply Detection",
      auditFinding: "Arm's-Length Transaction Violation",
      executiveSummaryLanguage: "Supplier and buyer identities intersect. Invoice represents an ineligible self-supply."
    }
  },
  {
    id: "EXP_04_DUPLICATE_INVOICE",
    title: "Duplicate Invoice Guard",
    engine: "Deduplication Core",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Blocks duplicate financing by ensuring the same normalized invoice number is not submitted twice for the same supplier in the same financial year.",
    inputFields: [
      { label: "Invoice Number", key: "invoice_number", type: "string", example: "INV-2026-DUP-1", validationRules: "Alphanumeric" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-DUP-1",
      invoice_face_value_inr: 10000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 8000
    },
    mutationRules: "Payload remains identical, but frontend generates a NEW x-idempotency-key to force database re-evaluation, triggering the unique row-level lock.",
    generatedPayloadExample: {
      invoice_number: "INV-2026-DUP-1",
      invoice_face_value_inr: 10000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 8000
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["DUPLICATE_INVOICE_NUMBER_SUBMISSION"],
    expectedPlainEnglishResult: "This invoice number has been previously submitted by the same supplier to this client in financial year 2026-27.",
    technicalDetailsOutput: {
      verdict: "FAIL",
      anomaly_severity: "CRITICAL",
      checks: [{ anomaly: { code: "DUPLICATE_INVOICE_NUMBER_SUBMISSION", math_proof: { hash_algorithm: "SHA-256", financial_year: "2026-27" } } }]
    },
    auditReportMapping: {
      experiment: "Duplicate Invoice Guard",
      auditFinding: "Duplicate Financing Attempt",
      executiveSummaryLanguage: "Cryptographic hash match detects a duplicate funding submission for the current financial year."
    }
  },
  {
    id: "EXP_05_DUPLICATE_IRN",
    title: "Duplicate IRN Guard",
    engine: "Deduplication Core",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Secures capital deployment by guaranteeing a cryptographic 64-character Invoice Reference Number is funded only once per portfolio.",
    inputFields: [
      { label: "Invoice Reference Number (IRN)", key: "irn", type: "string", example: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2", validationRules: "64-char hex" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-IRN-1",
      irn: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000
    },
    mutationRules: "Payload remains identical, frontend generates a NEW x-idempotency-key. Second execution triggers IRN constraint.",
    generatedPayloadExample: {
      invoice_number: "INV-2026-IRN-1",
      irn: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["DUPLICATE_IRN_SUBMISSION"],
    expectedPlainEnglishResult: "This IRN has been previously submitted to AEGIS by this client.",
    technicalDetailsOutput: {
      verdict: "FAIL",
      anomaly_severity: "CRITICAL",
      checks: [{ anomaly: { code: "DUPLICATE_IRN_SUBMISSION", math_proof: { client_id_hashed: true, irn_hashed: true } } }]
    },
    auditReportMapping: {
      experiment: "Duplicate IRN Guard",
      auditFinding: "E-Invoice Replay Attack",
      executiveSummaryLanguage: "Identical cryptographic IRN submitted across distinct funding requests. Capital deployment blocked."
    }
  },
  {
    id: "EXP_06_TRANSIT_PHYSICS",
    title: "Transit Physics Validation",
    engine: "Spatiotemporal Physics Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Proves invoice validity by ensuring the declared transport distance mathematically aligns with the E-Way Bill's active timestamp window.",
    inputFields: [
      { label: "Declared Distance (km)", key: "ewb_data_override.declared_distance_km", type: "number", example: 3000, validationRules: "> 0" },
      { label: "Transport Mode", key: "transport_mode_hint", type: "string", example: "ROAD", validationRules: "ROAD | RAIL | AIR | SHIP" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-PHYSICS",
      invoice_face_value_inr: 150000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 120000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 450,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30"
      }
    },
    mutationRules: "ewb_data_override.declared_distance_km: 450 → 3000.",
    generatedPayloadExample: {
      invoice_number: "INV-2026-PHYSICS",
      invoice_face_value_inr: 150000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 120000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 3000,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30"
      }
    },
    expectedVerdict: "INCONCLUSIVE",
    expectedAnomalyCodes: ["MISSING_PART_B_UPDATES"],
    expectedPlainEnglishResult: "Implied speed of 300.0 km/h is UNREALISTICALLY_FAST for mode ROAD.",
    technicalDetailsOutput: {
      verdict: "FAIL",
      anomaly_severity: "HIGH",
      checks: [{ check_id: "TRANSIT_PHYSICS", anomaly: { code: "UNREALISTICALLY_FAST", math_proof: { distance_km: 3000, validity_hours: 10, implied_speed_kmh: 300 } } }]
    },
    auditReportMapping: {
      experiment: "Transit Physics Validation",
      auditFinding: "Spatiotemporal Velocity Violation",
      executiveSummaryLanguage: "Declared transit distance mathematically exceeds maximum achievable speed for specified transport mode."
    }
  },
  {
    id: "EXP_07_EWB_NEGATIVE_VALIDITY",
    title: "EWB Temporal Validation (Negative Validity)",
    engine: "Document Chronology Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Blocks fabricated E-Way Bills by detecting chronologies where the document expires before it was legally generated.",
    inputFields: [
      { label: "EWB Generated At", key: "ewb_data_override.ewb_generated_at", type: "datetime", example: "2026-06-15T18:00:00+05:30", validationRules: "ISO 8601" },
      { label: "EWB Expiry At", key: "ewb_data_override.ewb_expiry_at", type: "datetime", example: "2026-06-15T10:00:00+05:30", validationRules: "ISO 8601" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-NEGT",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 100,
        irn_generated_at: "2026-06-15T09:00:00+05:30",
        ewb_generated_at: "2026-06-15T18:00:00+05:30",
        ewb_expiry_at: "2026-06-15T10:00:00+05:30"
      }
    },
    mutationRules: "ewb_expiry_at (10:00) precedes ewb_generated_at (18:00).",
    generatedPayloadExample: {
      invoice_number: "INV-2026-NEGT",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 100,
        irn_generated_at: "2026-06-15T09:00:00+05:30",
        ewb_generated_at: "2026-06-15T18:00:00+05:30",
        ewb_expiry_at: "2026-06-15T10:00:00+05:30"
      }
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["NEGATIVE_VALIDITY_PERIOD", "EXPIRY_BEFORE_GENERATION"],
    expectedPlainEnglishResult: "E-way bill expires before it was generated. Impossible chronology.",
    technicalDetailsOutput: {
      verdict: "FAIL",
      anomaly_severity: "CRITICAL",
      checks: [{ check_id: "TRANSIT_PHYSICS", anomaly: { code: "NEGATIVE_VALIDITY_PERIOD", math_proof: { validity_hours: -8 } } }]
    },
    auditReportMapping: {
      experiment: "EWB Temporal Validation",
      auditFinding: "Impossible Chronology Sequence",
      executiveSummaryLanguage: "Statutory transit documents exhibit mathematically inverted timestamps. Funding blocked."
    }
  },
  {
    id: "EXP_08_AATO_BACKDATING",
    title: "Excessive Backdating (AATO Validation)",
    engine: "Document Chronology Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Evaluates invoice date against IRN generation time. Alerts risk teams to potential 30-day reporting violations for suppliers exceeding ₹10 Crore AATO.",
    inputFields: [
      { label: "Invoice Date", key: "invoice_date", type: "string", example: "2026-04-15", validationRules: "YYYY-MM-DD" },
      { label: "IRN Generated At", key: "ewb_data_override.irn_generated_at", type: "string", example: "2026-06-15T10:00:00+05:30", validationRules: "ISO 8601" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-AATO",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-04-15",
      is_einvoice_mandated: true,
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 100,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30"
      }
    },
    mutationRules: "Gap between invoice_date (April 15) and irn_generated_at (June 15) is 61 days. Threshold is 30 days.",
    generatedPayloadExample: {
      invoice_number: "INV-2026-AATO",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-04-15",
      is_einvoice_mandated: true,
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 100,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30"
      }
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["EXCESSIVE_BACKDATING"],
    expectedPlainEnglishResult: "IRN generated 61 days after invoice date. Standard reporting limit is 30 days.",
    technicalDetailsOutput: {
      verdict: "INCONCLUSIVE",
      anomaly_severity: "HIGH",
      checks: [{ anomaly: { code: "EXCESSIVE_BACKDATING", math_proof: { gap_days: 61, threshold_days: 30 } } }]
    },
    auditReportMapping: {
      experiment: "Excessive Backdating (AATO Validation)",
      auditFinding: "Statutory Reporting Delay",
      executiveSummaryLanguage: "Invoice generation significantly precedes digital reporting. Verfication of supplier AATO turnover required."
    }
  },
  {
    id: "EXP_09_EWB_PRE_INVOICE",
    title: "EWB Pre-Invoice Validation",
    engine: "Document Chronology Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Detects chronological anomalies where transit documentation (EWB) precedes the creation of the invoice for non-mandated entities.",
    inputFields: [
      { label: "Invoice Date", key: "invoice_date", type: "string", example: "2026-06-15", validationRules: "YYYY-MM-DD" },
      { label: "EWB Generated At", key: "ewb_data_override.ewb_generated_at", type: "string", example: "2026-06-10T10:00:00+05:30", validationRules: "ISO 8601" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-PRE",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      is_einvoice_mandated: false,
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 100,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-10T10:00:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30"
      }
    },
    mutationRules: "is_einvoice_mandated: false. ewb_generated_at (June 10) precedes invoice_date (June 15).",
    generatedPayloadExample: {
      invoice_number: "INV-2026-PRE",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      is_einvoice_mandated: false,
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 100,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-10T10:00:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30"
      }
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["EWB_PRE_INVOICE_GENERATION"],
    expectedPlainEnglishResult: "EWB generated 120 hours before invoice date. Non-mandated entity: no IRP portal delay explains this gap.",
    technicalDetailsOutput: {
      verdict: "INCONCLUSIVE",
      anomaly_severity: "HIGH",
      checks: [{ anomaly: { code: "EWB_PRE_INVOICE_GENERATION", math_proof: { gap_hours: 120, is_einvoice_mandated: false } } }]
    },
    auditReportMapping: {
      experiment: "EWB Pre-Invoice Validation",
      auditFinding: "Pre-Emptive Transit Declaration",
      executiveSummaryLanguage: "Goods declared in transit before financial document existed. Manual confirmation required."
    }
  },
  {
    id: "EXP_10_EWB_PART_B_MISSING",
    title: "EWB Part B Movement Validation",
    engine: "Transit Movement Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Enforces CGST Rule 138(3) by ensuring high-value shipments traveling >50km have valid vehicle tracking updates filed.",
    inputFields: [
      { label: "Declared Distance (km)", key: "ewb_data_override.declared_distance_km", type: "number", example: 500, validationRules: "> 50" },
      { label: "Part B Updates", key: "ewb_data_override.part_b_updates", type: "array", example: [], validationRules: "Empty Array" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-PARTB",
      invoice_face_value_inr: 5500000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 5000000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 500,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30",
        part_b_updates: []
      }
    },
    mutationRules: "Distance > 50km, but part_b_updates array is completely empty.",
    generatedPayloadExample: {
      invoice_number: "INV-2026-PARTB",
      invoice_face_value_inr: 5500000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 5000000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 500,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30",
        part_b_updates: []
      }
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["MISSING_PART_B_UPDATES"],
    expectedPlainEnglishResult: "Distance > 50km requires Part B. No vehicle updates found.",
    technicalDetailsOutput: {
      verdict: "INCONCLUSIVE",
      anomaly_severity: "CRITICAL",
      checks: [{ anomaly: { code: "MISSING_PART_B_UPDATES", math_proof: { updates_count: 0, distance_threshold: 50, actual_distance: 500 } } }]
    },
    auditReportMapping: {
      experiment: "EWB Part B Movement Validation",
      auditFinding: "Missing Fleet Tracking Data",
      executiveSummaryLanguage: "Long-haul shipment lacks mandatory vehicle registration data. High risk of phantom freight."
    }
  },
  {
    id: "EXP_11_EWB_PART_B_FREQ",
    title: "Unrealistic Update Frequency",
    engine: "Transit Movement Engine",
    endpoint: "/v1/invoice/triangulate",
    businessDescription: "Detects potential EWB manipulation by identifying impossible vehicle change frequencies.",
    inputFields: [
      { label: "Update 1 Time", key: "ewb_data_override.part_b_updates[0].updated_at", type: "string", example: "2026-06-15T11:00:00+05:30", validationRules: "ISO 8601" },
      { label: "Update 2 Time", key: "ewb_data_override.part_b_updates[1].updated_at", type: "string", example: "2026-06-15T11:15:00+05:30", validationRules: "ISO 8601" }
    ],
    goldenBasePayload: {
      invoice_number: "INV-2026-FREQ",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 500,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30",
        part_b_updates: [
          { updated_at: "2026-06-15T11:00:00+05:30", vehicle_number: "MH12AB1234", from_place: "Mumbai", reason_code: "1" },
          { updated_at: "2026-06-15T11:15:00+05:30", vehicle_number: "MH12AB9999", from_place: "Mumbai", reason_code: "2" }
        ]
      }
    },
    mutationRules: "Gap between Part B updates is 15 minutes. Threshold for realistic physical transfer is 30 minutes.",
    generatedPayloadExample: {
      invoice_number: "INV-2026-FREQ",
      invoice_face_value_inr: 50000,
      supplier_gstin: "27AAPFU0939F1ZV",
      buyer_gstin: "24AAACC1206D1ZM",
      invoice_date: "2026-06-15",
      taxable_value: 40000,
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 500,
        irn_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_generated_at: "2026-06-15T10:30:00+05:30",
        ewb_expiry_at: "2026-06-17T23:59:00+05:30",
        part_b_updates: [
          { updated_at: "2026-06-15T11:00:00+05:30", vehicle_number: "MH12AB1234", from_place: "Mumbai", reason_code: "1" },
          { updated_at: "2026-06-15T11:15:00+05:30", vehicle_number: "MH12AB9999", from_place: "Mumbai", reason_code: "2" }
        ]
      }
    },
    expectedVerdict: "FAIL",
    expectedAnomalyCodes: ["UNREALISTIC_UPDATE_FREQUENCY"],
    expectedPlainEnglishResult: "Multiple Part B updates occurred within 30 minutes. Possible manipulation.",
    technicalDetailsOutput: {
      verdict: "INCONCLUSIVE",
      anomaly_severity: "MEDIUM",
      checks: [{ anomaly: { code: "UNREALISTIC_UPDATE_FREQUENCY", math_proof: { diff_hours: 0.25, threshold_hours: 0.5 } } }]
    },
    auditReportMapping: {
      experiment: "Unrealistic Update Frequency",
      auditFinding: "EWB Modification Anomaly",
      executiveSummaryLanguage: "Vehicle modifications occurred at an unrealistic pace. Review for portal manipulation."
    }
  },
  {
    id: "EXP_12_TAX_ARITHMETIC",
    title: "GST Geometry & Arithmetic Validation",
    engine: "Fuzzy Logic & Arithmetic Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Proves internal mathematical consistency by ensuring Taxable Value + CGST + SGST + IGST strictly equals Total Invoice Value.",
    inputFields: [
      { label: "Taxable Value", key: "taxable_value", type: "number", example: 100000, validationRules: "> 0" },
      { label: "CGST Amount", key: "cgst_amount", type: "number", example: 9000, validationRules: ">= 0" },
      { label: "SGST Amount", key: "sgst_amount", type: "number", example: 9000, validationRules: ">= 0" },
      { label: "Total Invoice Value", key: "total_invoice_value", type: "number", example: 120000, validationRules: "Must match sum within ₹1" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-012",
      erp_invoice: {
        invoice_number: "INV-MATH", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 120000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-MATH", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 120000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    mutationRules: "Taxable (100,000) + CGST (9,000) + SGST (9,000) = 118,000. Declared Total is 120,000. Difference > ₹1.",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-012",
      erp_invoice: {
        invoice_number: "INV-MATH", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 120000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-MATH", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 120000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["TAX_ARITHMETIC_V1"],
    expectedPlainEnglishResult: "Sum (expected_total) != stated (total_invoice_value), diff Rs.2000.00",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "tax_arithmetic", passed: false, math_proof: { expected_total: 118000, actual_total: 120000, difference: 2000 } }]
    },
    auditReportMapping: {
      experiment: "GST Geometry & Arithmetic Validation",
      auditFinding: "Mathematical Integrity Failure",
      executiveSummaryLanguage: "Invoice exhibits structural calculation defects. Total value does not equal taxable components plus tax."
    }
  },
  {
    id: "EXP_13_CGST_SGST_SYMMETRY",
    title: "CGST/SGST Symmetry Validation",
    engine: "Fuzzy Logic & Arithmetic Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Enforces structural tax symmetry by rejecting intrastate invoices where the Central and State tax components are not exactly equal.",
    inputFields: [
      { label: "CGST Amount", key: "cgst_amount", type: "number", example: 9000, validationRules: ">= 0" },
      { label: "SGST Amount", key: "sgst_amount", type: "number", example: 8000, validationRules: ">= 0" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-013",
      erp_invoice: {
        invoice_number: "INV-SYM", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 8000, igst_amount: 0,
        total_invoice_value: 117000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-SYM", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 8000, igst_amount: 0,
        total_invoice_value: 117000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    mutationRules: "CGST (9000) != SGST (8000).",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-013",
      erp_invoice: {
        invoice_number: "INV-SYM", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 8000, igst_amount: 0,
        total_invoice_value: 117000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-SYM", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 8000, igst_amount: 0,
        total_invoice_value: 117000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["ASYMMETRIC_CGST_SGST"],
    expectedPlainEnglishResult: "For intrastate supplies, CGST and SGST must be exactly equal. Difference: ₹1000.00.",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "cgst_sgst_symmetry", passed: false, erp_value: 9000, ims_value: 8000 }]
    },
    auditReportMapping: {
      experiment: "CGST/SGST Symmetry Validation",
      auditFinding: "Asymmetric Tax Application",
      executiveSummaryLanguage: "Central and State tax disbursements are mathematically disproportionate. Capital protection protocol activated."
    }
  },
  {
    id: "EXP_14_DUAL_TAX_REGIME",
    title: "Dual Tax Regime Detection",
    engine: "Statutory Law Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Blocks documents that illegally apply both Interstate (IGST) and Intrastate (CGST/SGST) tax structures simultaneously.",
    inputFields: [
      { label: "IGST Amount", key: "igst_amount", type: "number", example: 18000, validationRules: "> 0" },
      { label: "CGST Amount", key: "cgst_amount", type: "number", example: 9000, validationRules: "> 0" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-014",
      erp_invoice: {
        invoice_number: "INV-DUAL", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 18000,
        total_invoice_value: 136000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-DUAL", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 18000,
        total_invoice_value: 136000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    mutationRules: "igst_amount > 0 AND (cgst_amount > 0 OR sgst_amount > 0).",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-014",
      erp_invoice: {
        invoice_number: "INV-DUAL", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 18000,
        total_invoice_value: 136000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-DUAL", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 18000,
        total_invoice_value: 136000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["DUAL_TAX_REGIME_DETECTED"],
    expectedPlainEnglishResult: "Under Indian GST law, an invoice must apply either IGST (interstate) or CGST+SGST (intrastate) — never both.",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "dual_tax_regime_detection", passed: false }]
    },
    auditReportMapping: {
      experiment: "Dual Tax Regime Detection",
      auditFinding: "Mutually Exclusive Taxation",
      executiveSummaryLanguage: "Invoice applies mutually exclusive tax regimes concurrently. Funding blocked due to fundamental statutory contradiction."
    }
  },
  {
    id: "EXP_15_POS_CONSISTENCY",
    title: "Place of Supply Validation",
    engine: "Statutory Law Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Cross-references numeric Place of Supply (POS) indicators against state-code tax arrays to detect mis-mapped trade corridors.",
    inputFields: [
      { label: "Supplier State", key: "supplier_gstin", type: "string", example: "27AAPFU0939F1ZV", validationRules: "State 27" },
      { label: "Declared POS", key: "place_of_supply", type: "string", example: "27", validationRules: "State 27" },
      { label: "Applied Tax", key: "igst_amount", type: "number", example: 18000, validationRules: "> 0" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-015",
      erp_invoice: {
        invoice_number: "INV-POS", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 18000,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-POS", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 18000,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    mutationRules: "Supplier (27) == POS (27). Indicates intrastate supply. But IGST applied.",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-015",
      erp_invoice: {
        invoice_number: "INV-POS", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 18000,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-POS", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 18000,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["PLACE_OF_SUPPLY_INCONSISTENT"],
    expectedPlainEnglishResult: "Declared Place of Supply (27) matches supplier state (27), indicating an intrastate supply. CGST+SGST should apply. Invoice shows IGST.",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "place_of_supply_consistency", passed: false }]
    },
    auditReportMapping: {
      experiment: "Place of Supply Validation",
      auditFinding: "Place of Supply Mismatch",
      executiveSummaryLanguage: "Declared state taxation indicators contradict the applied tax format."
    }
  },
  {
    id: "EXP_16_BILL_TO_SHIP_TO",
    title: "Bill-To-Ship-To Alignment",
    engine: "Statutory Law Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Maintains funding pipeline speed by correctly bypassing strict state-code matches during complex tripartite (Section 10) supply chain movements.",
    inputFields: [
      { label: "Supplier GSTIN", key: "supplier_gstin", type: "string", example: "27AAPFU0939F1ZV", validationRules: "State 27" },
      { label: "Buyer GSTIN", key: "buyer_gstin", type: "string", example: "24AAACC1206D1ZM", validationRules: "State 24" },
      { label: "Ship-To State", key: "ship_to_state_code", type: "string", example: "29", validationRules: "State 29" },
      { label: "Applied Tax", key: "igst_amount", type: "number", example: 0, validationRules: "Should be > 0" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-016",
      erp_invoice: {
        invoice_number: "INV-B2S", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "24", ship_to_state_code: "29"
      },
      ims_invoice: {
        invoice_number: "INV-B2S", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "24", ship_to_state_code: "29"
      }
    },
    mutationRules: "Supplier (27) != Buyer (24). IGST should apply. Payload applies CGST/SGST.",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-016",
      erp_invoice: {
        invoice_number: "INV-B2S", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "24", ship_to_state_code: "29"
      },
      ims_invoice: {
        invoice_number: "INV-B2S", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 9000, sgst_amount: 9000, igst_amount: 0,
        total_invoice_value: 118000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "24", ship_to_state_code: "29"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["POS_INCONSISTENCY_DETECTED"],
    expectedPlainEnglishResult: "Interstate supply. IGST should apply. Invoice shows CGST + SGST. Tax type is inconsistent with Section 10(1)(b).",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "pos_bill_to_ship_to", passed: false }]
    },
    auditReportMapping: {
      experiment: "Bill-To-Ship-To Alignment",
      auditFinding: "Tripartite Transit Misalignment",
      executiveSummaryLanguage: "Supply chain taxation does not support the declared bill-to-ship-to geometry."
    }
  },
  {
    id: "EXP_17_GTA_FCM_VALID",
    title: "Goods Transport Agency Validation (Valid)",
    engine: "Statutory Law Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Verifies mathematical compliance for GTA freight invoices against the updated 5% and 18% Forward Charge structures.",
    inputFields: [
      { label: "HSN Code", key: "hsn_code", type: "string", example: "9965", validationRules: "9965" },
      { label: "Taxable Value", key: "taxable_value", type: "number", example: 100000, validationRules: "> 0" },
      { label: "Applied Tax (IGST)", key: "igst_amount", type: "number", example: 5000, validationRules: "5% implied" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-017",
      erp_invoice: {
        invoice_number: "INV-GTA", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 5000,
        total_invoice_value: 105000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      },
      ims_invoice: {
        invoice_number: "INV-GTA", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 5000,
        total_invoice_value: 105000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      }
    },
    mutationRules: "HSN is 9965. Implied rate is 5% (Valid FCM).",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-017",
      erp_invoice: {
        invoice_number: "INV-GTA", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 5000,
        total_invoice_value: 105000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      },
      ims_invoice: {
        invoice_number: "INV-GTA", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 5000,
        total_invoice_value: 105000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: [],
    expectedPlainEnglishResult: "INCONCLUSIVE: GTA FCM applied. Verify Annexure V declaration exists.",
    technicalDetailsOutput: {
      verdict: "PEND",
      match_fields: [{ field_name: "taxable_value", passed: null, note: "INCONCLUSIVE: GTA FCM applied. Verify Annexure V declaration exists." }]
    },
    auditReportMapping: {
      experiment: "Goods Transport Agency Validation (Valid)",
      auditFinding: "Verification of Annexure V Mandatory",
      executiveSummaryLanguage: "Freight invoice exhibits valid Forward Charge rate. Portal verification required prior to funding."
    }
  },
  {
    id: "EXP_18_GTA_OBSOLETE",
    title: "GTA Obsolete Rate Detection",
    engine: "Statutory Law Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Protects capital by flagging freight invoices utilizing the 12% tier abolished by the 56th GST Council Meeting.",
    inputFields: [
      { label: "HSN Code", key: "hsn_code", type: "string", example: "9965", validationRules: "9965" },
      { label: "Taxable Value", key: "taxable_value", type: "number", example: 100000, validationRules: "> 0" },
      { label: "Applied Tax (IGST)", key: "igst_amount", type: "number", example: 12000, validationRules: "12% implied" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-018",
      erp_invoice: {
        invoice_number: "INV-GTA2", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 12000,
        total_invoice_value: 112000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      },
      ims_invoice: {
        invoice_number: "INV-GTA2", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 12000,
        total_invoice_value: 112000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      }
    },
    mutationRules: "HSN is 9965. Implied rate is 12% (Obsolete).",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-018",
      erp_invoice: {
        invoice_number: "INV-GTA2", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 12000,
        total_invoice_value: 112000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      },
      ims_invoice: {
        invoice_number: "INV-GTA2", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 12000,
        total_invoice_value: 112000, hsn_code: "9965", item_description: "Freight", place_of_supply: "24"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["INVALID_GTA_TAX_RATE"],
    expectedPlainEnglishResult: "GTA FCM rate of 12% was abolished post-September 2025. Invalid tax rate.",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "taxable_value", passed: false }]
    },
    auditReportMapping: {
      experiment: "GTA Obsolete Rate Detection",
      auditFinding: "Statutory Rate Violation",
      executiveSummaryLanguage: "Freight invoice utilizes an abolished GST tier. Document is legally invalid."
    }
  },
  {
    id: "EXP_19_SPONSORSHIP_RCM",
    title: "Sponsorship RCM/FCM Classification",
    engine: "Statutory Law Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Extracts PAN entity intelligence (Corporate vs Non-Corporate) from the GSTIN to deterministically assign Reverse Charge requirements.",
    inputFields: [
      { label: "Supplier GSTIN", key: "supplier_gstin", type: "string", example: "27AAPFC0939F1ZD", validationRules: "Index 5 must be 'C'" },
      { label: "HSN Code", key: "hsn_code", type: "string", example: "998397", validationRules: "998397" },
      { label: "Applied Tax", key: "igst_amount", type: "number", example: 0, validationRules: "Must be >0 for Corp" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-019",
      erp_invoice: {
        invoice_number: "INV-SPON", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFC0939F1ZD", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 0,
        total_invoice_value: 100000, hsn_code: "998397", item_description: "Sponsorship", place_of_supply: "24"
      },
      ims_invoice: {
        invoice_number: "INV-SPON", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFC0939F1ZD", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 0,
        total_invoice_value: 100000, hsn_code: "998397", item_description: "Sponsorship", place_of_supply: "24"
      }
    },
    mutationRules: "Supplier GSTIN 6th character is 'C' (Corporate). HSN is 998397. Tax is 0 (RCM).",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-019",
      erp_invoice: {
        invoice_number: "INV-SPON", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFC0939F1ZD", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 0,
        total_invoice_value: 100000, hsn_code: "998397", item_description: "Sponsorship", place_of_supply: "24"
      },
      ims_invoice: {
        invoice_number: "INV-SPON", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFC0939F1ZD", buyer_gstin: "24AAACC1206D1ZM",
        taxable_value: 100000, cgst_amount: 0, sgst_amount: 0, igst_amount: 0,
        total_invoice_value: 100000, hsn_code: "998397", item_description: "Sponsorship", place_of_supply: "24"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["SPONSORSHIP_RCM_ERROR"],
    expectedPlainEnglishResult: "Corporate supplier (PAN 'C') providing sponsorship must charge forward tax (18%). RCM invalid.",
    technicalDetailsOutput: {
      verdict: "REJECT",
      match_fields: [{ field_name: "taxable_value", passed: false }]
    },
    auditReportMapping: {
      experiment: "Sponsorship RCM/FCM Classification",
      auditFinding: "Reverse Charge Misapplication",
      executiveSummaryLanguage: "Supplier entity type legally mandates Forward Charge collection. Invoice structure violates RCM statutes."
    }
  },
  {
    id: "EXP_20_COMPOSITION_DEALER",
    title: "Composition Dealer Geometry Validation",
    engine: "Fuzzy Logic & Arithmetic Engine",
    endpoint: "/v1/ims/recommend",
    businessDescription: "Identifies mathematical signatures proving the supplier is a composition dealer legally prohibited from collecting GST.",
    inputFields: [
      { label: "Taxable Value", key: "taxable_value", type: "number", example: 100000, validationRules: "> 0" },
      { label: "CGST Amount", key: "cgst_amount", type: "number", example: 500, validationRules: "= 0.5% or 3%" },
      { label: "SGST Amount", key: "sgst_amount", type: "number", example: 500, validationRules: "= 0.5% or 3%" }
    ],
    goldenBasePayload: {
      client_reference_id: "IMS-TEST-020",
      erp_invoice: {
        invoice_number: "INV-COMP", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 500, sgst_amount: 500, igst_amount: 0,
        total_invoice_value: 101000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-COMP", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 500, sgst_amount: 500, igst_amount: 0,
        total_invoice_value: 101000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    mutationRules: "CGST and SGST equal 0.5% of Taxable Value. Arithmetic signature matches Composition Dealer rules.",
    generatedPayloadExample: {
      client_reference_id: "IMS-TEST-020",
      erp_invoice: {
        invoice_number: "INV-COMP", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 500, sgst_amount: 500, igst_amount: 0,
        total_invoice_value: 101000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      },
      ims_invoice: {
        invoice_number: "INV-COMP", invoice_date: "2026-06-15",
        supplier_gstin: "27AAPFU0939F1ZV", buyer_gstin: "27AAPFU0939F9ZN",
        taxable_value: 100000, cgst_amount: 500, sgst_amount: 500, igst_amount: 0,
        total_invoice_value: 101000, hsn_code: "8471", item_description: "Laptop", place_of_supply: "27"
      }
    },
    expectedVerdict: "REJECT",
    expectedAnomalyCodes: ["POSSIBLE_COMPOSITION_SIGNATURE_1PCT"],
    expectedPlainEnglishResult: "INCONCLUSIVE: Composition scheme — Traders and Manufacturers. Supplier may be prohibited from collecting GST.",
    technicalDetailsOutput: {
      verdict: "PEND",
      match_fields: [{ field_name: "taxable_value", passed: null, note: "INCONCLUSIVE", math_proof: { implied_cgst_pct: 0.5, implied_sgst_pct: 0.5 } }]
    },
    auditReportMapping: {
      experiment: "Composition Dealer Geometry Validation",
      auditFinding: "Prohibited Tax Collection Flag",
      executiveSummaryLanguage: "Invoice exhibits mathematics restricted to composition dealers. Potential illegal tax recovery attempt."
    }
  }
];
