import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_AEGIS_API_URL || "https://aegis-api-968o.onrender.com";

const PUBLIC_PATHS = ["/login", "/_next/static", "/_next/image", "/favicon.ico"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie") || "";

  try {
    const meResponse = await fetch(`${API_BASE}/me`, {
      headers: { cookie },
    });

    if (meResponse.ok) {
      return NextResponse.next();
    }
  } catch {
    // Backend unreachable — redirect to login
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
