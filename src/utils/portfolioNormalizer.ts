"use client";

import type { NormalizedUploadRow, NormalizationResult } from "@/types/portfolioUpload";

const COLUMN_ALIASES: Record<string, string[]> = {
  invoice_number: [
    "invoice_number", "invoice no", "invoice#", "inv_no", "inv num",
    "invoice number", "invoiceno", "invoicenumber",
  ],
  supplier_gstin: [
    "supplier_gstin", "supplier_gst", "supplier gstin", "gstin_supplier",
    "gstin of supplier", "supplier gstin no", "supplier gst", "supplier_gst_no",
  ],
  buyer_gstin: [
    "buyer_gstin", "buyer_gst", "buyer gstin", "gstin_buyer",
    "gstin of buyer", "buyer gstin no", "buyer gst", "buyer_gst_no",
  ],
  invoice_date: [
    "invoice_date", "date", "inv_date", "invoice date", "invoice dt",
    "invoicedate", "invdate",
  ],
  invoice_face_value_inr: [
    "invoice_face_value_inr", "face_value", "amount", "invoice_amount",
    "inv amount", "total", "invoice value", "face value", "invoice amount",
    "facevalue", "invoicevalue", "inv_amount", "inv_value",
  ],
  taxable_value: [
    "taxable_value", "taxable amount", "taxable_amt", "taxable value",
    "taxablevalue",
  ],
  hsn_code: [
    "hsn_code", "hsn", "hsn code", "hsn_no", "hsn no", "hsncode",
  ],
  declared_gst_rate: [
    "declared_gst_rate", "gst_rate", "rate", "tax rate", "gst%",
    "gst rate", "gst %", "gstrate", "declared gst rate",
  ],
  product_description: [
    "product_description", "description", "product", "product description",
    "item description", "goods description", "product desc",
    "productdescription", "item_description",
  ],
  transport_mode_hint: [
    "transport_mode_hint", "transport_mode", "mode", "mode_of_transport",
    "transport mode", "transportmode",
  ],
  declared_distance_km: [
    "declared_distance_km", "distance_km", "distance", "dist_km",
    "declared distance", "distancekm",
  ],
  ewb_generated_at: [
    "ewb_generated_at", "ewb_date", "ewb_gen_date", "ewb generated at",
    "eway bill date", "ewbdate",
  ],
};

const REQUIRED_FIELDS = [
  "invoice_number",
  "supplier_gstin",
  "invoice_date",
  "invoice_face_value_inr",
] as const;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function findColumn(headers: string[], aliases: string[]): string | undefined {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());
  for (const alias of aliases) {
    const idx = lowerHeaders.indexOf(alias.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return undefined;
}

function toNumber(val: string): number | undefined {
  const cleaned = val.replace(/[₹,,\s]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? undefined : n;
}

let idCounter = 0;

export function normalizeCSV(csvText: string): NormalizationResult {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) {
    return { rows: [], rejectedCount: 0, errors: ["CSV must contain at least a header row and one data row."] };
  }

  const rawHeaders = parseCSVLine(lines[0]);
  if (rawHeaders.length === 0) {
    return { rows: [], rejectedCount: 0, errors: ["CSV header row is empty."] };
  }

  const canonicalHeaders: Record<string, string | undefined> = {};
  for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
    const found = findColumn(rawHeaders, aliases);
    if (found) canonicalHeaders[canonical] = found;
  }

  const missingRequired = REQUIRED_FIELDS.filter((f) => !canonicalHeaders[f]);
  if (missingRequired.length > 0) {
    return {
      rows: [],
      rejectedCount: 0,
      errors: [
        `Missing required columns in CSV header: ${missingRequired.join(", ")}. ` +
        `Found columns: ${rawHeaders.join(", ")}`,
      ],
    };
  }

  const rows: NormalizedUploadRow[] = [];
  let rejectedCount = 0;
  const rowErrors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const rawRow: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      rawRow[h] = (values[idx] ?? "").trim();
    });

    const getVal = (canonical: string): string => {
      const header = canonicalHeaders[canonical];
      return header ? rawRow[header] ?? "" : "";
    };

    const invoiceNumber = getVal("invoice_number");
    const supplierGstin = getVal("supplier_gstin");
    const buyerGstin = getVal("buyer_gstin") || undefined;
    const invoiceDate = getVal("invoice_date");
    const faceValueRaw = getVal("invoice_face_value_inr");
    const faceValueINR = toNumber(faceValueRaw);

    const rowRejections: string[] = [];
    if (!invoiceNumber) rowRejections.push("invoice_number");
    if (!supplierGstin) rowRejections.push("supplier_gstin");
    if (!invoiceDate) rowRejections.push("invoice_date");
    if (faceValueINR === undefined || faceValueINR <= 0) rowRejections.push("invoice_face_value_inr");

    if (rowRejections.length > 0) {
      rejectedCount++;
      rowErrors.push(`Row ${i}: rejected — missing/invalid required fields: ${rowRejections.join(", ")}`);
      continue;
    }


    const taxableValue = toNumber(getVal("taxable_value"));
    const hsnCode = getVal("hsn_code") || undefined;
    const declaredGstRate = toNumber(getVal("declared_gst_rate"));
    const productDescription = getVal("product_description") || undefined;
    const transportModeHint = getVal("transport_mode_hint") || undefined;
    const declaredDistanceKm = toNumber(getVal("declared_distance_km"));
    const ewbGeneratedAt = getVal("ewb_generated_at") || undefined;

    idCounter++;
    const rowId = `UPL-${String(idCounter).padStart(6, "0")}`;

    const rawPayload: Record<string, unknown> = {
      invoice_number: invoiceNumber,
      supplier_gstin: supplierGstin,
      invoice_date: invoiceDate,
      invoice_face_value_inr: faceValueINR,
    };
    if (buyerGstin) rawPayload.buyer_gstin = buyerGstin;
    if (taxableValue !== undefined) rawPayload.taxable_value = taxableValue;
    if (hsnCode) rawPayload.hsn_code = hsnCode;
    if (declaredGstRate !== undefined) rawPayload.declared_gst_rate = declaredGstRate;
    if (productDescription) rawPayload.product_description = productDescription;
    if (transportModeHint) rawPayload.transport_mode_hint = transportModeHint;
    if (declaredDistanceKm !== undefined) rawPayload.declared_distance_km = declaredDistanceKm;
    if (ewbGeneratedAt) rawPayload.ewb_generated_at = ewbGeneratedAt;

    rows.push({
      id: rowId,
      invoiceNumber,
      supplierGstin: supplierGstin.toUpperCase(),
      ...(buyerGstin ? { buyerGstin: buyerGstin.toUpperCase() } : {}),
      invoiceDate,
      faceValueINR: faceValueINR as number,
      taxableValue,
      hsnCode,
      declaredGstRate,
      productDescription,
      transportModeHint,
      declaredDistanceKm,
      ewbGeneratedAt,
      rawPayload,
    });
  }

  return { rows, rejectedCount, errors: rowErrors };
}
