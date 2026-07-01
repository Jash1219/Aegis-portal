"use client";

import { Download } from "lucide-react";

const CSV_HEADER = [
  "invoice_number",
  "supplier_gstin",
  "buyer_gstin",
  "invoice_date",
  "invoice_face_value_inr",
  "taxable_value",
  "hsn_code",
  "declared_gst_rate",
  "product_description",
  "transport_mode_hint",
  "declared_distance_km",
  "ewb_generated_at",
];

const SAMPLE_ROWS = [
  [
    "INV-2026-TRUST-001",
    "27AAPFU0939F1ZV",
    "24AAACC1206D1ZM",
    "2026-06-10",
    "250000",
    "200000",
    "8471",
    "18",
    "Laptop computers",
    "ROAD",
    "450",
    "2026-06-12T10:00:00+05:30",
  ],
  [
    "INV-2026-TRUST-002",
    "27AAPFU0939F1ZV",
    "24AAACC1206D1ZM",
    "2026-06-11",
    "500000",
    "400000",
    "5201",
    "5",
    "Cotton yarn",
    "ROAD",
    "200",
    "2026-06-13T08:30:00+05:30",
  ],
];

function buildCSV(): string {
  const headerLine = CSV_HEADER.join(",");
  const rows = SAMPLE_ROWS.map((r) =>
    r.map((cell) => (cell.includes(",") ? `"${cell}"` : cell)).join(","),
  ).join("\n");
  return `${headerLine}\n${rows}\n`;
}

function downloadCSV(): void {
  const csv = buildCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "AEGIS_Canonical_Template_v4.1.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DownloadCsvButton() {
  return (
    <button
      onClick={downloadCSV}
      className="flex items-center gap-sm px-md py-sm rounded-lg bg-primary/20 border border-primary/30 text-primary font-label-caps text-label-caps hover:bg-primary/30 transition-colors cursor-pointer"
    >
      <Download className="h-4 w-4" />
      Download CSV
    </button>
  );
}
