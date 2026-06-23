"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type {
  SandboxState,
  SandboxAction,
  ExperimentContract,
  PresentationProps,
  ExecutionRun,
  VisibilityMode,
  ReplayContext,
} from "@/types/sandbox";
import type { VerdictState } from "@/types/explainability";
import {
  EXPERIMENT_REGISTRY,
  getExperimentByValidationId,
  getGoldenPathValidation,
} from "@/config/experimentRegistry";

function initMutations(experiment: ExperimentContract): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of experiment.mutableFields) {
    values[field.key] = field.placeholder;
  }
  return values;
}

function getDefaultExperiment(): ExperimentContract {
  const firstEngineGolden = getGoldenPathValidation("TRANSIT_PHYSICS");
  if (firstEngineGolden) {
    const exp = getExperimentByValidationId(firstEngineGolden.id);
    if (exp) return exp;
  }
  return EXPERIMENT_REGISTRY[0];
}

function sandboxReducer(state: SandboxState, action: SandboxAction): SandboxState {
  const logStateChange = (actionType: string, newVid: string | null, newEid: string) => {
    console.log(`[REDUCER TRACE] action=${actionType} old_vid=${state.activeValidationId} new_vid=${newVid} old_eid=${state.activeExperiment.id} new_eid=${newEid}`);
  };
  switch (action.type) {
    case "SELECT_EXPERIMENT":
      logStateChange("SELECT_EXPERIMENT", action.experiment.id, action.experiment.id);
      return {
        ...state,
        activeExperiment: action.experiment,
        mutations: initMutations(action.experiment),
        status: "IDLE",
        isStale: false,
        executionHistory: [],
        error: null,
        prediction: "PASS",
        activeValidationId: action.experiment.id,
        isCustomPayload: false,
        customPayloadData: null,
        replayContext: null,
      };
    case "SET_MUTATION":
      return {
        ...state,
        mutations: { ...state.mutations, [action.key]: action.value },
        isStale: state.status === "SUCCESS" ? true : state.isStale,
      };
    case "SET_PREDICTION":
      return {
        ...state,
        prediction: action.state,
        isStale: state.status === "SUCCESS" ? true : state.isStale,
      };
    case "RUN_START":
      return { ...state, status: "LOADING", error: null, isStale: false };
    case "RUN_SUCCESS": {
      const run: ExecutionRun = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        result: action.result,
        mutations: { ...action.mutations },
        prediction: action.prediction,
      };
      return {
        ...state,
        status: "SUCCESS",
        executionHistory: [...state.executionHistory, run],
        mutations: { ...action.mutations },
      };
    }
    case "RUN_ERROR":
      return { ...state, status: "ERROR", error: action.error };
    case "MARK_STALE":
      return { ...state, isStale: true };
    case "RESET":
      return {
        ...state,
        status: "IDLE",
        isStale: false,
        executionHistory: [],
        error: null,
        isCustomPayload: false,
        customPayloadData: null,
        replayContext: null,
      };
    case "SET_VISIBILITY_MODE": {
      const newMode = action.mode;
      if (newMode === "EXPERT") {
        console.log("[REDUCER TRACE] action=SET_VISIBILITY_MODE(EXPERT) — no state change to activeValidationId/activeExperiment");
        return { ...state, visibilityMode: newMode };
      }
      const exp = getDefaultExperiment();
      const goldenId = exp.id;
      logStateChange("SET_VISIBILITY_MODE(EXECUTIVE)", goldenId, exp.id);
      return {
        ...state,
        visibilityMode: newMode,
        activeExperiment: exp,
        mutations: initMutations(exp),
        status: "IDLE",
        isStale: false,
        executionHistory: [],
        error: null,
        activeValidationId: goldenId,
        isCustomPayload: false,
        customPayloadData: null,
        replayContext: null,
      };
    }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query };
    case "SET_ACTIVE_VALIDATION": {
      logStateChange("SET_ACTIVE_VALIDATION", action.validationId, state.activeExperiment.id);
      if (!action.validationId) return { ...state, activeValidationId: null, isCustomPayload: false, customPayloadData: null, replayContext: null };
      const exp = getExperimentByValidationId(action.validationId);
      if (!exp) return state;
      return {
        ...state,
        activeExperiment: exp,
        mutations: initMutations(exp),
        status: "IDLE",
        isStale: false,
        executionHistory: [],
        error: null,
        activeValidationId: action.validationId,
        isCustomPayload: false,
        customPayloadData: null,
        replayContext: null,
      };
    }
    case "HYDRATE_FROM_URL":
      console.log("[REDUCER TRACE] action=HYDRATE_FROM_URL validationId=" + action.validationId + " experiment.id=" + action.experiment.id + " mode=" + action.mode + " isCustomPayload=" + (action.isCustomPayload ?? false) + " hasReplayContext=" + (!!action.replayContext));
      const hydratedMutations = initMutations(action.experiment);
      if (action.customPayloadData) {
        for (const key of Object.keys(hydratedMutations)) {
          if (action.customPayloadData[key] !== undefined) {
            hydratedMutations[key] = action.customPayloadData[key];
          }
        }
      }
      return {
        ...state,
        activeExperiment: action.experiment,
        mutations: hydratedMutations,
        status: "IDLE",
        isStale: false,
        executionHistory: [],
        error: null,
        prediction: "PASS",
        visibilityMode: action.mode,
        activeValidationId: action.validationId,
        isCustomPayload: action.isCustomPayload ?? false,
        customPayloadData: action.customPayloadData ?? null,
        replayContext: action.replayContext ?? null,
      };
    default:
      return state;
  }
}

