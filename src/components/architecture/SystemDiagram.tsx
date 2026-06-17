import {
  Building2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Trash2,
  Database,
  Lock,
} from "lucide-react";

interface FlowNodeProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function FlowNode({ icon, title, subtitle }: FlowNodeProps) {
  return (
    <div className="flex w-44 shrink-0 flex-col items-center gap-2 rounded-lg border border-[#333333] bg-[#111111] px-4 py-4 text-center">
      <div className="text-blue-400">{icon}</div>
      <span className="text-xs font-medium text-[#EDEDED]">{title}</span>
      <span className="text-[10px] leading-tight text-[#666666]">
        {subtitle}
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center text-[#444444]">
      <ArrowRight className="h-5 w-5" />
    </div>
  );
}

export default function SystemDiagram() {
  return (
    <div className="space-y-8">
      {/* Main Flow - horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap">
        <FlowNode
          icon={<Building2 className="h-6 w-6" />}
          title="Client ERP"
          subtitle="Invoice & EWB Data"
        />
        <Arrow />
        <FlowNode
          icon={<ShieldCheck className="h-6 w-6" />}
          title="API Gateway / Auth"
          subtitle="x-api-key + Idempotency"
        />
        <Arrow />
        <FlowNode
          icon={<Cpu className="h-6 w-6" />}
          title="Stateless Engine"
          subtitle="6 Deterministic Checks"
        />
        <Arrow />
        <FlowNode
          icon={<CheckCircle2 className="h-6 w-6" />}
          title="Verdict Generated"
          subtitle="PASS / FAIL / REJECT"
        />
        <Arrow />
        <FlowNode
          icon={<Trash2 className="h-6 w-6" />}
          title="In-Memory Discard"
          subtitle="No JSON or PII Persisted"
        />
      </div>

      {/* Database Box - isolated */}
      <div className="flex justify-center">
        <div className="flex w-72 items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-4">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-amber-300">
                Database
              </span>
              <Lock className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-amber-400/70">
              Stores only hashes (SHA-256) and UUIDs.{" "}
              <span className="font-semibold text-amber-300">
                NO PII / Financial Data.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
