"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { readAuthError } from "@/lib/auth-errors";

/**
 * Application-wide session state.
 *
 * The session itself lives in Better Auth (MongoDB Atlas via the
 * `@better-auth/mongo-adapter`), and `authClient.useSession()` keeps this
 * provider in sync with the `/api/auth/get-session` endpoint — so a page
 * reload, a sign-in, a Google redirect and a sign-out all resolve to the
 * same single source of truth.
 *
 * `status` starts as `"pending"` on both the server and the first client
 * render, which keeps the navbar free of hydration mismatches; components
 * can then render a neutral skeleton until the answer arrives.
 */

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  /** Two-letter monogram used when no photo is uploaded yet. */
  initials: string;
  role: "host" | "guest";
  /** Optional profile photo URL (remote hosts are allowed in next.config.ts). */
  image?: string;
};

export type AuthStatus = "pending" | "authenticated" | "unauthenticated";

/** Discriminated result so callers can show inline + toast errors. */
export type AuthResult =
  | { ok: true }
  | { ok: false; error: string };

type Credentials = {
  email: string;
  password: string;
};

type Registration = {
  name: string;
  email: string;
  password: string;
  image?: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  /** True while the session is being resolved (first paint / refetch). */
  isPending: boolean;
  status: AuthStatus;
  signIn: (values: Credentials) => Promise<AuthResult>;
  signUp: (values: Registration) => Promise<AuthResult>;
  /** Starts the Google OAuth flow; the browser navigates away on success. */
  signInWithGoogle: (callbackURL?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function firstNameOf(user: { name?: string } | undefined, email: string) {
  const name = user?.name?.trim();
  if (name) return name.split(/\s+/)[0];
  return email.split("@")[0] || "there";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const user = useMemo<SessionUser | null>(() => {
    const account = session?.user;
    if (!account) return null;

    const name = account.name?.trim() || account.email;
    return {
      id: account.id,
      name,
      email: account.email,
      initials: toInitials(name),
      role: "guest",
      image: account.image || undefined,
    };
  }, [session]);

  const signIn = useCallback<AuthContextValue["signIn"]>(async (values) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: true,
    });

    if (error) return { ok: false, error: readAuthError(error) };

    const displayName = firstNameOf(undefined, values.email);
    toast.success(`Welcome back, ${displayName}`, {
      description: "Your studios, drafts and bookings are where you left them.",
    });
    return { ok: true };
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(async (values) => {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image || undefined,
    });

    if (error) return { ok: false, error: readAuthError(error) };

    toast.success("Your StudioSpace account is ready", {
      description: "Sign in with your new credentials to continue.",
    });
    return { ok: true };
  }, []);

  const signInWithGoogle = useCallback<AuthContextValue["signInWithGoogle"]>(
    async (callbackURL = "/") => {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
      });

      if (error) return { ok: false, error: readAuthError(error) };
      return { ok: true };
    },
    [],
  );

  const signOut = useCallback<AuthContextValue["signOut"]>(async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Couldn't sign out", { description: readAuthError(error) });
      return;
    }

    toast.success("You have been signed out", {
      description: "Any saved drafts stay safe until your next sign-in.",
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus = isPending
      ? "pending"
      : user
        ? "authenticated"
        : "unauthenticated";

    return {
      user,
      isAuthenticated: user !== null,
      isPending,
      status,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    };
  }, [isPending, user, signIn, signUp, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
