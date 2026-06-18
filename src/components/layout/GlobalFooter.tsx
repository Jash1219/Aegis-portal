import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between py-md px-gutter">
      <span className="font-label-caps text-label-caps text-primary">
        &copy; {new Date().getFullYear()} AEGIS Systems. Institutional Grade Validation.
      </span>
      <div className="flex items-center gap-lg">
        <Link
          href="#"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors"
        >
          Security
        </Link>
        <Link
          href="#"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors"
        >
          API Docs
        </Link>
        <Link
          href="#"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </footer>
  );
}
