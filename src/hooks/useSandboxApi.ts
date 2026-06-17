"use client";

import { useState, useCallback } from "react";
import { executeAegisValidation } from "@/lib/api";

function randomHex(length: number): string {
  const bytes = new Uint8Array(length / 2);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function injectInvoiceNumber(
  obj: Record<string, unknown>,
): void {
  if (typeof obj.invoice_number === "string") {
    obj.invoice_number = `${obj.invoice_number}-${Date.now()}`;
  }
}

function injectIrns(obj: Record<string, unknown>): void {
  if (typeof obj.irn === "string") {
    obj.irn = randomHex(64);
  }
}

interface SandboxApiState {
  isLoading: boolean;
  error: string | null;
  result: Record<string, unknown> | null;
  requestPayload: Record<string, unknown> | null;
}

export function useSandboxApi() {
  const [state, setState] = useState<SandboxApiState>({
    isLoading: false,
    error: null,
    result: null,
    requestPayload: null,
  });

  const runValidation = useCallback(
    async (
      payload: Record<string, unknown>,
      experimentId: string,
      endpoint: string,
    ) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        result: null,
        requestPayload: null,
      }));

      try {
        const workingPayload: Record<string, unknown> = JSON.parse(
          JSON.stringify(payload),
        );

        if (experimentId !== "EXP_04_DUPLICATE_INVOICE") {
          injectInvoiceNumber(workingPayload);
          const erp = workingPayload.erp_invoice as Record<string, unknown> | undefined;
          const ims = workingPayload.ims_invoice as Record<string, unknown> | undefined;
          if (erp) injectInvoiceNumber(erp);
          if (ims) injectInvoiceNumber(ims);
        }

        if (experimentId !== "EXP_05_DUPLICATE_IRN") {
          injectIrns(workingPayload);
          const erp = workingPayload.erp_invoice as Record<string, unknown> | undefined;
          const ims = workingPayload.ims_invoice as Record<string, unknown> | undefined;
          if (erp) injectIrns(erp);
          if (ims) injectIrns(ims);
        }

        setState((prev) => ({ ...prev, requestPayload: workingPayload }));
        const result = await executeAegisValidation(workingPayload, endpoint);
        setState((prev) => ({ ...prev, result, isLoading: false }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "An unexpected error occurred",
          isLoading: false,
        }));
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      requestPayload: null,
    });
  }, []);

  return { ...state, runValidation, reset };
}
