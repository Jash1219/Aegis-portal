"use client";

import { useMemo, useRef, useEffect } from "react";

const BASE_LINES = [
  { type: "info", text: "[BUFFER ACTIVE] Local Deterministic Runtime" },
  { type: "info", text: "AEGIS v1.0.0 — sandbox session initialised" },
  { type: "info", text: "Engine status: all subsystems nominal" },
  { type: "info", text: "Awaiting payload..." },
];

interface TerminalProps {
  verdict?: string | null;
}

export function Terminal({ verdict }: TerminalProps) {
  const lines = useMemo(() => {
    const result = [...BASE_LINES];
    if (verdict) {
      result.push({
        type: "result",
        text: "Advisory Classification: High Severity Finding",
      });
    }
    return result;
  }, [verdict]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="bg-black/80 border border-white/10 rounded-sm font-mono text-xs p-4 h-48 overflow-y-auto">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`leading-relaxed ${
            line.type === "result"
              ? "text-yellow-400 font-bold"
              : "text-emerald-400"
          }`}
        >
          {`> ${line.text}`}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
