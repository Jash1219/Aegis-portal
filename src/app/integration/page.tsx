import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CodeTabs from "@/components/integration/CodeTabs";

export default function IntegrationPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24 text-[#EDEDED]">
      <div className="mx-auto max-w-3xl space-y-12">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Integration Hub
          </h1>
          <p className="max-w-2xl text-[#A0A0A0]">
            Integrate the AEGIS Pilot API into your development workflow. Use
            the Postman collection to explore endpoints, or call the API
            directly from your application.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/AEGIS_Pilot_Collection.json"
              download
              className={cn(buttonVariants({ variant: "default" }), "inline-flex items-center gap-1.5")}
            >
              Download Postman Collection
            </Link>
            <a
              href="https://docs.aegis.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "secondary" }), "inline-flex items-center gap-1.5")}
            >
              View API Docs
            </a>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight">
            Quick Start
          </h2>
          <CodeTabs />
        </section>

        <section className="rounded-lg border border-[#222222] bg-[#111111] p-4">
          <p className="text-sm text-[#A0A0A0]">
            <span className="font-medium text-[#EDEDED]">Security note:</span>{" "}
            Always store your API token in environment variables. Never commit
            tokens to version control or expose them in client-side code.
          </p>
        </section>
      </div>
    </div>
  );
}
