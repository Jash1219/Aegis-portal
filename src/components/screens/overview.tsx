import { MetricCard } from "@/components/ui/metric-card";
import { HeaderStatus } from "@/components/ui/header-status";

export function OverviewScreen() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Verified This Period"
          primaryMetric="1,247"
          deltaIndicator={{ direction: "up", value: "+12.3%" }}
          secondaryContext="vs previous period"
        />
        <MetricCard
          label="Clean (PASS)"
          primaryMetric="1,083"
          deltaIndicator={{ direction: "up", value: "+8.1%" }}
          secondaryContext="86.8% of total"
        />
        <MetricCard
          label="Manual Review Required"
          primaryMetric="132"
          deltaIndicator={{ direction: "down", value: "-5.2%" }}
          secondaryContext="10.6% of total"
        />
        <MetricCard
          label="Government Enrichment Coverage"
          primaryMetric="96.4%"
          deltaIndicator={{ direction: "up", value: "+2.1%" }}
          secondaryContext="1,202 of 1,247 invoices"
        />
      </div>

      <div className="surface-card rounded-lg p-4 flex items-center justify-between">
        <span className="text-label-caps text-on-surface-variant">
          System Status
        </span>
        <HeaderStatus status="VERIFIED" />
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
