import type { TechnicalEvidenceCardProps } from "@/types/explainability";

export function TechnicalEvidenceCard({
  telemetryData,
  timestamps,
  hashes,
}: TechnicalEvidenceCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        Technical Evidence
      </span>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-data-mono text-data-mono">
          <thead>
            <tr className="border-b border-[#222222]">
              <th className="py-xs px-sm text-label-caps text-on-surface-variant font-normal">
                Telemetry
              </th>
              <th className="py-xs px-sm text-label-caps text-on-surface-variant font-normal">
                Timestamp
              </th>
              <th className="py-xs px-sm text-label-caps text-on-surface-variant font-normal">
                Hash
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#222222] hover:bg-[#161616] transition-colors">
              <td className="py-xs px-sm text-on-surface">{telemetryData}</td>
              <td className="py-xs px-sm text-on-surface-variant">
                {timestamps}
              </td>
              <td className="py-xs px-sm text-on-surface-variant font-mono text-[11px]">
                {hashes}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
