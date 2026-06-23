export interface NormalizedUploadRow {
  id: string;
  invoiceNumber: string;
  supplierGstin: string;
  buyerGstin?: string;
  invoiceDate: string;
  faceValueINR: number;
  taxableValue?: number;
  hsnCode?: string;
  declaredGstRate?: number;
  productDescription?: string;
  transportModeHint?: string;
  declaredDistanceKm?: number;
  ewbGeneratedAt?: string;
  rawPayload: Record<string, unknown>;
}

export interface NormalizationResult {
  rows: NormalizedUploadRow[];
  rejectedCount: number;
  errors: string[];
}

export interface EvalResult {
  rowId: string;
  validationId: string;
  parentEngineId: string;
  verdict: "PASS" | "FAIL";
  anomalySeverity?: "LOW" | "MODERATE" | "HIGH" | "ABSOLUTE";
  message: string;
}

export type UploadMode = "IDLE" | "DEMO" | "CUSTOMER";
export type UploadPhase = "IDLE" | "PARSING" | "EVALUATING" | "BUILDING" | "DONE" | "ERROR";
