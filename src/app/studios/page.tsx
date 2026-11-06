import type { Metadata } from "next";
import Link from "next/link";

import { SearchIcon } from "@/components/icons";
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
  searchParams: Promise<{
    category?: string | string[] | undefined;
    q?: string | string[] | undefined;
  }>;
};

export default async function StudiosPage({ searchParams }: StudiosPageProps) {
  const query = await searchParams;
  const requested =
    typeof query.category === "string" ? query.category.trim() : "";
  const active =
    STUDIO_CATEGORIES.find((category) => category.slug === requested) ?? null;
  const search =
    typeof query.q === "string" ? query.q.trim().slice(0, 60) : "";

  const [studios, counts] = await Promise.all([
    getStudios({ category: active?.slug, search }),
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

          {/* ------------------------ search ------------------------ */}
          <form
            action="/studios"
            method="get"
            role="search"
            className="mt-5 flex max-w-xl gap-2"
          >
            {active ? <input type="hidden" name="category" value={active.slug} /> : null}
            <div className="relative flex-1">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-ink-400"
              >
                <SearchIcon className="size-[18px]" />
              </span>
              <label htmlFor="studio-search" className="sr-only">
                Search studios
              </label>
              <input
                id="studio-search"
                name="q"
                defaultValue={search}
                maxLength={60}
                placeholder="Search by title, city, amenity…"
                className="h-11 w-full rounded-full border border-white/15 bg-white/[0.06] pl-11 pr-4 text-[15px] text-white outline-none transition-colors placeholder:text-ink-400 focus:border-spotlight/70 focus:bg-white/[0.1]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-full bg-spotlight px-5 text-[14.5px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ---------------------------- listings --------------------------- */}
      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
          <p className="text-[13.5px] font-medium text-ink-500" aria-live="polite">
            {studios.length > 0
              ? `${studios.length} ${studios.length === 1 ? "studio" : "studios"}${
                  search
                    ? ` matching “${search}”`
                    : active
                      ? ` in ${active.label}`
                      : ""
                }`
              : search
                ? `No studios match “${search}”`
                : "No studios in this category yet"}
          </p>

          {studios.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio.slug} studio={studio} />
              ))}
            </div>
          ) : search ? (
            /* -------------------- empty search results -------------------- */
            <div className="mt-6 rounded-3xl border border-dashed border-ink-950/15 bg-white p-12 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-spotlight/15 text-spotlight-deep">
                <SearchIcon className="size-7" />
              </span>
              <p className="mt-4 text-[18px] font-semibold text-ink-950">
                Nothing matched “{search}”
              </p>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
                Try a shorter keyword, search by city or amenity — or clear the filters
                and browse every space on StudioSpace.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href={active ? `/studios?category=${active.slug}` : "/studios"}
                  className="inline-flex h-11 items-center rounded-full border border-ink-950/15 bg-white px-6 text-[15px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-ink-950 hover:text-white"
                >
                  Clear search
                </Link>
                <Link
                  href="/studios"
                  className="inline-flex h-11 items-center rounded-full bg-spotlight px-6 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
                >
                  Show all studios
                </Link>
              </div>
            </div>
          ) : (
            /* -------------------- empty category ------------------------- */
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
