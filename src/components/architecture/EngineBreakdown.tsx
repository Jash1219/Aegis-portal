import {
  Fingerprint,
  Truck,
  Clock,
  BrainCircuit,
  Scale,
} from "lucide-react";

interface EngineCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EngineCard({ icon, title, description }: EngineCardProps) {
  return (
    <div className="rounded-lg border border-[#222222] bg-[#111111] p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-md border border-[#333333] bg-[#0A0A0A] p-2 text-blue-400">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-[#EDEDED]">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-[#A0A0A0]">{description}</p>
    </div>
  );
}

const engines = [
  {
    icon: <Fingerprint className="h-5 w-5" />,
    title: "Deduplication Core",
    description:
      "Cryptographic checks against duplicate invoice numbers and 64-char IRNs. Ensures every invoice is unique per supplier and financial year.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Transit Physics Engine",
    description:
      "Spatiotemporal validation of E-way bills against physical distance and time. Detects unrealistic speeds and impossible travel windows.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Document Chronology Engine",
    description:
      "Validates timestamp sequences to prevent impossible backdating or negative validity periods across IRN, EWB, and invoice dates.",
  },
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: "Fuzzy Logic & Arithmetic Engine",
    description:
      "Ensures strict GST geometry, symmetric CGST/SGST taxation, and composition dealer mathematical signatures within ₹1 tolerance.",
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Statutory Law Engine",
    description:
      "Maps HS codes, Place of Supply, and Tripartite (Bill-to-Ship-to) supply chains against tax regime legality under CGST Act.",
  },
];

export default function EngineBreakdown() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {engines.map((engine) => (
        <EngineCard
          key={engine.title}
          icon={engine.icon}
          title={engine.title}
          description={engine.description}
        />
      ))}
    </div>
  );
}
