"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExperimentContract } from "@/types/sandbox";

interface ExperimentSelectProps {
  experiments: ExperimentContract[];
  value: string;
  onChange: (id: string) => void;
  disabled: boolean;
}

export default function ExperimentSelect({
  experiments,
  value,
  onChange,
  disabled,
}: ExperimentSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = experiments.find((e) => e.id === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          "h-10 w-full rounded-lg border border-[#222222] bg-[#0a0a0a] px-md py-sm text-left font-body-sm text-body-sm outline-none transition-colors flex items-center justify-between",
          "focus-visible:border-primary",
          disabled && "opacity-40 cursor-not-allowed",
        )}
      >
        <span className="text-primary">
          {active?.title ?? ""}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-on-surface-variant transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#0a0a0a] border border-[#222222] rounded-lg overflow-hidden shadow-xl max-h-60 overflow-y-auto">
          {experiments.map((exp) => {
            const selected = exp.id === value;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => {
                  onChange(exp.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-sm px-md py-sm text-left font-body-sm text-body-sm transition-colors border-b border-[#222222]/50 last:border-b-0",
                  selected && "bg-primary/10",
                  "text-primary hover:bg-white/[0.03] cursor-pointer border-l-2 border-l-transparent",
                )}
              >
                {exp.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
