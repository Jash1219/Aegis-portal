import type {
  EngineDef,
  ValidationDef,
  ExperimentDef,
  ExperimentContract,
} from "@/types/sandbox";

export const SHARED_BASELINE_PAYLOAD: Record<string, unknown> = {
  invoice_number: "INV-SYNTH-BASELINE",
  invoice_face_value_inr: 100000,
  supplier_gstin: "27AAPFU0939F1ZV",
  buyer_gstin: "24AAACC1206D1ZM",
  invoice_date: "2026-06-15",
  taxable_value: 80000,
};

export const ENGINES: EngineDef[] = [
  {
    id: "TRANSIT_PHYSICS",
    engineName: "Spatiotemporal Physics Engine",
    purpose:
      "Validates that declared transport distances are physically achievable within e-way bill validity windows for the specified transport mode.",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
  },
  {
    id: "DUPLICATE_FINANCING",
    engineName: "Deduplication Core",
    purpose:
      "Prevents the same invoice from being financed multiple times by detecting cryptographic hash collisions across the portfolio.",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
  },
  {
    id: "GST_GEOMETRY",
    engineName: "GSTIN Structural Analyser",
    purpose:
      "Validates the structural integrity of GSTINs — state code prefix, PAN pattern, checksum digit, and entity type indicator.",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
  },
  {
    id: "CHRONOLOGY_OVERRIDE",
    engineName: "Temporal Sequence Engine",
    purpose:
      "Verifies that invoice dates correctly precede e-way bill generation timestamps to detect post-dated documentation.",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
  },
  {
    id: "RATE_MATRIX",
    engineName: "GST Rate Engine",
    purpose:
      "Confirms that declared GST rates match statutory rates per the GST council rate matrix for given HSN codes.",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
  },
  {
    id: "HSN_LOGIC",
    engineName: "HSN Semantic Classifier",
    purpose:
      "Evaluates semantic consistency between declared HSN codes and product descriptions using a HSN-product ontology.",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
  },
  {
    id: "SYSTEM_GATEWAY",
    engineName: "System Gateway & Infrastructure",
    purpose:
      "Validates portal connectivity, API response integrity, and infrastructure-level communication with the GST and e-way bill systems.",
    visibilityLevel: "EXPERT_ONLY",
  },
  {
    id: "IDENTITY_ENTITY",
    engineName: "Identity & Entity Verification",
    purpose:
      "Verifies entity-level identity linkages — PAN-GSTIN consistency, director match against DIN, and beneficial ownership structures.",
    visibilityLevel: "EXPERT_ONLY",
  },
];

