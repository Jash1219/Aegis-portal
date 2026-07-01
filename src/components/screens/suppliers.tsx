"use client";

import { useState } from "react";
import { SupplierIntelligencePanel } from "@/components/ui/supplier-intelligence-panel";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import type { Verdict, GovernmentVerificationStatus } from "@/types/aegis";

interface MockSupplier {
  gstin: string;
  state: string;
  invoices: number;
  passRate: string;
  gstinStatus: "Active" | "Cancelled" | "Suspended";
  filingStatus: "Current" | "1 Period Gap" | "2+ Period Gap";
  registrationAge: string;
  sectorRisk: "High" | "Medium" | "Low";
}

const MOCK_SUPPLIERS: MockSupplier[] = [
  { gstin: "22AAAAA0000A1Z5", state: "Delhi", invoices: 45, passRate: "95.6%", gstinStatus: "Active", filingStatus: "Current", registrationAge: "7y 2m", sectorRisk: "Medium" },
  { gstin: "27BBBBB1111B2Z6", state: "Maharashtra", invoices: 128, passRate: "88.2%", gstinStatus: "Active", filingStatus: "1 Period Gap", registrationAge: "4y 8m", sectorRisk: "High" },
  { gstin: "29CCCCC2222C3Z7", state: "Karnataka", invoices: 73, passRate: "72.4%", gstinStatus: "Suspended", filingStatus: "2+ Period Gap", registrationAge: "2y 1m", sectorRisk: "High" },
  { gstin: "33DDDDD3333D4Z8", state: "Tamil Nadu", invoices: 92, passRate: "97.1%", gstinStatus: "Active", filingStatus: "Current", registrationAge: "11y 0m", sectorRisk: "Low" },
  { gstin: "24EEEEE4444E5Z9", state: "Gujarat", invoices: 31, passRate: "64.8%", gstinStatus: "Cancelled", filingStatus: "2+ Period Gap", registrationAge: "3y 9m", sectorRisk: "Medium" },
  { gstin: "09FFFFF5555F6Z1", state: "Uttar Pradesh", invoices: 67, passRate: "91.3%", gstinStatus: "Active", filingStatus: "Current", registrationAge: "5y 6m", sectorRisk: "Low" },
];

const GSTIN_STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-500",
  Cancelled: "bg-red-500",
  Suspended: "bg-amber-500",
};

function maskGstin(gstin: string): string {
  return gstin.length > 10 ? `${gstin.slice(0, 10)}***` : gstin;
}

const MOCK_INTELLIGENCE = {
  gstin: { value: "22AAAAA0000A1Z5", dataSource: "GST_PORTAL" as const, sourceName: "Government GST Database", accessMethod: "API", dataTimestamp: "2026-06-30T10:30:00Z" },
  legalName: { value: "Acme Corp Private Limited", dataSource: "GST_PORTAL" as const, sourceName: "Government GST Database", accessMethod: "API", dataTimestamp: "2026-06-30T10:30:00Z" },
  address: { value: "42, Industrial Area, Sector 12, Bangalore, Karnataka 560001", dataSource: "GST_PORTAL" as const, sourceName: "Government GST Database", accessMethod: "API", dataTimestamp: "2026-06-30T10:30:00Z" },
  registrationStatus: { value: "Active", dataSource: "GST_PORTAL" as const, sourceName: "Government GST Database", accessMethod: "API", dataTimestamp: "2026-06-30T10:30:00Z" },
  registrationDate: { value: "2019-04-01", dataSource: "GST_PORTAL" as const, sourceName: "Government GST Database", accessMethod: "API", dataTimestamp: "2026-06-30T10:30:00Z", isStatic: true },
};

interface FilingRecord {
  period: string;
  status: "Filed" | "Not Filed" | "Unknown";
  filingDate: string;
}

