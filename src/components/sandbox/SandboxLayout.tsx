"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  PlayIcon,
  ShieldCheck,
  ShieldX,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { EXPERIMENT_MATRIX } from "@/config/experiment-matrix";
import { useExperimentHydration } from "@/hooks/useExperimentHydration";
import { useSandboxApi } from "@/hooks/useSandboxApi";
import TechnicalDetailsAccordion from "./TechnicalDetailsAccordion";
import type { Verdict, Severity } from "@/types/aegis";

function verdictBadgeVariant(verdict: Verdict | undefined) {
  switch (verdict) {
    case "PASS":
      return "success" as const;
    case "FAIL":
    case "REJECT":
    case "GSTIN_CHECKSUM_FAILURE":
      return "danger" as const;
    case "INCONCLUSIVE":
    case "PEND":
      return "warning" as const;
    default:
      return "default" as const;
  }
}

function severityBadgeVariant(severity: Severity | undefined) {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return "danger" as const;
    case "MEDIUM":
      return "warning" as const;
    case "LOW":
    case "NONE":
      return "info" as const;
    default:
      return "default" as const;
  }
}

function extractVerdict(result: Record<string, unknown> | null): Verdict | undefined {
  if (!result) return undefined;
  if (typeof result.verdict === "string") return result.verdict as Verdict;
  if (typeof result.error === "string") return result.error as Verdict;
  return undefined;
}

function extractSeverity(result: Record<string, unknown> | null): Severity | undefined {
  if (!result) return undefined;
  const sev = result.anomaly_severity ?? result.severity;
  if (typeof sev === "string") return sev as Severity;
  return undefined;
}

function extractMessage(result: Record<string, unknown> | null): string | null {
  if (!result) return null;
  if (typeof result.message === "string") return result.message;
  const checks = result.checks as Array<Record<string, unknown>> | undefined;
  if (checks && checks.length > 0) {
    const firstAnomaly = checks[0]?.anomaly as Record<string, unknown> | undefined;
    if (firstAnomaly && typeof firstAnomaly.description === "string") {
      return firstAnomaly.description;
    }
  }
  return null;
}

export default function SandboxLayout() {
  const {
    activeExperiment,
    formValues,
    hydratedPayload,
    handleExperimentChange,
    handleInputChange,
  } = useExperimentHydration();

  const {
    isLoading,
    error,
    result,
    requestPayload,
    runValidation,
    reset,
  } = useSandboxApi();

  const handleRun = () => {
    reset();
    runValidation(
      hydratedPayload,
      activeExperiment.id,
      activeExperiment.endpoint,
    );
  };

  const verdict = extractVerdict(result);
  const severity = extractSeverity(result);
  const apiMessage = extractMessage(result);
  const displayMessage =
    apiMessage ?? activeExperiment.expectedPlainEnglishResult;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6 rounded-lg border border-[#222222] bg-[#111111] p-6">
        <div>
          <Label htmlFor="experiment" className="mb-1.5 block text-sm font-medium">
            Experiment
          </Label>
          <select
            id="experiment"
            value={activeExperiment.id}
            onChange={(e) => {
              reset();
              handleExperimentChange(e.target.value);
            }}
            className="h-8 w-full rounded-lg border border-[#222222] bg-transparent px-2.5 text-sm text-[#EDEDED] outline-none transition-colors focus-visible:border-[#444444]"
          >
            {EXPERIMENT_MATRIX.map((exp) => (
              <option
                key={exp.id}
                value={exp.id}
                className="bg-[#111111]"
              >
                {exp.title}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm leading-relaxed text-[#A0A0A0]">
          {activeExperiment.businessDescription}
        </p>

        <Separator />

        <div className="space-y-4">
          {activeExperiment.inputFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
              </Label>
              <Input
                id={field.key}
                type={field.type === "number" ? "number" : "text"}
                value={
                  field.type === "array"
                    ? JSON.stringify(formValues[field.key])
                    : (formValues[field.key]?.toString() ?? "")
                }
                onChange={(e) => {
                  const val =
                    field.type === "number"
                      ? e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                      : e.target.value;
                  handleInputChange(field.key, val);
                }}
                placeholder={field.example?.toString()}
              />
            </div>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <Button
            className="w-full gap-2 bg-[#EDEDED] text-[#0A0A0A] hover:bg-white"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
            {isLoading ? "Running..." : "Run Validation"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 rounded-lg border border-[#222222] bg-[#111111] p-6">
        {!result && !error && !isLoading && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#222222] bg-[#0A0A0A] p-8 text-center">
            <HelpCircle className="mb-3 h-10 w-10 text-[#A0A0A0]" />
            <p className="text-sm text-[#A0A0A0]">
              Configure inputs and run validation to see results
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#222222] bg-[#0A0A0A] p-8 text-center">
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-[#A0A0A0]" />
            <p className="text-sm text-[#A0A0A0]">
              Validating against AEGIS backend...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center">
            <ShieldX className="mb-3 h-10 w-10 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {result && !error && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              {verdict ? (
                <Badge variant={verdictBadgeVariant(verdict)} className="px-3 py-1 text-sm">
                  {verdict}
                </Badge>
              ) : null}
              {severity ? (
                <Badge variant={severityBadgeVariant(severity)} className="px-3 py-1 text-sm">
                  {severity}
                </Badge>
              ) : null}
            </div>

            {displayMessage && (
              <p className="text-sm leading-relaxed text-[#A0A0A0]">
                {displayMessage}
              </p>
            )}

            <Separator />

            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-8 w-8 text-green-500" />
                <span className="text-xs text-[#A0A0A0]">Pass</span>
                <span className="text-lg font-semibold text-[#EDEDED]">42</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldX className="h-8 w-8 text-red-500" />
                <span className="text-xs text-[#A0A0A0]">Fail</span>
                <span className="text-lg font-semibold text-[#EDEDED]">0</span>
              </div>
            </div>
          </>
        )}

        <TechnicalDetailsAccordion
          requestJson={JSON.stringify(
            requestPayload ?? hydratedPayload,
            null,
            2,
          )}
          responseJson={result ? JSON.stringify(result, null, 2) : null}
        />
      </div>
    </div>
  );
}
