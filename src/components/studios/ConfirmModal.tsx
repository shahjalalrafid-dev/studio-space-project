"use client";

import { useEffect, useState } from "react";

import { CloseIcon, SearchIcon, Spinner } from "@/components/icons";

/**
 * Shared confirmation dialog — behind "Delete" on /my-listings and
 * "Cancel Booking" on /my-bookings. Esc / backdrop close it while idle.
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  // Keep the dialog in the tree one tick longer so the exit path can be
  // animated later; for now it simply guards Escape handling on mass gutters.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 grid place-items-center px-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={() => {
          if (!busy) onCancel();
        }}
        className="menu-in absolute inset-0 cursor-default bg-ink-950/55 backdrop-blur-sm"
      />

      <div className="menu-in relative w-full max-w-md rounded-3xl border border-ink-950/10 bg-white p-6 shadow-[0_48px_90px_-40px_rgba(11,11,15,0.75)]">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600">
            <SearchIcon className="hidden" />
            <span className="text-[20px] font-black leading-none">!</span>
          </span>
          <div className="min-w-0">
            <h2
              id="confirm-title"
              className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink-950"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-500">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (!busy) onCancel();
            }}
            className="inline-flex h-10 items-center rounded-xl border border-ink-950/15 px-4 text-[14.5px] font-semibold text-ink-700 transition-colors hover:border-ink-950/30 hover:text-ink-950"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-[14.5px] font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-70"
          >
            {busy ? <Spinner className="size-4" /> : <CloseIcon className="size-4" />}
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