const MOCK_FILING_HISTORY: FilingRecord[] = [
  { period: "May 2026", status: "Filed", filingDate: "2026-06-11" },
  { period: "Apr 2026", status: "Filed", filingDate: "2026-05-10" },
  { period: "Mar 2026", status: "Filed", filingDate: "2026-04-11" },
  { period: "Feb 2026", status: "Filed", filingDate: "2026-03-11" },
  { period: "Jan 2026", status: "Filed", filingDate: "2026-02-11" },
  { period: "Dec 2025", status: "Filed", filingDate: "2026-01-11" },
  { period: "Nov 2025", status: "Filed", filingDate: "2025-12-11" },
  { period: "Oct 2025", status: "Filed", filingDate: "2025-11-11" },
  { period: "Sep 2025", status: "Filed", filingDate: "2025-10-11" },
  { period: "Aug 2025", status: "Filed", filingDate: "2025-09-11" },
  { period: "Jul 2025", status: "Not Filed", filingDate: "\u2014" },
  { period: "Jun 2025", status: "Unknown", filingDate: "\u2014" },
];

interface VerificationRecord {
  date: string;
  verdict: Verdict;
  anomalyCode: string;
  invoiceValue: string;
}

const MOCK_VERIFICATION_HISTORY: VerificationRecord[] = [
  { date: "2026-06-28", verdict: "PASS", anomalyCode: "\u2014", invoiceValue: "\u20B94.2L" },
  { date: "2026-06-25", verdict: "FAIL", anomalyCode: "ANOM-GST-FMT-001", invoiceValue: "\u20B912.5L" },
  { date: "2026-06-20", verdict: "INCONCLUSIVE", anomalyCode: "ANOM-TRN-RAT-006", invoiceValue: "\u20B98.7L" },
  { date: "2026-06-15", verdict: "PASS", anomalyCode: "\u2014", invoiceValue: "\u20B95.2L" },
  { date: "2026-06-10", verdict: "FAIL", anomalyCode: "ANOM-PAN-STAT-007", invoiceValue: "\u20B934.5L" },
  { date: "2026-06-05", verdict: "PASS", anomalyCode: "\u2014", invoiceValue: "\u20B92.8L" },
];

const FILING_STATUS_STYLES: Record<string, string> = {
  Filed: "text-emerald-400",
  "Not Filed": "text-red-400",
  Unknown: "text-on-surface-variant",
};

export function SuppliersScreen() {
  const [selectedGstin, setSelectedGstin] = useState<string | null>(null);

  if (selectedGstin) {
    const supplier = MOCK_SUPPLIERS.find((s) => s.gstin === selectedGstin);
    if (!supplier) return null;

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedGstin(null)}
          className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors"
        >
          &larr; Back to Supplier Table
        </button>

        <section>
          <SupplierIntelligencePanel
            supplierIntelligence={MOCK_INTELLIGENCE}
            governmentVerificationStatus={"VERIFIED" as GovernmentVerificationStatus}
          />
        </section>

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
                {MOCK_FILING_HISTORY.map((record) => (
                  <tr key={record.period} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.period}</td>
                    <td className="text-body-sm px-4 py-3 whitespace-nowrap">
                      <span className={FILING_STATUS_STYLES[record.status]}>{record.status}</span>
                    </td>
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.filingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
                {MOCK_VERIFICATION_HISTORY.map((record, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <VerdictBadge verdict={record.verdict} />
                    </td>
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">{record.anomalyCode}</td>
                    <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-medium">{record.invoiceValue}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href="#" className="text-body-sm text-on-surface-variant hover:text-foreground transition-colors">View</a>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-label-caps text-on-surface-variant">
          Supplier Portfolio
        </span>
        <span className="text-body-sm text-on-surface-variant">
          {MOCK_SUPPLIERS.length} suppliers
        </span>
      </div>

      <div className="surface-card rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Supplier GSTIN</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">State</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Invoices</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Pass Rate</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">GSTIN Status</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Latest Filing Status</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Registration Age</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Sector Risk</th>
              <th className="text-data-mono text-on-surface-variant px-4 py-3 whitespace-nowrap">Detail</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SUPPLIERS.map((supplier) => (
              <tr
                key={supplier.gstin}
                className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap font-mono">
                  {maskGstin(supplier.gstin)}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.state}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.invoices}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.passRate}
                </td>
                <td className="text-body-sm px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${GSTIN_STATUS_COLORS[supplier.gstinStatus]}`} />
                    <span className="text-foreground">{supplier.gstinStatus}</span>
                  </span>
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.filingStatus}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.registrationAge}
                </td>
                <td className="text-body-sm text-foreground px-4 py-3 whitespace-nowrap">
                  {supplier.sectorRisk}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setSelectedGstin(supplier.gstin)}
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
    </div>
  );
}