export const VALIDATIONS: ValidationDef[] = [
  {
    id: "V-TRANSIT-PHYSICS-001",
    name: "Distance vs Speed Feasibility",
    parentEngineId: "TRANSIT_PHYSICS",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
    isGoldenPath: true,
    riskCategory: "FRAUD",
    purpose:
      "Validates that the declared transport distance is physically achievable within the e-way bill validity window for road transport.",
    businessContext:
      "NBFCs finance invoices where goods are claimed to be in transit. If the distance is impossibly large for the valid time window, the shipment is likely fabricated.",
    passExample: "Distance: 450km, EWB validity: 48h, Mode: ROAD — achieves 9.4 km/h average",
    failExample: "Distance: 3200km, EWB validity: 14h, Mode: ROAD — implies 228 km/h",
    detectionDelta: {
      legacySystem: "Standard OCR + Rule-based Ledger Check",
      reasonMissed:
        "Legacy systems verify only document presence and arithmetic consistency. They do not cross-reference distance against temporal validity windows or modal speed limits.",
      evidenceBurden:
        "Requires integration of geospatial route APIs and temporal physics modelling unavailable in standard ERP-ledger stacks.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-TRANSIT-PHYSICS-002",
    name: "Transport Mode Feasibility",
    parentEngineId: "TRANSIT_PHYSICS",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FRAUD",
    purpose:
      "Checks that the declared transport mode is appropriate for the distance and goods type declared on the invoice.",
    businessContext:
      "Certain goods require specific transport modes (e.g., perishables require refrigerated). Mode mismatches indicate data fabrication.",
    passExample: "Distance: 1200km, Mode: TRAIN, Goods: Electronics — appropriate",
    failExample: "Distance: 2500km, Mode: AIR, Goods: Sand — economically implausible",
    detectionDelta: {
      legacySystem: "Manual mode field check",
      reasonMissed:
        "Legacy systems accept whatever transport mode is declared without cross-referencing against distance or goods type.",
      evidenceBurden:
        "Requires a goods-to-mode compatibility matrix and distance-to-mode cost modelling.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-TRANSIT-PHYSICS-003",
    name: "Route Plausibility Analysis",
    parentEngineId: "TRANSIT_PHYSICS",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FRAUD",
    purpose:
      "Validates that the declared route (origin-destination pair) is geographically plausible for the transport mode.",
    businessContext:
      "Fabricated invoices often declare nonsensical routes. Verifying origin-destination pairs against known transport corridors flags anomalies.",
    passExample: "Origin: Mumbai, Destination: Delhi, Mode: ROAD — plausible NH-48 corridor",
    failExample: "Origin: Mumbai, Destination: Chennai via Leh — geographically impossible",
    detectionDelta: {
      legacySystem: "No route validation in standard processing",
      reasonMissed:
        "Legacy invoice processing has no geospatial validation layer. Any origin-destination pair is accepted at face value.",
      evidenceBurden:
        "Requires a geographic information system (GIS) integration and transport corridor database.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-DUP-FIN-001",
    name: "Invoice Number Duplicate Detection",
    parentEngineId: "DUPLICATE_FINANCING",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
    isGoldenPath: true,
    riskCategory: "FRAUD",
    purpose:
      "Detects if an invoice with the same normalized number has been previously submitted for financing.",
    businessContext:
      "A single invoice should only be financed once. Duplicate invoice number submissions indicate attempted double financing.",
    passExample: "Invoice: INV-2026-NEW-001 — never submitted before",
    failExample: "Invoice: INV-2026-DUP-1 — previously submitted by same supplier",
    detectionDelta: {
      legacySystem: "Sequential Invoice Number Check",
      reasonMissed:
        "Legacy deduplication relies on exact invoice number matching. If the supplier resubmits with a different invoice number but identical IRN hash, the duplicate is not detected.",
      evidenceBurden:
        "Requires cryptographic hash indexing of all historical IRNs and invoice payloads, with real-time lookup at submission.",
    },
    severityMapping: { fail: "ABSOLUTE", pass: "LOW" },
  },
  {
    id: "V-DUP-FIN-002",
    name: "Cryptographic IRN Hash Collision",
    parentEngineId: "DUPLICATE_FINANCING",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FRAUD",
    purpose:
      "Detects SHA-256 hash collisions between the current invoice IRN and historical IRNs in the portfolio database.",
    businessContext:
      "Even with different invoice numbers, a supplier may reuse the same IRN. Hash collision detection catches this at the cryptographic level.",
    passExample: "IRN hash: a1b2c3... — no collision in historical DB",
    failExample: "IRN hash: d4e5f6... — matches previously financed invoice INV-2026-PREV-001",
    detectionDelta: {
      legacySystem: "No hash-based deduplication",
      reasonMissed:
        "Standard systems do not compute or store cryptographic hashes of invoice payloads. Duplicates with modified invoice numbers pass through.",
      evidenceBurden:
        "Requires SHA-256 hashing at ingestion, persistent hash store, and O(1) lookup capability.",
    },
    severityMapping: { fail: "ABSOLUTE", pass: "LOW" },
  },
  {
    id: "V-DUP-FIN-003",
    name: "Beneficiary Bank Account Duplicate",
    parentEngineId: "DUPLICATE_FINANCING",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FRAUD",
    purpose:
      "Flags if the same beneficiary bank account has been used across multiple different suppliers, indicating a possible shell entity network.",
    businessContext:
      "Multiple suppliers sharing the same bank account is a red flag for circular financing or shell entity networks.",
    passExample: "Supplier A: Account X, Supplier B: Account Y — independent accounts",
    failExample: "Supplier A, B, C all using Account Z — potential shell network",
    detectionDelta: {
      legacySystem: "No cross-supplier account matching",
      reasonMissed:
        "Legacy systems verify account number format only. Cross-supplier account matching is not performed.",
      evidenceBurden:
        "Requires a graph database or cross-referencing engine that maps beneficiary accounts to supplier entities.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-GST-GEO-001",
    name: "GSTIN State Code Validity",
    parentEngineId: "GST_GEOMETRY",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
    isGoldenPath: true,
    riskCategory: "COMPLIANCE",
    purpose:
      "Validates that the first two digits of the GSTIN (state code) correspond to a Gazette-notified Indian state or union territory code (01–38).",
    businessContext:
      "A malformed GSTIN with an invalid state code indicates either data-entry error or a shell entity. Tax credit cannot be legally claimed.",
    passExample: "GSTIN: 27AAPFU0939F1ZV — state code 27 (Maharashtra) is valid",
    failExample: "GSTIN: 99ABCDE1234F5Z6 — state code 99 does not exist",
    detectionDelta: {
      legacySystem: "GSTIN Format Regex Check",
      reasonMissed:
        "Standard format validation checks the 15-character alphanumeric pattern but does not verify that the state code falls within the Gazette-notified range of 01–38.",
      evidenceBurden:
        "Requires a state-code lookup table integrated at the point of GSTIN entry, with rejection of out-of-range codes.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-GST-GEO-002",
    name: "GSTIN PAN Pattern Verification",
    parentEngineId: "GST_GEOMETRY",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "COMPLIANCE",
    purpose:
      "Verifies that characters 3–12 of the GSTIN follow the PAN card pattern (5 letters, 4 numbers, 1 letter).",
    businessContext:
      "The PAN embedded in the GSTIN must follow the standard PAN structure. Deviations indicate a fabricated GSTIN.",
    passExample: "GSTIN: 27AAPFU0939F1ZV — PAN segment 'AAPFU0939F' matches PAN pattern",
    failExample: "GSTIN: 2712345678934FZ — PAN segment '1234567893' is all numeric, invalid",
    detectionDelta: {
      legacySystem: "Character count only",
      reasonMissed:
        "Legacy systems count 15 characters but do not validate the PAN segment's internal structure (5 letters + 4 digits + 1 letter).",
      evidenceBurden:
        "Requires regex-based PAN segment extraction and validation against Income Tax PAN format rules.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-GST-GEO-003",
    name: "GSTIN Checksum Digit Verification",
    parentEngineId: "GST_GEOMETRY",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "COMPLIANCE",
    purpose:
      "Computes and verifies the 15th character (checksum) of the GSTIN using the government-published verification algorithm.",
    businessContext:
      "A valid checksum mathematically proves the GSTIN is genuine. An invalid checksum indicates a fabricated or mistyped GSTIN.",
    passExample: "GSTIN: 27AAPFU0939F1ZV — checksum 'V' is valid per algorithm",
    failExample: "GSTIN: 27AAPFU0939F1ZA — checksum 'A' fails verification (expected 'V')",
    detectionDelta: {
      legacySystem: "No checksum verification",
      reasonMissed:
        "Standard GSTIN validation does not implement the government's checksum algorithm. Input is accepted as long as it is 15 characters.",
      evidenceBurden:
        "Requires implementation of the GSTIN checksum algorithm as published by the GST Technical Committee.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-CHRONO-001",
    name: "Invoice vs EWB Date Chronology",
    parentEngineId: "CHRONOLOGY_OVERRIDE",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
    isGoldenPath: true,
    riskCategory: "FRAUD",
    purpose:
      "Verifies that the invoice date precedes the e-way bill generation date. Reverse chronology indicates post-dated documentation.",
    businessContext:
      "For a valid financing request, the invoice must be raised before goods are dispatched (EWB generated). Reverse chronology implies fabricated documentation.",
    passExample: "Invoice: 2026-06-10, EWB: 2026-06-12 — invoice precedes dispatch",
    failExample: "Invoice: 2026-06-15, EWB: 2026-06-12 — EWB generated before invoice raised",
    detectionDelta: {
      legacySystem: "Date-field Character Match",
      reasonMissed:
        "Legacy OCR systems extract date strings and verify format validity but do not establish a temporal dependency graph between invoice and EWB.",
      evidenceBurden:
        "Requires cross-document temporal sequence analysis with business-rule understanding of the invoice-to-dispatch lifecycle.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-CHRONO-002",
    name: "EWB vs Delivery Date Chronology",
    parentEngineId: "CHRONOLOGY_OVERRIDE",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FRAUD",
    purpose:
      "Checks that the e-way bill generation date precedes the declared delivery date. Delivery before EWB generation is impossible.",
    businessContext:
      "Goods cannot be delivered before the e-way bill is generated. Violations indicate fabricated delivery receipts.",
    passExample: "EWB: 2026-06-12, Delivery: 2026-06-14 — EWB precedes delivery",
    failExample: "EWB: 2026-06-15, Delivery: 2026-06-13 — delivery precedes EWB",
    detectionDelta: {
      legacySystem: "No cross-document timeline check",
      reasonMissed:
        "Legacy systems process delivery receipts and e-way bills independently without establishing a chronological dependency.",
      evidenceBurden:
        "Requires linked timeline analysis across EWB, delivery receipt, and invoice documents.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-CHRONO-003",
    name: "IRN Generation vs Invoice Date",
    parentEngineId: "CHRONOLOGY_OVERRIDE",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FRAUD",
    purpose:
      "Verifies that the IRN (Invoice Reference Number) generation timestamp is after the invoice date. An IRN cannot exist before the invoice.",
    businessContext:
      "The IRN is generated by the GST portal upon invoice reporting. An IRN timestamp before the invoice date indicates data tampering.",
    passExample: "Invoice: 2026-06-10, IRN: 2026-06-10T15:30:00 — IRN after invoice",
    failExample: "Invoice: 2026-06-15, IRN: 2026-06-12T10:00:00 — IRN predates invoice",
    detectionDelta: {
      legacySystem: "No IRN timestamp validation",
      reasonMissed:
        "Standard processing extracts the IRN but does not compare its timestamp against the invoice date for chronological consistency.",
      evidenceBurden:
        "Requires IRN timestamp extraction from the GST portal response and comparison against the invoice date field.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-RATE-001",
    name: "HSN Rate Matrix Conformance",
    parentEngineId: "RATE_MATRIX",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
    isGoldenPath: true,
    riskCategory: "FINANCIAL",
    purpose:
      "Confirms the declared GST rate matches the statutory rate for the given HSN code under the GST council rate matrix.",
    businessContext:
      "Mismatched rates indicate misclassification to reduce tax liability. NBFCs must flag these as future ITC claims will be incorrect.",
    passExample: "HSN: 8471 (computers) @ 18% GST — matches rate matrix",
    failExample: "HSN: 8471 (computers) @ 5% GST — no slab matches",
    detectionDelta: {
      legacySystem: "Manual HSN Code Verification",
      reasonMissed:
        "Legacy processes rely on self-reported HSN codes without cross-referencing against the GST rate matrix. A manual auditor would need an up-to-date matrix.",
      evidenceBurden:
        "Requires an indexed, version-controlled GST rate matrix database integrated at point of invoice ingestion.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-RATE-002",
    name: "Tax Slab Boundary Test",
    parentEngineId: "RATE_MATRIX",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FINANCIAL",
    purpose:
      "Tests whether the declared taxable value falls suspiciously close to a slab boundary, suggesting intentional under-invoicing to stay within a lower tax bracket.",
    businessContext:
      "Invoice values just below a slab threshold may indicate deliberate under-invoicing to reduce GST liability.",
    passExample: "Taxable value: ₹4,50,000 (slab boundary is ₹5,00,000) — no proximity alert",
    failExample: "Taxable value: ₹4,99,500 (₹500 below ₹5,00,000 slab) — suspicious proximity",
    detectionDelta: {
      legacySystem: "No slab boundary analysis",
      reasonMissed:
        "Standard systems check the declared rate against the HSN but do not analyze the taxable value for proximity to slab boundaries.",
      evidenceBurden:
        "Requires a configurable proximity threshold and slab boundary database indexed by HSN and effective date.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-RATE-003",
    name: "Cess Applicability Check",
    parentEngineId: "RATE_MATRIX",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "FINANCIAL",
    purpose:
      "Verifies that any applicable GST cess (compensation cess) is correctly calculated for the given HSN code under the GST council rules.",
    businessContext:
      "Certain HSN codes (e.g., luxury cars, tobacco) attract additional cess. Missing cess indicates under-calculation of total tax liability.",
    passExample: "HSN: 8703 (motor vehicles) @ 28% + 15% cess — cess correctly applied",
    failExample: "HSN: 8703 (motor vehicles) @ 28% only — cess of 15% missing",
    detectionDelta: {
      legacySystem: "No cess validation",
      reasonMissed:
        "Legacy systems validate the primary GST rate but do not cross-reference cess applicability tables maintained by the GST council.",
      evidenceBurden:
        "Requires a cess applicability matrix indexed by HSN code with effective date ranges.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-HSN-001",
    name: "HSN-Product Description Semantic Match",
    parentEngineId: "HSN_LOGIC",
    visibilityLevel: "EXECUTIVE_AND_EXPERT",
    isGoldenPath: true,
    riskCategory: "COMPLIANCE",
    purpose:
      "Evaluates whether the declared HSN code is semantically consistent with the product description using a HSN-product ontology.",
    businessContext:
      "Misclassified HSN codes evade taxes or claim incorrect ITC. The engine cross-references HSN ranges against product descriptions.",
    passExample: "HSN: 8471, Product: 'Laptop computers' — consistent with electronics",
    failExample: "HSN: 8471, Product: 'Cotton yarn' — mismatch (8471 is electronics)",
    detectionDelta: {
      legacySystem: "Self-declared HSN without verification",
      reasonMissed:
        "Standard invoice processing accepts the supplier-declared HSN code at face value. No semantic cross-reference is performed.",
      evidenceBurden:
        "Requires a trained semantic classifier or HSN-product ontology database.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-HSN-002",
    name: "HSN Industry Category Verification",
    parentEngineId: "HSN_LOGIC",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "COMPLIANCE",
    purpose:
      "Validates that the HSN code falls within the expected industry category based on the supplier's registered business classification.",
    businessContext:
      "A supplier registered as a textile manufacturer declaring HSN codes from the electronics category indicates possible code misclassification.",
    passExample: "Supplier: Textile manufacturer, HSN: 5201 (cotton) — category matches",
    failExample: "Supplier: Textile manufacturer, HSN: 8471 (electronics) — category mismatch",
    detectionDelta: {
      legacySystem: "No supplier-HSN cross-reference",
      reasonMissed:
        "Legacy systems validate HSN format but do not cross-reference the HSN category against the supplier's registered business classification.",
      evidenceBurden:
        "Requires integration with the GST portal's supplier master data to fetch registered business classification.",
    },
    severityMapping: { fail: "MODERATE", pass: "LOW" },
  },
  {
    id: "V-HSN-003",
    name: "HSN Digit Depth Analysis",
    parentEngineId: "HSN_LOGIC",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "COMPLIANCE",
    purpose:
      "Verifies that the HSN code digit depth (4-digit vs 6-digit vs 8-digit) is appropriate for the invoice value and industry.",
    businessContext:
      "Higher-value invoices require more specific (8-digit) HSN codes. Using generic 4-digit codes on high-value invoices may indicate deliberate ambiguity.",
    passExample: "Invoice value: ₹15,00,000, HSN: 84717020 (8-digit) — appropriate depth",
    failExample: "Invoice value: ₹15,00,000, HSN: 8471 (4-digit) — insufficient specificity",
    detectionDelta: {
      legacySystem: "No digit depth analysis",
      reasonMissed:
        "Standard HSN validation accepts any valid HSN format without checking whether the digit depth is appropriate for the invoice value.",
      evidenceBurden:
        "Requires a value-tier-to-HSN-depth mapping table prescribed by the GST council.",
    },
    severityMapping: { fail: "LOW", pass: "LOW" },
  },
  {
    id: "V-GATEWAY-001",
    name: "GST Portal Connectivity & Response Integrity",
    parentEngineId: "SYSTEM_GATEWAY",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "OPERATIONAL",
    purpose:
      "Validates that the system can successfully connect to the GST portal and e-way bill portal, and that API responses are structurally complete.",
    businessContext:
      "Infrastructure-level validation ensures that upstream system availability does not compromise the verification pipeline.",
    passExample: "GST portal: HTTP 200, response time 340ms, schema valid",
    failExample: "GST portal: HTTP 503, timeout after 30s, or malformed response body",
    detectionDelta: {
      legacySystem: "No automated connectivity testing",
      reasonMissed:
        "Legacy systems assume portal availability. Connectivity failures surface only as user-facing errors after manual attempts.",
      evidenceBurden:
        "Requires automated health-check endpoints with configurable retry and timeout policies.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
  {
    id: "V-IDENTITY-001",
    name: "PAN-GSTIN Entity Linkage Verification",
    parentEngineId: "IDENTITY_ENTITY",
    visibilityLevel: "EXPERT_ONLY",
    isGoldenPath: false,
    riskCategory: "OPERATIONAL",
    purpose:
      "Verifies that the PAN embedded in the GSTIN matches the PAN registered with the Income Tax Department for the declared business entity.",
    businessContext:
      "Entity-level identity verification ensures that the entity claiming to be the supplier actually exists and is tax-compliant.",
    passExample: "GSTIN PAN: AAPFU0939F, ITD PAN: AAPFU0939F — match confirmed",
    failExample: "GSTIN PAN: AAPFU0939F, ITD PAN: BBPFU1234K — mismatch, possible identity theft",
    detectionDelta: {
      legacySystem: "No PAN-to-GSTIN cross-verification",
      reasonMissed:
        "Standard systems extract the PAN from GSTIN but do not independently verify it against the Income Tax Department database.",
      evidenceBurden:
        "Requires integration with the Income Tax Department's PAN verification API and entity master database.",
    },
    severityMapping: { fail: "HIGH", pass: "LOW" },
  },
];

export const EXPERIMENTS: ExperimentDef[] = [
  {
    validationId: "V-TRANSIT-PHYSICS-001",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-TRANSIT-001",
      transport_mode_hint: "ROAD",
      ewb_data_override: {
        declared_distance_km: 3200,
        ewb_generated_at: "2026-06-15T10:00:00+05:30",
        ewb_expiry_at: "2026-06-15T23:59:00+05:30",
      },
    },
    mutableFields: [
      { key: "ewb_data_override.declared_distance_km", label: "Declared Distance (km)", type: "number", placeholder: "450" },
      { key: "transport_mode_hint", label: "Transport Mode", type: "string", placeholder: "ROAD" },
    ],
  },
  {
    validationId: "V-TRANSIT-PHYSICS-002",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-TRANSIT-002",
      transport_mode_hint: "AIR",
      ewb_data_override: { declared_distance_km: 2500, ewb_generated_at: "2026-06-15T10:00:00+05:30", ewb_expiry_at: "2026-06-17T23:59:00+05:30" },
    },
    mutableFields: [
      { key: "transport_mode_hint", label: "Transport Mode", type: "string", placeholder: "ROAD" },
    ],
  },
  {
    validationId: "V-TRANSIT-PHYSICS-003",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-TRANSIT-003",
      ewb_data_override: { declared_distance_km: 450, ewb_generated_at: "2026-06-15T10:00:00+05:30", ewb_expiry_at: "2026-06-17T23:59:00+05:30" },
    },
    mutableFields: [
      { key: "ewb_data_override.declared_distance_km", label: "Declared Distance (km)", type: "number", placeholder: "450" },
    ],
  },
  {
    validationId: "V-DUP-FIN-001",
    usesSharedBaseline: true,
    scenarioMutations: { invoice_number: "INV-SYNTH-DUP-001" },
    mutableFields: [
      { key: "invoice_number", label: "Invoice Number", type: "string", placeholder: "INV-2026-DUP-1" },
    ],
  },
  {
    validationId: "V-DUP-FIN-002",
    usesSharedBaseline: true,
    scenarioMutations: { invoice_number: "INV-SYNTH-DUP-002", invoice_face_value_inr: 10000 },
    mutableFields: [
      { key: "invoice_number", label: "Invoice Number", type: "string", placeholder: "INV-2026-NEW-001" },
    ],
  },
  {
    validationId: "V-DUP-FIN-003",
    usesSharedBaseline: true,
    scenarioMutations: { invoice_number: "INV-SYNTH-DUP-003", invoice_face_value_inr: 75000 },
    mutableFields: [
      { key: "invoice_number", label: "Invoice Number", type: "string", placeholder: "INV-2026-NEW-001" },
    ],
  },
  {
    validationId: "V-GST-GEO-001",
    usesSharedBaseline: true,
    scenarioMutations: { invoice_number: "INV-SYNTH-GST-GEO-001", supplier_gstin: "99ABCDE1234F5Z6" },
    mutableFields: [
      { key: "supplier_gstin", label: "Supplier GSTIN", type: "string", placeholder: "27AAPFU0939F1ZV" },
      { key: "buyer_gstin", label: "Buyer GSTIN", type: "string", placeholder: "24AAACC1206D1ZM" },
    ],
  },
  {
    validationId: "V-GST-GEO-002",
    usesSharedBaseline: true,
    scenarioMutations: { invoice_number: "INV-SYNTH-GST-GEO-002", supplier_gstin: "2712345678934FZ" },
    mutableFields: [
      { key: "supplier_gstin", label: "Supplier GSTIN", type: "string", placeholder: "27AAPFU0939F1ZV" },
    ],
  },
  {
    validationId: "V-GST-GEO-003",
    usesSharedBaseline: true,
    scenarioMutations: { invoice_number: "INV-SYNTH-GST-GEO-003", supplier_gstin: "27AAPFU0939F1ZA" },
    mutableFields: [
      { key: "supplier_gstin", label: "Supplier GSTIN", type: "string", placeholder: "27AAPFU0939F1ZV" },
    ],
  },
  {
    validationId: "V-CHRONO-001",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-CHRONO-001",
      invoice_date: "2026-06-15",
      ewb_data_override: { ewb_generated_at: "2026-06-12T10:00:00+05:30" },
    },
    mutableFields: [
      { key: "invoice_date", label: "Invoice Date", type: "string", placeholder: "2026-06-15" },
      { key: "ewb_data_override.ewb_generated_at", label: "EWB Generation Date", type: "string", placeholder: "2026-06-12T10:00:00+05:30" },
    ],
  },
  {
    validationId: "V-CHRONO-002",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-CHRONO-002",
      invoice_date: "2026-06-10",
      ewb_data_override: { ewb_generated_at: "2026-06-15T10:00:00+05:30" },
    },
    mutableFields: [
      { key: "invoice_date", label: "Invoice Date", type: "string", placeholder: "2026-06-10" },
      { key: "ewb_data_override.ewb_generated_at", label: "EWB Generation Date", type: "string", placeholder: "2026-06-15T10:00:00+05:30" },
    ],
  },
  {
    validationId: "V-CHRONO-003",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-CHRONO-003",
      invoice_date: "2026-06-15",
      ewb_data_override: { irn_generated_at: "2026-06-12T10:00:00+05:30" },
    },
    mutableFields: [
      { key: "invoice_date", label: "Invoice Date", type: "string", placeholder: "2026-06-15" },
    ],
  },
  {
    validationId: "V-RATE-001",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-RATE-001",
      invoice_face_value_inr: 300000,
      taxable_value: 250000,
      hsn_code: "8471",
      declared_gst_rate: 5,
    },
    mutableFields: [
      { key: "hsn_code", label: "HSN Code", type: "string", placeholder: "8471" },
      { key: "declared_gst_rate", label: "GST Rate (%)", type: "number", placeholder: "18" },
    ],
  },
  {
    validationId: "V-RATE-002",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-RATE-002",
      invoice_face_value_inr: 499500,
      taxable_value: 499500,
      hsn_code: "8471",
      declared_gst_rate: 18,
    },
    mutableFields: [
      { key: "hsn_code", label: "HSN Code", type: "string", placeholder: "8471" },
      { key: "declared_gst_rate", label: "GST Rate (%)", type: "number", placeholder: "18" },
    ],
  },
  {
    validationId: "V-RATE-003",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-RATE-003",
      invoice_face_value_inr: 800000,
      taxable_value: 700000,
      hsn_code: "8703",
      declared_gst_rate: 28,
    },
    mutableFields: [
      { key: "hsn_code", label: "HSN Code", type: "string", placeholder: "8703" },
      { key: "declared_gst_rate", label: "GST Rate (%)", type: "number", placeholder: "28" },
    ],
  },
  {
    validationId: "V-HSN-001",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-HSN-001",
      invoice_face_value_inr: 250000,
      taxable_value: 200000,
      hsn_code: "8471",
      product_description: "Cotton yarn",
    },
    mutableFields: [
      { key: "hsn_code", label: "HSN Code", type: "string", placeholder: "8471" },
      { key: "product_description", label: "Product Description", type: "string", placeholder: "Laptop computers" },
    ],
  },
  {
    validationId: "V-HSN-002",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-HSN-002",
      hsn_code: "8471",
      product_description: "Cotton fabric",
    },
    mutableFields: [
      { key: "hsn_code", label: "HSN Code", type: "string", placeholder: "8471" },
      { key: "product_description", label: "Product Description", type: "string", placeholder: "Cotton fabric" },
    ],
  },
  {
    validationId: "V-HSN-003",
    usesSharedBaseline: true,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-HSN-003",
      invoice_face_value_inr: 1500000,
      taxable_value: 1200000,
      hsn_code: "8471",
      product_description: "Computer servers",
    },
    mutableFields: [
      { key: "hsn_code", label: "HSN Code", type: "string", placeholder: "84717020" },
    ],
  },
  {
    validationId: "V-GATEWAY-001",
    usesSharedBaseline: false,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-GATEWAY-001",
      portal_endpoint: "gst_portal_health",
      expected_status: 200,
    },
    mutableFields: [
      { key: "portal_endpoint", label: "Portal Endpoint", type: "string", placeholder: "gst_portal_health" },
    ],
  },
  {
    validationId: "V-IDENTITY-001",
    usesSharedBaseline: false,
    scenarioMutations: {
      invoice_number: "INV-SYNTH-IDENTITY-001",
      supplier_gstin: "27AAPFU0939F1ZV",
      declared_pan: "BBPFU1234K",
    },
    mutableFields: [
      { key: "supplier_gstin", label: "Supplier GSTIN", type: "string", placeholder: "27AAPFU0939F1ZV" },
      { key: "declared_pan", label: "Declared PAN", type: "string", placeholder: "AAPFU0939F" },
    ],
  },
];

const VALIDATION_TO_ENGINE: Record<string, EngineDef> = {};
for (const engine of ENGINES) {
  for (const validation of VALIDATIONS) {
    if (validation.parentEngineId === engine.id) {
      VALIDATION_TO_ENGINE[validation.id] = engine;
    }
  }
}

const VALIDATION_TO_DEF: Record<string, ValidationDef> = {};
for (const v of VALIDATIONS) {
  VALIDATION_TO_DEF[v.id] = v;
}

const EXPERIMENT_TO_DEF: Record<string, ExperimentDef> = {};
for (const e of EXPERIMENTS) {
  EXPERIMENT_TO_DEF[e.validationId] = e;
}

function compilePayload(validationId: string): Record<string, unknown> {
  const exp = EXPERIMENT_TO_DEF[validationId];
  if (!exp) return { ...SHARED_BASELINE_PAYLOAD };
  if (!exp.usesSharedBaseline) return { ...exp.scenarioMutations };
  return { ...SHARED_BASELINE_PAYLOAD, ...exp.scenarioMutations };
}

export function getEngineByValidationId(validationId: string): EngineDef | undefined {
  return VALIDATION_TO_ENGINE[validationId];
}

export function getValidationById(validationId: string): ValidationDef | undefined {
  return VALIDATION_TO_DEF[validationId];
}

export function getValidationsByEngineId(engineId: string): ValidationDef[] {
  return VALIDATIONS.filter((v) => v.parentEngineId === engineId);
}

export function getGoldenPathValidation(engineId: string): ValidationDef | undefined {
  return VALIDATIONS.find((v) => v.parentEngineId === engineId && v.isGoldenPath);
}

const EVIDENCE_REQUIREMENTS: Record<string, string[]> = {
  TRANSIT_PHYSICS: ["declared_distance_km"],
  DUPLICATE_FINANCING: ["invoice_number"],
  GST_GEOMETRY: ["supplier_gstin"],
  CHRONOLOGY_OVERRIDE: ["ewb_generated_at"],
  RATE_MATRIX: ["hsn_code", "declared_gst_rate"],
  HSN_LOGIC: ["hsn_code", "product_description"],
};

function getRequiredEvidence(validationId: string): string[] | undefined {
  const engine = getEngineByValidationId(validationId);
  if (!engine) return undefined;
  return EVIDENCE_REQUIREMENTS[engine.id];
}

function makeExperimentContract(validationId: string): ExperimentContract {
  const validation = VALIDATION_TO_DEF[validationId];
  const engine = VALIDATION_TO_ENGINE[validationId];
  const experiment = EXPERIMENT_TO_DEF[validationId];
  if (!validation || !engine || !experiment) {
    throw new Error(`Missing registry definition for validation: ${validationId}`);
  }
  return {
    id: validation.id,
    title: validation.name,
    engineName: engine.engineName,
    purpose: validation.purpose,
    businessContext: validation.businessContext,
    passExample: validation.passExample,
    failExample: validation.failExample,
    goldenPayload: compilePayload(validationId),
    mutableFields: experiment.mutableFields,
    requiredEvidence: getRequiredEvidence(validationId),
  };
}

export const EXPERIMENT_REGISTRY: ExperimentContract[] = EXPERIMENTS.map((e) =>
  makeExperimentContract(e.validationId),
);

export function getExperimentByValidationId(validationId: string): ExperimentContract | undefined {
  return EXPERIMENT_REGISTRY.find((e) => e.id === validationId);
}
