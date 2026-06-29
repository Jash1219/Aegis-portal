import { z } from "zod";

const API_BASE = "https://aegis-api-968o.onrender.com";

export class ApiError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(message: string, status: number, body: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export interface AegisFetchConfig<T> {
  endpoint: string;
  method: string;
  payload: Record<string, unknown>;
  schema?: z.ZodSchema<T>;
}

export async function aegisFetch<T>(
  config: AegisFetchConfig<T>,
): Promise<T> {
  const key = process.env.NEXT_PUBLIC_AEGIS_SANDBOX_KEY;

  if (!key) {
    throw new Error(
      "Sandbox API key is not configured. Set NEXT_PUBLIC_AEGIS_SANDBOX_KEY in your .env.local file.",
    );
  }

  const url = `${API_BASE}${config.endpoint}`;
  const idempotencyKey = globalThis.crypto.randomUUID();

  let response: Response;
  try {
    response = await fetch(url, {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "x-idempotency-key": idempotencyKey,
      },
      body: JSON.stringify(config.payload),
    });
  } catch (err) {
    throw new Error(
      `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }

  let parsedJson: Record<string, unknown>;
  try {
    parsedJson = await response.json();
  } catch (err) {
    throw new Error(
      `Failed to parse API response as JSON: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }

  if (config.schema) {
    return config.schema.parse(parsedJson);
  }

  return parsedJson as T;
}

export async function executeAegisValidation(
  payload: Record<string, unknown>,
  endpoint: string,
): Promise<Record<string, unknown>> {
  return aegisFetch<Record<string, unknown>>({
    endpoint,
    method: "POST",
    payload,
  });
}
