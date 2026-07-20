import { Badge } from "@/components/ui/badge";
import type { CheckResult, Severity } from "@/types/aegis";

const severityVariant: Record<Severity, "danger" | "warning" | "info" | "outline"> = {
  CRITICAL: "danger",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "outline",
};

interface EvidenceCardProps {
  checkResult: CheckResult;
}

export function EvidenceCard({ checkResult }: EvidenceCardProps) {
  const { status = "", severity, evidence, anomaly } = checkResult;

  return (
    <div className="surface-card rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {anomaly?.code && (
          <span className="font-semibold text-body-sm text-foreground">
            {anomaly.code}
          </span>
        )}
        {severity && (
          <Badge variant={severityVariant[severity] ?? "outline"}>
            {severity}
          </Badge>
        )}
      </div>

      {status && (
        <p className="text-data-mono text-on-surface-variant">
          {status}
        </p>
      )}

      {anomaly?.description && (
        <p className="text-body-sm text-foreground">
          {anomaly.description}
        </p>
      )}

      <details className="group">
        <summary className="text-label-caps text-on-surface-variant cursor-pointer hover:text-foreground transition-colors">
          View Evidence
        </summary>
        <div className="mt-3 space-y-3">
          {evidence && (
            <div>
              <span className="text-label-caps text-on-surface-variant">Evidence</span>
              <pre className="mt-1 text-data-mono bg-surface-container-low rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(evidence, null, 2)}
              </pre>
            </div>
          )}
          {anomaly?.math_proof && (
            <div>
              <span className="text-label-caps text-on-surface-variant">Math Proof</span>
              <pre className="mt-1 text-data-mono bg-surface-container-low rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(anomaly.math_proof, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
