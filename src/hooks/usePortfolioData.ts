"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PortfolioDataset } from "@/types/portfolio";
import type {
  EvalResult,
  UploadMode,
  UploadPhase,
} from "@/types/portfolioUpload";
import type { DataQualityTelemetry } from "@/types/portfolio";
import type { ExperimentContract } from "@/types/sandbox";
import { generateMockPortfolio } from "@/data/mockPortfolioDataset";
import { simulateApiResponse } from "@/lib/engine/core";
import { isEvidenceSufficient } from "@/lib/engine/evidenceGuard";
import { normalizeCSV } from "@/utils/portfolioNormalizer";
import { buildPortfolioDataset } from "@/utils/portfolioDatasetBuilder";
import { getExperimentByValidationId } from "@/config/experimentRegistry";

const MAX_ROWS = 5000;
const EVAL_CHUNK_SIZE = 250;

const UPLOAD_VALIDATION_IDS = [
  "V-TRANSIT-PHYSICS-001", "V-TRANSIT-PHYSICS-002", "V-TRANSIT-PHYSICS-003",
  "V-DUP-FIN-001", "V-DUP-FIN-002", "V-DUP-FIN-003",
  "V-GST-GEO-001", "V-GST-GEO-002", "V-GST-GEO-003",
  "V-CHRONO-001", "V-CHRONO-002", "V-CHRONO-003",
  "V-RATE-001", "V-RATE-002", "V-RATE-003",
  "V-HSN-001", "V-HSN-002", "V-HSN-003",
];

const ENGINE_ID_FROM_VALIDATION: Record<string, string> = {
  "V-TRANSIT-PHYSICS-001": "TRANSIT_PHYSICS",
  "V-TRANSIT-PHYSICS-002": "TRANSIT_PHYSICS",
  "V-TRANSIT-PHYSICS-003": "TRANSIT_PHYSICS",
  "V-DUP-FIN-001": "DUPLICATE_FINANCING",
  "V-DUP-FIN-002": "DUPLICATE_FINANCING",
  "V-DUP-FIN-003": "DUPLICATE_FINANCING",
  "V-GST-GEO-001": "GST_GEOMETRY",
  "V-GST-GEO-002": "GST_GEOMETRY",
  "V-GST-GEO-003": "GST_GEOMETRY",
  "V-CHRONO-001": "CHRONOLOGY_OVERRIDE",
  "V-CHRONO-002": "CHRONOLOGY_OVERRIDE",
  "V-CHRONO-003": "CHRONOLOGY_OVERRIDE",
  "V-RATE-001": "RATE_MATRIX",
  "V-RATE-002": "RATE_MATRIX",
  "V-RATE-003": "RATE_MATRIX",
  "V-HSN-001": "HSN_LOGIC",
  "V-HSN-002": "HSN_LOGIC",
  "V-HSN-003": "HSN_LOGIC",
};

function mapSeverity(engineSeverity?: string): "LOW" | "MODERATE" | "HIGH" | "ABSOLUTE" | undefined {
  if (!engineSeverity) return undefined;
  if (engineSeverity === "CRITICAL") return "ABSOLUTE";
  if (engineSeverity === "HIGH") return "HIGH";
  if (engineSeverity === "MODERATE") return "MODERATE";
  if (engineSeverity === "LOW") return "LOW";
  return undefined;
}

interface UsePortfolioDataReturn {
  dataset: PortfolioDataset | null;
  isLoading: boolean;
  error: string | null;
  activeMode: UploadMode;
  setActiveMode: (mode: UploadMode) => void;
  uploadPhase: UploadPhase;
  uploadProgress: number;
  uploadErrors: string[];
  lastUploadedFile: string | null;
  processUpload: (file: File) => Promise<void>;
  resetUpload: () => void;
}

