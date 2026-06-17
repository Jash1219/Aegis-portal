import "dotenv/config";
import { randomUUID, randomBytes } from "node:crypto";
import { EXPERIMENT_MATRIX } from "../src/config/experiment-matrix";
import { deepSet } from "../src/lib/object-utils";

const API_BASE = "https://aegis-api-968o.onrender.com";

interface ValidationResult {
  id: string;
  title: string;
  expectedVerdict: string;
  actualVerdict: string;
  passed: boolean;
  notes: string;
}

function hydratePayload(
  experiment: (typeof EXPERIMENT_MATRIX)[number],
): Record<string, unknown> {
  let payload = structuredClone(experiment.goldenBasePayload) as Record<string, unknown>;
  for (const field of experiment.inputFields) {
    payload = deepSet(payload, field.key, field.example);
  }
  return payload;
}

function addDynamicIds(
  payload: Record<string, unknown>,
  skipIrns: boolean,
): Record<string, unknown> {
  const apply = (obj: Record<string, unknown>) => {
    if (typeof obj.invoice_number === "string") {
      obj.invoice_number = `${obj.invoice_number}-${Date.now()}`;
    }
    if (!skipIrns && typeof obj.irn === "string") {
      obj.irn = randomBytes(32).toString("hex");
    }
  };
  apply(payload);
  if (payload.erp_invoice) apply(payload.erp_invoice as Record<string, unknown>);
  if (payload.ims_invoice) apply(payload.ims_invoice as Record<string, unknown>);
  return payload;
}

async function validateExperiment(
  experiment: (typeof EXPERIMENT_MATRIX)[number],
): Promise<ValidationResult> {
  let payload = hydratePayload(experiment);
  const skipIrns = experiment.id === "EXP_05_DUPLICATE_IRN";
  if (experiment.id !== "EXP_04_DUPLICATE_INVOICE") {
    payload = addDynamicIds(payload, skipIrns);
  }
  const key = process.env.NEXT_PUBLIC_AEGIS_SANDBOX_KEY;

  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_AEGIS_SANDBOX_KEY is not set in environment",
    );
  }

  const url = `${API_BASE}${experiment.endpoint}`;
  const idempotencyKey = randomUUID();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "x-idempotency-key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json();

    const actualVerdict: string =
      body.verdict ??
      body.result?.verdict ??
      body.status ??
      body.error ??
      `HTTP_${response.status}`;

    const passed = actualVerdict === experiment.expectedVerdict;
    let notes = "";

    if (!response.ok) {
      const detailStr = JSON.stringify(body);
      notes = passed
        ? `OK (HTTP ${response.status})`
        : `HTTP ${response.status} — Expected ${experiment.expectedVerdict}, got ${actualVerdict} — details: ${detailStr.length > 400 ? detailStr.slice(0, 400) + "…" : detailStr}`;
    } else {
      notes = passed
        ? "OK"
        : `Expected ${experiment.expectedVerdict}, got ${actualVerdict}`;
    }

    return {
      id: experiment.id,
      title: experiment.title,
      expectedVerdict: experiment.expectedVerdict,
      actualVerdict,
      passed,
      notes,
    };
  } catch (err) {
    return {
      id: experiment.id,
      title: experiment.title,
      expectedVerdict: experiment.expectedVerdict,
      actualVerdict: "NETWORK_ERROR",
      passed: false,
      notes: `Network error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

async function main() {
  console.log("AEGIS Experiment Validation Report");
  console.log("=".repeat(60));
  console.log();

  const results: ValidationResult[] = [];

  for (const experiment of EXPERIMENT_MATRIX) {
    process.stdout.write(`  ${experiment.id} — ${experiment.title} ... `);
    const result = await validateExperiment(experiment);
    results.push(result);
    console.log(result.passed ? "PASS" : "FAIL");
  }

  console.log();
  console.log("=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));
  console.log();

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`  Total: ${results.length}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log();

  console.log("---");
  console.log();
  console.log("| ID | Title | Expected | Actual | Status | Notes |");
  console.log("|---|---|---|---|---|---|");
  for (const r of results) {
    const status = r.passed ? "✅ PASS" : "❌ FAIL";
    console.log(
      `| ${r.id} | ${r.title} | ${r.expectedVerdict} | ${r.actualVerdict} | ${status} | ${r.notes} |`,
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
