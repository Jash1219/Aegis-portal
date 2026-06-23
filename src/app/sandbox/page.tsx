"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { Play, Loader2, AlertTriangle } from "lucide-react";
import {
  ENGINES,
  EXPERIMENT_REGISTRY,
  getValidationById,
} from "@/config/experimentRegistry";
import { useSandboxReducer } from "@/hooks/useSandboxReducer";
import { translateApiResponse } from "@/utils/responseTranslator";
import { applyMutations } from "@/utils/payloadMutator";
import { simulateApiResponse } from "@/lib/engine/core";
import { isEvidenceSufficient } from "@/lib/engine/evidenceGuard";
import { PredictionCard } from "@/components/explainability/PredictionCard";
import { PredictionVsActualCard } from "@/components/explainability/PredictionVsActualCard";
import { RiskClassificationCard } from "@/components/explainability/RiskClassificationCard";
import { RecommendedActionCard } from "@/components/explainability/RecommendedActionCard";
import { HowToResolveCard } from "@/components/explainability/HowToResolveCard";
import { ValidationScopeCard } from "@/components/explainability/ValidationScopeCard";
import { ValidationFindingCard } from "@/components/explainability/ValidationFindingCard";
import { MathematicalProofCard } from "@/components/explainability/MathematicalProofCard";
import { TechnicalEvidenceCard } from "@/components/explainability/TechnicalEvidenceCard";
import RightPaneEmptyState from "@/components/sandbox/RightPaneEmptyState";
import ExecutiveSummaryPanel from "@/components/sandbox/ExecutiveSummaryPanel";
import JsonPayloadCard from "@/components/sandbox/JsonPayloadCard";
import { BusinessImpactCard } from "@/components/explainability/BusinessImpactCard";
import ModeToggle from "@/components/sandbox/ModeToggle";
import ValidationCoverageMatrix from "@/components/sandbox/ValidationCoverageMatrix";
import ExpertModeNavigation from "@/components/sandbox/ExpertModeNavigation";
import ReplayModeBanner from "@/components/sandbox/ReplayModeBanner";

function buildPayload(
  experiment: typeof EXPERIMENT_REGISTRY[number],
  mutations: Record<string, unknown>,
  customPayload?: Record<string, unknown> | null,
): Record<string, unknown> {
  if (customPayload) return customPayload;
  return applyMutations(experiment.goldenPayload, {}, mutations);
}

