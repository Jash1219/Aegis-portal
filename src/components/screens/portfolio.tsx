"use client";

import { useState, useEffect } from "react";
import { ManualReviewItem } from "@/components/ui/manual-review-item";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { VerificationDetailScreen } from "@/components/screens/verification-detail";
import { fetchPortfolioData, fetchManualReviewQueue } from "@/lib/bff";
import type { PortfolioData, ManualReviewItemData } from "@/types/aegis";

function formatInvoiceValue(n: number): string {
  const lakhs = n / 100000;
  return `${lakhs.toFixed(1)}L`;
}

function formatCr(n: number): string {
  const cr = n / 10000000;
  return `\u20B9${cr.toFixed(1)}Cr`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-72 bg-on-surface-variant/10 rounded" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-on-surface-variant/10 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-40 bg-on-surface-variant/10 rounded" />
        <div className="h-64 bg-on-surface-variant/10 rounded-lg" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="surface-card rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-48">
      <p className="text-label-caps text-on-surface-variant">
        Could not load portfolio data.
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

export function PortfolioScreen() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [queueData, setQueueData] = useState<ManualReviewItemData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [portfolio, manualReview] = await Promise.all([
          fetchPortfolioData(),
          fetchManualReviewQueue(),
        ]);
        if (!cancelled) {
          setData(portfolio);
          setQueueData(manualReview);
        }
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
    setQueueData(null);

    Promise.all([
      fetchPortfolioData(),
      fetchManualReviewQueue(),
    ])
      .then(([portfolio, manualReview]) => {
        setData(portfolio);
        setQueueData(manualReview);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  if (selectedVerificationId) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedVerificationId(null)}
          className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors"
        >
          &larr; Back to Portfolio
        </button>
        <VerificationDetailScreen verificationId={selectedVerificationId} />
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState onRetry={handleRetry} />;

  const manual_review_queue = queueData ?? [];
  const { rows } = data;

  return (
    <div className="space-y-8">
      {/* Section A — Manual Review Queue */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant">
            Manual Review Queue — {manual_review_queue.length} invoices requiring human attention |{" "}
            {formatCr(
              manual_review_queue.reduce(
                (sum, v) => sum + v.invoice_value_inr,
                0,
              ),
            )} total value
          </span>
        </div>
        <div className="space-y-2">
          {manual_review_queue.map((v) => (
            <ManualReviewItem
              key={v.verification_id}
              invoiceReference={v.invoice_reference_truncated ?? v.verification_id}
              supplierState={v.supplier_state ?? ""}
              invoiceValue={formatInvoiceValue(v.invoice_value_inr)}
              primaryAnomalyCode={v.primary_anomaly_code ?? ""}
              allAnomalyCodes={v.all_anomaly_codes ?? []}
              daysInQueue={v.days_in_queue}
              onClick={() => setSelectedVerificationId(v.verification_id)}
            />
          ))}
        </div>
      </section>

      {/* Section B — Verification Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant">
            Verification Table
          </span>
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Filter
            </span>
            <span className="text-on-surface-variant">|</span>
            <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Sort
            </span>
            <span className="text-on-surface-variant">|</span>
            <span className="text-body-sm text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Export
            </span>
          </div>
        </div>
        <div className="surface-card rounded-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Submission Date
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Invoice Date
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Supplier State
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  HSN Chapter
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Verdict
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Anomaly Codes
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Invoice Value
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Government Enrichment
                </th>
                <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr
                  key={v.verification_id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {v.submitted_at}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {v.invoice_date ?? "\u2014"}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {v.supplier_state}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {v.hsn_chapter}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <VerdictBadge verdict={v.verdict} />
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {v.anomaly_codes.length > 0
                      ? v.anomaly_codes.join(", ")
                      : "\u2014"}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-medium">
                    {formatInvoiceValue(v.invoice_value_inr)}
                  </td>
                  <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                    {v.government_enrichment}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedVerificationId(v.verification_id)}
                      className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}