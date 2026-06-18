import type {
  PortfolioDataset,
  PortfolioInvoice,
  PortfolioAnomaly,
  EngineAttribution,
  SupplierConcentration,
} from "@/types/portfolio";

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash >>> 0;
}

function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

const ENGINE_NAMES: Record<string, string> = {
  DUPLICATE_FINANCING: "Deduplication Core",
  TRANSIT_PHYSICS: "Spatiotemporal Physics Engine",
  GST_GEOMETRY: "GSTIN Structural Analyser",
  RATE_MATRIX: "GST Rate Engine",
  HSN_LOGIC: "HSN Semantic Classifier",
};

const BAD_ACTOR_GSTIN = "33ABCD1234E1Z5";

const SUPPLIER_GSTINS = [
  "07AABCU1234E1Z1",
  "24ZZZPD5678E1Z3",
  "33ABCD1234E1Z5",
  "27BBBCK9012E1Z6",
  "06DDDER3456E1Z7",
  "10EEEFS7890E1Z8",
  "19FFFGT1112E1Z9",
  "08GGGHR2223E2Z1",
  "29HHHJK3334E2Z2",
  "14IIIKL4445E2Z3",
  "05JJJMN5556E2Z4",
  "30KKKOP6667E2Z5",
  "03LLLQR7778E2Z6",
  "12MMMST8889E2Z7",
  "09NNNUV9990E2Z8",
];

const BUYER_GSTINS = [
  "99AAABC1111E1Z1",
  "99ZZZPD2222E1Z3",
  "99BBBCK3333E1Z6",
  "99DDDER4444E1Z7",
];

const HSN_CODES = ["8471", "5201", "6109", "8703", "3004", "2106"];

const TRANSPORT_MODES = ["ROAD", "RAIL", "AIR", "SEA"];

const PRODUCT_CATEGORIES: Record<string, string> = {
  "8471": "electronics",
  "5201": "textiles",
  "6109": "apparel",
  "8703": "automotive",
  "3004": "pharmaceuticals",
  "2106": "food_processing",
};

const PRODUCT_DESCRIPTIONS: Record<string, string[]> = {
  electronics: [
    "Computer server equipment",
    "Laptop computers for business use",
    "Electronic circuit boards",
    "Network switching equipment",
  ],
  textiles: [
    "Cotton yarn for textile manufacturing",
    "Polyester fabric rolls",
    "Woven textile material",
    "Industrial thread spools",
  ],
  apparel: [
    "Cotton t-shirts bulk order",
    "Formal shirts for corporate uniform",
    "Garment accessories",
    "Casual wear clothing line",
  ],
  automotive: [
    "Automobile spare parts",
    "Truck tyres and tubes",
    "Vehicle engine components",
    "Tractor accessories",
  ],
  pharmaceuticals: [
    "Pharmaceutical bulk drugs",
    "Antibiotic tablets wholesale",
    "Medical supply capsule packing",
    "Vaccine cold storage units",
  ],
  food_processing: [
    "Edible oil refined 15L cans",
    "Packaged snack foods",
    "Dairy product bulk supply",
    "Sauce and condiment jars",
  ],
};

function generateSupplierGstin(rng: () => number): string {
  return pick(rng, SUPPLIER_GSTINS);
}

function generateBuyerGstin(
  rng: () => number,
  clusterSupplierGstin?: string,
): string {
  if (clusterSupplierGstin === BAD_ACTOR_GSTIN) {
    const buyers = BUYER_GSTINS.filter((b) => b !== "99AAABC1111E1Z1");
    return pick(rng, buyers);
  }
  if (rng() < 0.3) return "99AAABC1111E1Z1";
  return pick(rng, BUYER_GSTINS);
}

function generateInvoiceDate(rng: () => number): string {
  const day = Math.floor(rng() * 90) + 1;
  const d = new Date(2025, 9, 1);
  d.setDate(d.getDate() + day);
  return d.toISOString().split("T")[0];
}

function generateFaceValue(rng: () => number, isFlagged: boolean): number {
  if (isFlagged) {
    const band = rng();
    if (band < 0.3) return Math.floor(rng() * 200000 + 50000);
    if (band < 0.7) return Math.floor(rng() * 800000 + 200000);
    return Math.floor(rng() * 5000000 + 1000000);
  }
  const band = rng();
  if (band < 0.4) return Math.floor(rng() * 100000 + 10000);
  if (band < 0.75) return Math.floor(rng() * 400000 + 100000);
  return Math.floor(rng() * 2000000 + 500000);
}

