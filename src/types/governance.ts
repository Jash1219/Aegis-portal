export interface RuleManifestContract {
  id: string;
  engineFamily: string;
  riskVector: string;
  regulatoryIntent: string;
  lifecycleState: "ACTIVE" | "ROADMAP";
  requiredHeaders: string[];
}
