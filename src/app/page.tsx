import { Suspense } from "react";

import { CategoryRail } from "@/components/home/CategoryRail";
import { FeaturedStudios } from "@/components/home/FeaturedStudios";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HostGuarantee } from "@/components/home/HostGuarantee";
import { MemberStrip } from "@/components/home/MemberStrip";
import { BookingSteps } from "@/components/home/BookingSteps";

/**
 * Dynamic homepage — every section reads live data from MongoDB, so the
 * route opts out of prerendering (`force-dynamic`) and the two database
 * sections stream in behind Suspense after the banner is already visible.
 */

export const dynamic = "force-dynamic";

function FeaturedFallback() {
  return (
    <section className="bg-paper py-16 sm:py-20 lg:py-24" aria-busy>
      <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
        <span className="block h-4 w-32 animate-pulse rounded-full bg-ink-950/10" />
        <span className="mt-4 block h-9 w-full max-w-lg animate-pulse rounded-lg bg-ink-950/[0.08]" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="block h-80 animate-pulse rounded-3xl bg-ink-950/[0.05]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryFallback() {
  return (
    <section className="border-t border-ink-950/[0.07] bg-white py-16 sm:py-20 lg:py-24" aria-busy>
      <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
        <span className="block h-4 w-40 animate-pulse rounded-full bg-ink-950/10" />
        <span className="mt-4 block h-9 w-full max-w-md animate-pulse rounded-lg bg-ink-950/[0.08]" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`block h-64 animate-pulse rounded-3xl bg-ink-950/[0.05] ${
                index < 3 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSlider />
      <MemberStrip />

      <Suspense fallback={<FeaturedFallback />}>
        <FeaturedStudios />
      </Suspense>

      <Suspense fallback={<CategoryFallback />}>
        <CategoryRail />
      </Suspense>

      <BookingSteps />
      <HostGuarantee />
    </>
  );
}
