import Link from "next/link";

const GOV_CARDS = [
  {
    href: "/rules",
    title: "Statutory Rule Manifest",
    desc: "Inspect the 1:1 statutory mapping of all active CBIC compliance rules and their required execution evidence.",
  },
  {
    href: "/trust",
    title: "Sovereign Trust Center",
    desc: "Verify our immutable declarations of local-first execution, browser RAM containment, and zero-PII processing.",
  },
  {
    href: "/onboarding",
    title: "Ingestion Schemas & ERP",
    desc: "Download the AEGIS canonical CSV template and inspect the automatic alias resolution dictionary.",
  },
];

export function GovernanceRoutingDock() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="mb-8 max-w-2xl">
        <div className="font-mono text-[10px] tracking-[0.2em] text-on-surface-variant uppercase mb-2">
          INSTITUTIONAL INTERLOCK
        </div>
        <h2 className="text-2xl font-bold font-mono text-primary tracking-tight uppercase">
          TRUST & GOVERNANCE DOCK
        </h2>
        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
          Inspect immutable system declarations, statutory compliance mappings,
          and canonical ERP schemas.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GOV_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-surface/60 border border-white/20 hover:border-primary/60 p-8 block transition-all hover:-translate-y-0.5 min-h-[180px] flex flex-col justify-center"
          >
            <div className="font-mono text-sm text-primary font-bold tracking-wider mb-3">
              {card.title}
            </div>
            <div className="text-xs text-on-surface-variant leading-relaxed">
              {card.desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
