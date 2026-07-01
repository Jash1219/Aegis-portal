const ENGINE_CARDS = [
  {
    id: "TRANSIT_PHYSICS",
    name: "Transit Physics Engine",
    purpose:
      "Validates that declared transport distances are physically achievable within e-way bill validity windows for the specified transport mode.",
  },
  {
    id: "HSN_LOGIC",
    name: "HSN Lexical Distance Engine",
    purpose:
      "Evaluates semantic consistency between declared HSN codes and product descriptions using a HSN-product ontology.",
  },
  {
    id: "SYSTEM_GATEWAY",
    name: "API Gateway & Idempotency Layer",
    purpose:
      "Validates portal connectivity, API response integrity, and infrastructure-level communication with the GST and e-way bill systems.",
  },
];

export function EngineCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ENGINE_CARDS.map((card) => (
        <div
          key={card.id}
          className="bg-surface/60 border border-white/20 p-6 rounded-sm flex flex-col gap-3"
        >
          <div className="text-xs font-mono text-primary font-bold tracking-wider">
            {card.id}
          </div>
          <div className="text-sm text-on-surface-variant uppercase font-mono">
            {card.name}
          </div>
          <div className="text-xs text-on-surface-variant leading-relaxed">
            {card.purpose}
          </div>
        </div>
      ))}
    </div>
  );
}
