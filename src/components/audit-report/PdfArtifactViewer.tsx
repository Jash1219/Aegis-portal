import { FileText } from "lucide-react";

export default function PdfArtifactViewer() {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg opacity-90 flex flex-col gap-md">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-on-surface-variant" />
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Cryptographic Data Anchor (Synthetic Artifact)
        </span>
      </div>
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-xl flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-sm text-on-surface-variant">
          <FileText className="h-8 w-8 opacity-40" />
          <span className="font-body-sm text-body-sm text-center">
            Synthetic artifact placeholder — no PDF attached
          </span>
          <span className="font-data-mono text-data-mono text-xs opacity-40">
            SHA-256: a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
          </span>
        </div>
      </div>
    </div>
  );
}
