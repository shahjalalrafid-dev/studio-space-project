"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/auth/AuthFields";
import {
  CalendarIcon,
  CloseIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

/**
 * "Book Workspace Now" — opens from the detail page's CTA and saves a
 * reservation in the `bookings` collection with status "Pending".
 *
 * The booker's name/email come from the session (email is read-only, so
 * every reservation is traceable to an account), the server re-validates
 * capacity and dates, and a success toast lands the user on /my-bookings.
 */

export type BookingStudio = {
  id: string;
  slug: string;
  title: string;
  image: string;
  address: string;
  pricePerHour: number;
  securityDeposit: number;
  capacity: number;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  date?: string;
  hours?: string;
  guests?: string;
};

const START_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const controlClass = (invalid: boolean) =>
  [
    "h-11 w-full rounded-xl border bg-paper-warm/70 px-3.5 text-[15px] text-ink-950",
    "placeholder:text-ink-400 outline-none transition-colors duration-150",
    invalid
      ? "border-rose-400 bg-rose-50/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
      : "border-ink-950/[0.12] focus:border-spotlight/80 focus:bg-white focus:ring-4 focus:ring-spotlight/20",
  ].join(" ");

function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor: string;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline justify-between gap-3 text-[13px] font-semibold tracking-[0.02em] text-ink-700"
    >
      {children}
      {hint ? <span className="text-[12px] font-normal text-ink-400">{hint}</span> : null}
    </label>
  );
}

