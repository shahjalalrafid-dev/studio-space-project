import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to StudioSpace to manage your studio bookings, saved spaces and host dashboard.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] | undefined }>;
};

/** Public login route — Better Auth talks to MongoDB through `/api/auth`. */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const rawNext = typeof query.next === "string" ? query.next : "";
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : null;
  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : "/register";

  return (
    <AuthShell
      eyebrow="Member access"
      title={<>Welcome back.</>}
      subtitle="Log in to pick up your bookings, saved studios and host tools exactly where you left them."
      asideEyebrow="StudioSpace membership"
      asideTitle={<>Your next shoot is one login away.</>}
      asidePoints={[
        "Instant booking confirmations",
        "Saved studios & favourite crews",
        "Host dashboard with live payouts",
      ]}
      asideStat={{
        value: "4.9/5",
        label: "average rating from 12,400+ creators booked last season",
      }}
      footer={
        <>
          New to StudioSpace?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-ink-950 underline decoration-spotlight decoration-[3px] underline-offset-4 transition-colors hover:text-spotlight-deep"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginView />
    </AuthShell>
  );
}
