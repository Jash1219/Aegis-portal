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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sandbox", label: "Sandbox", icon: FlaskConical },
  { href: "/audit-report", label: "Audit Report", icon: BarChart3 },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/architecture", label: "Architecture", icon: GitBranch },
  { href: "/integration", label: "Integration", icon: CodeXml },
  { href: "/pilot", label: "Pilot", icon: Rocket },
];

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
      <ul className="flex flex-col py-md w-full">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href} className="relative">
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-secondary rounded-r" />
              )}
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-sm px-gutter py-sm transition-colors",
                  isActive
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
    </nav>
  );
}
