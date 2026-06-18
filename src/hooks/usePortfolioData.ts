"use client";

import { useState, useEffect } from "react";
import type { PortfolioDataset } from "@/types/portfolio";
import { generateMockPortfolio } from "@/data/mockPortfolioDataset";

export function usePortfolioData() {
  const [dataset, setDataset] = useState<PortfolioDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        const result = generateMockPortfolio("AEGIS_DEMO");
        setDataset(result);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate portfolio data.",
        );
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { dataset, isLoading, error };
}
