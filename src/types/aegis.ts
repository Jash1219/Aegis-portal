export type Verdict = "PASS" | "FAIL" | "INCONCLUSIVE";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type GovernmentDataSource =
  | "GST_PORTAL"
  | "INCOME_TAX_PORTAL"
  | "MCA"
  | "BANK"
  | "MANUAL_UPLOAD"
  | "ERP"
  | "CREDIT_BUREAU"
  | "PUBLIC_RECORD";

export interface IntelligenceField<T> {
  value: T;
  dataSource: GovernmentDataSource;
  sourceName: string;
  accessMethod: string;
  dataTimestamp: string;
  isStatic?: boolean;
}

export type GovernmentVerificationStatus =
  | "VERIFIED"
  | "NOT_FOUND"
  | "DISCREPANCY"
  | "PENDING"
  | "UNAVAILABLE";

export interface SupplierIntelligence {
  gstin?: IntelligenceField<string>;
  legalName?: IntelligenceField<string>;
  address?: IntelligenceField<string>;
  registrationStatus?: IntelligenceField<string>;
  registrationDate?: IntelligenceField<string>;
}

export interface CheckAnomaly {
  code: string;
  description?: string;
  math_proof?: Record<string, unknown>;
}

export interface CheckResult {
  check_id?: string;
  check_name?: string;
  status?: string;
  severity?: Severity;
  evidence?: Record<string, unknown>;
  anomaly?: CheckAnomaly;
}

export interface PricingTier {
  tier_name: string;
  invoice_face_value_inr: number;
  fee_inr: number;
}

export interface TriangulateResponse {
  verification_id?: string;
  client_reference_id?: string;
  verdict?: Verdict;
  verdict_code?: string;
  anomaly_severity?: Severity;
  severity?: Severity;
  error?: string;
  message?: string;
  field?: string;
  code?: string;
  details?: Array<Record<string, unknown>>;
  checks?: CheckResult[];
  match_fields?: Array<Record<string, unknown>>;
  pricing_tier?: PricingTier;
  status?: string;
  government_verification_status?: GovernmentVerificationStatus;
  supplier_intelligence?: SupplierIntelligence;
}
