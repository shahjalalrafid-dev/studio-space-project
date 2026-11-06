"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/studios/ConfirmModal";
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  StudioAddIcon,
} from "@/components/icons";
import { categoryLabel } from "@/lib/site";
import type { Studio } from "@/lib/studios";

/**
 * /my-listings body — every studio whose `ownerEmail` matches the session.
 *
 * Reads `GET /api/studios?mine=1`, renders a desktop table / mobile card
 * layout, and drives the owner-only Delete action behind a confirmation
 * modal (`DELETE /api/studios/[id]` → success toast → list refresh).
 */
export function MyListings() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/studios?mine=1", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        studios?: Studio[];
        error?: string;
      };

      if (!response.ok || !payload?.studios) {
        setStudios([]);
        setError(payload?.error ?? "Couldn't load your listings.");
        return;
      }
      setError(null);
      setStudios(payload.studios);
    } catch {
      setStudios([]);
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

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/studios/${pendingDelete.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      };

      if (!response.ok) {
        toast.error("Delete failed", {
          description: payload?.error ?? "The listing couldn't be removed — try again.",
        });
        return;
      }

      toast.success("Studio removed", {
        description: `“${pendingDelete.title}” is no longer listed on StudioSpace.`,
      });
      setPendingDelete(null);
      await load();
    } catch {
      toast.error("Delete failed", {
        description: "Couldn't reach the server — check your connection and retry.",
      });
    } finally {
      setDeleting(false);
    }
  }

  /* ----------------------------- states ---------------------------- */

  if (studios === null) {
    return (
      <div aria-busy className="overflow-hidden rounded-3xl border border-ink-950/[0.08] bg-white">
        <div className="h-14 animate-pulse border-b border-ink-950/[0.06] bg-paper-warm/70" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-ink-950/[0.06] px-5 py-5 last:border-b-0"
          >
            <span className="size-16 shrink-0 animate-pulse rounded-xl bg-ink-950/[0.06]" />
            <span className="h-4 flex-1 animate-pulse rounded-full bg-ink-950/[0.06]" />
            <span className="hidden h-9 w-24 animate-pulse rounded-full bg-ink-950/[0.06] sm:block" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-300 bg-rose-50/60 p-10 text-center">
        <p className="text-[17px] font-semibold text-rose-800">
          We couldn&apos;t load your listings
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

  if (studios.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-950/15 bg-white p-12 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-spotlight/15 text-spotlight-deep">
          <StudioAddIcon className="size-7" />
        </span>
        <p className="mt-4 text-[18px] font-semibold text-ink-950">
          You haven&apos;t listed a studio yet
        </p>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
          Publish your first space — photo studio, sound stage, podcast lounge or
          workshop — and it appears on the explore grid right away.
        </p>
        <Link
          href="/add-studio"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-spotlight px-6 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D]"
        >
          Add your first studio
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    );
  }

  /* ----------------------------- table ----------------------------- */

  return (
    <>
      <p className="text-[13.5px] font-medium text-ink-500" aria-live="polite">
        {studios.length} {studios.length === 1 ? "listing" : "listings"} owned by this
        account
      </p>

      {/* ---------------------- desktop table ---------------------- */}
      <div className="mt-4 hidden overflow-hidden rounded-3xl border border-ink-950/[0.08] bg-white lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-950/[0.08] bg-paper-warm/70">
              {["Studio", "Category", "Rate", "Location", "Rating", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-500"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr
                key={studio.id}
                className="border-b border-ink-950/[0.06] transition-colors last:border-b-0 hover:bg-paper-warm/40"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/studios/${studio.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="relative block size-14 shrink-0 overflow-hidden rounded-xl bg-ink-950/5">
                      {studio.image ? (
                        <Image
                          src={studio.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-ink-950 transition-colors group-hover:text-spotlight-deep">
                        {studio.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-ink-500">
                        ${studio.pricePerHour}/hr · {studio.capacity} pax
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-ink-950/[0.06] px-2.5 py-1 text-[12px] font-semibold text-ink-700">
                    {categoryLabel(studio.category)}
                  </span>
                </td>
                <td className="px-5 py-4 text-[15px] font-semibold tabular-nums text-ink-950">
                  ${studio.pricePerHour}
                  <span className="text-[13px] font-medium text-ink-400">/hr</span>
                </td>
                <td className="max-w-[12rem] px-5 py-4">
                  <span className="flex items-center gap-1.5 text-[14px] text-ink-600">
                    <MapPinIcon className="size-4 shrink-0 text-ink-400" />
                    <span className="truncate">{studio.address || "—"}</span>
                  </span>
                </td>
                <td className="px-5 py-4 text-[14.5px] font-semibold tabular-nums text-ink-950">
                  {studio.rating > 0 ? `${studio.rating.toFixed(1)} ★` : "New"}
                  <span className="ml-1 font-normal text-ink-400">
                    ({studio.reviews})
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/studios/edit/${studio.id}`}
                      className="inline-flex h-9 items-center rounded-lg border border-ink-950/15 bg-white px-3.5 text-[13.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-ink-950 hover:text-white"
                    >
                      Update
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(studio)}
                      className="inline-flex h-9 items-center rounded-lg border border-rose-200 bg-rose-50 px-3.5 text-[13.5px] font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------------------- mobile cards ---------------------- */}
      <ul className="mt-4 grid gap-4 lg:hidden">
        {studios.map((studio) => (
          <li
            key={studio.id}
            className="overflow-hidden rounded-3xl border border-ink-950/[0.08] bg-white"
          >
            <Link
              href={`/studios/${studio.slug}`}
              className="relative block aspect-[16/9] bg-ink-950/5"
            >
              {studio.image ? (
                <Image
                  src={studio.image}
                  alt={studio.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : null}
              <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                {categoryLabel(studio.category)}
              </span>
            </Link>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[16px] font-semibold leading-snug text-ink-950">
                  <Link href={`/studios/${studio.slug}`} className="hover:text-spotlight-deep">
                    {studio.title}
                  </Link>
                </h3>
                <p className="shrink-0 text-right leading-none">
                  <span className="text-[17px] font-bold text-ink-950">
                    ${studio.pricePerHour}
                  </span>
                  <span className="text-[12.5px] font-medium text-ink-400"> /hr</span>
                </p>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-500">
                <MapPinIcon className="size-4 shrink-0 text-ink-400" />
                <span className="truncate">{studio.address || "Location on request"}</span>
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-ink-500">
                <ClockIcon className="size-4 shrink-0 text-ink-400" />
                {studio.capacity} people max ·{" "}
                {studio.rating > 0 ? `${studio.rating.toFixed(1)} ★` : "No reviews yet"}
              </p>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/studios/edit/${studio.id}`}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-ink-950/15 bg-white text-[14px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30"
                >
                  Update
                </Link>
                <button
                  type="button"
                  onClick={() => setPendingDelete(studio)}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-[14px] font-semibold text-rose-700 transition-colors hover:border-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete this listing?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” will be removed from MongoDB and disappear from the explore grid. Bookings already made stay in your guests' histories — this can't be undone.`
            : ""
        }
        confirmLabel="Delete listing"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
      />
    </>
  );
}
