import SandboxLayout from "@/components/sandbox/SandboxLayout";

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24 text-[#EDEDED]">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          API Sandbox
        </h1>
        <SandboxLayout />
      </div>
    </div>
  );
}
