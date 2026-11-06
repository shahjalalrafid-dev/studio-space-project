import type { Metadata } from "next";
import Link from "next/link";

import { PrivateRoute } from "@/components/routes/PrivateRoute";
import { StudioForm } from "@/components/studios/StudioForm";
import { ArrowRightIcon, StudioAddIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Add New Studio",
  description:
    "Publish your photo studio, sound stage, podcast room or workshop on StudioSpace — hourly pricing, verified bookings.",
};

/** Private route — <PrivateRoute> bounces signed-out visitors to /login. */
export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <section className="relative isolate overflow-hidden border-b border-ink-950/[0.07] bg-ink-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-spotlight/[0.16] blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-11 sm:px-5 sm:py-13 xl:px-8">
          <Link
            href="/my-listings"
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-300 transition-colors hover:text-white"
          >
            <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            My Studio Listings
          </Link>

          <p className="mt-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            <StudioAddIcon className="size-4" />
            Host a space
          </p>
          <h1 className="mt-3 text-[2.2rem] font-semibold leading-[1.07] tracking-[-0.03em] sm:text-[2.7rem]">
            Add a new studio
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-300">
            Fill in the specs once — it goes live on the explore grid immediately and
            lands in your listings so you can update or pull it any time.
          </p>
        </div>
      </section>

      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-5 xl:px-8">
          <StudioForm mode="create" />
        </div>
      </section>
    </PrivateRoute>
  );
}
