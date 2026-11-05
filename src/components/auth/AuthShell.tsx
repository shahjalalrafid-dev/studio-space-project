import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import { ApertureIcon, CheckIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

/**
 * Shared chrome for the Login and Registration pages:
 *
 *  · a dark "darkroom" story panel (desktop) with the brand, a short pitch
 *    and three proof points
 *  · a centred white form card on a warm paper surface (all breakpoints)
 *  · a mobile brand strip so small screens keep the identity
 *
 * Pure presentational markup — the interactive form is passed in as
 * `children` by the client views.
 */

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  /** Story panel copy (desktop only). */
  asideEyebrow: string;
  asideTitle: ReactNode;
  asidePoints: string[];
  asideStat: { value: string; label: string };
  /** Bottom of the card — the "switch to the other page" link. */
  footer: ReactNode;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  asideEyebrow,
  asideTitle,
  asidePoints,
  asideStat,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="relative isolate flex flex-col lg:min-h-[calc(100svh-6.75rem)] lg:flex-row">
      {/* ------------------------- story panel ------------------------- */}
      <aside className="relative hidden overflow-hidden bg-ink-950 px-12 py-12 text-white lg:flex lg:w-[46%] lg:flex-col xl:px-16">
        {/* spotlight bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-spotlight/[0.16] blur-[120px]"
        />
        {/* soft grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 30% 25%, black, transparent 75%)",
          }}
        />
        {/* aperture watermark */}
        <ApertureIcon
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-20 h-[26rem] w-[26rem] text-spotlight/[0.09]"
          strokeWidth={0.6}
        />

        <div className="relative">
          <Logo tone="light" showTagline />
        </div>

        <div className="relative mt-auto max-w-[30rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            {asideEyebrow}
          </p>
          <h2 className="mt-4 text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
            {asideTitle}
          </h2>

          <ul className="mt-7 grid gap-3">
            {asidePoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-[15px] text-ink-300"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-spotlight/15 text-spotlight ring-1 ring-spotlight/30">
                  <CheckIcon className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex items-center gap-4 border-t border-white/10 pt-6">
            <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-white">
              {asideStat.value}
            </span>
            <span className="max-w-[13rem] text-[13px] leading-snug text-ink-400">
              {asideStat.label}
            </span>
          </div>
        </div>
      </aside>

      {/* -------------------------- form side -------------------------- */}
      <section className="relative flex flex-1 justify-center px-4 py-8 sm:px-8 sm:py-12 lg:items-center">
        {/* paper wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-spotlight/[0.09] blur-3xl"
        />

        <div className="relative w-full max-w-[31rem]">
          {/* mobile brand strip */}
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-ink-950 px-4 py-3 lg:hidden">
            <Logo tone="light" size="sm" />
            <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
              {SITE.tagline}
            </span>
          </div>

          <div className="rounded-3xl border border-ink-950/[0.09] bg-white p-6 shadow-[0_40px_80px_-56px_rgba(11,11,15,0.7)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-spotlight-deep">
              {eyebrow}
            </p>
            <h1 className="mt-2.5 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink-950">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              {subtitle}
            </p>

            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-5 text-center text-[14.5px] text-ink-500">
            {footer}
          </p>
        </div>
      </section>
    </div>
  );
}
