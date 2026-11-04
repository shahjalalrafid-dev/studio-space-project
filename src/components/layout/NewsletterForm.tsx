"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ArrowRightIcon, MailIcon } from "@/components/icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter capture for the footer.
 * Every outcome is reported through a Sonner toast — never `alert()`.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      toast.error("That email doesn't look right", {
        description: "Double-check the address — for example you@studio.com.",
      });
      return;
    }

    setPending(true);
    // Placeholder for the real subscribe call to your API route.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setPending(false);
    setEmail("");

    toast.success("You're on the StudioSpace list", {
      description: `New openings and host pricing insights will land in ${value}.`,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label
        htmlFor="newsletter-email"
        className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
      >
        Stay in the loop
      </label>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-400">
        One email a week: newly listed studios, off-peak rates and booking tips
        from working creators. No spam, unsubscribe any time.
      </p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-400" />
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@studio.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-full border border-white/15 bg-white/[0.06] pl-11 pr-4 text-[15px] text-white placeholder:text-ink-400 transition-colors outline-none focus:border-spotlight/70 focus:bg-white/[0.09] focus:ring-2 focus:ring-spotlight/25"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-spotlight px-6 text-[15px] font-semibold text-ink-950 transition-all hover:bg-[#FFC24D] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Subscribing…" : "Subscribe"}
          <ArrowRightIcon
            className={`size-4 transition-transform duration-200 ${
              pending ? "animate-pulse" : "group-hover:translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-400">
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        />
        Joined by 4,100+ creators across 27 cities.
      </p>
    </form>
  );
}
