import { writeFileSync } from "node:fs";
import { join } from "node:path";

const MARGIN = 56;
const PAGE_W = 612;
const PAGE_H = 792;
const BODY_W = PAGE_W - MARGIN * 2;

function escapePdfString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(): Buffer {
  const objects: string[] = [];
  let objNum = 0;

  const addObj = (content: string): number => {
    const n = ++objNum;
    const data = `${n} 0 obj\n${content}\nendobj\n`;
    objects.push(data);
    return n;
  };

  const addStream = (
    data: string,
    dict: Record<string, string> = {},
  ): number => {
    const stream = `${Object.entries(dict)
      .map(([k, v]) => `/${k} ${v}`)
      .join("\n")}\n/Length ${Buffer.byteLength(data, "utf-8")}`;
    return addObj(`<<${stream}>>\nstream\n${data}\nendstream`);
  };

  const fontObj = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  );
  const fontBoldObj = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  );
  const fontMonoObj = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
  );

  const lines: string[] = [];
  let y = PAGE_H - MARGIN;

  const text = (s: string, size = 10, bold = false, color = "0") => {
    const font = bold ? fontBoldObj : fontObj;
    lines.push(`BT /F${font} ${size} Tf ${color} rg`);
    lines.push(`1 0 0 1 ${MARGIN} ${y} Tm (${escapePdfString(s)}) Tj ET`);
    y -= size * 1.2;
  };

  const line = () => {
    lines.push(
      `${MARGIN} ${y + 6} ${MARGIN + BODY_W} ${y + 6} re S`,
    );
    y -= 10;
  };

  // Title
  y -= 10;
  text("SAMPLE HISTORICAL AUDIT REPORT", 22, true, "0.15 0.25 0.5");
  y -= 4;
  text("Generated Using Synthetic Demonstration Data", 10, false, "0.6 0.2 0.2");
  y -= 8;
  line();
  y -= 4;
  text(
    "AEGIS Verification Engine — Portfolio Risk Assessment",
    11,
    true,
    "0.2 0.3 0.4",
  );
  y -= 2;
  text("Report Date: June 2026 | Engagement: Pilot Phase", 9, false, "0.4");
  y -= 12;

  // Summary box
  const summaryBoxY = y;
  lines.push("0.9 0.9 0.95 rg");
  lines.push(`${MARGIN - 4} ${y - 4} ${BODY_W + 8} 88 re f`);
  y -= 6;
  text("EXECUTIVE SUMMARY", 12, true, "0.15 0.25 0.5");
  text(
    "This report presents the results of a comprehensive audit of 20 synthetic invoice",
    9,
    false,
    "0.2",
  );
  text(
    "transactions evaluated by the AEGIS verification engine. The portfolio exhibits a",
    9,
    false,
    "0.2",
  );
  text(
    "risk profile consistent with early-stage capital deployment, with 40% of invoices",
    9,
    false,
    "0.2",
  );
  text(
    "flagged for mathematical anomalies, statutory non-compliance, or transit physics",
    9,
    false,
    "0.2",
  );
  text(
    "violations. Total flagged value: INR 4,28,000.",
    9,
    false,
    "0.2",
  );
  y = summaryBoxY - 92;
  y -= 8;

  // Key Metrics
  text("KEY METRICS", 12, true, "0.15 0.25 0.5");
  line();
  y -= 2;

  const metrics = [
    ["Total Invoices Audited", "20"],
    ["Passed (PASS)", "1"],
    ["Failed (FAIL / REJECT)", "16"],
    ["Inconclusive (INCONCLUSIVE / PEND)", "3"],
    ["Anomaly Coverage", "100%"],
    ["Highest Severity Found", "CRITICAL"],
  ];
  for (const [label, value] of metrics) {
    text(`${label}:  ${value}`, 10, false, "0.2");
  }
  y -= 8;

  // Anomaly Breakdown
  text("ANOMALY BREAKDOWN", 12, true, "0.15 0.25 0.5");
  line();
  y -= 2;

  const anomalies = [
    ["GSTIN Checksum Failure", "1 invoice"],
    ["Self-Supply Detected", "1 invoice"],
    ["Duplicate Invoice / IRN", "2 invoices"],
    ["Transit Physics Violation", "3 invoices"],
    ["Document Chronology Violation", "4 invoices"],
    ["Tax Arithmetic / Geometry", "3 invoices"],
    ["Statutory Law Violation", "3 invoices"],
  ];
  for (const [anomaly, count] of anomalies) {
    text(`${anomaly.padEnd(40, ".")} ${count}`, 10, false, "0.2");
  }
  y -= 10;

  // CRO Findings
  text("RISK FINDINGS FOR CRO REVIEW", 12, true, "0.5 0.15 0.15");
  line();
  y -= 2;

  const findings = [
    "1. Capital Exposure: INR 4,28,000 in flagged invoices requires immediate",
    "   reconciliation before funding pipeline expansion.",
    "2. Statutory Risk: 35% of invoices exhibit GST compliance failures",
    "   (dual tax regime, place of supply mismatches, missing Part-B updates).",
    "3. Operational Alpha: AEGIS detected 6 distinct anomaly classes across",
    "   20 invoices — manual sampling would miss 70% of these signals.",
    "4. Recommendation: Deploy automated verification gates at invoice",
    "   submission to prevent capital leakage.",
  ];
  for (const finding of findings) {
    text(finding, 9, false, "0.2");
  }

  const contentStream = lines.join("\n");

  const pageContentObj = addStream(contentStream);

  const pagesObj = addObj(
    "<< /Type /Pages /Kids [0 0 R] /Count 1 >>",
  );

  const pageObj = addObj(
    `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${pageContentObj} 0 R /Resources << /Font << /F${fontObj} ${fontObj} 0 R /F${fontBoldObj} ${fontBoldObj} 0 R /F${fontMonoObj} ${fontMonoObj} 0 R >> >> >>`,
  );

  // Patch pagesObj kids list now that pageObj is known
  objects[pagesObj - 1] = objects[pagesObj - 1].replace(
    "Kids [0 0 R]",
    `Kids [${pageObj} 0 R]`,
  );

  const catalogObj = addObj(
    `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`,
  );

  // Build final PDF
  const header = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";
  let body = header;
  const offs: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offs.push(Buffer.byteLength(body, "utf-8"));
    body += objects[i];
  }

  const xrefOffset = Buffer.byteLength(body, "utf-8");
  let xref = "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
  for (const off of offs) {
    xref += String(off).padStart(10, "0") + " 00000 n \n";
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(body + xref + trailer, "utf-8");
}

const pdfBuffer = buildPdf();
const outPath = join(import.meta.dirname, "..", "public", "historical_audit_report.pdf");
writeFileSync(outPath, pdfBuffer);
console.log(`PDF written to ${outPath} (${pdfBuffer.length} bytes)`);
