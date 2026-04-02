import { createAuthClient } from "better-auth/client";

const authBaseUrl =
  typeof window === "undefined"
    ? new URL("/api/auth", process.env.NEXT_PUBLIC_BASE_URL).toString()
    : "/api/auth";

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  fetchOptions: {
    credentials: "include",
  },
});
