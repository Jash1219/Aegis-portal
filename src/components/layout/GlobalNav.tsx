"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/architecture", label: "Architecture & Trust" },
  { href: "/integration", label: "Integration Hub" },
  { href: "/sandbox", label: "API Sandbox" },
  { href: "/audit-report", label: "Audit Report" },
];

export default function GlobalNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#EDEDED]" />
          <span className="text-lg font-semibold tracking-tight text-[#EDEDED]">
            AEGIS
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#A0A0A0] transition-colors hover:text-[#EDEDED]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/pilot"
            className="rounded-md bg-[#EDEDED] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-white"
          >
            Request Pilot Audit
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? (
            <X className="h-5 w-5 text-[#EDEDED]" />
          ) : (
            <Menu className="h-5 w-5 text-[#EDEDED]" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#222222] bg-[#0A0A0A] px-6 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-[#A0A0A0] transition-colors hover:text-[#EDEDED]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/pilot"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-md bg-[#EDEDED] px-4 py-2 text-center text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-white"
          >
            Request Pilot Audit
          </Link>
        </div>
      )}
    </header>
  );
}
