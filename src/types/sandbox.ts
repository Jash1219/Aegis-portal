import type { VerdictState, RiskLevel } from "./explainability";

export type VisibilityLevel = "EXECUTIVE_AND_EXPERT" | "EXPERT_ONLY";
export type RiskCategory = "FRAUD" | "COMPLIANCE" | "FINANCIAL" | "OPERATIONAL";
export type VisibilityMode = "EXECUTIVE" | "EXPERT";

export interface MutableField {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "array";
  placeholder: string;
}

export interface EngineDef {
  id: string;
  engineName: string;
  purpose: string;
  visibilityLevel: VisibilityLevel;
}

export interface SeverityMapping {
  fail: RiskLevel;
  pass: RiskLevel;
}

export interface DetectionDelta {
  legacySystem: string;
  reasonMissed: string;
  evidenceBurden: string;
}

export interface ValidationDef {
  id: string;
  name: string;
  parentEngineId: string;
  visibilityLevel: VisibilityLevel;
  isGoldenPath: boolean;
  riskCategory: RiskCategory;
  purpose: string;
  businessContext: string;
  passExample: string;
  failExample: string;
  detectionDelta: DetectionDelta;
  severityMapping: SeverityMapping;
}

export type ExperimentLifecycle = "ACTIVE" | "ROADMAP";

export interface ExperimentDef {
  validationId: string;
  usesSharedBaseline: boolean;
  scenarioMutations: Record<string, unknown>;
  mutableFields: MutableField[];
  lifecycle: ExperimentLifecycle;
}

export interface ExperimentContract {
  id: string;
  title: string;
  engineName: string;
  purpose: string;
  businessContext: string;
  passExample: string;
  failExample: string;
  goldenPayload: Record<string, unknown>;
  mutableFields: MutableField[];
  requiredEvidence?: string[];
  lifecycle: ExperimentLifecycle;
}

export interface ExecutionRun {
  id: string;
  timestamp: string;
  result: PresentationProps;
  mutations: Record<string, unknown>;
  prediction: VerdictState;
}

export type SandboxStatus = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

export interface ReplayContext {
  anomalyId: string;
  invoiceNumber: string;
  supplierGstin: string;
  validationId: string;
  replayTimestamp: string;
}

export interface SandboxState {
  activeExperiment: ExperimentContract;
  mutations: Record<string, unknown>;
  prediction: VerdictState;
  status: SandboxStatus;
  isStale: boolean;
  executionHistory: ExecutionRun[];
  error: string | null;
  visibilityMode: VisibilityMode;
  searchQuery: string;
  activeValidationId: string | null;
  isCustomPayload: boolean;
  customPayloadData: Record<string, unknown> | null;
  replayContext: ReplayContext | null;
}

export interface PresentationProps {
  verdict: VerdictState;
  headline: string;
  explanation: string;
  riskLevel: RiskLevel;
  riskJustification: string;
  impactStatement: string;
  engineName: string;
  engineDescription: string;
  findingTitle: string;
  findingExplanation: string;
  actionType: string;
  requiredEvidence: string;
  resolutionCriteria: string[];
  secondaryProofs: string;
  formula: string;
  variables: Record<string, string>;
  calculatedResult: string;
  telemetryData: string;
  timestamps: string;
  hashes: string;
  predictedState: VerdictState;
  actualState: VerdictState;
}

export type SandboxAction =
  | { type: "SELECT_EXPERIMENT"; experiment: ExperimentContract }
  | { type: "SET_MUTATION"; key: string; value: unknown }
  | { type: "SET_PREDICTION"; state: VerdictState }
  | { type: "RUN_START" }
  | { type: "RUN_SUCCESS"; result: PresentationProps; mutations: Record<string, unknown>; prediction: VerdictState }
  | { type: "RUN_ERROR"; error: string }
  | { type: "MARK_STALE" }
  | { type: "RESET" }
  | { type: "SET_VISIBILITY_MODE"; mode: VisibilityMode }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SET_ACTIVE_VALIDATION"; validationId: string | null }
  | { type: "HYDRATE_FROM_URL"; experiment: ExperimentContract; validationId: string | null; mode: VisibilityMode; isCustomPayload?: boolean; customPayloadData?: Record<string, unknown> | null; replayContext?: ReplayContext | null };
