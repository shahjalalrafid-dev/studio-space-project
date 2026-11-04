"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  AccountIcon,
  ChevronDownIcon,
  LogoutIcon,
} from "@/components/icons";
import { useAuth, type SessionUser } from "@/context/AuthContext";
import { ACCOUNT_LINKS, isActivePath } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

export function Avatar({
  user,
  className = "size-8 text-[11px]",
}: {
  user: SessionUser;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-spotlight to-[#E08900] font-semibold text-ink-950 ring-2 ring-white/70 ${className}`}
    >
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          fill
          sizes="(max-width: 1024px) 40px, 32px"
          className="object-cover"
        />
      ) : (
        <span aria-hidden>{user.initials}</span>
      )}
      <span className="sr-only">{user.name}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Shared list — used by the desktop dropdown AND the mobile sheet     */
/* ------------------------------------------------------------------ */

export function AccountLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <>
      {ACCOUNT_LINKS.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              active
                ? "bg-spotlight/15 font-semibold text-ink-950"
                : "font-medium text-ink-700 hover:bg-ink-950/[0.055] hover:text-ink-950"
            }`}
          >
            <AccountIcon
              name={item.icon}
              className={`size-[18px] shrink-0 ${
                active ? "text-spotlight-deep" : "text-ink-500 group-hover:text-ink-700"
              }`}
            />
            <span className="min-w-0">
              <span className="block truncate text-[15px] leading-tight">
                {item.label}
              </span>
              <span className="block truncate text-[12px] font-normal leading-tight text-ink-500">
                {item.hint}
              </span>
            </span>
            {active ? (
              <span
                aria-hidden
                className="ml-auto size-1.5 shrink-0 rounded-full bg-spotlight shadow-[0_0_8px_rgba(255,176,32,0.9)]"
              />
            ) : null}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => {
          signOut();
          onNavigate?.();
        }}
        className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-ink-950/[0.08] px-3 pt-3 pb-2.5 text-[15px] font-medium text-rose-600 transition-colors hover:bg-rose-50"
      >
        <LogoutIcon className="size-[18px] shrink-0" />
        Log out
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop dropdown                                                    */
/* ------------------------------------------------------------------ */

export function UserMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const openNow = () => {
    clearTimer();
    setOpen(true);
  };

  const closeSoon = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openNow())}
        className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-spotlight/70 ${
          open
            ? "border border-ink-950/20 bg-white shadow-[0_10px_24px_-18px_rgba(11,11,15,0.7)]"
            : "border border-ink-950/10 bg-white/70 hover:border-ink-950/25 hover:bg-white"
        }`}
      >
        <Avatar user={user} className="size-8 text-[11px]" />
        <span className="hidden max-w-[8.5rem] truncate text-sm font-medium text-ink-800 xl:block">
          {user.name}
        </span>
        <ChevronDownIcon
          className={`size-4 text-ink-500 transition-transform duration-200 ${
            open ? "rotate-180 text-ink-800" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className="menu-in absolute right-0 top-[calc(100%+10px)] w-[19.5rem] overflow-hidden rounded-2xl border border-ink-950/10 bg-white shadow-[0_36px_70px_-34px_rgba(11,11,15,0.55)]"
        >
          <div className="flex items-start gap-3 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 px-4 py-4">
            <Avatar user={user} className="size-11 text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-ink-400">{user.email}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-spotlight/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-spotlight">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-spotlight shadow-[0_0_6px_rgba(255,176,32,0.9)]"
                />
                Studio host
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5 p-1.5">
            <AccountLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
