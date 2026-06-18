"use client";

import { cn } from "@/lib/utils";
import type { VisibilityMode } from "@/types/sandbox";

interface ModeToggleProps {
  mode: VisibilityMode;
  onChange: (mode: VisibilityMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-lg p-xs w-fit">
      <button
        onClick={() => onChange("EXECUTIVE")}
        className={cn(
          "font-label-caps text-label-caps px-md py-sm rounded-md transition-colors cursor-pointer",
          mode === "EXECUTIVE"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-primary",
        )}
      >
        Executive
      </button>
      <button
        onClick={() => onChange("EXPERT")}
        className={cn(
          "font-label-caps text-label-caps px-md py-sm rounded-md transition-colors cursor-pointer",
          mode === "EXPERT"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-primary",
        )}
      >
        Expert
      </button>
    </div>
  );
}
