"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { StudioLoader } from "@/components/ui/StudioLoader";

/**
 * Gate for the private routes (`/add-studio`, `/my-listings`,
 * `/my-bookings`, `/studios/edit/[id]`).
 *
 * While Better Auth resolves the session it shows the branded loader;
 * a signed-out visitor is toasted once and bounced to the login screen
 * with a `?next=` hop back to the page they asked for.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const bounced = useRef(false);

  useEffect(() => {
    if (status !== "unauthenticated" || bounced.current) return;

    bounced.current = true;
    toast.warning("This area is for signed-in members", {
      description: "Log in (or create an account) to manage listings & bookings.",
    });
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status !== "authenticated") {
    return (
      <StudioLoader
        full
        label={
          status === "pending"
            ? "Checking your session…"
            : "Taking you to the login screen…"
        }
      />
    );
  }

  return <>{children}</>;
}
