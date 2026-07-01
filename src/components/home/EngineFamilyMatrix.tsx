const ENGINE_FAMILIES = [
  {
    key: "DUPLICATE_FINANCING",
    name: "Deduplication Core",
    desc: "Detects intra-batch identifier collisions to prevent duplicate invoice counting within the active upload session.",
  },
  {
    key: "GST_GEOMETRY",
    name: "Volumetric Analyser",
    desc: "Evaluates declared transaction totals against local Place of Supply (POS) logic and state-code syntax rules.",
  },
  {
    key: "TRANSIT_PHYSICS",
    name: "Spatiotemporal Feasibility",
    desc: "Executes scalar velocity calculations (distance / time delta) to flag mathematically improbable transport speeds.",
  },
  {
    key: "CHRONOLOGY_OVERRIDE",
    name: "Temporal Sequence",
    desc: "Audits transaction timestamps to verify that invoice generation strictly precedes e-way bill dispatch and expiration milestones.",
  },
  {
    key: "RATE_MATRIX",
    name: "Statutory Slab Auditor",
    desc: "Validates declared tax percentages against the canonical set of Indian statutory GST slab rates (0%, 5%, 12%, 18%, 28%).",
  },
  {
    key: "HSN_LOGIC",
    name: "Taxonomy Classifier",
    desc: "Cross-references declared HSN codes against an in-memory item ontology to detect semantic product misclassification.",
  },
  {
    key: "SYSTEM_GATEWAY",
    name: "Infrastructure Integrity",
    desc: "Validates client-side payload schema compliance and tracks local evaluation loop execution latencies.",
  },
  {
    key: "IDENTITY_ENTITY",
    name: "PAN Syntax Validator",
    desc: "Performs positional string extraction to verify valid Permanent Account Number (PAN) syntax embedded within the GSTIN.",
  },
];

export function EngineFamilyMatrix() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-28">
      <div className="mb-8 max-w-2xl">
        <div className="font-mono text-[10px] tracking-[0.2em] text-on-surface-variant uppercase mb-2">
          SYSTEM ARCHITECTURE
        </div>
        <h2 className="text-2xl font-bold font-mono text-primary tracking-tight uppercase">
          CORE VALIDATION ENGINE FAMILIES
        </h2>
        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
          Stateless client-side subsystems enforcing deterministic fiscal,
          structural, and spatiotemporal geometry.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {ENGINE_FAMILIES.map((item) => (
          <div
            key={item.key}
            className="bg-surface p-8 hover:bg-surface-container-low transition-all relative overflow-hidden group border-t-2 border-transparent hover:border-primary flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-mono text-primary font-bold tracking-wider mb-2 bg-primary/10 px-2 py-0.5 inline-block rounded-sm uppercase">
                {item.key}
              </div>
              <div className="text-sm text-on-surface-variant uppercase font-mono mb-4 pb-2 border-b border-white/10">
                {item.name}
              </div>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
