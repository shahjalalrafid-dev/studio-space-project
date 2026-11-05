import { createAuthClient } from "better-auth/react";

/**
 * Browser-side Better Auth client.
 *
 * It talks to the catch-all route handler at `/api/auth/[...all]` on the
 * same origin, so no `baseURL` override is needed here — `BETTER_AUTH_URL`
 * stays a server-only variable (it is not prefixed with `NEXT_PUBLIC_`).
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