function SandboxContent() {
  const {
    state,
    selectExperiment,
    selectValidation,
    setMutation,
    setPrediction,
    runStart,
    runSuccess,
    runError,
    setVisibilityMode,
    setSearchQuery,
  } = useSandboxReducer();

  const [expandedEngineId, setExpandedEngineId] = useState<string | null>(null);

  console.log("[REPLAY DEBUG] === Sandbox State ===");
  console.log("[REPLAY DEBUG] isCustomPayload:", state.isCustomPayload);
  console.log("[REPLAY DEBUG] isCustomPayload type:", typeof state.isCustomPayload);
  console.log("[REPLAY DEBUG] customPayloadData:", state.customPayloadData);
  console.log("[REPLAY DEBUG] replayContext:", state.replayContext);
  console.log("[REPLAY DEBUG] activeValidationId:", state.activeValidationId);
  console.log("[REPLAY DEBUG] activeExperiment.id:", state.activeExperiment.id);
  console.log("[REPLAY DEBUG] activeExperiment.title:", state.activeExperiment.title);
  console.log("[REPLAY DEBUG] replayContext?.validationId:", state.replayContext?.validationId);

  const isLoading = state.status === "LOADING";
  const isExpert = state.visibilityMode === "EXPERT";

  const latestRun =
    state.executionHistory[state.executionHistory.length - 1] ?? null;

  const handleRun = useCallback(async () => {
    const payload = buildPayload(
      state.activeExperiment,
      state.mutations,
      state.customPayloadData,
    );
    console.log("[REPLAY DEBUG] === Execution Run ===");
    console.log("[REPLAY DEBUG] isCustomPayload:", state.isCustomPayload);
    console.log("[REPLAY DEBUG] buildPayload source:", state.customPayloadData ? "customPayloadData" : "registry baseline");
    console.log("[REPLAY DEBUG] payload:", JSON.stringify(payload));

    runStart();
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (state.activeExperiment.lifecycle !== "ACTIVE") {
      const roadmapRaw = { verdict: "INCONCLUSIVE", message: "Validation defined but not yet executable in current engine version." };
      const translated = translateApiResponse(roadmapRaw, state.activeExperiment);
      runSuccess(translated, state.mutations, state.prediction);
      return;
    }

    if (!isEvidenceSufficient(state.activeExperiment, payload)) {
      const skippedRaw = { verdict: "INCONCLUSIVE", message: "Insufficient evidence: missing required fields for this validation." };
      const translated = translateApiResponse(skippedRaw, state.activeExperiment);
      runSuccess(translated, state.mutations, state.prediction);
      return;
    }

    try {
      const raw = simulateApiResponse(state.activeExperiment, payload);
      console.log("[REPLAY DEBUG] raw simulation response:", JSON.stringify(raw));
      const translated = translateApiResponse(raw, state.activeExperiment);
      console.log("[REPLAY DEBUG] translated verdict:", translated.verdict);
      runSuccess(translated, state.mutations, state.prediction);
    } catch (err) {
      runError(
        err instanceof Error ? err.message : "Validation execution failed.",
      );
    }
  }, [state.activeExperiment, state.mutations, state.customPayloadData, state.isCustomPayload, state.prediction, runStart, runSuccess, runError]);

  const payloadJson = useMemo(
    () =>
      JSON.stringify(
        buildPayload(state.activeExperiment, state.mutations, state.customPayloadData),
        null,
        2,
      ),
    [state.activeExperiment, state.mutations, state.customPayloadData],
  );

  const isFailOrInconclusive =
    latestRun &&
    (latestRun.result.verdict === "FAIL" ||
      latestRun.result.verdict === "INCONCLUSIVE");

  const handleValidationSelect = useCallback(
    (validationId: string) => {
      selectValidation(validationId);
    },
    [selectValidation],
  );

  const currentValidation = getValidationById(state.activeExperiment.id);

  const executionControls = (
    <>
      {/* Guided Learning Context */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Context
        </span>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {currentValidation?.purpose ?? state.activeExperiment.purpose}
        </p>
        <div className="bg-[#0a0a0a] border border-[#222222] rounded p-md flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Business Context
          </span>
          <p className="font-body-sm text-body-sm text-on-surface">
            {currentValidation?.businessContext ?? state.activeExperiment.businessContext}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-sm">
          <div className="flex flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-secondary">
              Pass Example
            </span>
            <span className="font-data-mono text-data-mono text-on-surface bg-[#0a0a0a] border border-[#222222] rounded px-sm py-xs">
              {currentValidation?.passExample ?? state.activeExperiment.passExample}
            </span>
          </div>
          <div className="flex flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-error">
              Fail Example
            </span>
            <span className="font-data-mono text-data-mono text-error bg-[#0a0a0a] border border-error/20 rounded px-sm py-xs">
              {currentValidation?.failExample ?? state.activeExperiment.failExample}
            </span>
          </div>
        </div>
        {currentValidation?.detectionDelta && (
          <div className="bg-[#0a0a0a] border border-yellow-500/20 rounded p-md flex flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-yellow-400 uppercase tracking-widest">
              Detection Delta
            </span>
            <span className="font-body-sm text-body-sm text-yellow-400/80">
              {currentValidation.detectionDelta.reasonMissed}
            </span>
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Input Parameters
        </span>
        {state.activeExperiment.mutableFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-xs">
            <label
              htmlFor={field.key}
              className="font-label-caps text-label-caps text-on-surface-variant"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              type={field.type === "number" ? "number" : "text"}
              value={(state.mutations[field.key]?.toString() ?? "")}
              onChange={(e) =>
                setMutation(
                  field.key,
                  field.type === "number"
                    ? e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                    : e.target.value,
                )
              }
              disabled={isLoading}
              placeholder={field.placeholder}
              className="h-10 w-full rounded-lg border border-[#222222] bg-[#0a0a0a] text-primary font-body-sm text-body-sm px-md py-sm outline-none transition-colors focus-visible:border-primary placeholder:text-on-surface-variant/40 disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        ))}
      </div>

      {/* Prediction */}
      <PredictionCard
        selectedState={state.prediction}
        onSelect={setPrediction}
      />

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={isLoading}
        className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-caps text-label-caps flex items-center justify-center gap-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Validation
          </>
        )}
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
          API Sandbox
        </h1>
        <ModeToggle
          mode={state.visibilityMode}
          onChange={setVisibilityMode}
        />
      </div>

      {state.isCustomPayload && (
        <ReplayModeBanner context={state.replayContext} />
      )}

      {/* Validation Coverage Matrix */}
      <ValidationCoverageMatrix
        engines={ENGINES}
        visibilityMode={state.visibilityMode}
        activeValidationId={state.activeValidationId}
        onValidationSelect={handleValidationSelect}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Pane */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-md">
          {isExpert ? (
            <ExpertModeNavigation
              engines={ENGINES}
              activeValidationId={state.activeValidationId}
              searchQuery={state.searchQuery}
              onSearchChange={setSearchQuery}
              onValidationSelect={handleValidationSelect}
              onEngineExpand={setExpandedEngineId}
              expandedEngineId={expandedEngineId}
            />
          ) : (
            <>
              {/* Experiment Selector */}
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
                <label
                  htmlFor="experiment-select"
                  className="font-label-caps text-label-caps text-on-surface-variant"
                >
                  Experiment
                </label>
                <select
                  id="experiment-select"
                  value={state.activeExperiment.id}
                  onChange={(e) => selectExperiment(e.target.value)}
                  disabled={isLoading}
                  className="h-10 w-full rounded-lg border border-[#222222] bg-[#0a0a0a] text-primary font-body-sm text-body-sm px-md py-sm outline-none transition-colors focus-visible:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {EXPERIMENT_REGISTRY.map((exp) => (
                    <option key={exp.id} value={exp.id} className="bg-[#0a0a0a]">
                      {exp.title}
                    </option>
                  ))}
                </select>
              </div>

              {executionControls}
            </>
          )}
        </div>

        {/* Right Pane (unchanged) */}
        <div className="flex-1 flex flex-col gap-md min-w-0">
          {state.isStale && (
            <div className="flex items-center gap-sm px-lg py-md rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
              <span className="font-body-sm text-body-sm text-yellow-400">
                Inputs changed. Run validation again to refresh results.
              </span>
            </div>
          )}

          {state.status === "IDLE" && (isExpert ? (
            <div className="flex flex-col gap-md">{executionControls}</div>
          ) : (
            <RightPaneEmptyState />
          ))}

          {state.status === "LOADING" && (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#111111] border border-[#222222] rounded-lg p-xl">
              <Loader2 className="h-10 w-10 animate-spin text-on-surface-variant mb-md" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Validating against AEGIS deterministic engine...
              </span>
            </div>
          )}

          {state.status === "ERROR" && (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#111111] border border-error/20 rounded-lg p-xl">
              <span className="font-data-mono text-data-mono text-error mb-sm">
                ERROR
              </span>
              <p className="font-body-sm text-body-sm text-error text-center">
                {state.error}
              </p>
            </div>
          )}

          {state.status === "SUCCESS" && latestRun && (
            <div className="flex flex-col gap-md">
              <ExecutiveSummaryPanel data={latestRun.result} />

              <div className="flex items-center gap-3 pt-md">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase shrink-0">
                  Business Analysis
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>

              <BusinessImpactCard
                impactStatement={latestRun.result.impactStatement}
                verdict={latestRun.result.verdict}
              />

              <PredictionVsActualCard
                predictedState={state.prediction}
                actualState={latestRun.result.actualState}
              />

              <RiskClassificationCard
                level={latestRun.result.riskLevel}
                justification={latestRun.result.riskJustification}
              />

              <ValidationFindingCard
                findingTitle={latestRun.result.findingTitle}
                findingExplanation={latestRun.result.findingExplanation}
              />

              <ValidationScopeCard
                engineName={latestRun.result.engineName}
                engineDescription={latestRun.result.engineDescription}
              />

              <RecommendedActionCard
                actionType={latestRun.result.actionType}
                requiredEvidence={latestRun.result.requiredEvidence}
              />

              {isFailOrInconclusive && (
                <HowToResolveCard
                  resolutionCriteria={latestRun.result.resolutionCriteria}
                  secondaryProofs={latestRun.result.secondaryProofs}
                />
              )}

              <div className="flex items-center gap-3 pt-md">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                <span className="font-label-caps text-label-caps text-blue-400 tracking-[0.2em] uppercase shrink-0">
                  Technical Evidence
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              </div>

              <MathematicalProofCard
                formula={latestRun.result.formula}
                variables={latestRun.result.variables}
                calculatedResult={latestRun.result.calculatedResult}
              />

              <TechnicalEvidenceCard
                telemetryData={latestRun.result.telemetryData}
                timestamps={latestRun.result.timestamps}
                hashes={latestRun.result.hashes}
              />

              <JsonPayloadCard label="Request Payload" json={payloadJson} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Loading sandbox...</span>
      </div>
    }>
      <SandboxContent />
    </Suspense>
  );
}
