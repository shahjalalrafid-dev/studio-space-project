"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  FormAlert,
  PasswordField,
  SocialButton,
  SubmitButton,
  TextField,
} from "@/components/auth/AuthFields";
import { GoogleIcon, MailIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

type FieldErrors = { email?: string; password?: string };

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/**
 * Login form.
 *
 *  · validates before hitting MongoDB and mirrors failures into the card
 *    (FormAlert) *and* a Sonner toast
 *  · success → home page, where the navbar/hero pick up the session
 *  · Google → Better Auth's OAuth redirect, back to the home page
 */
export function LoginView() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isPending, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"form" | "google" | null>(null);

  // Already signed in? Send the user home instead of showing the form.
  useEffect(() => {
    if (!isPending && isAuthenticated) router.replace("/");
  }, [isPending, isAuthenticated, router]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) next.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(trimmedEmail))
      next.email = "Enter a valid email address.";

    if (!password) next.password = "Password is required.";

    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Please fix the highlighted fields and try again.");
      toast.error("Check the form", {
        description: "Some fields need your attention before you can log in.",
      });
      return;
    }

    setFieldErrors({});
    setError(null);
    setBusy("form");

    const result = await signIn({ email: email.trim(), password });

    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      toast.error("Log in failed", { description: result.error });
      return;
    }

    router.push("/");
  }

  async function onGoogle() {
    if (busy) return;
    setError(null);
    setBusy("google");

    const result = await signInWithGoogle();
    if (!result.ok) {
      setBusy(null);
      setError(result.error);
      toast.error("Google sign-in failed", { description: result.error });
    }
    // On success the browser navigates to Google, then back to the home page.
  }

  function onForgotPassword() {
    toast.info("Password reset isn't enabled in this build", {
      description:
        "Skip it for the demo — an administrator can reset your password for you.",
    });
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <FormAlert message={error} />

        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@studio.com"
          icon={<MailIcon className="size-[18px]" />}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="current-password"
          placeholder="••••••••"
          labelAside={
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[13px] font-semibold text-spotlight-deep transition-colors hover:text-spotlight-deep/75 hover:underline"
            >
              Forgot password?
            </button>
          }
        />

        <SubmitButton busy={busy === "form"}>Log in</SubmitButton>
      </form>

      <div className="my-5 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-ink-950/10" />
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-400">
          or
        </span>
        <span className="h-px flex-1 bg-ink-950/10" />
      </div>

      <SocialButton busy={busy === "google"} onClick={onGoogle}>
        <GoogleIcon className="size-[18px]" />
        Continue with Google
      </SocialButton>

      <p className="mt-4 text-center text-[13px] text-ink-500">
        Sessions are stored securely in MongoDB Atlas.
      </p>
    </>
  );
}
