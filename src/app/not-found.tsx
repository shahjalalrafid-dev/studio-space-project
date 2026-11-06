import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon, ApertureIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "That page isn't on the StudioSpace set — head back home.",
};

/**
 * Custom 404 — a stylized studio set illustration (cyc wall, softbox and
 * a camera on the tripod) with a direct "Return to Home" CTA.
 *
 * The root `app/not-found.tsx` also catches every unmatched URL, so
 * /dashboard, /help, /terms… all land here instead of a bare Next.js 404.
 */

function StudioSetIllustration() {
  return (
    <svg
      viewBox="0 0 420 260"
      role="img"
      aria-label="Illustration of an empty photo studio with a cyclorama wall, a softbox light and a camera on a tripod"
      className="h-auto w-full max-w-[26rem]"
    >
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb020" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffb020" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1c23" />
          <stop offset="100%" stopColor="#0b0b0f" />
        </linearGradient>
      </defs>

      {/* room */}
      <rect x="8" y="8" width="404" height="244" rx="22" fill="#131318" />
      <rect x="8" y="8" width="404" height="244" rx="22" fill="url(#floor)" opacity="0.6" />

      {/* cyc wall — the curved white sweep */}
      <path
        d="M40 196V96c0-14 11-25 25-25h150c14 0 25 11 25 25v100"
        fill="#f1f1f4"
      />
      <path
        d="M40 196v-18c0-13 11-24 24-24h176v42Z"
        fill="#e3e3e9"
      />

      {/* softbox on a stand, aimed at the cyc */}
      <g>
        <path d="M330 196 306 118" stroke="#4a4a55" strokeWidth="4" strokeLinecap="round" />
        <path d="M316 196h30" stroke="#4a4a55" strokeWidth="4" strokeLinecap="round" />
        <rect
          x="288"
          y="66"
          width="54"
          height="42"
          rx="8"
          fill="#ffb020"
          transform="rotate(-14 315 87)"
        />
        <rect
          x="294"
          y="72"
          width="42"
          height="30"
          rx="5"
          fill="#fff3d6"
          transform="rotate(-14 315 87)"
        />
        {/* light beam */}
        <path d="M296 96 214 132l-16-46 92-30Z" fill="url(#beam)" />
      </g>

      {/* camera on a tripod */}
      <g>
        <path d="M150 244l22-46M196 244l-22-46M173 198v46" stroke="#6b6b78" strokeWidth="5" strokeLinecap="round" />
        <rect x="146" y="166" width="56" height="30" rx="7" fill="#2e2e37" />
        <circle cx="174" cy="181" r="10" fill="#ffb020" />
        <circle cx="174" cy="181" r="4.5" fill="#0b0b0f" />
        <rect x="196" y="172" width="14" height="12" rx="3" fill="#4a4a55" />
        <rect x="156" y="158" width="18" height="10" rx="3" fill="#4a4a55" />
        {/* record light */}
        <circle cx="156" cy="163" r="3" fill="#ff5a5a" />
      </g>

      {/* clapperboard on the floor */}
      <g transform="rotate(-8 96 224)">
        <rect x="72" y="212" width="48" height="26" rx="4" fill="#0b0b0f" stroke="#6b6b78" strokeWidth="2" />
        <path d="M72 218h48" stroke="#6b6b78" strokeWidth="2" />
        <path d="M78 212l8 6M92 212l8 6M106 212l8 6" stroke="#ffb020" strokeWidth="3" />
      </g>

      {/* floating aperture mark */}
      <g opacity="0.9">
        <circle cx="352" cy="42" r="18" fill="none" stroke="#ffb020" strokeWidth="3" />
        <path
          d="M352 24v36M334 42h36M340 30l24 24M364 30l-24 24"
          stroke="#ffb020"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-spotlight/[0.14] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-gel/[0.12] blur-[130px]"
      />

      <div className="relative mx-auto flex min-h-[68vh] max-w-6xl flex-col items-center justify-center gap-10 px-4 py-16 text-center sm:px-5 lg:flex-row lg:items-center lg:gap-16 lg:py-20 xl:px-8">
        <div className="order-2 max-w-xl lg:order-1 lg:text-left">
          <p className="flex items-center justify-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight lg:justify-start">
            <ApertureIcon className="size-4" />
            Error 404 · off the set
          </p>

          <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[3.4rem]">
            This page didn&apos;t make
            <br />
            <span className="text-spotlight">the final cut.</span>
          </h1>

          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-300">
            The scene you&apos;re looking for was moved, renamed or never rolled
            in the first place. The lights are still warm on the homepage —
            or browse every studio we&apos;ve got.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-spotlight px-7 text-[15.5px] font-semibold text-ink-950 shadow-[0_18px_34px_-20px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
            >
              Return to Home
              <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/studios"
              className="inline-flex h-12 items-center rounded-full border border-white/25 bg-white/[0.06] px-7 text-[15.5px] font-semibold text-white backdrop-blur transition-colors hover:border-white/45 hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
            >
              Explore studios
            </Link>
          </div>

          <p className="mt-6 text-[14px] text-ink-400">
            Looking for your listings or reservations?{" "}
            <Link
              href="/my-listings"
              className="font-semibold text-white underline decoration-spotlight decoration-2 underline-offset-4 transition-colors hover:text-spotlight"
            >
              My Studio Listings
            </Link>{" "}
            ·{" "}
            <Link
              href="/my-bookings"
              className="font-semibold text-white underline decoration-spotlight decoration-2 underline-offset-4 transition-colors hover:text-spotlight"
            >
              My Bookings
            </Link>
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <StudioSetIllustration />
        </div>
      </div>
    </section>
  );
}
