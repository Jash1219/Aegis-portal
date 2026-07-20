const API_BASE =
  process.env.NEXT_PUBLIC_AEGIS_API_URL || "https://aegis-api-968o.onrender.com";

export interface User {
  id: string;
  email: string;
  role: "ANALYST" | "ADMIN";
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new AuthError("Invalid email or password.", response.status);
  }

  return response.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/me`, {
      credentials: "include",
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
