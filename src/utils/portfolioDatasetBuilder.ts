"use client";

import type {
  PortfolioDataset,
  PortfolioInvoice,
  PortfolioAnomaly,
  PortfolioMetrics,
  EngineAttribution,
  SupplierConcentration,
  DataQualityTelemetry,
} from "@/types/portfolio";
import type { NormalizedUploadRow, EvalResult } from "@/types/portfolioUpload";

const ENGINE_NAMES: Record<string, string> = {
  TRANSIT_PHYSICS: "Transit Physics Engine",
  DUPLICATE_FINANCING: "Deduplication Core",
  GST_GEOMETRY: "GSTIN Structural Analyser",
  CHRONOLOGY_OVERRIDE: "Temporal Sequence Engine",
  RATE_MATRIX: "GST Rate Engine",
  HSN_LOGIC: "HSN Lexical Distance Engine",
};

const ENGINE_RISK_CATEGORY: Record<
  string,
  "FRAUD" | "COMPLIANCE" | "FINANCIAL" | "OPERATIONAL"
> = {
  TRANSIT_PHYSICS: "FRAUD",
  DUPLICATE_FINANCING: "FRAUD",
  GST_GEOMETRY: "COMPLIANCE",
  CHRONOLOGY_OVERRIDE: "FRAUD",
  RATE_MATRIX: "FINANCIAL",
  HSN_LOGIC: "COMPLIANCE",
};

const SEVERITY_RANK: Record<string, number> = {
  ABSOLUTE: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
};

const RISK_CATEGORY_RANK: Record<string, number> = {
  FRAUD: 4,
  FINANCIAL: 3,
  COMPLIANCE: 2,
  OPERATIONAL: 1,
};

function extractEngineId(validationId: string): string {
  const MAP: Record<string, string> = {
    "TRANSIT-PHYSICS": "TRANSIT_PHYSICS",
    "DUP-FIN": "DUPLICATE_FINANCING",
    "GST-GEO": "GST_GEOMETRY",
    "CHRONO": "CHRONOLOGY_OVERRIDE",
    "RATE": "RATE_MATRIX",
    "HSN": "HSN_LOGIC",
  };
  const withoutV = validationId.replace(/^V-/, "");
  const prefix = withoutV.replace(/-\d{3}$/, "");
  return MAP[prefix] ?? prefix;
}

function generateFindingSummary(engineId: string, message: string): string {
  const engineLabel = ENGINE_NAMES[engineId] ?? engineId;
  return `[${engineLabel}] ${message}`;
}

function generateRecommendedAction(engineId: string, severity: string): string {
  const isHigh = severity === "ABSOLUTE" || severity === "HIGH";
  switch (engineId) {
    case "DUPLICATE_FINANCING":
      return isHigh
        ? "Freeze all pending payments to this supplier. Escalate to forensic audit team for criminal referral. Block beneficiary bank account immediately."
        : "Flag supplier for enhanced due diligence. Request original invoice copies and cross-reference with e-way bill portal records.";
    case "TRANSIT_PHYSICS":
      return isHigh
        ? "Hold disbursement pending geospatial tracking data verification. Request GPS log data from transporter for the declared route."
        : "Cross-verify transit distance with geospatial analytics. Request route declaration amendment if discrepancy is data-entry related.";
    case "GST_GEOMETRY":
      return "Validate supplier registered address against GST portal. File correction if state code is erroneous. Notify supplier to amend GST registration if needed.";
    case "CHRONOLOGY_OVERRIDE":
      return isHigh
        ? "Flag for forensic document examination. Reverse chronology indicates potential fabricated documentation. Hold disbursement."
        : "Request corrected e-way bill or invoice amendment. Verify timeline with supporting documents.";
    case "RATE_MATRIX":
      return "Cross-reference HSN code with GST council rate schedule. Issue amended invoice if rate mismatch is confirmed. File revised return if already submitted.";
    case "HSN_LOGIC":
      return "Verify product classification against HSN code reference guide. Request supplier to provide technical specification sheet for correct reclassification.";
    default:
      return "Review anomaly details and escalate to appropriate validation team.";
  }
}

