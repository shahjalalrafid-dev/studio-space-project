"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/studios/ConfirmModal";
import { StatusBadge } from "@/components/studios/StatusBadge";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@/components/icons";
import { categoryLabel } from "@/lib/site";

/**
 * /my-bookings body — every reservation made with this account's email.
 *
 * Reads `GET /api/bookings?mine=1`, shows the status badge
 * (Pending / Confirmed / Completed / Cancelled) and offers
 * "Cancel Booking" only while the slot is still Pending
 * (`PATCH /api/bookings/[id]` → success toast → refresh).
 */

type Booking = {
  id: string;
  studioId: string;
  studioSlug: string;
  studioTitle: string;
  studioImage: string;
  studioCategory: string;
  pricePerHour: number;
  securityDeposit: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  hours: number;
  guests: number;
  message: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
};

function formatSlot(booking: Booking) {
  const day = new Date(`${booking.date}T00:00:00`);
  const label = Number.isNaN(day.getTime())
    ? booking.date
    : day.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  return `${label} · ${booking.startTime} · ${booking.hours} ${
    booking.hours === 1 ? "hour" : "hours"
  }`;
}

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/bookings?mine=1", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        bookings?: Booking[];
        error?: string;
      };

      if (!response.ok || !payload?.bookings) {
        setBookings([]);
        setError(payload?.error ?? "Couldn't load your bookings.");
        return;
      }
      setError(null);
      setBookings(payload.bookings);
    } catch {
      setBookings([]);
      setError("Couldn't reach the server — check your connection and retry.");
    }
  }, []);

  useEffect(() => {
    // Kicked off inside an async IIFE so the first render stays sync-free
    // (react-hooks/set-state-in-effect) while the list still loads on mount.
    void (async () => {
      await load();
    })();
  }, [load]);

  async function confirmCancel() {
    if (!pendingCancel || cancelling) return;
    setCancelling(true);

    try {
      const response = await fetch(`/api/bookings/${pendingCancel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string };

      if (!response.ok) {
        toast.error("Couldn't cancel the booking", {
          description: payload?.error ?? "Try again in a moment.",
        });
        return;
      }

      toast.success("Booking cancelled", {
        description: `“${pendingCancel.studioTitle}” is off your schedule — the host has been notified.`,
      });
      setPendingCancel(null);
      await load();
    } catch {
      toast.error("Couldn't cancel the booking", {
        description: "Check your connection and try again.",
      });
    } finally {
      setCancelling(false);
    }
  }

  /* ----------------------------- states ---------------------------- */

  if (bookings === null) {
    return (
      <div aria-busy className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-3xl border border-ink-950/[0.08] bg-white p-5"
          >
            <span className="size-20 shrink-0 animate-pulse rounded-2xl bg-ink-950/[0.06]" />
            <div className="flex-1">
              <span className="block h-4 w-2/3 animate-pulse rounded-full bg-ink-950/[0.06]" />
              <span className="mt-2.5 block h-3.5 w-1/3 animate-pulse rounded-full bg-ink-950/[0.05]" />
            </div>
            <span className="hidden h-9 w-28 animate-pulse rounded-full bg-ink-950/[0.06] sm:block" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-300 bg-rose-50/60 p-10 text-center">
        <p className="text-[17px] font-semibold text-rose-800">
          We couldn&apos;t load your bookings
        </p>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-rose-700/80">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-5 inline-flex h-11 items-center rounded-full bg-rose-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-950/15 bg-white p-12 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-spotlight/15 text-spotlight-deep">
          <CalendarIcon className="size-7" />
        </span>
        <p className="mt-4 text-[18px] font-semibold text-ink-950">
          No reservations yet
        </p>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
          When you book a workspace it lands here with a live status — pending,
          confirmed, completed or cancelled.
        </p>
        <Link
          href="/studios"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-spotlight px-6 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
        >
          Explore studios
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    );
  }

  /* ----------------------------- list ------------------------------ */

  const pendingCount = bookings.filter((booking) => booking.status === "Pending").length;

  return (
    <>
      <p className="text-[13.5px] font-medium text-ink-500" aria-live="polite">
        {bookings.length} {bookings.length === 1 ? "reservation" : "reservations"}
        {pendingCount > 0 ? ` · ${pendingCount} awaiting confirmation` : ""}
      </p>

      <ul className="mt-4 grid gap-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="overflow-hidden rounded-3xl border border-ink-950/[0.08] bg-white"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              {/* ---------------------- studio ---------------------- */}
              <Link
                href={`/studios/${booking.studioSlug || booking.studioId}`}
                className="group relative block h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-ink-950/5 sm:size-24 sm:h-auto"
                aria-label={`View ${booking.studioTitle}`}
              >
                {booking.studioImage ? (
                  <Image
                    src={booking.studioImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
              </Link>

              {/* ---------------------- details --------------------- */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                      {categoryLabel(booking.studioCategory)}
                    </p>
                    <h3 className="mt-1 truncate text-[17px] font-semibold tracking-[-0.01em] text-ink-950">
                      <Link
                        href={`/studios/${booking.studioSlug || booking.studioId}`}
                        className="transition-colors hover:text-spotlight-deep"
                      >
                        {booking.studioTitle}
                      </Link>
                    </h3>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-2.5 grid gap-1.5 text-[14px] text-ink-600 sm:grid-cols-2">
                  <p className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4 shrink-0 text-ink-400" />
                    {formatSlot(booking)}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <ClockIcon className="size-4 shrink-0 text-ink-400" />
                    {booking.guests} {booking.guests === 1 ? "guest" : "guests"} · booked
                    by {booking.name}
                  </p>
                  <p className="flex items-center gap-1.5 sm:col-span-2">
                    <MapPinIcon className="size-4 shrink-0 text-ink-400" />
                    Reference #{booking.id.slice(-8).toUpperCase()} · booked{" "}
                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* ---------------------- price + actions -------------- */}
              <div className="flex shrink-0 flex-col items-start gap-3 border-t border-ink-950/[0.07] pt-4 sm:min-w-[11rem] sm:flex-col-reverse sm:items-end sm:border-t-0 sm:pt-0">
                <p className="text-right leading-none">
                  <span className="text-[22px] font-bold tracking-[-0.02em] text-ink-950">
                    ${booking.totalPrice.toLocaleString()}
                  </span>
                  <span className="mt-1 block text-[12.5px] font-medium text-ink-400">
                    ${booking.pricePerHour}/hr × {booking.hours} + deposit
                  </span>
                </p>

                {booking.status === "Pending" ? (
                  <button
                    type="button"
                    onClick={() => setPendingCancel(booking)}
                    className="inline-flex h-10 items-center rounded-xl border border-rose-200 bg-rose-50 px-4 text-[14px] font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-600 hover:text-white"
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <span className="text-[13px] italic text-ink-400">
                    {booking.status === "Cancelled"
                      ? "Slot released"
                      : booking.status === "Completed"
                        ? "Hope it went well!"
                        : "Host confirmed — see you there"}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={pendingCancel !== null}
        title="Cancel this booking?"
        description={
          pendingCancel
            ? `“${pendingCancel.studioTitle}” on ${pendingCancel.date} will be marked Cancelled and the slot freed for other creators. Pending bookings can be cancelled free of charge.`
            : ""
        }
        confirmLabel="Cancel booking"
        busy={cancelling}
        onConfirm={() => void confirmCancel()}
        onCancel={() => {
          if (!cancelling) setPendingCancel(null);
        }}
      />
    </>
  );
}
