import type { ExperimentContract } from "@/types/sandbox";

function getPayloadValue(payload: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = payload;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function isEvidenceSufficient(
  experiment: ExperimentContract,
  payload: Record<string, unknown>,
): boolean {
  const evidence = experiment.requiredEvidence;
  if (!evidence || evidence.length === 0) return true;

  for (const key of evidence) {
    const val = getPayloadValue(payload, key);
    if (val === undefined || val === null || val === "") {
      return false;
    }
  }
  return true;
}
