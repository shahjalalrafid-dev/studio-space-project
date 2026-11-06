"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { AccountLinks, Avatar, UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/context/AuthContext";
import { isActivePath, MAIN_NAV, SITE } from "@/lib/site";

/**
 * Sticky StudioSpace header:
 *  · dark "spotlight ribbon" with the marketplace pitch (lg+)
 *  · translucent main bar with active-route indicators
 *  · guest actions (Log in / Register) vs. account dropdown when signed in
 *  · collapsible sheet on small screens
 */
export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isPending, user } = useAuth();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the sheet on any route change — including browser back/forward.
  // React's render-time adjustment pattern keeps this out of an effect,
  // so navigation never triggers a cascading re-render.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSheetOpen(false);
  }

  // Hairline shadow appears once the page is scrolled away from the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ---------------- spotlight ribbon (desktop only) --------------- */}
      <div className="hidden bg-ink-950 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-5 text-[13px] xl:px-8">
          <p className="flex items-center gap-2.5 text-ink-300">
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-spotlight shadow-[0_0_9px_3px_rgba(255,176,32,0.6)]"
            />
            <span className="truncate">{SITE.ribbon}</span>
          </p>
          <Link
            href="/add-studio"
            className="group flex shrink-0 items-center gap-1.5 font-medium text-white transition-colors hover:text-spotlight"
          >
            Become a host
            <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ------------------------------ bar --------------------------- */}
      <div
        className={`border-b bg-paper/85 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled
            ? "border-ink-950/10 shadow-[0_18px_36px_-32px_rgba(11,11,15,0.9)]"
            : "border-ink-950/[0.07]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-5 xl:px-8">
          <Logo className="shrink-0" />

          {/* desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden h-full items-stretch lg:flex lg:gap-1 xl:gap-2"
          >
            {MAIN_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex items-center px-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-spotlight/70 xl:px-4"
                >
                  <span
                    className={`text-[15px] transition-colors duration-200 ${
                      active
                        ? "font-semibold text-ink-950"
                        : "font-medium text-ink-600 group-hover:text-ink-950"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-spotlight transition-all duration-300 ${
                      active
                        ? "opacity-100 shadow-[0_0_12px_rgba(255,176,32,0.95)]"
                        : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {isPending ? (
              /* Session still resolving — keep the header quiet instead of
                 flashing guest buttons to a signed-in member. */
              <>
                <span
                  aria-hidden
                  className="hidden h-10 w-20 animate-pulse rounded-full bg-ink-950/[0.06] sm:inline-block"
                />
                <span
                  aria-hidden
                  className="hidden h-10 w-28 animate-pulse rounded-full bg-ink-950/[0.06] sm:inline-block"
                />
              </>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/add-studio"
                  className="hidden h-10 items-center rounded-full border border-spotlight/45 bg-spotlight/10 px-4 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-spotlight/20 sm:inline-flex"
                >
                  List your studio
                </Link>
                <div className="hidden lg:block">
                  <UserMenu />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center rounded-full px-3.5 text-[15px] font-medium text-ink-700 transition-colors hover:bg-ink-950/[0.055] hover:text-ink-950 sm:inline-flex"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="hidden h-10 items-center rounded-full bg-spotlight px-5 text-[15px] font-semibold text-ink-950 shadow-[0_10px_22px_-14px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] sm:inline-flex"
                >
                  Register
                </Link>
              </>
            )}

            {/* mobile trigger */}
            <button
              type="button"
              onClick={() => setSheetOpen((v) => !v)}
              aria-expanded={sheetOpen}
              aria-controls="mobile-navigation"
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-ink-950/10 bg-white/70 text-ink-800 transition-colors hover:border-ink-950/25 hover:bg-white lg:hidden"
            >
              {sheetOpen ? (
                <CloseIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------- mobile sheet --------------------- */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden border-b border-ink-950/[0.07] bg-paper/95 backdrop-blur-xl transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
          sheetOpen
            ? "grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {MAIN_NAV.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-[16px] transition-colors ${
                      active
                        ? "bg-spotlight/15 font-semibold text-ink-950"
                        : "font-medium text-ink-700 hover:bg-ink-950/[0.055] hover:text-ink-950"
                    }`}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-spotlight shadow-[0_0_8px_rgba(255,176,32,0.9)]"
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-ink-950/[0.08] pt-3">
              {isAuthenticated && user ? (
                <>
                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 ring-1 ring-ink-950/[0.07]">
                    <Avatar user={user} className="size-10 text-[12px]" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-950">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <AccountLinks onNavigate={() => setSheetOpen(false)} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setSheetOpen(false)}
                    className="grid h-11 place-items-center rounded-full bg-spotlight text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setSheetOpen(false)}
                    className="grid h-11 place-items-center rounded-full border border-ink-950/15 text-[15px] font-semibold text-ink-800 transition-colors hover:bg-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
