export type InvoiceStatus = "CLEAN" | "FLAGGED";

export interface PortfolioInvoice {
  id: string;
  invoiceNumber: string;
  supplierGstin: string;
  buyerGstin: string;
  invoiceDate: string;
  faceValueINR: number;
  status: InvoiceStatus;
  rawPayload: Record<string, unknown>;
}

export interface PortfolioAnomaly {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  supplierGstin: string;
  invoiceDate: string;
  validationId: string;
  parentEngineId: string;
  riskCategory: "FRAUD" | "COMPLIANCE" | "FINANCIAL" | "OPERATIONAL";
  severity: "LOW" | "MODERATE" | "HIGH" | "ABSOLUTE";
  flaggedValueINR: number;
  findingSummary: string;
  recommendedAction: string;
  replayReady: boolean;
  rawPayload: Record<string, unknown>;
}

export interface PortfolioMetrics {
  totalInvoices: number;
  evaluatedValueINR: number;
  flaggedInvoices: number;
  flaggedValueINR: number;
  criticalAnomalies: number;
  cleanInvoices: number;
}

export interface EngineAttribution {
  engineId: string;
  engineName: string;
  exposureValueINR: number;
  anomalyCount: number;
  percentageOfTotalExposure: number;
}

export interface SupplierConcentration {
  supplierGstin: string;
  anomalyCount: number;
  exposureValueINR: number;
  percentageOfTotalExposure: number;
}

export interface PortfolioDataset {
  methodology: {
    scope: string;
    coverage: string;
    transactionsEvaluated: number;
    classification: string;
  };
  metrics: PortfolioMetrics;
  attribution: EngineAttribution[];
  supplierConcentration: SupplierConcentration[];
  invoices: PortfolioInvoice[];
  anomalies: PortfolioAnomaly[];
}
