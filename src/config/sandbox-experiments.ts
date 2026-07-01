export interface SandboxExperiment {
  id: string;
  label: string;
  engine: string;
  description: string;
}

export const SANDBOX_EXPERIMENTS: SandboxExperiment[] = [
  {
    id: "V-CHRONO-001",
    label: "Invoice vs EWB Dispatch Chronology",
    engine: "Temporal Sequence Engine",
    description:
      "Verifies that the invoice date precedes the e-way bill generation date. Reverse chronology indicates post-dated documentation.",
  },
  {
    id: "V-HSN-003",
    label: "HSN Waterfall Fallback Lookup",
    engine: "HSN Lexical Distance Engine",
    description:
      "Verifies that the HSN code digit depth (4-digit vs 6-digit vs 8-digit) is appropriate for the invoice value and industry.",
  },
  {
    id: "V-RATE-001",
    label: "Statutory GST Conformance",
    engine: "GST Rate Engine",
    description:
      "Confirms the declared GST rate matches the statutory rate for the given HSN code under the GST council rate matrix.",
  },
  {
    id: "V-IDENTITY-001",
    label: "PAN Entity Linkage & Self-Supply Verification",
    engine: "Identity & Entity Verification",
    description:
      "Verifies that the PAN embedded in the GSTIN matches the PAN registered with the Income Tax Department for the declared business entity.",
  },
  {
    id: "V-DUP-FIN-003",
    label: "[ ROADMAP — LOCKED FOR PILOT ]",
    engine: "Deduplication Core",
    description:
      "Flags if the same beneficiary bank account has been used across multiple different suppliers, indicating a possible shell entity network.",
  },
];
