"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { HeaderStatus } from "@/components/ui/header-status";
import { fetchOverviewSummary } from "@/lib/bff";
import type { OverviewSummary } from "@/types/aegis";

function formatCount(n: number): string {
  return n.toLocaleString("en-IN");
}

function formatPercentage(n: number): string {
  return `${n.toFixed(1)}%`;
}

function formatDelta(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="surface-card rounded-lg p-4 space-y-3 animate-pulse"
          >
            <div className="h-3 w-24 bg-on-surface-variant/10 rounded" />
            <div className="h-6 w-32 bg-on-surface-variant/10 rounded" />
            <div className="h-3 w-20 bg-on-surface-variant/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="surface-card rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-48">
      <p className="text-label-caps text-on-surface-variant">
        Could not load overview data.
      </p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Retry
      </button>
    </div>
  );
}

export function OverviewScreen() {
  const [data, setData] = useState<OverviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const summary = await fetchOverviewSummary();
        if (!cancelled) setData(summary);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function handleRetry() {
    setLoading(true);
    setError(false);
    setData(null);

    fetchOverviewSummary()
      .then((summary) => setData(summary))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  if (loading) return <LoadingSkeleton />;

  if (error || !data) return <ErrorState onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Verified This Period"
          primaryMetric={formatCount(data.verified_count)}
          deltaIndicator={{
            direction:
              data.verified_count_delta_pct > 0
                ? "up"
                : data.verified_count_delta_pct < 0
                  ? "down"
                  : "neutral",
            value: formatDelta(data.verified_count_delta_pct),
          }}
          secondaryContext="vs previous period"
        />
        <MetricCard
          label="Clean (PASS)"
          primaryMetric={formatCount(data.clean_count)}
          deltaIndicator={{
            direction:
              data.clean_pct_delta_pct > 0
                ? "up"
                : data.clean_pct_delta_pct < 0
                  ? "down"
                  : "neutral",
            value: formatDelta(data.clean_pct_delta_pct),
          }}
          secondaryContext={`${formatPercentage(data.clean_pct)} of total`}
        />
        <MetricCard
          label="Manual Review Required"
          primaryMetric={formatCount(data.manual_review_count)}
          deltaIndicator={{ direction: "neutral", value: "" }}
          secondaryContext={`\u20B9${data.manual_review_value_inr.toLocaleString("en-IN")} total value`}
        />
        <MetricCard
          label="Government Enrichment Coverage"
          primaryMetric={formatPercentage(data.government_enrichment_coverage_pct)}
          deltaIndicator={{ direction: "neutral", value: "" }}
          secondaryContext="of invoices enriched"
        />
      </div>

      <div className="surface-card rounded-lg p-4 flex items-center justify-between">
        <span className="text-label-caps text-on-surface-variant">
          System Status
        </span>
        <HeaderStatus status={data.government_verification_status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface-card rounded-lg p-4 flex items-center justify-center h-64">
          <span className="text-label-caps text-on-surface-variant">
            Verification Trend (30 days)
          </span>
        </div>
        <div className="surface-card rounded-lg p-4 flex items-center justify-center h-64">
          <span className="text-label-caps text-on-surface-variant">
            Capital Under Review by Anomaly Type
          </span>
        </div>
      </div>
    </div>
  );
}
