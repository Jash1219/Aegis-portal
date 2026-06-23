"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import type { PortfolioAnomaly } from "@/types/portfolio";
import FindingDetailSlideOut from "@/components/portfolio/FindingDetailSlideOut";

interface FindingsTriageTableProps {
  anomalies: PortfolioAnomaly[];
}

type SortKey = keyof PortfolioAnomaly;
type SortDir = "asc" | "desc";

const severityStyles: Record<string, string> = {
  ABSOLUTE: "text-error border-error/30 bg-error/10",
  HIGH: "text-orange-400 border-orange-500/20 bg-orange-500/10",
  MODERATE: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
  LOW: "text-secondary border-secondary/20 bg-secondary/10",
};

const riskCategoryStyles: Record<string, string> = {
  FRAUD: "text-error",
  COMPLIANCE: "text-yellow-400",
  FINANCIAL: "text-blue-400",
  OPERATIONAL: "text-on-surface-variant",
};

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function SortIcon({ columnKey, sortKey, sortDir }: { columnKey: string; sortKey: SortKey; sortDir: SortDir }) {
  if (columnKey !== sortKey) {
    return <ArrowUpDown className="h-3 w-3 text-on-surface-variant/40" />;
  }
  return sortDir === "asc" ? (
    <ChevronUp className="h-3 w-3 text-primary" />
  ) : (
    <ChevronDown className="h-3 w-3 text-primary" />
  );
}

export default function FindingsTriageTable({
  anomalies,
}: FindingsTriageTableProps) {

  const [sortKey, setSortKey] = useState<SortKey>("flaggedValueINR");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedAnomaly, setSelectedAnomaly] =
    useState<PortfolioAnomaly | null>(null);

  const sorted = useMemo(() => {
    const copy = [...anomalies];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      const cmp = aStr.localeCompare(bStr);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [anomalies, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns: { key: SortKey; label: string; sortable: boolean }[] = [
    { key: "id", label: "Anomaly ID", sortable: true },
    { key: "supplierGstin", label: "Supplier GSTIN", sortable: true },
    { key: "riskCategory", label: "Risk Category", sortable: true },
    { key: "flaggedValueINR", label: "Flagged Value (INR)", sortable: true },
    { key: "parentEngineId", label: "Primary Engine", sortable: true },
    { key: "severity", label: "Severity", sortable: true },
    { key: "recommendedAction", label: "Recommended Action", sortable: false },
  ];

  return (
    <>
      <div className="flex flex-col gap-md">
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Plane 3 — Findings Triage ({anomalies.length} flagged)
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg overflow-x-auto">
          <table className="w-full border-collapse font-data-mono text-data-mono">
            <thead>
              <tr className="border-b border-[#222222] bg-[#0a0a0a]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-md py-sm text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest ${col.sortable ? "cursor-pointer hover:text-primary transition-colors select-none" : ""}`}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          columnKey={col.key}
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((anomaly) => (
                <tr
                  key={anomaly.id}
                  onClick={() => setSelectedAnomaly(anomaly)}
                  className="border-b border-[#222222] hover:bg-[#161616] transition-colors cursor-pointer"
                >
                  <td className="px-md py-sm text-primary">{anomaly.id}</td>
                  <td className="px-md py-sm text-on-surface">
                    {anomaly.supplierGstin}
                  </td>
                  <td className="px-md py-sm">
                    <span
                      className={`font-label-caps text-label-caps ${riskCategoryStyles[anomaly.riskCategory] ?? ""}`}
                    >
                      {anomaly.riskCategory}
                    </span>
                  </td>
                  <td className="px-md py-sm text-on-surface">
                    {formatINR(anomaly.flaggedValueINR)}
                  </td>
                  <td className="px-md py-sm text-on-surface-variant">
                    {anomaly.parentEngineId}
                  </td>
                  <td className="px-md py-sm">
                    <span
                      className={`px-sm py-xs rounded border text-data-mono font-data-mono ${severityStyles[anomaly.severity] ?? ""}`}
                    >
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="px-md py-sm text-on-surface-variant max-w-[240px] truncate">
                    {anomaly.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FindingDetailSlideOut
        anomaly={selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
      />
    </>
  );
}
