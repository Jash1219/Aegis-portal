import { HeroCommandTerminal } from "@/components/home/HeroCommandTerminal";
import { SovereignTelemetryGrid } from "@/components/home/SovereignTelemetryGrid";
import { EngineFamilyMatrix } from "@/components/home/EngineFamilyMatrix";
import { GovernanceRoutingDock } from "@/components/home/GovernanceRoutingDock";

export default function LandingPageRoot() {
  return (
    <div className="min-h-screen bg-background text-on-background relative pb-24 select-text">
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />
      <div className="relative z-10">
        <HeroCommandTerminal />
        <SovereignTelemetryGrid />
        <EngineFamilyMatrix />
        <GovernanceRoutingDock />
      </div>
    </div>
  );
}
