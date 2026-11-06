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

/** Dark page header + spinner used while a private form loads. */
export function StudioFormSkeleton({ title = "Loading…" }: { title?: string }) {
  return (
    <div aria-busy>
      <div className="border-b border-ink-950/[0.07] bg-ink-950">
        <div className="mx-auto max-w-4xl px-4 py-11 sm:px-5 sm:py-13 xl:px-8">
          <span className="block h-3.5 w-32 animate-pulse rounded-full bg-white/15" />
          <span className="mt-6 block h-9 w-64 animate-pulse rounded-lg bg-white/10" />
          <span className="mt-3 block h-4 w-full max-w-lg animate-pulse rounded-full bg-white/[0.07]" />
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-5 xl:px-8">
        <StudioLoader label={title} />
        <div className="mt-6 grid gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className="block h-44 animate-pulse rounded-3xl bg-ink-950/[0.05]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Header + rows placeholder for /my-listings and /my-bookings. */
export function StudioListSkeleton({ heading }: { heading: string }) {
  return (
    <div aria-busy>
      <div className="border-b border-ink-950/[0.07] bg-ink-950">
        <div className="mx-auto max-w-7xl px-4 py-11 sm:px-5 sm:py-13 xl:px-8">
          <span className="block h-3.5 w-28 animate-pulse rounded-full bg-white/15" />
          <span className="mt-6 block h-9 w-72 animate-pulse rounded-lg bg-white/10" />
          <span className="mt-3 block h-4 w-full max-w-md animate-pulse rounded-full bg-white/[0.07]" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 xl:px-8">
        <span className="block h-3.5 w-52 animate-pulse rounded-full bg-ink-950/10" />
        <div className="mt-4 grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className="block h-28 animate-pulse rounded-3xl bg-ink-950/[0.05]"
            />
          ))}
        </div>
        <p className="mt-6 text-center text-[13.5px] font-medium text-ink-400">
          {heading}
        </p>
      </div>
    </div>
  );
}