export function buildPortfolioDataset(
  rows: NormalizedUploadRow[],
  results: EvalResult[],
  dataQuality?: DataQualityTelemetry,
): PortfolioDataset {
  const rowMap = new Map<string, NormalizedUploadRow>();
  for (const row of rows) {
    rowMap.set(row.id, row);
  }

  const rowFailResults = new Map<string, EvalResult[]>();
  for (const r of results) {
    if (r.verdict !== "FAIL") continue;
    const list = rowFailResults.get(r.rowId) ?? [];
    list.push(r);
    rowFailResults.set(r.rowId, list);
  }

  const flaggedRowIds = new Set(rowFailResults.keys());

  const anomalies: PortfolioAnomaly[] = [];
  const flaggedInvoices: PortfolioInvoice[] = [];
  let flaggedValueTotal = 0;
  let evaluatedValueTotal = 0;

  const orderedFlaggedRows = rows.filter((r) => flaggedRowIds.has(r.id));

  for (const row of orderedFlaggedRows) {
    const fails = rowFailResults.get(row.id)!;

    const invoice: PortfolioInvoice = {
      id: `INV-${row.id}`,
      invoiceNumber: row.invoiceNumber,
      supplierGstin: row.supplierGstin,
      buyerGstin: row.buyerGstin,
      invoiceDate: row.invoiceDate,
      faceValueINR: row.faceValueINR,
      status: "FLAGGED",
      rawPayload: row.rawPayload,
    };
    flaggedInvoices.push(invoice);
    flaggedValueTotal += row.faceValueINR;
    evaluatedValueTotal += row.faceValueINR;

    for (const fail of fails) {
      const engineId = extractEngineId(fail.validationId);
      const riskCategory = ENGINE_RISK_CATEGORY[engineId] ?? "OPERATIONAL";
      const severity = fail.anomalySeverity ?? "HIGH";

      anomalies.push({
        id: `ANOM-${row.id}-${fail.validationId}`,
        invoiceId: invoice.id,
        invoiceNumber: row.invoiceNumber,
        supplierGstin: row.supplierGstin,
        invoiceDate: row.invoiceDate,
        validationId: fail.validationId,
        parentEngineId: engineId,
        riskCategory,
        severity,
        flaggedValueINR: 0,
        findingSummary: generateFindingSummary(engineId, fail.message),
        recommendedAction: generateRecommendedAction(engineId, severity),
        replayReady: true,
        rawPayload: row.rawPayload,
      });
    }
  }

  const cleanInvoices: PortfolioInvoice[] = [];
  for (const row of rows) {
    if (flaggedRowIds.has(row.id)) continue;
    cleanInvoices.push({
      id: `INV-${row.id}`,
      invoiceNumber: row.invoiceNumber,
      supplierGstin: row.supplierGstin,
      buyerGstin: row.buyerGstin,
      invoiceDate: row.invoiceDate,
      faceValueINR: row.faceValueINR,
      status: "CLEAN",
      rawPayload: row.rawPayload,
    });
    evaluatedValueTotal += row.faceValueINR;
  }

  const allInvoices = [...flaggedInvoices, ...cleanInvoices];
  const cleanCount = cleanInvoices.length;
  const criticalAnomalies = anomalies.filter(
    (a) => a.severity === "ABSOLUTE" || a.severity === "HIGH",
  ).length;

  const engineIds = Object.keys(ENGINE_NAMES);

  const engineAnomalyCounts: Record<string, number> = {};
  for (const engineId of engineIds) {
    engineAnomalyCounts[engineId] = 0;
  }
  for (const anomaly of anomalies) {
    engineAnomalyCounts[anomaly.parentEngineId] =
      (engineAnomalyCounts[anomaly.parentEngineId] ?? 0) + 1;
  }

  const engineExposureValue: Record<string, number> = {};
  for (const engineId of engineIds) {
    engineExposureValue[engineId] = 0;
  }

  for (const inv of flaggedInvoices) {
    const invAnomalies = anomalies.filter(
      (a) => a.invoiceId === inv.id,
    );
    if (invAnomalies.length === 0) continue;

    const sorted = [...invAnomalies].sort((a, b) => {
      const sevDiff =
        (SEVERITY_RANK[b.severity] ?? 0) -
        (SEVERITY_RANK[a.severity] ?? 0);
      if (sevDiff !== 0) return sevDiff;
      const catDiff =
        (RISK_CATEGORY_RANK[b.riskCategory] ?? 0) -
        (RISK_CATEGORY_RANK[a.riskCategory] ?? 0);
      if (catDiff !== 0) return catDiff;
      return a.parentEngineId.localeCompare(b.parentEngineId);
    });

    const topEngine = sorted[0].parentEngineId;
    engineExposureValue[topEngine] =
      (engineExposureValue[topEngine] ?? 0) + inv.faceValueINR;
  }

  const supplierAnomalyCounts: Record<string, number> = {};
  const supplierExposureValue: Record<string, number> = {};
  for (const anomaly of anomalies) {
    const gstin = anomaly.supplierGstin;
    supplierAnomalyCounts[gstin] =
      (supplierAnomalyCounts[gstin] ?? 0) + 1;
  }
  for (const inv of flaggedInvoices) {
    supplierExposureValue[inv.supplierGstin] =
      (supplierExposureValue[inv.supplierGstin] ?? 0) +
      inv.faceValueINR;
  }

  const totalRows = rows.length;
  const flaggedCount = flaggedInvoices.length;

  const methodology = {
    scope: "Customer-Uploaded Portfolio Analysis via AEGIS Anomaly Detection",
    coverage: `Cross-portfolio scan spanning 6 anomaly detection engines: ${Object.values(ENGINE_NAMES).join(", ")}.`,
    transactionsEvaluated: totalRows,
    classification: `Customer upload — ${cleanCount} clean (compliant) / ${flaggedCount} flagged (anomalous) across ${engineIds.length} engines.`,
  };

  const metrics: PortfolioMetrics = {
    totalInvoices: allInvoices.length,
    evaluatedValueINR: evaluatedValueTotal,
    flaggedInvoices: flaggedInvoices.length,
    flaggedValueINR: flaggedValueTotal,
    criticalAnomalies,
    cleanInvoices: cleanCount,
  };

  const attribution: EngineAttribution[] = engineIds
    .filter((eid) => (engineAnomalyCounts[eid] ?? 0) > 0)
    .map((engineId) => ({
      engineId,
      engineName: ENGINE_NAMES[engineId] ?? engineId,
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
    invoices: allInvoices,
    anomalies,
    ...(dataQuality ? { dataQuality } : {}),
  };
}
