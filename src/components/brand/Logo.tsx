import Link from "next/link";

import { ApertureIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

type LogoProps = {
  /** Renders as plain markup when `href` is provided by the caller. */
  href?: string;
  /** Size preset of the aperture badge. */
  size?: "sm" | "md";
  /** `light` = for dark surfaces (footer, mobile sheet header). */
  tone?: "dark" | "light";
  /** Hides the small descriptor under the wordmark on tight layouts. */
  showTagline?: boolean;
  className?: string;
};

const BADGE_SIZE = {
  sm: "size-8 rounded-[10px]",
  md: "size-10 rounded-xl",
} as const;

const ICON_SIZE = {
  sm: "size-[18px]",
  md: "size-[22px]",
} as const;

/**
 * StudioSpace brand lockup: aperture badge + wordmark.
 * Deliberately hook-free so it can be rendered by a Server Component.
 */
export function Logo({
  href = "/",
  size = "md",
  tone = "dark",
  showTagline = false,
  className = "",
}: LogoProps) {
  const light = tone === "light";

  const badge = (
    <span
      className={`relative grid shrink-0 place-items-center ${BADGE_SIZE[size]} ${
        light
          ? "bg-gradient-to-br from-white/15 to-white/[0.04] ring-1 ring-white/20"
          : "bg-gradient-to-br from-ink-800 via-ink-950 to-black ring-1 ring-ink-950/10"
      }`}
    >
      {/* soft spotlight bloom behind the blades */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-[inherit] ${
          light ? "bg-spotlight/10" : "bg-spotlight/15"
        } blur-[6px]`}
      />
      <ApertureIcon
        className={`relative ${ICON_SIZE[size]} text-spotlight drop-shadow-[0_0_6px_rgba(255,176,32,0.55)]`}
      />
    </span>
  );

  const wordmark = (
    <span className="flex flex-col leading-none">
      <span
        className={`text-[17px] font-semibold tracking-[-0.02em] ${
          light ? "text-white" : "text-ink-950"
        }`}
      >
        {SITE.wordmarkLead}
        <span
          className={
            light
              ? "text-spotlight"
              : "text-spotlight-deep [text-shadow:0_0_18px_rgba(255,176,32,0.35)]"
          }
        >
          {SITE.wordmarkTail}
        </span>
      </span>
      {showTagline ? (
        <span
          className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${
            light ? "text-ink-400" : "text-ink-500"
          }`}
        >
          {SITE.tagline}
        </span>
      ) : null}
    </span>
  );

  return (
    <Link
      href={href}
      aria-label={`${SITE.name} — home`}
      className={`group inline-flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-spotlight/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
    >
      <span className="flex items-center gap-2.5 transition-transform duration-200 group-hover:-translate-y-px">
        {badge}
        {wordmark}
      </span>
    </Link>
  );
}
