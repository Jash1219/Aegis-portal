"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      aria-label="Sign out"
      className="flex items-center gap-1.5 text-label-caps text-on-surface-variant hover:text-destructive transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
