/**
 * Reservation status badge — Pending / Confirmed / Completed / Cancelled.
 * Server-safe (no hooks).
 */

const STYLES: Record<string, string> = {
  Pending:
    "bg-amber-100 text-amber-800 ring-amber-500/30",
  Confirmed:
    "bg-emerald-100 text-emerald-800 ring-emerald-600/25",
  Completed:
    "bg-sky-100 text-sky-800 ring-sky-600/25",
  Cancelled:
    "bg-rose-100 text-rose-700 ring-rose-500/25",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.1em] ring-1 ${style}`}
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${
          status === "Cancelled"
            ? "bg-rose-500"
            : status === "Completed"
              ? "bg-sky-600"
              : status === "Confirmed"
                ? "bg-emerald-600"
                : "animate-pulse bg-amber-600"
        }`}
      />
      {status}
    </span>
  );
}
