import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { SocialIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import {
  FOOTER_CATEGORIES,
  FOOTER_HOST_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_QUICK_LINKS,
  FOOTER_SUPPORT_LINKS,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/site";

/**
 * StudioSpace footer — dark "darkroom" surface that mirrors the header.
 * Static server component; only the newsletter field is interactive.
 */

const COLUMN_TITLE =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-white";
const COLUMN_LINK =
  "text-[15px] text-ink-400 transition-colors hover:text-white focus-visible:text-white";

function LinkColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav aria-label={title} className={className}>
      <h3 className={COLUMN_TITLE}>{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={COLUMN_LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink-950 text-ink-300">
      {/* spotlight wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-56 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-spotlight/[0.09] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-72 w-72 rounded-full bg-gel/[0.10] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
        {/* ---------------------- brand + newsletter ------------------- */}
        <div className="grid gap-10 border-b border-white/[0.09] py-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Logo tone="light" showTagline />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-400">
              {SITE.mission}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[12px] font-medium text-ink-300">
                Hourly booking
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[12px] font-medium text-ink-300">
                Verified hosts
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[12px] font-medium text-ink-300">
                No hidden fees
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <NewsletterForm />
          </div>
        </div>

        {/* --------------------------- link grid ----------------------- */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <LinkColumn title="Quick Links" links={FOOTER_QUICK_LINKS} />
          <LinkColumn
            title="Popular Categories"
            links={FOOTER_CATEGORIES}
          />
          <LinkColumn title="For Hosts" links={FOOTER_HOST_LINKS} />
          <LinkColumn title="Support" links={FOOTER_SUPPORT_LINKS} />
        </div>

        {/* --------------------------- socials ------------------------- */}
        <div className="flex flex-col gap-6 border-t border-white/[0.09] py-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-sm text-[14px] leading-relaxed text-ink-400">
            Follow StudioSpace for new listings, set tours and creator
            spotlights.
          </p>

          <ul className="flex flex-wrap items-center gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-ink-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-spotlight/60 hover:bg-spotlight/15 hover:text-spotlight focus-visible:-translate-y-0.5 focus-visible:border-spotlight focus-visible:text-spotlight focus-visible:outline-none"
                >
                  <SocialIcon name={social.icon} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------- copyright bar ----------------------- */}
        <div className="flex flex-col gap-4 border-t border-white/[0.09] py-7 md:flex-row md:items-center md:justify-between">
          <p className="text-[13.5px] text-ink-400">
            © {SITE.copyrightYear} {SITE.name} Inc. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[13.5px] text-ink-400 transition-colors hover:text-white focus-visible:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              aria-hidden
              className="hidden size-1 rounded-full bg-ink-700 sm:block"
            />
            <li className="text-[13.5px] text-ink-400">
              Built for creators, by creators.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