export function useSandboxReducer() {
  const searchParams = useSearchParams();
  const defaultExp = getDefaultExperiment();

  const initialState: SandboxState = {
    activeExperiment: defaultExp,
    mutations: initMutations(defaultExp),
    prediction: "PASS" as VerdictState,
    status: "IDLE" as const,
    isStale: false,
    executionHistory: [] as ExecutionRun[],
    error: null as string | null,
    visibilityMode: "EXECUTIVE" as VisibilityMode,
    searchQuery: "",
    activeValidationId: defaultExp.id,
    isCustomPayload: false,
    customPayloadData: null,
    replayContext: null,
  };

  const [state, dispatch] = useReducer(sandboxReducer, initialState);

  const hydratedReplayRef = useRef<string | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const validationIdParam = searchParams.get("validationId");
    const payloadSource = searchParams.get("payloadSource");
    const replayId = searchParams.get("replayId");

    if (payloadSource === "session" && replayId && hydratedReplayRef.current === replayId) {
      return;
    }

    if (modeParam || validationIdParam) {
      const mode: VisibilityMode =
        modeParam === "expert" ? "EXPERT" : "EXECUTIVE";

      let isCustomPayload = false;
      let customPayloadData: Record<string, unknown> | null = null;
      let replayContext: ReplayContext | null = null;

      if (payloadSource === "session" && replayId) {
        let payloadExists = false;
        let contextExists = false;
        let storageValidationId: string | null = null;

        try {
          const payloadRaw = sessionStorage.getItem(`AEGIS_REPLAY_${replayId}`);
          const contextRaw = sessionStorage.getItem(`AEGIS_REPLAY_CONTEXT_${replayId}`);

          payloadExists = !!payloadRaw;
          contextExists = !!contextRaw;

          if (payloadRaw && contextRaw) {
            const parsedPayload = JSON.parse(payloadRaw) as Record<string, unknown>;
            const parsedContext = JSON.parse(contextRaw) as ReplayContext;

            storageValidationId = parsedContext.validationId;

            if (parsedContext.validationId === validationIdParam) {
              isCustomPayload = true;
              customPayloadData = parsedPayload;
              replayContext = parsedContext;
            }
          }
        } catch (e) {
          console.log("[REPLAY DEBUG] Error during parsing:", e);
        }

        console.log("[REPLAY DEBUG] === Session Replay Validation ===");
        console.log("[REPLAY DEBUG] replayId:", replayId);
        console.log("[REPLAY DEBUG] urlValidationId:", validationIdParam);
        console.log("[REPLAY DEBUG] payloadExists:", payloadExists);
        console.log("[REPLAY DEBUG] contextExists:", contextExists);
        console.log("[REPLAY DEBUG] storageValidationId:", storageValidationId);
        console.log("[REPLAY DEBUG] parityResult:", storageValidationId === validationIdParam);

        sessionStorage.removeItem(`AEGIS_REPLAY_${replayId}`);
        sessionStorage.removeItem(`AEGIS_REPLAY_CONTEXT_${replayId}`);

        hydratedReplayRef.current = replayId;

        if (!isCustomPayload) {
          window.alert("Custom replay payload unavailable or mismatched. Default demonstration payload loaded.");
        }
      }

      console.log("[REPLAY DEBUG] Pre-dispatch check — validationIdParam:", validationIdParam, "experimentId:", getExperimentByValidationId(validationIdParam ?? "")?.id, "isCustomPayload:", isCustomPayload, "hasPayload:", !!customPayloadData, "hasContext:", !!replayContext);

      if (validationIdParam) {
        const exp = getExperimentByValidationId(validationIdParam);
        if (exp) {
          dispatch({
            type: "HYDRATE_FROM_URL",
            experiment: exp,
            validationId: validationIdParam,
            mode,
            isCustomPayload,
            customPayloadData,
            replayContext,
          });
          return;
        }
      }
      if (mode === "EXPERT") {
        dispatch({ type: "SET_VISIBILITY_MODE", mode: "EXPERT" });
      }
    }
  }, [searchParams]);

  const selectExperiment = useCallback(
    (id: string) => {
      const exp = EXPERIMENT_REGISTRY.find((e) => e.id === id);
      if (exp) dispatch({ type: "SELECT_EXPERIMENT", experiment: exp });
    },
    [],
  );

  const selectValidation = useCallback(
    (validationId: string) => {
      dispatch({ type: "SET_ACTIVE_VALIDATION", validationId });
    },
    [],
  );

  const setMutation = useCallback((key: string, value: unknown) => {
    dispatch({ type: "SET_MUTATION", key, value });
  }, []);

  const setPrediction = useCallback((s: VerdictState) => {
    dispatch({ type: "SET_PREDICTION", state: s });
  }, []);

  const runStart = useCallback(() => {
    dispatch({ type: "RUN_START" });
  }, []);

  const runSuccess = useCallback(
    (
      result: PresentationProps,
      mutations: Record<string, unknown>,
      prediction: VerdictState,
    ) => {
      dispatch({ type: "RUN_SUCCESS", result, mutations, prediction });
    },
    [],
  );

  const runError = useCallback((error: string) => {
    dispatch({ type: "RUN_ERROR", error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const setVisibilityMode = useCallback((mode: VisibilityMode) => {
    dispatch({ type: "SET_VISIBILITY_MODE", mode });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", query });
  }, []);

  return {
    state,
    selectExperiment,
    selectValidation,
    setMutation,
    setPrediction,
    runStart,
    runSuccess,
    runError,
    reset,
    setVisibilityMode,
    setSearchQuery,
  };
}
