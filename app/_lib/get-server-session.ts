import { cookies } from "next/headers";

import { authClient } from "@/app/_lib/auth-client";

export type AuthSession = NonNullable<typeof authClient.$Infer.Session>;

export async function getServerSession(): Promise<AuthSession | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AuthSession | null;
  } catch {
    return null;
  }
}
