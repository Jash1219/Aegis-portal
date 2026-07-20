"use client";

import { useState, useEffect } from "react";
import { SupplierIntelligencePanel } from "@/components/ui/supplier-intelligence-panel";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { fetchSuppliersTable, fetchSupplierDetail } from "@/lib/bff";
import type { SupplierRow, SupplierDetailResponse } from "@/types/aegis";

const FILING_STATUS_STYLES: Record<string, string> = {
  Filed: "text-emerald-400",
  "Not Filed": "text-red-400",
  Unknown: "text-on-surface-variant",
};

function formatInvoiceValue(paise: number): string {
  const lakhs = paise / 10000000;
  return `\u20B9${lakhs.toFixed(1)}L`;
}

function formatInr(n: number): string {
  return `\u20B9${n.toLocaleString("en-IN")}`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-48 bg-on-surface-variant/10 rounded" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-on-surface-variant/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="surface-card rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-48">
      <p className="text-label-caps text-on-surface-variant">
        Could not load suppliers data.
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

function SupplierDetailView({
  identifier,
  onBack,
}: {
  identifier: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<SupplierDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const detail = await fetchSupplierDetail(identifier);
        if (!cancelled) setData(detail);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load supplier detail.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [identifier]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setData(null);

    fetchSupplierDetail(identifier)
      .then((detail) => setData(detail))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Could not load supplier detail.",
        ),
      )
      .finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-24 bg-on-surface-variant/10 rounded" />
        <div className="h-48 bg-on-surface-variant/10 rounded-lg" />
        <div className="h-32 bg-on-surface-variant/10 rounded-lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors"
        >
          &larr; Back to Supplier Table
        </button>
        <div className="surface-card rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-48">
          <p className="text-label-caps text-on-surface-variant">{error ?? "Could not load supplier detail."}</p>
          <button
            onClick={handleRetry}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors"
      >
        &larr; Back to Supplier Table
      </button>

      {data.supplier_intelligence && data.government_verification_status && (
        <section>
          <SupplierIntelligencePanel
            supplierIntelligence={data.supplier_intelligence}
            governmentVerificationStatus={data.government_verification_status}
          />
        </section>
      )}

      {data.filing_history && data.filing_history.length > 0 && (
        <section className="space-y-3">
          <span className="text-label-caps text-on-surface-variant block">
            Filing History
          </span>
          <div className="surface-card rounded-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Tax Period</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Filing Status</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Filing Date</th>
                </tr>
              </thead>
              <tbody>
                {data.filing_history.map((record) => (
                  <tr key={record.period} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.period}</td>
                    <td className="text-body-sm px-4 py-3 whitespace-nowrap">
                      <span className={FILING_STATUS_STYLES[record.status] ?? "text-on-surface-variant"}>{record.status}</span>
                    </td>
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.filing_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data.verification_history && data.verification_history.length > 0 && (
        <section className="space-y-3">
          <span className="text-label-caps text-on-surface-variant block">
            Verification History
          </span>
          <div className="surface-card rounded-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Verification Date</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Verdict</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Primary Anomaly Code</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Invoice Value</th>
                  <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Detail</th>
                </tr>
              </thead>
              <tbody>
                {data.verification_history.map((record, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <VerdictBadge verdict={record.verdict} />
                    </td>
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.anomaly_code}</td>
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-medium">{formatInvoiceValue(record.invoice_value_paise)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href="#" className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export function SuppliersScreen() {
  const [data, setData] = useState<SupplierRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const suppliers = await fetchSuppliersTable();
        if (!cancelled) setData(suppliers);
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

    fetchSuppliersTable()
      .then((suppliers) => setData(suppliers))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-label-caps text-on-surface-variant">
          Supplier Portfolio
        </span>
        <span className="text-body-sm text-on-surface-variant">
          {data.length} suppliers
        </span>
      </div>

      <div className="surface-card rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">GSTIN</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">State</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Verifications</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Total Value</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Anomalies</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Anomaly Rate</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Last Verified</th>
            </tr>
          </thead>
          <tbody>
            {data.map((supplier, i) => (
              <tr
                key={supplier.supplier_gstin_masked ?? `supplier-${i}`}
                className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-mono">
                  {supplier.supplier_gstin_masked ?? "\u2014"}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.supplier_state ?? "\u2014"}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.verification_count}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-medium">
                  {formatInr(supplier.total_value_inr)}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.anomaly_count}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.anomaly_rate_pct}%
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.last_verified_at ?? "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
