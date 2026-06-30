import { cn } from "@/lib/utils";

interface IntegrityCertificateProps {
  verificationId: string;
  createdAt: string;
  payloadHash: string;
  apiCallSummary: string;
  apiVersion: string;
  schemaVersion: string;
  engineVersion: string;
}

export function IntegrityCertificate({
  verificationId,
  createdAt,
  payloadHash,
  apiCallSummary,
  apiVersion,
  schemaVersion,
  engineVersion,
}: IntegrityCertificateProps) {
  return (
    <details className="group">
      <summary className={cn(
        "text-label-caps text-on-surface-variant cursor-pointer hover:text-foreground transition-colors",
        "select-none",
      )}>
        Integrity Certificate
      </summary>
      <div className="mt-3 surface-card rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-body-sm">
          <span className="text-on-surface-variant">Verification ID</span>
          <span className="text-foreground font-mono">{verificationId}</span>

          <span className="text-on-surface-variant">Created</span>
          <span className="text-foreground">{createdAt}</span>

          <span className="text-on-surface-variant">Payload Hash</span>
          <span className="text-foreground font-mono break-all">{payloadHash}</span>

          <span className="text-on-surface-variant">API Version</span>
          <span className="text-foreground">{apiVersion}</span>

          <span className="text-on-surface-variant">Schema Version</span>
          <span className="text-foreground">{schemaVersion}</span>

          <span className="text-on-surface-variant">Engine Version</span>
          <span className="text-foreground">{engineVersion}</span>
        </div>

        <div className="rounded-lg bg-surface-container-low p-3 text-body-sm text-on-surface-variant">
          {apiCallSummary}
        </div>

        <p className="text-data-mono text-secondary">
          Immutable — this record has not been modified since creation
        </p>
      </div>
    </details>
  );
}
