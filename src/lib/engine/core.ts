import type { ExperimentContract } from "@/types/sandbox";

export function simulateApiResponse(
  experiment: ExperimentContract,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = payload as any;

  if (experiment.id.startsWith("V-TRANSIT-PHYSICS")) {
    const distance = p?.ewb_data_override?.declared_distance_km ?? p.declared_distance_km;
    const mode = p.transport_mode_hint;
    if (distance === undefined || distance === null || distance === "") {
      return {
        verdict: "FAIL",
        anomaly_severity: "MODERATE",
        message: "No declared distance provided for transit physics validation.",
        checks: [{ check_id: experiment.id, anomaly: { code: "MISSING_DISTANCE", description: "Declared distance is required for speed feasibility check.", math_proof: { distance_km: distance, status: "MISSING" } } }],
      };
    }
    if (Number(distance) > 500) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: `Implied speed of ${(Number(distance) / 10).toFixed(1)} km/h is unrealistic for mode ${mode}.`,
        checks: [{ check_id: experiment.id, anomaly: { code: "UNREALISTICALLY_FAST", description: `Distance ${distance}km exceeds plausible range.`, math_proof: { distance_km: distance, validity_hours: 10, implied_speed_kmh: Number(distance) / 10 } } }],
      };
    }
    return {
      verdict: "PASS",
      message: "Transit physics validated.",
      checks: [{ check_id: experiment.id, anomaly: { code: "PHYSICS_CLEARED", math_proof: { distance_km: distance, status: "ACHIEVABLE" } } }],
    };
  }

  if (experiment.id.startsWith("V-DUP-FIN")) {
    const invoiceNum = p.invoice_number ?? "";
    if (invoiceNum.includes("DUP") || invoiceNum.includes("dup")) {
      return {
        verdict: "FAIL",
        anomaly_severity: "CRITICAL",
        message: "Invoice matches previously financed record. Duplicate financing blocked.",
        checks: [{ check_id: experiment.id, anomaly: { code: "DUPLICATE_INVOICE_NUMBER_SUBMISSION", description: "Cryptographic hash collision detected.", math_proof: { hash_algorithm: "SHA-256", match_found: true } } }],
      };
    }
    return {
      verdict: "PASS",
      message: "No duplicate detected.",
      checks: [{ check_id: experiment.id, anomaly: { code: "NO_DUPLICATE", math_proof: { hash_algorithm: "SHA-256", match_found: false } } }],
    };
  }

  if (experiment.id.startsWith("V-GST-GEO")) {
    const gstin = p.supplier_gstin ?? "";
    const stateCode = parseInt(gstin.substring(0, 2), 10);
    const validCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
    if (!validCodes.includes(stateCode)) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: `State code ${stateCode} in GSTIN is invalid.`,
        checks: [{ check_id: experiment.id, anomaly: { code: "INVALID_STATE_CODE", description: `GSTIN state code ${stateCode} out of valid range.`, math_proof: { gstin: gstin, state_code: stateCode, valid_range: "01-38" } } }],
      };
    }
    return {
      verdict: "PASS",
      message: "GSTIN geometry validated.",
      checks: [{ check_id: experiment.id, anomaly: { code: "GSTIN_VALID", math_proof: { gstin: gstin, state_code: stateCode, status: "VALID" } } }],
    };
  }

  if (experiment.id.startsWith("V-CHRONO")) {
    const invDate = new Date(p.invoice_date);
    const ewbRaw = p?.ewb_data_override?.ewb_generated_at ?? p.ewb_generated_at;
    const ewbDate = new Date(ewbRaw);
    if (isNaN(invDate.getTime())) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: "Invalid invoice date provided for chronology validation.",
        checks: [{ check_id: experiment.id, anomaly: { code: "INVALID_INVOICE_DATE", description: "Invoice date is missing or malformed.", math_proof: { invoice_date: p.invoice_date, status: "INVALID" } } }],
      };
    }
    if (isNaN(ewbDate.getTime())) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: "Invalid e-way bill date provided for chronology validation.",
        checks: [{ check_id: experiment.id, anomaly: { code: "INVALID_EWB_DATE", description: "EWB generation date is missing or malformed.", math_proof: { ewb_generated_at: ewbRaw, status: "INVALID" } } }],
      };
    }
    if (ewbDate < invDate) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: "Reverse chronology: EWB generated before invoice raised.",
        checks: [{ check_id: experiment.id, anomaly: { code: "REVERSE_CHRONOLOGY", description: "EWB predates invoice.", math_proof: { invoice_date: invDate.toISOString().split("T")[0], ewb_generated_at: ewbDate.toISOString().split("T")[0] } } }],
      };
    }
    return {
      verdict: "PASS",
      message: "Chronology verified.",
      checks: [{ check_id: experiment.id, anomaly: { code: "CHRONOLOGY_CLEAR", math_proof: { invoice_date: invDate.toISOString().split("T")[0], ewb_generated_at: ewbDate.toISOString().split("T")[0] } } }],
    };
  }

  if (experiment.id.startsWith("V-RATE")) {
    const hsn = p.hsn_code;
    const declaredRate = Number(p.declared_gst_rate);
    const matrix: Record<string, number> = { "8471": 18, "5201": 5, "6109": 12, "8703": 28, "3004": 12, "2106": 18 };
    if (hsn === undefined || hsn === null || hsn === "") {
      return {
        verdict: "FAIL",
        anomaly_severity: "MODERATE",
        message: "No HSN code provided for rate validation.",
        checks: [{ check_id: experiment.id, anomaly: { code: "MISSING_HSN_CODE", description: "HSN code is required for rate matrix lookup.", math_proof: { hsn_code: hsn, status: "MISSING" } } }],
      };
    }
    if (!(hsn in matrix)) {
      return {
        verdict: "FAIL",
        anomaly_severity: "MODERATE",
        message: `HSN code ${hsn} not found in rate matrix. Unrecognized product classification.`,
        checks: [{ check_id: experiment.id, anomaly: { code: "UNRECOGNIZED_HSN_CODE", description: `HSN ${hsn} does not exist in the GST rate matrix.`, math_proof: { hsn_code: hsn, status: "UNRECOGNIZED" } } }],
      };
    }
    const expectedRate = matrix[hsn]!;
    if (declaredRate !== expectedRate) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: `Rate ${declaredRate}% does not match expected ${expectedRate}% for HSN ${hsn}.`,
        checks: [{ check_id: experiment.id, anomaly: { code: "RATE_MISMATCH", description: `Expected ${expectedRate}%, got ${declaredRate}%.`, math_proof: { hsn_code: hsn, declared_rate: declaredRate, expected_rate: expectedRate } } }],
      };
    }
    return {
      verdict: "PASS",
      message: `Rate ${declaredRate}% matches HSN ${hsn}.`,
      checks: [{ check_id: experiment.id, anomaly: { code: "RATE_MATCH", math_proof: { hsn_code: hsn, declared_rate: declaredRate, expected_rate: expectedRate } } }],
    };
  }

  if (experiment.id.startsWith("V-HSN")) {
    const hsn = p.hsn_code;
    const desc = (p.product_description ?? "").toLowerCase();
    if (!hsn) {
      return {
        verdict: "FAIL",
        anomaly_severity: "MODERATE",
        message: "No HSN code provided for semantic classification.",
        checks: [{ check_id: experiment.id, anomaly: { code: "MISSING_HSN_CODE", description: "HSN code required for product classification.", math_proof: { hsn_code: hsn, status: "MISSING" } } }],
      };
    }
    if (!desc) {
      return {
        verdict: "FAIL",
        anomaly_severity: "MODERATE",
        message: "No product description provided for semantic classification.",
        checks: [{ check_id: experiment.id, anomaly: { code: "MISSING_DESCRIPTION", description: "Product description required for HSN matching.", math_proof: { hsn_code: hsn, status: "MISSING_DESCRIPTION" } } }],
      };
    }
    const cats: Record<string, string> = { "8471": "electronics", "5201": "textiles", "6109": "apparel", "8703": "automotive", "3004": "pharmaceuticals", "2106": "food_processing" };
    const cat = cats[hsn] ?? "general";
    const kws: Record<string, string[]> = { electronics: ["computer", "laptop", "electronic", "circuit", "chip", "monitor", "printer"], textiles: ["cotton", "yarn", "fabric", "thread", "textile", "wool"], apparel: ["shirt", "garment", "apparel", "clothing", "dress", "t-shirt"], automotive: ["car", "vehicle", "auto", "motor", "truck", "tractor"], pharmaceuticals: ["medicine", "drug", "pharma", "tablet", "capsule", "vaccine"], food_processing: ["food", "beverage", "snack", "oil", "dairy", "sauce"] };
    const match = (kws[cat] ?? ["generic"]).some((kw) => desc.includes(kw));
    if (!match) {
      return {
        verdict: "FAIL",
        anomaly_severity: "MODERATE",
        message: `Description does not match category "${cat}" for HSN ${hsn}.`,
        checks: [{ check_id: experiment.id, anomaly: { code: "HSN_CATEGORY_MISMATCH", description: `Expected category "${cat}" for HSN ${hsn}.`, math_proof: { hsn_code: hsn, expected_category: cat, match_found: false } } }],
      };
    }
    return {
      verdict: "PASS",
      message: `HSN ${hsn} matches product description.`,
      checks: [{ check_id: experiment.id, anomaly: { code: "HSN_MATCH", math_proof: { hsn_code: hsn, expected_category: cat, match_found: true } } }],
    };
  }

  if (experiment.id === "V-GATEWAY-001") {
    return {
      verdict: "PASS",
      message: "Gateway connectivity verified.",
      checks: [{ check_id: experiment.id, anomaly: { code: "GATEWAY_ACTIVE", math_proof: { portal: p.portal_endpoint, status: "reachable" } } }],
    };
  }

  if (experiment.id === "V-IDENTITY-001") {
    const gstinPan = (p.supplier_gstin ?? "").substring(2, 12);
    const declaredPan = p.declared_pan ?? "";
    if (gstinPan !== declaredPan) {
      return {
        verdict: "FAIL",
        anomaly_severity: "HIGH",
        message: "PAN embedded in GSTIN does not match declared PAN.",
        checks: [{ check_id: experiment.id, anomaly: { code: "PAN_MISMATCH", description: `GSTIN-embedded PAN "${gstinPan}" differs from declared PAN "${declaredPan}".`, math_proof: { gstin_pan: gstinPan, declared_pan: declaredPan, match: false } } }],
      };
    }
    return {
      verdict: "PASS",
      message: "PAN-GSTIN linkage verified.",
      checks: [{ check_id: experiment.id, anomaly: { code: "PAN_MATCH", math_proof: { gstin_pan: gstinPan, declared_pan: declaredPan, match: true } } }],
    };
  }

  return { verdict: "PASS", message: "Validation completed." };
}