export function BookWorkspaceButton({ studio }: { studio: BookingStudio }) {
  const router = useRouter();
  const { user, isPending } = useAuth();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [hours, setHours] = useState(2);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const total = studio.pricePerHour * hours + studio.securityDeposit;

  // Lock background scroll + Esc while the modal is open.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, busy]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Add the name the booking is for.";
    if (phone.trim() && !/^[+\d][\d\s()-]{5,}$/.test(phone.trim()))
      next.phone = "That phone number looks incomplete.";
    if (!date) next.date = "Pick the shoot date.";
    else if (date < today) next.date = "Pick today or a future date.";
    if (!Number.isInteger(hours) || hours < 1 || hours > 12)
      next.hours = "Book between 1 and 12 hours.";
    if (!Number.isInteger(guests) || guests < 1)
      next.guests = "Tell us how many people are coming.";
    else if (guests > studio.capacity)
      next.guests = `This space fits ${studio.capacity} people.`;
    return next;
  }

  function onOpen() {
    if (isPending) {
      toast.info("One moment — checking your session…");
      return;
    }
    if (!user) {
      toast.warning("Log in to book this workspace", {
        description: "Reservations are tied to your StudioSpace account.",
      });
      router.push(`/login?next=${encodeURIComponent(`/studios/${studio.slug}`)}`);
      return;
    }
    if (!name && user.name) setName(user.name);
    setOpen(true);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Check the booking form", {
        description: "A few fields need your attention before we can hold the slot.",
      });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId: studio.id,
          name: name.trim(),
          phone: phone.trim(),
          date,
          startTime,
          hours,
          guests,
          message: message.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        booking?: { id: string };
        error?: string;
      };

      if (!response.ok || !payload?.booking) {
        toast.error("Booking not saved", {
          description: payload?.error ?? "Something went wrong — try again.",
        });
        return;
      }

      toast.success("Reservation requested", {
        description: `“${studio.title}” is pending confirmation — find it in My Bookings.`,
      });
      setOpen(false);
      router.push("/my-bookings");
    } catch {
      toast.error("Booking not saved", {
        description: "Couldn't reach the server — check your connection and retry.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-spotlight text-[15.5px] font-semibold text-ink-950 shadow-[0_16px_30px_-18px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
      >
        <CalendarIcon className="size-[18px]" />
        Book Workspace Now
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          className="fixed inset-0 z-50 grid place-items-center px-4 py-6"
        >
          <button
            type="button"
            aria-label="Close booking dialog"
            onClick={() => {
              if (!busy) setOpen(false);
            }}
            className="menu-in absolute inset-0 cursor-default bg-ink-950/55 backdrop-blur-sm"
          />

          <div className="menu-in relative flex max-h-[92vh] w-full max-w-[34rem] flex-col overflow-hidden rounded-3xl border border-ink-950/10 bg-white shadow-[0_48px_90px_-40px_rgba(11,11,15,0.75)]">
            {/* ------------------------ header ------------------------ */}
            <div className="relative shrink-0">
              <div className="relative h-28 w-full overflow-hidden bg-ink-950">
                {studio.image ? (
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 544px) 100vw, 544px"
                    className="object-cover"
                  />
                ) : null}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/85 to-ink-950/20"
                />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => {
                    if (!busy) setOpen(false);
                  }}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink-950/60 text-white backdrop-blur transition-colors hover:bg-ink-950/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
                >
                  <CloseIcon className="size-5" />
                </button>

                <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-spotlight">
                    Reserve these hours
                  </p>
                  <h2
                    id="booking-title"
                    className="mt-1 truncate text-[20px] font-semibold tracking-[-0.02em] text-white"
                  >
                    {studio.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* ------------------------- form -------------------------- */}
            <form
              onSubmit={onSubmit}
              noValidate
              className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
            >
              <p className="flex items-center gap-2 text-[13.5px] text-ink-500">
                <MapPinIcon className="size-4 shrink-0 text-ink-400" />
                <span className="truncate">{studio.address || "Location on request"}</span>
              </p>

              <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="booking-name">Full name</FieldLabel>
                  <input
                    id="booking-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    aria-invalid={fieldErrors.name ? true : undefined}
                    className={`mt-1.5 ${controlClass(Boolean(fieldErrors.name))}`}
                  />
                  {fieldErrors.name ? (
                    <p className="mt-1 text-[12.5px] font-medium text-rose-600">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <FieldLabel htmlFor="booking-email" hint="from your account">
                    Email
                  </FieldLabel>
                  <input
                    id="booking-email"
                    value={user?.email ?? ""}
                    readOnly
                    disabled
                    className="mt-1.5 h-11 w-full cursor-not-allowed rounded-xl border border-ink-950/[0.1] bg-ink-950/[0.04] px-3.5 text-[15px] text-ink-500 outline-none"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="booking-phone" hint="optional">
                    Phone
                  </FieldLabel>
                  <input
                    id="booking-phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+1 555 010 2030"
                    aria-invalid={fieldErrors.phone ? true : undefined}
                    className={`mt-1.5 ${controlClass(Boolean(fieldErrors.phone))}`}
                  />
                  {fieldErrors.phone ? (
                    <p className="mt-1 text-[12.5px] font-medium text-rose-600">
                      {fieldErrors.phone}
                    </p>
                  ) : null}
                </div>

                <div>
                  <FieldLabel htmlFor="booking-date">Shoot date</FieldLabel>
                  <input
                    id="booking-date"
                    type="date"
                    value={date}
                    min={today}
                    onChange={(event) => setDate(event.target.value)}
                    aria-invalid={fieldErrors.date ? true : undefined}
                    className={`mt-1.5 ${controlClass(Boolean(fieldErrors.date))}`}
                  />
                  {fieldErrors.date ? (
                    <p className="mt-1 text-[12.5px] font-medium text-rose-600">
                      {fieldErrors.date}
                    </p>
                  ) : null}
                </div>

                <div>
                  <FieldLabel htmlFor="booking-start">Start time</FieldLabel>
                  <select
                    id="booking-start"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className={`mt-1.5 ${controlClass(false)}`}
                  >
                    {START_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="booking-hours" hint="1–12 h">
                    Hours
                  </FieldLabel>
                  <input
                    id="booking-hours"
                    type="number"
                    min={1}
                    max={12}
                    value={hours}
                    onChange={(event) => setHours(Number(event.target.value))}
                    aria-invalid={fieldErrors.hours ? true : undefined}
                    className={`mt-1.5 ${controlClass(Boolean(fieldErrors.hours))}`}
                  />
                  {fieldErrors.hours ? (
                    <p className="mt-1 text-[12.5px] font-medium text-rose-600">
                      {fieldErrors.hours}
                    </p>
                  ) : null}
                </div>

                <div>
                  <FieldLabel htmlFor="booking-guests" hint={`max ${studio.capacity}`}>
                    Guests
                  </FieldLabel>
                  <input
                    id="booking-guests"
                    type="number"
                    min={1}
                    max={studio.capacity}
                    value={guests}
                    onChange={(event) => setGuests(Number(event.target.value))}
                    aria-invalid={fieldErrors.guests ? true : undefined}
                    className={`mt-1.5 ${controlClass(Boolean(fieldErrors.guests))}`}
                  />
                  {fieldErrors.guests ? (
                    <p className="mt-1 text-[12.5px] font-medium text-rose-600">
                      {fieldErrors.guests}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="booking-message" hint="optional">
                    Notes for the host
                  </FieldLabel>
                  <textarea
                    id="booking-message"
                    rows={3}
                    maxLength={600}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Crew size, load-in needs, prop deliveries…"
                    className="mt-1.5 w-full rounded-xl border border-ink-950/[0.12] bg-paper-warm/70 px-3.5 py-2.5 text-[15px] text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-spotlight/80 focus:bg-white focus:ring-4 focus:ring-spotlight/20"
                  />
                </div>
              </div>

              {/* ---------------------- price box ---------------------- */}
              <div className="mt-5 rounded-2xl border border-ink-950/[0.08] bg-paper-warm/70 p-4">
                <dl className="grid gap-1.5 text-[14px]">
                  <div className="flex justify-between gap-4 text-ink-600">
                    <dt className="flex items-center gap-1.5">
                      <ClockIcon className="size-3.5 text-ink-400" />
                      ${studio.pricePerHour} × {hours} {hours === 1 ? "hour" : "hours"}
                    </dt>
                    <dd className="font-medium text-ink-800">
                      ${(studio.pricePerHour * hours).toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 text-ink-600">
                    <dt className="flex items-center gap-1.5">
                      <UserIcon className="size-3.5 text-ink-400" />
                      Refundable security deposit
                    </dt>
                    <dd className="font-medium text-ink-800">
                      ${studio.securityDeposit.toLocaleString()}
                    </dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-4 border-t border-ink-950/[0.08] pt-2 text-[15.5px] font-semibold text-ink-950">
                    <dt>Total due at confirmation</dt>
                    <dd>${total.toLocaleString()}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
                  You won&apos;t be charged yet — the host confirms the slot first.
                  Cancel free while the reservation is still Pending.
                </p>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!busy) setOpen(false);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-ink-950/15 px-5 text-[14.5px] font-semibold text-ink-700 transition-colors hover:border-ink-950/30 hover:text-ink-950"
                >
                  Keep browsing
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-spotlight px-6 text-[14.5px] font-semibold text-ink-950 transition-colors hover:bg-[#FFC24D] disabled:opacity-70"
                >
                  {busy ? <Spinner className="size-4" /> : null}
                  {busy ? "Requesting…" : "Request booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
