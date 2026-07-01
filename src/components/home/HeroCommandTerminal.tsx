import Link from "next/link";

export function HeroCommandTerminal() {
  return (
    <div className="mt-28 mb-28 relative">
      <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] tracking-widest font-mono text-on-surface-variant/40 select-none pointer-events-none">
        <span>SYS.ROOT.01</span>
        <span>51.5074&deg; N, 0.1278&deg; W</span>
      </div>

      <div className="max-w-5xl mx-auto border-y border-white/10 bg-surface/30 backdrop-blur-md py-16 md:py-20 text-center">
        <h1 className="text-7xl md:text-9xl font-bold tracking-[0.15em] text-primary select-none uppercase font-mono">
          AEGIS
        </h1>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-4 text-center">
        <p className="text-2xl md:text-3xl font-bold text-primary font-mono tracking-tight">
          Deterministic Statutory GST Intelligence & Evidence Layer
        </p>
        <p className="text-base text-on-surface-variant mt-4 leading-relaxed">
          Stateless client-side verification with deterministic replay
          parity. Ingest, normalize, and audit corporate ledgers with zero
          network data egress.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 md:gap-6 max-w-xl mx-auto mt-10 font-mono text-sm uppercase tracking-widest">
        <Link
          href="/portfolio"
          className="w-[180px] md:w-[220px] bg-primary text-background border border-primary hover:bg-surface-variant hover:text-primary p-5 text-center block transition-colors font-bold min-h-[96px] flex flex-col items-center justify-center"
        >
          Execute Macro Scan
          <span className="text-xs text-background/70 block lowercase font-normal tracking-normal">
            Batch CSV Ingestion
          </span>
        </Link>
        <Link
          href="/sandbox"
          className="w-[180px] md:w-[220px] bg-surface text-primary border border-white/20 hover:bg-white/5 p-5 text-center block transition-colors min-h-[96px] flex flex-col items-center justify-center"
        >
          Initiate Sandbox
          <span className="text-xs text-primary/60 block lowercase tracking-normal">
            Mathematical Proof Inspector
          </span>
        </Link>
      </div>
    </div>
  );
}
