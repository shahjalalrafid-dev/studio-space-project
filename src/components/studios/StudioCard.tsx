import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, MapPinIcon, StarIcon } from "@/components/icons";
import { categoryLabel } from "@/lib/site";
import type { Studio } from "@/lib/studios";

/**
 * Shared studio listing card — used by the homepage "Featured Studios"
 * grid (top 6 from MongoDB) and by the /studios listing page.
 *
 * Server-safe: no hooks, no client JS beyond the link itself.
 */

export function StudioCard({ studio }: { studio: Studio }) {
  const location = [studio.area, studio.city].filter(Boolean).join(", ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-950/[0.08] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink-950/15 hover:shadow-[0_38px_60px_-46px_rgba(11,11,15,0.95)]">
      <Link
        href={`/studios/${studio.slug}`}
        aria-label={`View details for ${studio.title}`}
        className="relative block aspect-[4/3] overflow-hidden bg-ink-950 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-spotlight"
      >
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/5 to-transparent"
        />

        <span className="absolute left-3.5 top-3.5 rounded-full bg-ink-950/80 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/15 backdrop-blur">
          {categoryLabel(studio.category)}
        </span>

        <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12.5px] font-bold text-ink-950 shadow-[0_10px_20px_-14px_rgba(11,11,15,0.9)]">
          <StarIcon className="size-3.5 text-spotlight-deep" />
          {studio.rating.toFixed(1)}
          <span className="font-medium text-ink-400">({studio.reviews})</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink-950">
            <Link
              href={`/studios/${studio.slug}`}
              className="line-clamp-1 transition-colors hover:text-spotlight-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
            >
              {studio.title}
            </Link>
          </h3>
          <p className="shrink-0 text-right leading-none">
            <span className="text-[19px] font-bold tracking-[-0.02em] text-ink-950">
              ${studio.pricePerHour}
            </span>
            <span className="text-[13px] font-medium text-ink-400"> /hr</span>
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-[14px] text-ink-500">
          <MapPinIcon className="size-4 shrink-0 text-ink-400" />
          <span className="truncate">{location || "Location on request"}</span>
        </p>

        {studio.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {studio.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-ink-950/[0.08] bg-paper-warm px-2.5 py-1 text-[12px] font-medium text-ink-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-1">
          <Link
            href={`/studios/${studio.slug}`}
            className="group/link inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-ink-950/[0.12] bg-white text-[14.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/25 hover:bg-ink-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
          >
            View Details
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
