import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterView } from "@/components/auth/RegisterView";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a free StudioSpace account to book photography studios, sound stages and podcast suites by the hour.",
};

/** Public registration route — creates the user in MongoDB Atlas. */
export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the marketplace"
      title={<>Create your account.</>}
      subtitle="Register in under a minute, then book studios, list your own space and keep every receipt in one place."
      asideEyebrow="For creators, by creators"
      asideTitle={<>Where ideas get shot.</>}
      asidePoints={[
        "1,200+ verified studios in 27 cities",
        "Transparent hourly pricing, no hidden fees",
        "Free to join — no card required",
      ]}
      asideStat={{
        value: "27",
        label: "cities live today, with new studios added every week",
      }}
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ink-950 underline decoration-spotlight decoration-[3px] underline-offset-4 transition-colors hover:text-spotlight-deep"
          >
            Log in
          </Link>
        </>
      }
    >
      <RegisterView />
    </AuthShell>
  );
}
