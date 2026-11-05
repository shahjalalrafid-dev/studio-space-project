import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { StudioCard } from "@/components/studios/StudioCard";
import { getFeaturedStudios } from "@/lib/studios";

/**
 * "Featured Studios" — dynamic.
 *
 * The section queries MongoDB itself on every render and asks for the
 * top-rated studios with `.limit(6)`; failures degrade to an empty state
 * rather than taking the homepage down.
 */
export async function FeaturedStudios() {
  const studios = await getFeaturedStudios(6);

  return (
    <section
      aria-labelledby="featured-heading"
      className="relative bg-paper py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-spotlight/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight-deep">
              Featured studios
            </p>
            <h2
              id="featured-heading"
              className="mt-3 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-950 sm:text-[2.6rem]"
            >
              The six spaces creators rebook most
            </h2>
            <p className="mt-3 text-[16.5px] leading-relaxed text-ink-500">
              Top-rated listings pulled live from the MongoDB{" "}
              <code className="rounded-md bg-ink-950/[0.06] px-1.5 py-0.5 text-[15px] font-semibold text-ink-700">
                studios
              </code>{" "}
              collection — refreshed every time this page loads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-[13px] font-semibold text-emerald-700">
              <span
                aria-hidden
                className="size-1.5 animate-pulse rounded-full bg-emerald-500"
              />
              Live from MongoDB
            </span>
            <Link
              href="/studios"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-ink-950/15 bg-white px-5 text-[14.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-ink-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
            >
              View all studios
              <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {studios.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio.slug} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-ink-950/15 bg-white/70 p-10 text-center">
            <p className="text-[17px] font-semibold text-ink-950">
              The first studios are being onboarded
            </p>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
              The <code className="font-semibold">studios</code> collection is
              empty right now — run <code className="font-semibold">npm run
              db:seed</code> to load demo listings.
            </p>
            <Link
              href="/studios"
              className="mt-5 inline-flex h-11 items-center rounded-full bg-spotlight px-6 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
            >
              Browse all studios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
