import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer className="border-t border-[#222222] bg-[#0A0A0A] px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#A0A0A0] md:flex-row">
        <p>&copy; {new Date().getFullYear()} AEGIS. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#EDEDED]"
          >
            GitHub
          </Link>
          <Link
            href="/aegis_audit_certificate.pdf"
            className="transition-colors hover:text-[#EDEDED]"
          >
            Sample Certificate
          </Link>
          <span className="transition-colors hover:text-[#EDEDED]">
            Terms
          </span>
        </div>
      </div>
    </footer>
  );
}
