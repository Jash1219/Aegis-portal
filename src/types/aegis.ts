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

export interface OverviewSummary {
  period: string;
  verified_count: number;
  verified_count_delta_pct: number;
  clean_count: number;
  clean_pct: number;
  clean_pct_delta_pct: number;
  manual_review_count: number;
  manual_review_value_inr: number;
  government_enrichment_coverage_pct: number;
  government_verification_status: GovernmentVerificationStatus;
  trend: Array<{
    period: string;
    verified_count: number;
    clean_pct: number;
  }>;
  capital_by_anomaly_type: Record<string, { count: number; value_inr: number }>;
}

export interface ManualReviewItemData {
  verification_id: string;
  invoice_reference_truncated: string | null;
  supplier_gstin_masked: string | null;
  supplier_state: string | null;
  invoice_value_inr: number;
  primary_anomaly_code: string | null;
  all_anomaly_codes: string[] | null;
  days_in_queue: number;
}

export interface PortfolioVerificationRow {
  verification_id: string;
  submitted_at: string;
  invoice_date: string | null;
  supplier_state: string;
  hsn_chapter: string;
  verdict: Verdict;
  anomaly_codes: string[];
  invoice_value_inr: number;
  government_enrichment: string;
}

export interface PortfolioData {
  rows: PortfolioVerificationRow[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface FilingRecord {
  period: string;
  status: string;
  filing_date: string;
}

export interface SupplierVerificationRecord {
  date: string;
  verdict: Verdict;
  anomaly_code: string;
  invoice_value_paise: number;
}

export interface SupplierDetailResponse {
  supplier_intelligence?: SupplierIntelligence;
  government_verification_status?: GovernmentVerificationStatus;
  filing_history?: FilingRecord[];
  verification_history?: SupplierVerificationRecord[];
}

export interface SupplierRow {
  supplier_gstin_masked: string | null;
  supplier_state: string | null;
  verification_count: number;
  total_value_inr: number;
  anomaly_count: number;
  anomaly_rate_pct: number;
  last_verified_at: string | null;
}

export interface VerificationDetailResponse {
  verification_id: string;
  client_reference_id: string;
  verdict: Verdict;
  checks: CheckResult[];
  government_verification_status: GovernmentVerificationStatus;
  supplier_intelligence: SupplierIntelligence;
  created_at: string;
  processing_time_ms?: number;
  evidence_timeline?: {
    schema_validation: string;
    deterministic_rules: string;
    government_verification: string;
    supplier_intelligence: string;
    verdict_assembly: string;
  };
  integrity?: {
    payload_hash: string;
    api_call_summary: string;
    api_version: string;
    schema_version: string;
    engine_version: string;
  };
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