function determineRiskCategory(
  engineId: string,
): "FRAUD" | "COMPLIANCE" | "FINANCIAL" | "OPERATIONAL" {
  switch (engineId) {
    case "DUPLICATE_FINANCING":
      return "FRAUD";
    case "TRANSIT_PHYSICS":
      return "FRAUD";
    case "GST_GEOMETRY":
      return "COMPLIANCE";
    case "RATE_MATRIX":
      return "FINANCIAL";
    case "HSN_LOGIC":
      return "COMPLIANCE";
    default:
      return "OPERATIONAL";
  }
}

function generateFindingSummary(
  engineId: string,
  severity: string,
  rng: () => number,
): string {
  switch (engineId) {
    case "DUPLICATE_FINANCING": {
      const ref = Math.floor(rng() * 9000 + 1000);
      if (severity === "ABSOLUTE" || severity === "HIGH") {
        return `Duplicate invoice submission detected — IRN hash collision with previously financed entry #INV-${ref}. Same invoice presented to ${Math.floor(rng() * 3 + 2)} different financiers.`;
      }
      return `Invoice number matches previously processed document #INV-${ref}. Beneficiary bank account appears in ${Math.floor(rng() * 2 + 1)} prior claims.`;
    }
    case "TRANSIT_PHYSICS": {
      const speed = Math.floor(rng() * 800 + 200);
      const mode = pick(rng, TRANSPORT_MODES);
      if (severity === "ABSOLUTE" || severity === "HIGH") {
        return `Implied transit speed ${speed} km/h exceeds maximum feasible threshold for ${mode} transport. Route distance / time-window ratio indicates impossible logistics.`;
      }
      return `Declared transit distance ${Math.floor(rng() * 3000 + 500)} km with ${Math.floor(rng() * 12 + 4)}h window produces implausible ${speed} km/h average speed for ${mode} mode.`;
    }
    case "GST_GEOMETRY": {
      const code = Math.floor(rng() * 10 + 40);
      return `GSTIN state code ${code} does not match any valid Indian state code (01-38). Supplier may be registered under incorrect jurisdiction.`;
    }
    case "RATE_MATRIX": {
      const hsn = pick(rng, HSN_CODES);
      const declared = [5, 12, 18, 28][Math.floor(rng() * 4)];
      const expected = [5, 12, 18, 28][Math.floor(rng() * 4)];
      if (declared === expected) {
        return `GST rate ${declared}% for HSN ${hsn} appears mismatched against product category benchmark. Rate applicability requires manual review.`;
      }
      return `Declared GST rate ${declared}% does not match expected rate ${expected}% for HSN code ${hsn} (${PRODUCT_CATEGORIES[hsn] ?? "general"}).`;
    }
    case "HSN_LOGIC": {
      const hsn = pick(rng, HSN_CODES);
      const cat = PRODUCT_CATEGORIES[hsn] ?? "general";
      return `Product description does not semantically match HSN category "${cat}" for code ${hsn}. Classification discrepancy may affect applicable tax rate.`;
    }
    default:
      return "Anomalous pattern detected in invoice validation pipeline.";
  }
}

function generateRecommendedAction(
  engineId: string,
  severity: string,
): string {
  switch (engineId) {
    case "DUPLICATE_FINANCING":
      if (severity === "ABSOLUTE" || severity === "HIGH") {
        return "Freeze all pending payments to this supplier. Escalate to forensic audit team for criminal referral. Block beneficiary bank account immediately.";
      }
      return "Flag supplier for enhanced due diligence. Request original invoice copies and cross-reference with e-way bill portal records.";
    case "TRANSIT_PHYSICS":
      if (severity === "ABSOLUTE" || severity === "HIGH") {
        return "Hold disbursement pending geospatial tracking data verification. Request GPS log data from transporter for the declared route.";
      }
      return "Cross-verify transit distance with geospatial analytics. Request route declaration amendment if discrepancy is data-entry related.";
    case "GST_GEOMETRY":
      return "Validate supplier registered address against GST portal. File correction if state code is erroneous. Notify supplier to amend GST registration if needed.";
    case "RATE_MATRIX":
      return "Cross-reference HSN code with GST council rate schedule. Issue amended invoice if rate mismatch is confirmed. File revised return if already submitted.";
    case "HSN_LOGIC":
      return "Verify product classification against HSN code reference guide. Request supplier to provide technical specification sheet for correct reclassification.";
    default:
      return "Review anomaly details and escalate to appropriate validation team.";
  }
}

