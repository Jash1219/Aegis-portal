import { Bell, Settings, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 z-40 h-16 w-[calc(100%-16rem)] flex items-center justify-between px-gutter bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
          <span className="font-label-caps text-label-caps text-on-surface-variant">SYSTEM ACTIVE</span>
        </div>
      </div>
      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-sm text-on-surface-variant">
          <button
            aria-label="Notifications"
            className="hover:text-primary transition-colors p-1"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            aria-label="Settings"
            className="hover:text-primary transition-colors p-1"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            aria-label="Account"
            className="hover:text-primary transition-colors p-1"
          >
            <UserCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
