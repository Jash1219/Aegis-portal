import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/ui/source-badge";
import { FreshnessBadge } from "@/components/ui/freshness-badge";
import type { SupplierIntelligence, GovernmentVerificationStatus } from "@/types/aegis";

const FIELD_LABELS: Record<keyof SupplierIntelligence, string> = {
  gstin: "GSTIN",
  legalName: "Legal Name",
  address: "Address",
  registrationStatus: "Registration Status",
  registrationDate: "Registration Date",
};

const STATUS_VARIANT: Record<GovernmentVerificationStatus, "success" | "warning" | "danger" | "info" | "outline"> = {
  VERIFIED: "success",
  NOT_FOUND: "warning",
  DISCREPANCY: "danger",
  PENDING: "info",
  UNAVAILABLE: "outline",
};

const STATUS_LABELS: Record<GovernmentVerificationStatus, string> = {
  VERIFIED: "Verified",
  NOT_FOUND: "Not Found",
  DISCREPANCY: "Discrepancy",
  PENDING: "Pending",
  UNAVAILABLE: "Unavailable",
};

interface SupplierIntelligencePanelProps {
  supplierIntelligence: SupplierIntelligence;
  governmentVerificationStatus?: GovernmentVerificationStatus;
}

export function SupplierIntelligencePanel({
  supplierIntelligence,
  governmentVerificationStatus,
}: SupplierIntelligencePanelProps) {
  const fieldKeys: Array<keyof SupplierIntelligence> = [
    "gstin", "legalName", "address", "registrationStatus", "registrationDate",
  ];

  return (
    <div className="surface-card rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-body-sm text-foreground">
          Government Verification
        </span>
        {governmentVerificationStatus && (
          <Badge variant={STATUS_VARIANT[governmentVerificationStatus]}>
            {STATUS_LABELS[governmentVerificationStatus]}
          </Badge>
        )}
      </div>

      {governmentVerificationStatus === "UNAVAILABLE" && (
        <div className="rounded-lg bg-surface-container-low p-3 text-body-sm text-on-surface-variant">
          Government verification data is currently unavailable.
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 text-body-sm">
        <span className="text-label-caps text-on-surface-variant">Field</span>
        <span className="text-label-caps text-on-surface-variant">Value</span>
        <span className="text-label-caps text-on-surface-variant">Provenance</span>

        {fieldKeys
          .filter((key) => supplierIntelligence[key])
          .map((key) => {
            const field = supplierIntelligence[key]!;
            return (
              <div key={key} className="contents">
                <span className="text-on-surface">{FIELD_LABELS[key]}</span>
                <span className="text-foreground">{field.value}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge
                    dataSource={field.dataSource}
                    sourceName={field.sourceName}
                    accessMethod={field.accessMethod}
                    dataTimestamp={field.dataTimestamp}
                  />
                  <FreshnessBadge
                    dataTimestamp={field.dataTimestamp}
                    isStatic={field.isStatic}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
