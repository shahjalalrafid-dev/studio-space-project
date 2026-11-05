import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { STUDIO_CATEGORIES } from "@/lib/site";
import { getCategoryCounts } from "@/lib/studios";

/**
 * "Browse by Studio Categories" — five interactive cards.
 *
 * Each card links to `/studios?category=<slug>` so the listing page opens
 * with that category already selected. Counters come straight from a
 * MongoDB `$group` aggregation over the studios collection.
 */
export async function CategoryRail() {
  const counts = await getCategoryCounts();
  const categories = STUDIO_CATEGORIES.filter((category) => category.featured);

  return (
    <section
      aria-labelledby="categories-heading"
      className="border-t border-ink-950/[0.07] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight-deep">
              Browse by category
            </p>
            <h2
              id="categories-heading"
              className="mt-3 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-950 sm:text-[2.6rem]"
            >
              Find the room your idea needs
            </h2>
            <p className="mt-3 text-[16.5px] leading-relaxed text-ink-500">
              Five ways in — pick a category and the explore page opens with it
              already selected.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex h-11 items-center gap-2 self-start rounded-full border border-ink-950/15 bg-white px-5 text-[14.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-ink-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
          >
            See every studio
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((category, index) => {
            const count = counts[category.slug] ?? 0;
            const span = index < 3 ? "lg:col-span-2" : "lg:col-span-3";

            return (
              <Link
                key={category.slug}
                href={`/studios?category=${category.slug}`}
                className={`group relative isolate flex h-[15rem] items-end overflow-hidden rounded-3xl border border-ink-950/10 transition-all duration-300 hover:-translate-y-1 hover:border-ink-950/20 hover:shadow-[0_38px_60px_-46px_rgba(11,11,15,0.95)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight sm:h-[16.5rem] ${span}`}
              >
                <Image
                  src={category.image}
                  alt={`${category.label} category`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/10"
                />

                <span className="absolute right-4 top-4 rounded-full bg-white/12 px-3 py-1 text-[12.5px] font-semibold text-white ring-1 ring-white/20 backdrop-blur">
                  {count > 0 ? `${count} ${count === 1 ? "space" : "spaces"}` : "New"}
                </span>

                <div className="relative flex w-full items-end justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <h3 className="text-[21px] font-semibold leading-tight tracking-[-0.02em] text-white">
                      {category.label}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-[14px] text-ink-300">
                      {category.blurb}
                    </p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-spotlight text-ink-950 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRightIcon className="size-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
