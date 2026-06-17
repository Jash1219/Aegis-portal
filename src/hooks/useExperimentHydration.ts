"use client";

import { useReducer, useMemo, useCallback } from "react";
import { EXPERIMENT_MATRIX, type Experiment } from "@/config/experiment-matrix";
import { deepSet } from "@/lib/object-utils";

function initFormValues(experiment: Experiment): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of experiment.inputFields) {
    values[field.key] = field.example;
  }
  return values;
}

function buildHydratedPayload(
  experiment: Experiment,
  formValues: Record<string, unknown>,
): Record<string, unknown> {
  let payload = structuredClone(experiment.goldenBasePayload) as Record<string, unknown>;
  for (const key of Object.keys(formValues)) {
    payload = deepSet(payload, key, formValues[key]);
  }
  return payload;
}

interface FormState {
  experimentId: string;
  values: Record<string, unknown>;
}

type FormAction =
  | { type: "CHANGE_EXPERIMENT"; experimentId: string; initialValues: Record<string, unknown> }
  | { type: "SET_FIELD"; key: string; value: string | number | boolean };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "CHANGE_EXPERIMENT":
      return { experimentId: action.experimentId, values: action.initialValues };
    case "SET_FIELD":
      return { ...state, values: { ...state.values, [action.key]: action.value } };
    default:
      return state;
  }
}

export function useExperimentHydration() {
  const [formState, dispatch] = useReducer(formReducer, {
    experimentId: "EXP_01_GOLDEN_PASS",
    values: initFormValues(EXPERIMENT_MATRIX[0]),
  });

  const activeExperiment = useMemo(
    () =>
      EXPERIMENT_MATRIX.find((exp) => exp.id === formState.experimentId) ??
      EXPERIMENT_MATRIX[0],
    [formState.experimentId],
  );

  const handleExperimentChange = useCallback(
    (experimentId: string) => {
      const experiment =
        EXPERIMENT_MATRIX.find((exp) => exp.id === experimentId) ??
        EXPERIMENT_MATRIX[0];
      dispatch({
        type: "CHANGE_EXPERIMENT",
        experimentId: experiment.id,
        initialValues: initFormValues(experiment),
      });
    },
    [],
  );

  const handleInputChange = useCallback(
    (key: string, value: string | number | boolean) => {
      dispatch({ type: "SET_FIELD", key, value });
    },
    [],
  );

  const hydratedPayload = useMemo(
    () => buildHydratedPayload(activeExperiment, formState.values),
    [activeExperiment, formState.values],
  );

  return {
    activeExperiment,
    formValues: formState.values,
    hydratedPayload,
    handleExperimentChange,
    handleInputChange,
  };
}
