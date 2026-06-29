import DownloadCsvButton from "@/components/onboarding/DownloadCsvButton";

const SCHEMA_DEFINITIONS: {
  property: string;
  mandatory: boolean;
  acceptedHeaders: string;
}[] = [
  {
    property: "invoice_number",
    mandatory: true,
    acceptedHeaders:
      "invoice_number, invoice no, invoice#, inv_no, inv num, invoice number, invoiceno, invoicenumber",
  },
  {
    property: "supplier_gstin",
    mandatory: true,
    acceptedHeaders:
      "supplier_gstin, supplier_gst, supplier gstin, gstin_supplier, gstin of supplier, supplier gstin no, supplier gst, supplier_gst_no",
  },
  {
    property: "buyer_gstin",
    mandatory: false,
    acceptedHeaders:
      "buyer_gstin, buyer_gst, buyer gstin, gstin_buyer, gstin of buyer, buyer gstin no, buyer gst, buyer_gst_no",
  },
  {
    property: "invoice_date",
    mandatory: true,
    acceptedHeaders:
      "invoice_date, date, inv_date, invoice date, invoice dt, invoicedate, invdate",
  },
  {
    property: "invoice_face_value_inr",
    mandatory: true,
    acceptedHeaders:
      "invoice_face_value_inr, face_value, amount, invoice_amount, inv amount, total, invoice value, face value, invoice amount, facevalue, invoicevalue, inv_amount, inv_value",
  },
  {
    property: "taxable_value",
    mandatory: false,
    acceptedHeaders:
      "taxable_value, taxable amount, taxable_amt, taxable value, taxablevalue",
  },
  {
    property: "hsn_code",
    mandatory: false,
    acceptedHeaders:
      "hsn_code, hsn, hsn code, hsn_no, hsn no, hsncode",
  },
  {
    property: "declared_gst_rate",
    mandatory: false,
    acceptedHeaders:
      "declared_gst_rate, gst_rate, rate, tax rate, gst%, gst rate, gst %, gstrate, declared gst rate",
  },
  {
    property: "product_description",
    mandatory: false,
    acceptedHeaders:
      "product_description, description, product, product description, item description, goods description, product desc, productdescription, item_description",
  },
  {
    property: "transport_mode_hint",
    mandatory: false,
    acceptedHeaders:
      "transport_mode_hint, transport_mode, mode, mode_of_transport, transport mode, transportmode",
  },
  {
    property: "declared_distance_km",
    mandatory: false,
    acceptedHeaders:
      "declared_distance_km, distance_km, distance, dist_km, declared distance, distancekm",
  },
  {
    property: "ewb_generated_at",
    mandatory: false,
    acceptedHeaders:
      "ewb_generated_at, ewb_date, ewb_gen_date, ewb generated at, eway bill date, ewbdate",
  },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-lg">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Ingestion & Schema Center
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Canonical CSV template, accepted header aliases, and field
            requirements for portfolio ingestion.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
                Canonical CSV Ingestion Template
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                AEGIS_Canonical_Template_v4.1.csv &mdash; 12 columns, 2 sample
                rows
              </span>
            </div>
            <DownloadCsvButton />
          </div>
        </div>

        <div className="flex flex-col gap-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Accepted Header Aliases
          </span>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                    Property
                  </th>
                  <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                    Mandatory
                  </th>
                  <th className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-left px-sm py-md">
                    Accepted Headers
                  </th>
                </tr>
              </thead>
              <tbody>
                {SCHEMA_DEFINITIONS.map((def) => (
                  <tr
                    key={def.property}
                    className="border-b border-[#222222] hover:bg-[#111111] transition-colors"
                  >
                    <td className="font-data-mono text-data-mono text-primary px-sm py-md">
                      {def.property}
                    </td>
                    <td className="px-sm py-md">
                      <span
                        className={`font-data-mono text-data-mono ${def.mandatory ? "text-emerald-400" : "text-on-surface-variant"}`}
                      >
                        {def.mandatory ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="font-body-sm text-body-sm text-on-surface px-sm py-md leading-relaxed">
                      {def.acceptedHeaders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
