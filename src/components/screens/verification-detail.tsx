"use client";

import { useState, useEffect } from "react";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { EvidenceCard } from "@/components/ui/evidence-card";
import { SupplierIntelligencePanel } from "@/components/ui/supplier-intelligence-panel";
import { EvidenceTimeline } from "@/components/ui/evidence-timeline";
import { IntegrityCertificate } from "@/components/ui/integrity-certificate";
import { HeaderStatus } from "@/components/ui/header-status";
import { fetchVerificationDetail } from "@/lib/bff";
import type { VerificationDetailResponse } from "@/types/aegis";

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="surface-card rounded-lg p-4">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-on-surface-variant/10 rounded" />
          <div className="h-4 w-36 bg-on-surface-variant/10 rounded" />
          <div className="h-4 w-28 bg-on-surface-variant/10 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-24 bg-on-surface-variant/10 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-on-surface-variant/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="surface-card rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-48">
      <p className="text-label-caps text-on-surface-variant">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Retry
      </button>
    </div>
  );
}

type TimelineStatus =
  | "PASSED"
  | "FINDINGS_DETECTED"
  | "DEGRADED"
  | "UNAVAILABLE"
  | "SKIPPED";

const VALID_TIMELINE_STATUSES: ReadonlySet<string> = new Set<TimelineStatus>([
  "PASSED", "FINDINGS_DETECTED", "DEGRADED", "UNAVAILABLE", "SKIPPED",
]);

function toTimelineStatus(value: string): TimelineStatus {
  return VALID_TIMELINE_STATUSES.has(value) ? value as TimelineStatus : "UNAVAILABLE";
}

interface VerificationDetailScreenProps {
  verificationId: string;
}

export function VerificationDetailScreen({
  verificationId,
}: VerificationDetailScreenProps) {
  const [data, setData] = useState<VerificationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const detail = await fetchVerificationDetail(verificationId);
        if (!cancelled) setData(detail);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load verification detail.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [verificationId]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setData(null);

    fetchVerificationDetail(verificationId)
      .then((detail) => setData(detail))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Could not load verification detail.",
        ),
      )
      .finally(() => setLoading(false));
  }

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "Could not load verification detail."} onRetry={handleRetry} />;

  const {
    verification_id,
    client_reference_id,
    verdict,
    checks,
    government_verification_status,
    supplier_intelligence,
    created_at,
    processing_time_ms,
    evidence_timeline,
    integrity,
  } = data;

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-data-mono text-on-surface-variant">
              {verification_id}
            </div>
            <div className="text-body-sm text-on-surface-variant">
              Invoice: {client_reference_id}
            </div>
            <div className="text-body-sm text-on-surface-variant">
              Created: {created_at}
            </div>
            {processing_time_ms !== undefined && (
              <div className="text-body-sm text-on-surface-variant">
                Processing Time: {(processing_time_ms / 1000).toFixed(1)}s
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {verdict && <VerdictBadge verdict={verdict} />}
            {government_verification_status && (
              <HeaderStatus status={government_verification_status} />
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <span className="text-label-caps text-on-surface-variant block">
          Findings
        </span>
        {checks?.map((check, idx) => (
          <EvidenceCard key={check.check_id ?? idx} checkResult={check} />
        ))}
      </section>

      <section>
        {supplier_intelligence && government_verification_status && (
          <SupplierIntelligencePanel
            supplierIntelligence={supplier_intelligence}
            governmentVerificationStatus={government_verification_status}
          />
        )}
      </section>

      {evidence_timeline && (
        <section>
          <details className="group">
            <summary className="text-label-caps text-on-surface-variant cursor-pointer hover:text-foreground transition-colors select-none">
              Evidence Timeline
            </summary>
            <div className="mt-3">
              <EvidenceTimeline
                schemaValidation={toTimelineStatus(evidence_timeline.schema_validation)}
                deterministicRules={toTimelineStatus(evidence_timeline.deterministic_rules)}
                governmentVerification={toTimelineStatus(evidence_timeline.government_verification)}
                supplierIntelligence={toTimelineStatus(evidence_timeline.supplier_intelligence)}
                verdictAssembly={toTimelineStatus(evidence_timeline.verdict_assembly)}
              />
            </div>
          </details>
        </section>
      )}

      {integrity && (
        <section>
          <IntegrityCertificate
            verificationId={verification_id}
            createdAt={created_at}
            payloadHash={integrity.payload_hash}
            apiCallSummary={integrity.api_call_summary}
            apiVersion={integrity.api_version}
            schemaVersion={integrity.schema_version}
            engineVersion={integrity.engine_version}
          />
        </section>
      )}
    </div>
  );
}
