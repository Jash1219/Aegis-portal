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

export async function executeAegisValidation(
  payload: Record<string, unknown>,
  endpoint: string,
): Promise<Record<string, unknown>> {
  const key = process.env.NEXT_PUBLIC_AEGIS_SANDBOX_KEY;

  if (!key) {
    throw new Error(
      "Sandbox API key is not configured. Set NEXT_PUBLIC_AEGIS_SANDBOX_KEY in your .env.local file.",
    );
  }

  const url = `${API_BASE}${endpoint}`;
  const idempotencyKey = globalThis.crypto.randomUUID();

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "x-idempotency-key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error(
      `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }

  const body: Record<string, unknown> = await response.json();
  return body;
}
