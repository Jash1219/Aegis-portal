import { Fingerprint, DollarSign, BarChart3, MapPin } from "lucide-react";

const callouts = [
  {
    icon: Fingerprint,
    title: "Cryptographic Data Anchor",
    description:
      "Ensures non-repudiation. Every report is cryptographically tied to the exact state of the verification engine at the time of execution.",
  },
  {
    icon: DollarSign,
    title: "Flagged Invoice Value",
    description:
      "Direct Capital Protection ROI. Instantly identifies the exact rupee exposure of mathematically anomalous invoices in the portfolio.",
  },
  {
    icon: BarChart3,
    title: "Integrity Verdict Breakdown",
    description:
      "Portfolio Health at a glance. Categorizes risk into actionable PASS, FAIL, and INCONCLUSIVE buckets.",
  },
  {
    icon: MapPin,
    title: "Exposure Signatures",
    description:
      "Maps isolated validation failures (e.g., Transit Physics, Duplicate IRN) into executive-level audit findings.",
  },
];

export default function ReportAnnotations() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#EDEDED]">
        What to Look For
      </h3>
      {callouts.map((callout) => {
        const Icon = callout.icon;
        return (
          <div
            key={callout.title}
            className="rounded-lg border border-[#222222] bg-[#0A0A0A] p-4"
          >
            <div className="mb-2 flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <h4 className="text-sm font-medium text-[#EDEDED]">
                {callout.title}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-[#A0A0A0]">
              {callout.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
