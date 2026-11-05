"use client";

import Link from "next/link";

import { Avatar } from "@/components/layout/UserMenu";
import { useAuth } from "@/context/AuthContext";

/**
 * Slim welcome ribbon under the banner slider.
 *
 * It keeps the "the home page shows my name and photo after I log in"
 * promise visible even though the banner itself is now a slider, and it
 * renders nothing (no layout shift for guests) while the session resolves.
 */
export function MemberStrip() {
  const { status, user, signOut } = useAuth();

  if (status !== "authenticated" || !user) return null;

  return (
    <section
      aria-label="Your account"
      className="border-b border-ink-950/[0.07] bg-gradient-to-r from-spotlight/[0.16] via-paper to-spotlight/[0.08]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5 xl:px-8">
        <Avatar user={user} className="size-12 shrink-0 text-sm" />

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-spotlight-deep">
            Signed in — welcome back
          </p>
          <p className="truncate text-[17px] font-semibold leading-tight text-ink-950">
            {user.name}
          </p>
          <p className="truncate text-[13.5px] text-ink-500">{user.email}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2.5">
          <Link
            href="/studios"
            className="inline-flex h-10 items-center rounded-full bg-ink-950 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
          >
            Explore studios
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex h-10 items-center rounded-full border border-ink-950/15 bg-white px-5 text-[14.5px] font-semibold text-ink-700 transition-colors hover:border-ink-950/30 hover:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
          >
            Log out
          </button>
        </div>
      </div>
    </section>
  );
}
