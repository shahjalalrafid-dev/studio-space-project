import { ApertureIcon } from "@/components/icons";

/**
 * Branded loading state — used by root/route `loading.tsx` files and by
 * <PrivateRoute> while the session is being resolved.
 */
export function StudioLoader({
  label = "Loading StudioSpace…",
  full = false,
}: {
  label?: string;
  full?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-4 ${
        full ? "min-h-[70vh]" : "py-16"
      }`}
    >
      <span className="relative grid size-14 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-2 border-ink-950/10 border-t-spotlight"
        />
        <ApertureIcon className="size-7 animate-pulse text-spotlight-deep" />
      </span>
      <span className="flex items-center gap-2 text-[14px] font-medium text-ink-500">
        <span
          aria-hidden
          className="size-1.5 animate-pulse rounded-full bg-spotlight"
        />
        {label}
      </span>
    </div>
  );
}

/** Room-grid placeholder used by the /studios loading route. */
export function StudioGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      aria-busy
      className="mx-auto max-w-7xl px-4 py-10 sm:px-5 xl:px-8"
    >
      <span className="block h-4 w-40 animate-pulse rounded-full bg-ink-950/10" />
      <span className="mt-4 block h-9 w-full max-w-sm animate-pulse rounded-lg bg-ink-950/[0.08]" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <span
            key={index}
            className="block h-80 animate-pulse rounded-3xl bg-ink-950/[0.05]"
          />
        ))}
      </div>
    </div>
  );
}

/** Detail-page placeholder used by the /studios/[slug] loading route. */
export function StudioDetailSkeleton() {
  return (
    <div aria-busy>
      <div className="h-[22rem] w-full animate-pulse bg-ink-950/90" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-5 lg:grid-cols-[1.35fr_0.65fr] xl:px-8">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className="block h-5 animate-pulse rounded-lg bg-ink-950/[0.07]"
              style={{ width: `${88 - index * 12}%` }}
            />
          ))}
          <span className="mt-6 block h-32 animate-pulse rounded-3xl bg-ink-950/[0.05]" />
        </div>
        <span className="block h-96 animate-pulse rounded-3xl bg-ink-950/[0.06]" />
      </div>
    </div>
  );
}
