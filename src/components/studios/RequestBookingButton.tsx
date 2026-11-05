"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CalendarIcon } from "@/components/icons";
import { Spinner } from "@/components/auth/AuthFields";

/**
 * Detail-page CTA.
 *
 * Payments/checkout is a later module, so the button is honest about what
 * happens today instead of pretending to create a booking.
 */
export function RequestBookingButton({ title }: { title: string }) {
  const [busy, setBusy] = useState(false);

  function onRequest() {
    if (busy) return;
    setBusy(true);

    window.setTimeout(() => {
      setBusy(false);
      toast.info("Checkout arrives with the payments module", {
        description: `“${title}” is saved to your shortlist in the meantime.`,
      });
    }, 600);
  }

  return (
    <button
      type="button"
      onClick={onRequest}
      disabled={busy}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-spotlight text-[15.5px] font-semibold text-ink-950 shadow-[0_16px_30px_-18px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
    >
      {busy ? <Spinner className="size-4" /> : <CalendarIcon className="size-[18px]" />}
      Book these hours
    </button>
  );
}