export function usePortfolioData(): UsePortfolioDataReturn {
  const [dataset, setDataset] = useState<PortfolioDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveModeState] = useState<UploadMode>("DEMO");
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("IDLE");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);
  const abortRef = useRef(false);

  const setActiveMode = useCallback((mode: UploadMode) => {
    abortRef.current = true;
    setActiveModeState(mode);
    setIsLoading(mode === "DEMO");
    setError(null);
    setUploadPhase("IDLE");
    setUploadProgress(0);
    setDataset(null);
  }, []);

  useEffect(() => {
    if (activeMode !== "DEMO") return;
    abortRef.current = false;

    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        const result = generateMockPortfolio("AEGIS_DEMO");
        if (!cancelled) {
          setDataset(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to generate portfolio data.",
          );
          setIsLoading(false);
        }
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeMode]);

  const resetUpload = useCallback(() => {
    abortRef.current = true;
    setUploadPhase("IDLE");
    setUploadProgress(0);
    setUploadErrors([]);
    setDataset(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const processUpload = useCallback(async (file: File) => {
    abortRef.current = false;
    setError(null);
    setLastUploadedFile(null);

    try {
      setUploadPhase("PARSING");
      setUploadProgress(0);

      const csvText = await file.text();
      if (abortRef.current) return;

      const normalized = normalizeCSV(csvText);
      if (normalized.rows.length === 0) {
        const allErrors = normalized.errors.length > 0
          ? normalized.errors
          : ["CSV file contains no valid data rows after parsing."];
        setUploadErrors(allErrors);
        setUploadPhase("ERROR");
        return;
      }

      if (normalized.rows.length > MAX_ROWS) {
        setUploadErrors([
          `CSV contains ${normalized.rows.length} rows, which exceeds the maximum of ${MAX_ROWS.toLocaleString()}. Please split your data and try again.`,
          ...normalized.errors.slice(0, 5),
        ]);
        setUploadPhase("ERROR");
        return;
      }

      const parseErrors = normalized.errors.length > 0
        ? [`${normalized.rejectedCount} row(s) rejected during parsing.`, ...normalized.errors.slice(0, 10)]
        : [];
      setUploadErrors(parseErrors);

      setUploadPhase("EVALUATING");
      setUploadProgress(0);

      const allResults: EvalResult[] = [];
      let totalEvaluationsAttempted = 0;
      let successfulEvaluations = 0;
      let skippedEvaluations = 0;
      const missingKeysSet = new Set<string>();

      for (let i = 0; i < normalized.rows.length; i += EVAL_CHUNK_SIZE) {
        if (abortRef.current) return;

        const chunk = normalized.rows.slice(i, i + EVAL_CHUNK_SIZE);

        for (const row of chunk) {
          if (abortRef.current) return;
          for (const vid of UPLOAD_VALIDATION_IDS) {
            const experiment = getExperimentByValidationId(vid);
            if (!experiment) continue;
            if (experiment.lifecycle !== "ACTIVE") continue;
            totalEvaluationsAttempted++;

            if (!isEvidenceSufficient(experiment, row.rawPayload)) {
              skippedEvaluations++;
              if (experiment.requiredEvidence) {
                for (const key of experiment.requiredEvidence) {
                  const val = row.rawPayload[key];
                  if (val === undefined || val === null || val === "") {
                    missingKeysSet.add(key);
                  }
                }
              }
              allResults.push({
                rowId: row.id,
                validationId: vid,
                parentEngineId: ENGINE_ID_FROM_VALIDATION[vid] ?? vid,
                verdict: "PASS",
                anomalySeverity: undefined,
                message: "Skipped: insufficient evidence",
              });
              continue;
            }

            successfulEvaluations++;
            const response = simulateApiResponse(experiment, row.rawPayload);
            allResults.push({
              rowId: row.id,
              validationId: vid,
              parentEngineId: ENGINE_ID_FROM_VALIDATION[vid] ?? vid,
              verdict: response.verdict === "FAIL" ? "FAIL" : "PASS",
              anomalySeverity: mapSeverity(response.anomaly_severity as string | undefined),
              message: (response.message as string) ?? "",
            });
          }
        }

        const pct = Math.min((i + chunk.length) / normalized.rows.length, 1);
        setUploadProgress(pct);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      if (abortRef.current) return;

      setUploadPhase("BUILDING");
      const evaluableCoveragePercent =
        totalEvaluationsAttempted > 0
          ? Math.round((successfulEvaluations / totalEvaluationsAttempted) * 100)
          : 0;
      const telemetry: DataQualityTelemetry = {
        totalEvaluationsAttempted,
        successfulEvaluations,
        skippedEvaluations,
        evaluableCoveragePercent,
        isUntrustworthy: evaluableCoveragePercent < 60,
        missingEvidenceKeys: Array.from(missingKeysSet),
      };
      const built = buildPortfolioDataset(normalized.rows, allResults, telemetry);

      if (abortRef.current) return;

      setDataset(built);
      setLastUploadedFile(file.name);
      setUploadPhase("DONE");
      setUploadProgress(1);
      setIsLoading(false);
    } catch (err) {
      if (abortRef.current) return;
      const msg = err instanceof Error ? err.message : "Upload processing failed unexpectedly.";
      setUploadErrors([msg]);
      setUploadPhase("ERROR");
    }
  }, []);

  return {
    dataset,
    isLoading,
    error,
    activeMode,
    setActiveMode,
    uploadPhase,
    uploadProgress,
    uploadErrors,
    lastUploadedFile,
    processUpload,
    resetUpload,
  };
}
