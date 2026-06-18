import type { ExperimentContract, PresentationProps } from "@/types/sandbox";
import type { VerdictState, RiskLevel } from "@/types/explainability";

function inferVerdict(raw: Record<string, unknown>): VerdictState {
  const v = raw.verdict ?? raw.status;
  if (typeof v === "string") {
    const upper = v.toUpperCase();
    if (upper === "PASS" || upper === "VERIFIED") return "PASS";
    if (upper === "FAIL" || upper === "REJECT") return "FAIL";
  }
  return "INCONCLUSIVE";
}

function inferRiskLevel(verdict: VerdictState, severity?: string): RiskLevel {
  if (verdict === "FAIL") {
    if (severity?.toUpperCase() === "CRITICAL") return "ABSOLUTE";
    return "HIGH";
  }
  if (verdict === "INCONCLUSIVE") return "MODERATE";
  return "LOW";
}

function extractTelemetry(raw: Record<string, unknown>): string {
  const checks = raw.checks as Array<Record<string, unknown>> | undefined;
  if (checks && checks.length > 0) {
    return checks.map((c) => c.check_id ?? "UNKNOWN").join(", ");
  }
  return "core_orchestrator";
}

export function translateApiResponse(
  rawResponse: unknown,
  experiment: ExperimentContract,
): PresentationProps {
  const raw = (rawResponse ?? {}) as Record<string, unknown>;
  const verdict = inferVerdict(raw);
  const severity = raw.anomaly_severity as string | undefined;
  const riskLevel = inferRiskLevel(verdict, severity);
  const isFail = verdict === "FAIL";

  const checks = raw.checks as Array<Record<string, unknown>> | undefined;
  const anomaly = checks?.[0]?.anomaly as Record<string, unknown> | undefined;
  const mathProof = anomaly?.math_proof as Record<string, unknown> | undefined;

  return {
    verdict,
    headline: isFail
      ? "Anomaly Detected"
      : verdict === "INCONCLUSIVE"
        ? "Inconclusive Result"
        : "All Checks Passed",
    explanation:
      (raw.message as string) ??
      (raw.verdict_code as string) ??
      `Validation complete. Outcome: ${verdict}.`,
    riskLevel,
    riskJustification:
      riskLevel === "ABSOLUTE"
        ? "Systemic risk indicators found. Immediate action required."
        : riskLevel === "HIGH"
          ? "Significant anomalies detected. Review recommended before funding."
          : riskLevel === "MODERATE"
            ? "Some parameters require manual verification."
            : "No material risk identified.",
    impactStatement: isFail
      ? `Capital exposure detected: ${experiment.title} flagged anomalous values requiring intervention.`
      : `${experiment.title} cleared with no material discrepancies.`,
    engineName: experiment.engineName,
    engineDescription: experiment.purpose,
    findingTitle: `${experiment.engineName} — ${verdict}`,
    findingExplanation:
      (anomaly?.description as string) ??
      (anomaly?.code as string) ??
      `Engine evaluated ${experiment.title}. Outcome: ${verdict}.`,
    actionType: isFail
      ? `Review ${experiment.engineName} output. Investigate flagged fields before approving financing.`
      : "No action required. All validation criteria satisfied.",
    requiredEvidence: isFail
      ? "Supplier documentation, signed delivery receipts, and third-party verification report."
      : "Standard compliance documentation for portfolio records.",
    resolutionCriteria: isFail
      ? [
          `Verify ${experiment.engineName} input parameters match source documents.`,
          "Cross-reference with supplier-submitted e-way bill and invoice PDF.",
          "Obtain exception approval from risk committee if discrepancy persists.",
        ]
      : ["No resolution steps required."],
    secondaryProofs: isFail
      ? "Mathematical proof hash, audit trail ID, and anomaly classification code."
      : "Audit trail ID and timestamp of successful validation.",
    formula: mathProof
      ? Object.entries(mathProof)
          .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
          .join("; ")
      : `${experiment.engineName}: deterministic boolean evaluation`,
    variables: mathProof
      ? (Object.fromEntries(
          Object.entries(mathProof).map(([k, v]) => [k, String(v)]),
        ) as Record<string, string>)
      : { status: verdict, engine: experiment.engineName },
    calculatedResult: isFail
      ? `ANOMALY: ${riskLevel}`
      : verdict === "INCONCLUSIVE"
        ? "INCONCLUSIVE — manual review required"
        : "PASS — all thresholds satisfied",
    telemetryData: extractTelemetry(raw),
    timestamps:
      (raw.execution_time_ms as string) ??
      (raw.timestamp as string) ??
      new Date().toISOString(),
    hashes:
      raw.verification_id as string ?? raw.id as string ?? crypto.randomUUID(),
    predictedState: "PASS",
    actualState: verdict,
  };
}
