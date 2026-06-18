"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";

interface JsonPayloadCardProps {
  label: string;
  json: string;
}

export default function JsonPayloadCard({ label, json }: JsonPayloadCardProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden">
      <div
        onClick={() => setCollapsed(!collapsed)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCollapsed(!collapsed); } }}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        className="w-full flex items-center justify-between px-lg py-md hover:bg-[#161616] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-sm">
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          ) : (
            <ChevronDown className="h-4 w-4 text-on-surface-variant" />
          )}
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            {label}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {!collapsed && (
        <div className="px-lg pb-md">
          <pre className="font-data-mono text-data-mono text-on-surface-variant bg-[#0a0a0a] border border-[#222222] rounded p-md overflow-x-auto max-h-80 overflow-y-auto">
            {json}
          </pre>
        </div>
      )}
    </div>
  );
}