function buildRawPayload(
  engineId: string,
  invoice: {
    invoiceNumber: string;
    supplierGstin: string;
    buyerGstin: string;
    invoiceDate: string;
    hsnCode?: string;
    declaredGstRate?: number;
    productDescription?: string;
    declaredDistanceKm?: number;
    transportMode?: string;
    pan?: string;
    ewbGeneratedAt?: string;
  },
  rng: () => number,
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    invoice_number: invoice.invoiceNumber,
    supplier_gstin: invoice.supplierGstin,
    buyer_gstin: invoice.buyerGstin,
    invoice_date: invoice.invoiceDate,
  };

  switch (engineId) {
    case "TRANSIT_PHYSICS": {
      const dist =
        invoice.declaredDistanceKm ?? Math.floor(rng() * 400 + 50);
      const mode = invoice.transportMode ?? "ROAD";
      const ewbDate =
        invoice.ewbGeneratedAt ??
        new Date(
          new Date(invoice.invoiceDate).getTime() - 86400000,
        ).toISOString();
      base.declared_distance_km = dist;
      base.transport_mode_hint = mode;
      base.ewb_generated_at = ewbDate;
      base.ewb_data_override = {
        declared_distance_km: dist + Math.floor(rng() * 100 - 50),
        ewb_generated_at: ewbDate,
      };
      break;
    }
    case "DUPLICATE_FINANCING": {
      base.invoice_number = invoice.invoiceNumber;
      break;
    }
    case "RATE_MATRIX":
    case "HSN_LOGIC": {
      const hsn = invoice.hsnCode ?? "8471";
      base.hsn_code = hsn;
      base.declared_gst_rate = invoice.declaredGstRate ?? 18;
      base.product_description =
        invoice.productDescription ?? "General merchandise";
      break;
    }
    case "GST_GEOMETRY": {
      base.supplier_gstin = invoice.supplierGstin;
      break;
    }
  }

  return base;
}

