import type { Metadata } from "next";
import Link from "next/link";

import { StudioCard } from "@/components/studios/StudioCard";
import { STUDIO_CATEGORIES } from "@/lib/site";
import { getCategoryCounts, getStudios } from "@/lib/studios";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Browse photography studios, sound stages, podcast rooms, music suites and art workshops by the hour.",
};

/** Live listing — reads the `studios` collection on every request. */
export const dynamic = "force-dynamic";

type StudiosPageProps = {
  searchParams: Promise<{ category?: string | string[] | undefined }>;
};

export default async function StudiosPage({ searchParams }: StudiosPageProps) {
  const query = await searchParams;
  const requested =
    typeof query.category === "string" ? query.category.trim() : "";
  const active =
    STUDIO_CATEGORIES.find((category) => category.slug === requested) ?? null;

  const [studios, counts] = await Promise.all([
    getStudios({ category: active?.slug }),
    getCategoryCounts(),
  ]);

  return (
    <>
      {/* --------------------------- page head --------------------------- */}
      <section className="relative isolate overflow-hidden border-b border-ink-950/[0.07] bg-ink-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-spotlight/[0.16] blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-14 xl:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            Explore studios
          </p>
          <h1 className="mt-3 text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[2.8rem]">
            {active ? active.label : "Every space, one list"}
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-300">
            {active
              ? active.blurb + " — pre-selected from the category you chose."
              : "Photo studios, sound stages, podcast rooms, music suites and art workspaces — all booked by the hour."}
          </p>

          {/* ----------------------- filter chips ---------------------- */}
          <nav
            aria-label="Studio categories"
            className="mt-7 flex flex-wrap gap-2"
          >
            <Link
              href="/studios"
              aria-current={active ? undefined : "page"}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                active
                  ? "border border-white/15 bg-white/[0.05] text-ink-300 hover:bg-white/[0.1]"
                  : "bg-spotlight text-ink-950"
              }`}
            >
              All studios
              <span
                className={
                  active ? "text-white/50" : "text-ink-950/60 font-bold"
                }
              >
                {Object.values(counts).reduce((sum, n) => sum + n, 0)}
              </span>
            </Link>

            {STUDIO_CATEGORIES.map((category) => {
              const isActive = active?.slug === category.slug;
              return (
                <Link
                  key={category.slug}
                  href={`/studios?category=${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                    isActive
                      ? "bg-spotlight text-ink-950"
                      : "border border-white/15 bg-white/[0.05] text-ink-300 hover:bg-white/[0.1]"
                  }`}
                >
                  {category.label}
                  <span
                    className={
                      isActive ? "text-ink-950/60 font-bold" : "text-white/45"
                    }
                  >
                    {counts[category.slug] ?? 0}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ---------------------------- listings --------------------------- */}
      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
          <p className="text-[13.5px] font-medium text-ink-500" aria-live="polite">
            {studios.length > 0
              ? `${studios.length} ${studios.length === 1 ? "studio" : "studios"}${
                  active ? ` in ${active.label}` : ""
                }`
              : "No studios in this category yet"}
          </p>

          {studios.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio.slug} studio={studio} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-ink-950/15 bg-white p-12 text-center">
              <p className="text-[17px] font-semibold text-ink-950">
                Nothing listed in this category yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
                Hosts publish new spaces every week — browse everything in the
                meantime, or pick another category above.
              </p>
              <Link
                href="/studios"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-spotlight px-6 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
              >
                Show all studios
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
