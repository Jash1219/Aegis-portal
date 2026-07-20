import type {
  OverviewSummary,
  PortfolioData,
  ManualReviewItemData,
  VerificationDetailResponse,
  SupplierRow,
  SupplierDetailResponse,
} from "@/types/aegis";

const BFF_BASE =
  process.env.NEXT_PUBLIC_AEGIS_API_URL || "https://aegis-api-968o.onrender.com";

export class BffError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "BffError";
  }
}

export async function fetchOverviewSummary(): Promise<OverviewSummary> {
  const response = await fetch(`${BFF_BASE}/bff/overview`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new BffError("Failed to fetch overview summary.", response.status);
  }

  return response.json();
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const response = await fetch(`${BFF_BASE}/bff/portfolio`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new BffError("Failed to fetch portfolio data.", response.status);
  }

  return response.json();
}

export async function fetchManualReviewQueue(): Promise<ManualReviewItemData[]> {
  const response = await fetch(`${BFF_BASE}/bff/manual-review`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new BffError("Failed to fetch manual review queue.", response.status);
  }

  const body: { rows: ManualReviewItemData[] } = await response.json();
  return body.rows;
}

export async function fetchSupplierDetail(
  identifier: string,
): Promise<SupplierDetailResponse> {
  const response = await fetch(
    `${BFF_BASE}/bff/supplier/${encodeURIComponent(identifier)}`,
    { credentials: "include" },
  );

  if (response.status === 404 || response.status === 403) {
    throw new BffError(
      "Supplier not found or access denied.",
      response.status,
    );
  }

  if (!response.ok) {
    throw new BffError(
      "Failed to fetch supplier detail.",
      response.status,
    );
  }

  return response.json();
}

export async function fetchSuppliersTable(): Promise<SupplierRow[]> {
  const response = await fetch(`${BFF_BASE}/bff/suppliers`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new BffError("Failed to fetch suppliers table.", response.status);
  }

  const body: { rows: SupplierRow[] } = await response.json();
  return body.rows;
}

export async function fetchVerificationDetail(
  verificationId: string,
): Promise<VerificationDetailResponse> {
  const response = await fetch(
    `${BFF_BASE}/bff/verification/${encodeURIComponent(verificationId)}`,
    { credentials: "include" },
  );

  if (response.status === 404) {
    throw new BffError(
      "Verification not found or access denied.",
      response.status,
    );
  }

  if (!response.ok) {
    throw new BffError(
      "Failed to fetch verification detail.",
      response.status,
    );
  }

  return response.json();
}
