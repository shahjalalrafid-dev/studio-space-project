"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  FormAlert,
  PasswordChecklist,
  PasswordField,
  SocialButton,
  SubmitButton,
  TextField,
} from "@/components/auth/AuthFields";
import { GoogleIcon, ImageIcon, LockIcon, MailIcon, UserIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { passwordViolations } from "@/lib/password";

type FieldErrors = {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const URL_PATTERN = /^https?:\/\/\S+$/i;

/**
 * Registration form.
 *
 *  · full client-side validation (required fields + the assignment's
 *    password policy) with per-field errors, an inline rule checklist and
 *    a toast — nothing is sent to MongoDB until the password is valid
 *  · success → login page
 *  · Google → Better Auth's OAuth redirect, straight to the home page
 */
export function RegisterView() {
  const router = useRouter();
  const { signUp, signInWithGoogle, isPending, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"form" | "google" | null>(null);

  // Already signed in? The form has nothing left to do — go home.
  useEffect(() => {
    if (!isPending && isAuthenticated) router.replace("/");
  }, [isPending, isAuthenticated, router]);

  const previewSource = URL_PATTERN.test(image.trim()) ? image.trim() : null;

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const trimmedEmail = email.trim();
    const trimmedImage = image.trim();

    if (!name.trim()) next.name = "Name is required.";
    else if (name.trim().length < 2) next.name = "Please enter your full name.";

    if (!trimmedEmail) next.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(trimmedEmail))
      next.email = "Enter a valid email address.";

    if (!trimmedImage) next.image = "Photo URL is required.";
    else if (!URL_PATTERN.test(trimmedImage))
      next.image = "Enter a full URL starting with https://";

    if (!password) next.password = "Password is required.";
    else {
      const violations = passwordViolations(password);
      if (violations.length > 0)
        next.password = "Your password doesn't meet the rules below.";
    }

    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Please fix the highlighted fields before registering.");
      toast.error("Check the form", {
        description: nextErrors.password
          ? "Passwords need an uppercase letter, a lowercase letter and at least 6 characters."
          : "Some fields need your attention before you can register.",
      });
      return;
    }

    setFieldErrors({});
    setError(null);
    setBusy("form");

    const result = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      image: image.trim(),
    });

    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      toast.error("Registration failed", { description: result.error });
      return;
    }

    router.push("/login");
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

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <FormAlert message={error} />

        <TextField
          label="Name"
          value={name}
          onChange={setName}
          error={fieldErrors.name}
          autoComplete="name"
          placeholder="Shahjalal Rafid"
          icon={<UserIcon className="size-[18px]" />}
        />

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

        <TextField
          label="Photo URL"
          value={image}
          onChange={setImage}
          error={fieldErrors.image}
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://…/your-photo.jpg"
          icon={<ImageIcon className="size-[18px]" />}
          labelAside={
            <span className="flex items-center gap-2">
              {previewSource ? (
                <Image
                  src={previewSource}
                  alt="Photo preview"
                  width={22}
                  height={22}
                  className="size-[22px] rounded-full object-cover ring-1 ring-ink-950/10"
                />
              ) : null}
              <span className="text-[12px] text-ink-400">Shown as your avatar</span>
            </span>
          }
        />

        <div className="grid gap-3">
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
            autoComplete="new-password"
            placeholder="At least 6 characters"
          />
          <PasswordChecklist password={password} />
        </div>

        <SubmitButton busy={busy === "form"}>Create account</SubmitButton>
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

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[13px] text-ink-500">
        <LockIcon className="size-3.5 shrink-0 text-ink-400" />
        Your credentials are hashed and stored in MongoDB Atlas.
      </p>
    </>
  );
}
