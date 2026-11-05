/**
 * Turns the raw errors returned by the Better Auth client into short,
 * human-readable copy that can be shown in a form banner *and* a toast.
 *
 * Better Auth reports failures as `{ status, message, error: { code, message } }`.
 * Known codes get a friendly sentence; everything else falls back to the
 * server message, then to a generic one.
 */

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD:
    "The email or password you entered is incorrect.",
  INVALID_PASSWORD: "The password you entered is incorrect.",
  USER_NOT_FOUND: "We couldn't find an account with those credentials.",
  USER_ALREADY_EXISTS:
    "An account already exists with this email. Try logging in instead.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long.",
  PASSWORD_TOO_LONG: "That password is too long — keep it under 128 characters.",
  INVALID_EMAIL: "Please enter a valid email address.",
  EMAIL_NOT_VERIFIED:
    "This account's email is not verified yet. Contact support to get it verified.",
  TOO_MANY_ATTEMPTS:
    "Too many attempts. Please wait a moment and try again.",
  EMAIL_PASSWORD_DISABLED:
    "Email & password sign-in is not enabled on this deployment.",
  PROVIDER_NOT_FOUND: "That sign-in provider is not configured.",
  SIGNUP_DISABLED: "Registration is currently closed.",
  UNAUTHORIZED: "Your session expired. Please sign in again.",
};

type ErrorLike = {
  message?: string;
  status?: number;
  error?: { code?: string; message?: string; status?: number } | null;
} | null;

/** Reads a server error shape and returns copy suitable for the UI. */
export function readAuthError(error: unknown): string {
  const raw = error as ErrorLike;
  const code = raw?.error?.code ?? "";

  const known = MESSAGES[code];
  if (known) return known;

  const message = raw?.error?.message ?? raw?.message ?? "";
  const lowered = message.toLowerCase();

  if (
    lowered.includes("failed to fetch") ||
    lowered.includes("networkerror") ||
    lowered.includes("network request failed")
  ) {
    return "We couldn't reach the server. Check your connection and try again.";
  }
  if (lowered.includes("timeout")) {
    return "The request timed out. Please try again.";
  }
  if (lowered.includes("already exists")) {
    return MESSAGES.USER_ALREADY_EXISTS;
  }

  return message.trim() || "Something went wrong. Please try again.";
}
