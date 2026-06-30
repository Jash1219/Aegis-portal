import { HeaderStatus } from "@/components/ui/header-status";

const NAV_ITEMS = [
  "Overview",
  "Portfolio",
  "Suppliers",
  "Integration",
  "Governance",
] as const;

const VERSION_LINE =
  "AEGIS v4.1.0 | Verification Engine v1.0.0 | API v1 | Schema v1.0";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
            {NAV_ITEMS.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 text-label-caps text-on-surface-variant"
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <HeaderStatus status="VERIFIED" />
          <span className="text-label-caps text-on-surface-variant">
            Account
          </span>
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
