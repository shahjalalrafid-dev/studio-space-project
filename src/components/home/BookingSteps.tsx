import {
  BoltIcon,
  CameraIcon,
  ClockIcon,
  SearchIcon,
} from "@/components/icons";

/**
 * "How Booking Works" — the four-step workflow.
 *
 * Static section; the dashed connector behind the step icons only shows
 * through the gaps between cards on large screens.
 */

const STEPS = [
  {
    number: "01",
    icon: SearchIcon,
    title: "Discover Spaces",
    text: "Filter by category, city, capacity and hourly rate — with real photos of the exact room you will walk into.",
  },
  {
    number: "02",
    icon: ClockIcon,
    title: "Select Shoot Hours",
    text: "Pick the block you need from a live calendar. Hold a date, extend the day, no phone tag with the host.",
  },
  {
    number: "03",
    icon: BoltIcon,
    title: "Book Instantly",
    text: "Confirm with card or wallet. The booking lands in the host's calendar the moment payment clears.",
  },
  {
    number: "04",
    icon: CameraIcon,
    title: "Create & Produce",
    text: "Arrive, plug in, shoot. Keys, codes and gear notes arrive with your confirmation — leave it as you found it.",
  },
];

export function BookingSteps() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="booking-steps-heading"
      className="relative isolate overflow-hidden bg-paper-warm py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-gel/[0.08] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight-deep">
            How booking works
          </p>
          <h2
            id="booking-steps-heading"
            className="mt-3 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-950 sm:text-[2.6rem]"
          >
            Four steps from idea to shoot day
          </h2>
          <p className="mt-3 text-[16.5px] leading-relaxed text-ink-500">
            No quotes, no back-and-forth email chains. Search, pick your hours,
            pay and get the keys.
          </p>
        </div>

        <div className="relative mt-12">
          {/* dashed connector, visible through the gaps between cards */}
          <span
            aria-hidden
            className="absolute left-[10%] right-[10%] top-[3.15rem] hidden border-t border-dashed border-ink-950/20 lg:block"
          />

          <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="group relative rounded-3xl border border-ink-950/[0.08] bg-white p-6 shadow-[0_30px_60px_-54px_rgba(11,11,15,0.9)] transition-all duration-300 hover:-translate-y-1 hover:border-ink-950/15"
                >
                  <div className="flex items-center justify-between">
                    <span className="relative grid size-14 place-items-center rounded-2xl bg-ink-950 text-spotlight shadow-[0_16px_30px_-22px_rgba(11,11,15,1)]">
                      <Icon className="size-6" />
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-2xl bg-spotlight/10 blur-md"
                      />
                    </span>
                    <span className="font-mono text-[13px] font-semibold tabular-nums text-ink-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">
                    {step.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