export function generateMockPortfolio(
  seed: string = "AEGIS_DEMO",
): PortfolioDataset {
  const seedNum = hashSeed(seed);
  const rng = createRng(seedNum);

  const anomalies: PortfolioAnomaly[] = [];
  const flaggedInvoices: PortfolioInvoice[] = [];
  const cleanInvoices: PortfolioInvoice[] = [];
  let flaggedValueTotal = 0;
  let evaluatedValueTotal = 0;

  const engineAnomalyCounts: Record<string, number> = {
    DUPLICATE_FINANCING: 0,
    TRANSIT_PHYSICS: 0,
    GST_GEOMETRY: 0,
    RATE_MATRIX: 0,
    HSN_LOGIC: 0,
  };

  const engineExposureValue: Record<string, number> = {
    DUPLICATE_FINANCING: 0,
    TRANSIT_PHYSICS: 0,
    GST_GEOMETRY: 0,
    RATE_MATRIX: 0,
    HSN_LOGIC: 0,
  };

  const supplierAnomalyCounts: Record<string, number> = {};
  const supplierExposureValue: Record<string, number> = {};

  const DUP_VALIDATION_MAP: Record<number, string> = {
    0: "V-DUP-FIN-001",
    1: "V-DUP-FIN-002",
    2: "V-DUP-FIN-003",
  };

  const TRANSIT_VALIDATION_MAP: Record<number, string> = {
    0: "V-TRANSIT-PHYSICS-001",
    1: "V-TRANSIT-PHYSICS-002",
    2: "V-TRANSIT-PHYSICS-003",
  };

  const GST_VALIDATION_MAP: Record<number, string> = {
    0: "V-GST-GEO-001",
    1: "V-GST-GEO-002",
    2: "V-GST-GEO-003",
  };

  const RATE_VALIDATION_MAP: Record<number, string> = {
    0: "V-RATE-001",
    1: "V-RATE-002",
    2: "V-RATE-003",
  };

  const HSN_VALIDATION_MAP: Record<number, string> = {
    0: "V-HSN-001",
    1: "V-HSN-002",
    2: "V-HSN-003",
  };

  type AnomalyPlan = {
    engineId: string;
    severity: "LOW" | "MODERATE" | "HIGH" | "ABSOLUTE";
    useClusterGstin: boolean;
  };

  const anomalyPlans: AnomalyPlan[] = [
    // DUPLICATE_FINANCING — 17 anomalies (2 ABSOLUTE, 5 HIGH, 7 MODERATE, 3 LOW)
    // First 8 use cluster GSTIN (BAD_ACTOR_GSTIN)
    { engineId: "DUPLICATE_FINANCING", severity: "ABSOLUTE", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "ABSOLUTE", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "HIGH", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "HIGH", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "HIGH", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "LOW", useClusterGstin: true },
    { engineId: "DUPLICATE_FINANCING", severity: "HIGH", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "HIGH", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "MODERATE", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "LOW", useClusterGstin: false },
    { engineId: "DUPLICATE_FINANCING", severity: "LOW", useClusterGstin: false },
    // TRANSIT_PHYSICS — 14 anomalies (2 ABSOLUTE, 4 HIGH, 5 MODERATE, 3 LOW)
    { engineId: "TRANSIT_PHYSICS", severity: "ABSOLUTE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "ABSOLUTE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "HIGH", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "HIGH", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "HIGH", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "HIGH", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "MODERATE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "MODERATE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "MODERATE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "MODERATE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "MODERATE", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "LOW", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "LOW", useClusterGstin: false },
    { engineId: "TRANSIT_PHYSICS", severity: "LOW", useClusterGstin: false },
    // GST_GEOMETRY — 6 anomalies (0 ABSOLUTE, 1 HIGH, 3 MODERATE, 2 LOW)
    { engineId: "GST_GEOMETRY", severity: "HIGH", useClusterGstin: false },
    { engineId: "GST_GEOMETRY", severity: "MODERATE", useClusterGstin: false },
    { engineId: "GST_GEOMETRY", severity: "MODERATE", useClusterGstin: false },
    { engineId: "GST_GEOMETRY", severity: "MODERATE", useClusterGstin: false },
    { engineId: "GST_GEOMETRY", severity: "LOW", useClusterGstin: false },
    { engineId: "GST_GEOMETRY", severity: "LOW", useClusterGstin: false },
    // RATE_MATRIX — 6 anomalies (1 ABSOLUTE, 1 HIGH, 3 MODERATE, 1 LOW)
    { engineId: "RATE_MATRIX", severity: "ABSOLUTE", useClusterGstin: false },
    { engineId: "RATE_MATRIX", severity: "HIGH", useClusterGstin: false },
    { engineId: "RATE_MATRIX", severity: "MODERATE", useClusterGstin: false },
    { engineId: "RATE_MATRIX", severity: "MODERATE", useClusterGstin: false },
    { engineId: "RATE_MATRIX", severity: "MODERATE", useClusterGstin: false },
    { engineId: "RATE_MATRIX", severity: "LOW", useClusterGstin: false },
    // HSN_LOGIC — 5 anomalies (0 ABSOLUTE, 1 HIGH, 2 MODERATE, 2 LOW)
    { engineId: "HSN_LOGIC", severity: "HIGH", useClusterGstin: false },
    { engineId: "HSN_LOGIC", severity: "MODERATE", useClusterGstin: false },
    { engineId: "HSN_LOGIC", severity: "MODERATE", useClusterGstin: false },
    { engineId: "HSN_LOGIC", severity: "LOW", useClusterGstin: false },
    { engineId: "HSN_LOGIC", severity: "LOW", useClusterGstin: false },
  ];

  const dupInvIndex = { val: 0 };
  const transitInvIndex = { val: 0 };
  const gstInvIndex = { val: 0 };
  const rateInvIndex = { val: 0 };
  const hsnInvIndex = { val: 0 };

  for (let i = 0; i < anomalyPlans.length; i++) {
    const plan = anomalyPlans[i];
    const supplierGstin = plan.useClusterGstin
      ? BAD_ACTOR_GSTIN
      : generateSupplierGstin(rng);
    const buyerGstin = generateBuyerGstin(rng, supplierGstin);
    const invoiceDate = generateInvoiceDate(rng);
    const faceValue = generateFaceValue(rng, true);
    const invNum = plan.engineId === "DUPLICATE_FINANCING"
      ? `INV-${String(1000 + i).padStart(4, "0")}-${seed.slice(0, 4).toUpperCase()}-DUP`
      : `INV-${String(1000 + i).padStart(4, "0")}-${seed.slice(0, 4).toUpperCase()}`;
    const invoiceId = `INV-${seed.slice(0, 4).toUpperCase()}-${String(i + 1).padStart(4, "0")}`;

    let validationId: string;
    switch (plan.engineId) {
      case "DUPLICATE_FINANCING": {
        const idx = dupInvIndex.val % 3;
        validationId = DUP_VALIDATION_MAP[idx];
        dupInvIndex.val++;
        break;
      }
      case "TRANSIT_PHYSICS": {
        const idx = transitInvIndex.val % 3;
        validationId = TRANSIT_VALIDATION_MAP[idx];
        transitInvIndex.val++;
        break;
      }
      case "GST_GEOMETRY": {
        const idx = gstInvIndex.val % 3;
        validationId = GST_VALIDATION_MAP[idx];
        gstInvIndex.val++;
        break;
      }
      case "RATE_MATRIX": {
        const idx = rateInvIndex.val % 3;
        validationId = RATE_VALIDATION_MAP[idx];
        rateInvIndex.val++;
        break;
      }
      case "HSN_LOGIC": {
        const idx = hsnInvIndex.val % 3;
        validationId = HSN_VALIDATION_MAP[idx];
        hsnInvIndex.val++;
        break;
      }
      default:
        validationId = "V-DUP-FIN-001";
    }

    const riskCategory = determineRiskCategory(plan.engineId);

    const flaggedValue =
      riskCategory === "FINANCIAL"
        ? Math.round(faceValue * 0.1)
        : faceValue;

    const payloadParams: {
      invoiceNumber: string;
      supplierGstin: string;
      buyerGstin: string;
      invoiceDate: string;
      hsnCode?: string;
      declaredGstRate?: number;
      productDescription?: string;
      declaredDistanceKm?: number;
      transportMode?: string;
      pan?: string;
      ewbGeneratedAt?: string;
    } = {
      invoiceNumber: invNum,
      supplierGstin,
      buyerGstin,
      invoiceDate,
    };

    switch (plan.engineId) {
      case "TRANSIT_PHYSICS":
        payloadParams.declaredDistanceKm = 3200;
        payloadParams.transportMode = "ROAD";
        break;
      case "GST_GEOMETRY":
        payloadParams.supplierGstin = "99" + supplierGstin.substring(2);
        break;
      case "RATE_MATRIX":
        payloadParams.hsnCode = "8471";
        payloadParams.declaredGstRate = 5;
        break;
      case "HSN_LOGIC":
        payloadParams.hsnCode = "8471";
        payloadParams.productDescription = "Cotton textile fabric";
        break;
    }

    const rawPayload = buildRawPayload(plan.engineId, payloadParams, rng);

    const invoice: PortfolioInvoice = {
      id: invoiceId,
      invoiceNumber: invNum,
      supplierGstin,
      buyerGstin,
      invoiceDate,
      faceValueINR: faceValue,
      status: "FLAGGED",
      rawPayload,
    };

    const anomaly: PortfolioAnomaly = {
      id: `ANOM-${seed.slice(0, 4).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      supplierGstin: invoice.supplierGstin,
      invoiceDate: invoice.invoiceDate,
      validationId,
      parentEngineId: plan.engineId,
      riskCategory,
      severity: plan.severity,
      flaggedValueINR: flaggedValue,
      findingSummary: generateFindingSummary(plan.engineId, plan.severity, rng),
      recommendedAction: generateRecommendedAction(plan.engineId, plan.severity),
      replayReady: true,
      rawPayload,
    };

    flaggedInvoices.push(invoice);
    anomalies.push(anomaly);
    flaggedValueTotal += flaggedValue;
    evaluatedValueTotal += faceValue;
    engineAnomalyCounts[plan.engineId]++;
    engineExposureValue[plan.engineId] += faceValue;

    supplierAnomalyCounts[supplierGstin] =
      (supplierAnomalyCounts[supplierGstin] ?? 0) + 1;
    supplierExposureValue[supplierGstin] =
      (supplierExposureValue[supplierGstin] ?? 0) + faceValue;
  }

  for (let i = 0; i < 952; i++) {
    const supplierGstin = generateSupplierGstin(rng);
    const buyerGstin = generateBuyerGstin(rng);
    const invoiceDate = generateInvoiceDate(rng);
    const faceValue = generateFaceValue(rng, false);
    const invNum = `INV-${String(2000 + i).padStart(4, "0")}-${seed.slice(0, 4).toUpperCase()}`;
    const invoiceId = `INV-${seed.slice(0, 4).toUpperCase()}-CLN-${String(i + 1).padStart(4, "0")}`;

    const enginePick = rng();
    let engineId: string;
    if (enginePick < 0.2) engineId = "TRANSIT_PHYSICS";
    else if (enginePick < 0.4) engineId = "DUPLICATE_FINANCING";
    else if (enginePick < 0.55) engineId = "GST_GEOMETRY";
    else if (enginePick < 0.7) engineId = "RATE_MATRIX";
    else if (enginePick < 0.85) engineId = "HSN_LOGIC";
    else engineId = "TRANSIT_PHYSICS";

    const hsn = pick(rng, HSN_CODES);
    const desc = pick(rng, PRODUCT_DESCRIPTIONS[PRODUCT_CATEGORIES[hsn]]);
    const rate = { "8471": 18, "5201": 5, "6109": 12, "8703": 28, "3004": 12, "2106": 18 }[hsn] ?? 18;
    const cleanPayload = buildRawPayload(
      engineId,
      {
        invoiceNumber: invNum,
        supplierGstin,
        buyerGstin,
        invoiceDate,
        hsnCode: hsn,
        declaredGstRate: rate,
        productDescription: desc,
        declaredDistanceKm: Math.floor(rng() * 200 + 10),
        transportMode: pick(rng, TRANSPORT_MODES),
        ewbGeneratedAt: new Date(
          new Date(invoiceDate).getTime() - 86400000 * 2,
        ).toISOString(),
      },
      rng,
    );

    const invoice: PortfolioInvoice = {
      id: invoiceId,
      invoiceNumber: invNum,
      supplierGstin,
      buyerGstin,
      invoiceDate,
      faceValueINR: faceValue,
      status: "CLEAN",
      rawPayload: cleanPayload,
    };

    cleanInvoices.push(invoice);
    evaluatedValueTotal += faceValue;
  }

  const allInvoices = [...flaggedInvoices, ...cleanInvoices];

  const criticalAnomalies = anomalies.filter(
    (a) => a.severity === "ABSOLUTE" || a.severity === "HIGH",
  ).length;

  const methodology = {
    scope: "Deterministic Analysis of 1,000 Q3 FY2025-26 Ledger Entries",
    coverage:
      "Cross-portfolio scan spanning 5 anomaly detection engines: Duplicate Financing, Transit Physics, GST Geometry, Rate Matrix, and HSN Semantic Classification.",
    transactionsEvaluated: 1000,
    classification:
      "Synthetic portfolio generated via AEGIS deterministic engine — 952 clean (compliant) / 48 flagged (anomalous).",
  };

  const metrics = {
    totalInvoices: allInvoices.length,
    evaluatedValueINR: evaluatedValueTotal,
    flaggedInvoices: flaggedInvoices.length,
    flaggedValueINR: flaggedValueTotal,
    criticalAnomalies,
    cleanInvoices: cleanInvoices.length,
  };

  const attribution: EngineAttribution[] = Object.entries(
    ENGINE_NAMES,
  ).map(([engineId, engineName]) => ({
    engineId,
    engineName,
    exposureValueINR: engineExposureValue[engineId] ?? 0,
    anomalyCount: engineAnomalyCounts[engineId] ?? 0,
    percentageOfTotalExposure:
      evaluatedValueTotal > 0
        ? Math.round(
            ((engineExposureValue[engineId] ?? 0) / evaluatedValueTotal) *
              10000,
          ) / 100
        : 0,
  }));

  const supplierConcentration: SupplierConcentration[] = Object.entries(
    supplierAnomalyCounts,
  )
    .filter(([, count]) => count > 0)
    .map(([gstin, count]) => ({
      supplierGstin: gstin,
      anomalyCount: count,
      exposureValueINR: supplierExposureValue[gstin] ?? 0,
      percentageOfTotalExposure:
        evaluatedValueTotal > 0
          ? Math.round(
              ((supplierExposureValue[gstin] ?? 0) / evaluatedValueTotal) *
                10000,
            ) / 100
          : 0,
    }))
    .sort((a, b) => b.anomalyCount - a.anomalyCount);

  return {
    methodology,
    metrics,
    attribution,
    supplierConcentration,
    invoices: [...flaggedInvoices, ...cleanInvoices],
    anomalies,
  };
}
