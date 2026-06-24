"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  Briefcase,
  GitBranch,
  CodeXml,
  Rocket,
  Shield,
  FileText,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavSection {
  title: string;
  links: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navSections: NavSection[] = [
  {
    title: "CORE EVALUATION TIER",
    links: [
      { href: "/portfolio", label: "Portfolio Scan", icon: Briefcase },
      { href: "/sandbox", label: "Sandbox Replay", icon: FlaskConical },
    ],
  },
  {
    title: "INSTITUTIONAL GOVERNANCE",
    links: [
      { href: "/rules", label: "Rule Manifest", icon: FileText },
      { href: "/trust", label: "Sovereign Trust Center", icon: Shield },
      { href: "/onboarding", label: "Ingestion Schemas", icon: Upload },
    ],
  },
];

const standaloneLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/audit-report", label: "Audit Report", icon: BarChart3 },
  { href: "/architecture", label: "Architecture", icon: GitBranch },
  { href: "/integration", label: "Integration", icon: CodeXml },
  { href: "/pilot", label: "Pilot", icon: Rocket },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function GlobalNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-surface-container-lowest border-r border-outline-variant z-50 overflow-y-auto">
      <div className="flex flex-col gap-xs px-gutter py-lg border-b border-outline-variant">
        <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
          AEGIS
        </span>
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Deterministic Validation
        </span>
      </div>

      {/* Standalone links (Dashboard, Audit, etc.) */}
      <ul className="flex flex-col py-md w-full">
        {standaloneLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, pathname);

          return (
            <li key={link.href} className="relative">
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-secondary rounded-r" />
              )}
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-sm px-gutter py-sm transition-colors",
                  active
                    ? "text-secondary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-label-caps text-label-caps">
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Grouped sections */}
      {navSections.map((section) => (
        <div key={section.title} className="flex flex-col w-full">
          <div className="px-gutter py-xs">
            <span className="font-body-xs text-body-xs text-on-surface-variant/50 uppercase tracking-[0.15em]">
              {section.title}
            </span>
          </div>
          <ul className="flex flex-col w-full">
            {section.links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href, pathname);

              return (
                <li key={link.href} className="relative">
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-secondary rounded-r" />
                  )}
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-sm px-gutter py-sm transition-colors",
                      active
                        ? "text-secondary font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-high",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-label-caps text-label-caps">
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
