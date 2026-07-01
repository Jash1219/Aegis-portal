const TELEMETRY_CARDS = [
  {
    value: "8",
    label: "ACTIVE PREDICATES",
    subtext: "Lifecycle-Gated Active Controls",
    subClass: "text-emerald-400",
  },
  {
    value: "12",
    label: "ROADMAP PREDICATES",
    subtext: "Gated Lifecycle Definitions",
    subClass: "text-amber-400",
  },
  {
    value: "Client RAM",
    label: "COMPUTATION HOST",
    subtext: "Air-Gapped HTML5 FileReader",
    subClass: "text-on-surface-variant",
  },
  {
    value: "0.0 Bytes",
    label: "NETWORK EGRESS",
    subtext: "Client-RAM Isolation",
    subClass: "text-emerald-400",
  },
];

export function SovereignTelemetryGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-28">
      <div className="text-xs font-mono text-on-surface-variant mb-4 uppercase tracking-[0.2em] border-b border-white/10 pb-2">
        SOVEREIGN SYSTEM STATE
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {TELEMETRY_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-surface p-8"
          >
            <div className="text-4xl md:text-5xl font-bold font-mono text-primary leading-none tracking-tight">
              {card.value}
            </div>
            <div className="text-xs text-on-surface-variant uppercase mt-4 tracking-wider">
              {card.label}
            </div>
            <div className={`text-[11px] font-mono mt-1.5 ${card.subClass}`}>
              {card.subtext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
