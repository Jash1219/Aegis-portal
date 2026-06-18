import type { ReactNode } from "react";

export type VerdictState = "PASS" | "FAIL" | "INCONCLUSIVE";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "ABSOLUTE";

export interface VerdictHeroCardProps {
  verdict: VerdictState;
  headline: string;
  explanation: string;
}

export interface ValidationFindingCardProps {
  findingTitle: string;
  findingExplanation: string;
}

export interface BusinessImpactCardProps {
  impactStatement: string;
  verdict: VerdictState;
}

export interface RiskClassificationCardProps {
  level: RiskLevel;
  justification: string;
}

export interface InputExplainabilityCardProps {
  title: string;
  definition: string;
  businessContext: string;
  exampleValue: string;
  exampleFailure: string;
  children?: ReactNode;
}

export interface EngineDefinitionCardProps {
  engineName: string;
  purpose: string;
  triggerCondition: string;
}

export interface WhyThisMattersCardProps {
  concept: string;
  businessValue: string;
  riskMitigated: string;
}

export interface RealWorldExampleCardProps {
  scenario: string;
  actorBehavior: string;
  systemResponse: string;
}

export interface ValidationScopeCardProps {
  engineName: string;
  engineDescription: string;
}

export interface RecommendedActionCardProps {
  actionType: string;
  requiredEvidence: string;
}

export interface HowToResolveCardProps {
  resolutionCriteria: string[];
  secondaryProofs: string;
}

export interface MathematicalProofCardProps {
  formula: string;
  variables: Record<string, string>;
  calculatedResult: string;
}

export interface TechnicalEvidenceCardProps {
  telemetryData: string;
  timestamps: string;
  hashes: string;
}

export interface ValidationCoverageCardProps {
  engines: EngineDefinitionCardProps[];
}

export interface FinancialExposureCardProps {
  valueIdentified: string;
  varianceType: string;
}

export interface PredictionCardProps {
  selectedState: VerdictState;
  onSelect: (state: VerdictState) => void;
}

export interface PredictionVsActualCardProps {
  predictedState: VerdictState;
  actualState: VerdictState;
}
