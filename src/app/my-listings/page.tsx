import type { Metadata } from "next";

import { PrivateRoute } from "@/components/routes/PrivateRoute";
import { MyListings } from "@/components/studios/MyListings";

export const metadata: Metadata = {
  title: "My Studio Listings",
  description:
    "Manage the studios you host on StudioSpace — update details or remove a listing.",
};

/** Private route — only the signed-in host sees their own listings. */
export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <section className="relative isolate overflow-hidden border-b border-ink-950/[0.07] bg-ink-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-28 h-[24rem] w-[24rem] rounded-full bg-gel/[0.14] blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-5 sm:py-13 xl:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            Host dashboard
          </p>
          <h1 className="mt-3 text-[2.2rem] font-semibold leading-[1.07] tracking-[-0.03em] sm:text-[2.7rem]">
            My Studio Listings
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-300">
            Every space you own, matched by your account email — update the details or
            pull a listing from the grid.
          </p>
        </div>
      </section>

      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
          <MyListings />
        </div>
      </section>
    </PrivateRoute>
  );
}
