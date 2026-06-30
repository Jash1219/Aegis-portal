interface ProvenanceBlockProps {
  sourceName: string;
  accessMethod: string;
  dataTimestamp: string;
  cacheAge: string;
  auditLogReference?: string;
}

export function ProvenanceBlock({
  sourceName,
  accessMethod,
  dataTimestamp,
  cacheAge,
  auditLogReference,
}: ProvenanceBlockProps) {
  return (
    <div className="surface-card rounded-lg p-4">
      <span className="text-label-caps text-on-surface-variant">Provenance</span>
      <dl className="mt-3 grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-body-sm">
        <dt className="text-on-surface-variant">Source Name</dt>
        <dd className="text-foreground">{sourceName}</dd>

        <dt className="text-on-surface-variant">Access Method</dt>
        <dd className="text-foreground">{accessMethod}</dd>

        <dt className="text-on-surface-variant">Data Timestamp</dt>
        <dd className="text-foreground">{dataTimestamp}</dd>

        <dt className="text-on-surface-variant">Cache Age</dt>
        <dd className="text-foreground">{cacheAge}</dd>

        <dt className="text-on-surface-variant">Audit Log Ref</dt>
        <dd className="text-foreground">{auditLogReference ?? "N/A"}</dd>
      </dl>
    </div>
  );
}
