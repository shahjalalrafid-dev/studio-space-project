"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import {
  CheckIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "@/components/icons";
import { PASSWORD_RULES, passwordStrength } from "@/lib/password";

/* ------------------------------------------------------------------ */
/* Shared control chrome                                               */
/* ------------------------------------------------------------------ */

const controlClass = (invalid: boolean, hasTrailing: boolean) =>
  [
    "h-12 w-full rounded-xl border bg-paper-warm/70 text-[15px] text-ink-950",
    "placeholder:text-ink-400 outline-none transition-colors duration-150",
    hasTrailing ? "pl-11 pr-12" : "pl-11 pr-4",
    invalid
      ? "border-rose-400 bg-rose-50/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
      : "border-ink-950/[0.12] focus:border-spotlight/80 focus:bg-white focus:ring-4 focus:ring-spotlight/20",
  ].join(" ");

const ICON_SLOT =
  "pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-ink-400";

type AuthFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Extra content aligned with the label (e.g. a "Forgot password?" link). */
  labelAside?: ReactNode;
  icon: ReactNode;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "placeholder" | "autoComplete" | "inputMode" | "maxLength"
>;

/** Label + leading icon + inline error, shared by every credential field. */
export function TextField({
  label,
  value,
  onChange,
  error,
  labelAside,
  icon,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}: AuthFieldProps) {
  const id = useId();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[13px] font-semibold tracking-[0.02em] text-ink-700"
        >
          {label}
        </label>
        {labelAside}
      </div>

      <div className="relative mt-1.5">
        <span aria-hidden className={ICON_SLOT}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          className={controlClass(Boolean(error), false)}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-[13px] font-medium text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}

/** Password variant with a show/hide reveal toggle. */
export function PasswordField({
  label,
  value,
  onChange,
  error,
  labelAside,
  autoComplete = "current-password",
  placeholder,
}: Omit<AuthFieldProps, "type" | "icon" | "inputMode" | "maxLength"> & {
  autoComplete?: string;
}) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[13px] font-semibold tracking-[0.02em] text-ink-700"
        >
          {label}
        </label>
        {labelAside}
      </div>

      <div className="relative mt-1.5">
        <span aria-hidden className={ICON_SLOT}>
          <LockIcon className="size-[18px]" />
        </span>
        <input
          id={id}
          type={revealed ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          className={controlClass(Boolean(error), true)}
        />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? "Hide password" : "Show password"}
          aria-pressed={revealed}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-ink-400 transition-colors hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-spotlight"
        >
          {revealed ? (
            <EyeIcon className="size-[18px]" />
          ) : (
            <EyeOffIcon className="size-[18px]" />
          )}
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-[13px] font-medium text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Password policy checklist                                          */
/* ------------------------------------------------------------------ */

const STRENGTH_LABEL = ["Too weak", "Getting there", "Good", "Strong"];
const STRENGTH_COLOR = [
  "bg-ink-200",
  "bg-rose-400",
  "bg-amber-400",
  "bg-emerald-500",
];

/** Live rule-by-rule feedback shown under the registration password field. */
export function PasswordChecklist({ password }: { password: string }) {
  const score = password.length === 0 ? 0 : passwordStrength(password);

  return (
    <div className="rounded-xl border border-ink-950/[0.08] bg-paper-warm/60 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">
          Password rules
        </span>
        <span className="text-[12px] font-semibold text-ink-600">
          {password.length === 0 ? "—" : STRENGTH_LABEL[score]}
        </span>
      </div>

      <div className="mt-2 flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              index < score ? STRENGTH_COLOR[score] : "bg-ink-200"
            }`}
          />
        ))}
      </div>

      <ul className="mt-3 grid gap-1.5">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-2 text-[13px] transition-colors ${
                met ? "text-ink-800" : "text-ink-500"
              }`}
            >
              <span
                className={`grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors ${
                  met
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-ink-950/15 bg-white text-ink-300"
                }`}
              >
                {met ? <CheckIcon className="size-3" /> : null}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback + actions                                                 */
/* ------------------------------------------------------------------ */

/** Inline form-level error (paired with a Sonner toast). */
export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="form-alert flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[14px] font-medium leading-snug text-rose-700"
    >
      <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-rose-500 text-white">
        <CloseIcon className="size-3" strokeWidth={2.4} />
      </span>
      <span>{message}</span>
    </p>
  );
}

/** Primary submit button with a busy state. */
export function SubmitButton({
  busy,
  children,
}: {
  busy: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-spotlight text-[15.5px] font-semibold text-ink-950 shadow-[0_14px_28px_-18px_rgba(255,176,32,1)] transition-all hover:bg-[#FFC24D] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
    >
      {busy ? (
        <>
          <Spinner className="size-4 text-ink-950/70" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Circular OAuth button. */
export function SocialButton({
  busy,
  onClick,
  children,
}: {
  busy: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-ink-950/[0.14] bg-white text-[15px] font-semibold text-ink-800 transition-colors hover:border-ink-950/25 hover:bg-paper-warm/70 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
    >
      {busy ? <Spinner className="size-4 text-ink-500" /> : children}
    </button>
  );
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
