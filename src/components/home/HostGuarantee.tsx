import Link from "next/link";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  ShieldIcon,
  SupportIcon,
  ToolIcon,
} from "@/components/icons";

/**
 * "Host Guarantee & Creator Support" — the platform's assurances:
 * liability protection, verified profiles, equipment safety and 24/7 support.
 */

const ASSURANCES = [
  {
    icon: ShieldIcon,
    title: "Liability protection",
    text: "Every confirmed booking carries up to $5M in host liability cover — from load-in through strike.",
    stat: "$5M cover",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified profiles",
    text: "Government ID and studio verification before a listing goes live. Hosts and guests, both sides checked.",
    stat: "ID checked",
  },
  {
    icon: ToolIcon,
    title: "Equipment safety",
    text: "Condition checklists on both sides plus damage deposits released within 48 hours of wrap.",
    stat: "48h payout",
  },
  {
    icon: SupportIcon,
    title: "24/7 host support",
    text: "Real humans on chat and phone, any hour of the night — median first response under four minutes.",
    stat: "<4 min reply",
  },
];

export function HostGuarantee() {
  return (
    <section
      aria-labelledby="guarantee-heading"
      className="relative isolate overflow-hidden bg-ink-950 py-16 text-white sm:py-20 lg:py-28"
    >
      {/* spotlight wash + grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-24 h-[32rem] w-[32rem] rounded-full bg-spotlight/[0.14] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 80% 10%, black, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:px-8">
        <div className="lg:pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            Host guarantee &amp; creator support
          </p>
          <h2
            id="guarantee-heading"
            className="mt-3 text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-[2.7rem]"
          >
            Host with cover.
            <br />
            Create with backup.
          </h2>
          <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-ink-300">
            A studio is a business, not a spare room. StudioSpace carries the
            insurance, verifies the people and keeps support awake so your
            shoot day stays boring — in the best way.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
            {[
              { value: "$5M", label: "liability cover" },
              { value: "100%", label: "verified hosts" },
              { value: "24/7", label: "human support" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] text-white">
                  {item.value}
                </p>
                <p className="mt-1.5 text-[13px] uppercase tracking-[0.14em] text-ink-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/studios"
            className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-spotlight px-6 text-[15.5px] font-semibold text-ink-950 shadow-[0_18px_34px_-20px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
          >
            Host Your Space
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ASSURANCES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-spotlight/35 hover:bg-white/[0.07]"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-spotlight/12 text-spotlight ring-1 ring-spotlight/25 transition-colors group-hover:bg-spotlight group-hover:text-ink-950">
                  <Icon className="size-6" />
                </span>

                <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-300">
                  {item.text}
                </p>

                <p className="mt-4 inline-flex w-fit rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-200">
                  {item.stat}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
