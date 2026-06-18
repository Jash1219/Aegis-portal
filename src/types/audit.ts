import type { RiskLevel } from "./explainability";

export interface DetectionDelta {
  legacySystem: string;
  reasonMissed: string;
  evidenceBurden: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  associatedValueINR: number;
  detectionDelta: DetectionDelta;
  businessImpact: string;
  recommendedAction: string;
  requiredEvidence: string;
  engineName: string;
  findingExplanation: string;
}

export interface Methodology {
  scope: string;
  coverage: string;
  period: string;
  sampleSize: number;
}

export interface Attribution {
  primaryEngineTrigger: string;
  concentrationInsight: string;
}

export interface PortfolioMetrics {
  totalInvoicesReviewed: number;
  totalFaceValueINR: number;
  totalAnomaliesDetected: number;
  totalCapitalAtRiskINR: number;
  enginesDeployed: number;
}

export interface HistoricalAuditReport {
  reportId: string;
  classification: string;
  generatedAt: string;
  disclaimer: string;
  methodology: Methodology;
  attribution: Attribution;
  portfolioMetrics: PortfolioMetrics;
  findings: AuditFinding[];
}
