"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderStatus } from "@/components/ui/header-status";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { fetchOverviewSummary } from "@/lib/bff";
import type { GovernmentVerificationStatus } from "@/types/aegis";

const NAV_ITEMS = [
  { label: "Overview", href: "/overview" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Integration", href: "/integration" },
  { label: "Governance", href: "/governance" },
] as const;

const VERSION_LINE =
  "AEGIS v4.1.0 | Verification Engine v1.0.0 | API v1 | Schema v1.0";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [govStatus, setGovStatus] = useState<GovernmentVerificationStatus>("UNAVAILABLE");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const summary = await fetchOverviewSummary();
        if (!cancelled) {
          setGovStatus(summary.government_verification_status);
        }
      } catch {
        if (!cancelled) {
          setGovStatus("UNAVAILABLE");
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <header className="flex items-center justify-between px-gutter py-3 border-b border-outline-variant bg-surface">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
              AEGIS
            </span>
            <span className="text-label-caps text-on-surface-variant">
              v4.1.0
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="px-3 py-1.5 text-label-caps text-on-surface-variant"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <HeaderStatus status={govStatus} />
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-container-max w-full px-gutter py-xl md:py-xxl">
          {children}
        </div>
      </main>
      <footer className="flex items-center justify-center px-gutter py-3 border-t border-outline-variant bg-surface text-data-mono text-on-surface-variant">
        {VERSION_LINE}
      </footer>
    </div>
  );
}
