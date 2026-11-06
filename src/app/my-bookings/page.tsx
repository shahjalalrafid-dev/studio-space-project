import type { Metadata } from "next";

import { PrivateRoute } from "@/components/routes/PrivateRoute";
import { MyBookings } from "@/components/studios/MyBookings";

export const metadata: Metadata = {
  title: "My Bookings",
  description:
    "Every workspace reservation you've made on StudioSpace — track its status and cancel pending slots.",
};

/** Private route — reservations are matched to the session's email. */
export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <section className="relative isolate overflow-hidden border-b border-ink-950/[0.07] bg-ink-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-28 -top-28 h-[24rem] w-[24rem] rounded-full bg-spotlight/[0.16] blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-5 sm:py-13 xl:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            Reservations
          </p>
          <h1 className="mt-3 text-[2.2rem] font-semibold leading-[1.07] tracking-[-0.03em] sm:text-[2.7rem]">
            My Bookings
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-300">
            Every slot you&apos;ve held — with its live status. Pending reservations can
            be cancelled right from this page.
          </p>
        </div>
      </section>

      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-5 xl:px-8">
          <MyBookings />
        </div>
      </section>
    </PrivateRoute>
  );
}
