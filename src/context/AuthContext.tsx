"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

/**
 * Temporary session store for the chrome (navbar / footer) work.
 *
 * It mirrors the shape of a real session so swapping it for your own
 * provider (NextAuth, Clerk, custom JWT, ...) only touches the two
 * components that consume `useAuth()` — the navbar and the account menu.
 *
 * The initial value is identical on the server and the client, so the
 * header hydrates without a mismatch and never flashes a different state
 * when a private route is reloaded.
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

type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  signIn: (overrides?: Partial<SessionUser>) => void;
  signOut: () => void;
};

const DEMO_USER: SessionUser = {
  id: "usr_demo_01",
  name: "Shahjalal Rafid",
  email: "rafid@studiospace.io",
  initials: "SR",
  role: "host",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start signed-in so the avatar/dropdown state is what you see first.
  // `Log out` in the menu flips this to the guest state and vice versa.
  const [user, setUser] = useState<SessionUser | null>(DEMO_USER);

  const signIn = useCallback((overrides?: Partial<SessionUser>) => {
    const next = { ...DEMO_USER, ...overrides };
    setUser(next);
    toast.success(`Welcome back, ${next.name.split(" ")[0]}`, {
      description: "Your studio drafts and bookings are exactly where you left them.",
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    toast.success("You have been signed out", {
      description: "Any saved drafts stay safe until your next sign-in.",
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
