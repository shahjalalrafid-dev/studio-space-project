import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { PrivateRoute } from "@/components/routes/PrivateRoute";
import { StudioForm } from "@/components/studios/StudioForm";
import { auth } from "@/lib/auth";
import { getStudioByIdOrSlug } from "@/lib/studios";

export const metadata: Metadata = {
  title: "Update Studio",
  description: "Edit the details, pricing and amenities of your StudioSpace listing.",
};

export const dynamic = "force-dynamic";

type EditStudioPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Private route — /studios/edit/[id].
 *
 * The form prefills from MongoDB; ownership is enforced twice: here
 * (someone else's listing renders the 404 immediately) and again inside
 * PUT /api/studios/[id], so a forged request still gets a 403.
 */
export default async function EditStudioPage({ params }: EditStudioPageProps) {
  const { id } = await params;
  const studio = await getStudioByIdOrSlug(id);

  if (!studio) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  // Signed out? Hand the pre-filled form to the client gate, which
  // bounces to /login?next= and brings the host straight back here.
  if (!user) {
    return (
      <PrivateRoute>
        <EditStudioShell>
          <StudioForm mode="edit" initial={studio} studioId={studio.id} />
        </EditStudioShell>
      </PrivateRoute>
    );
  }

  const isOwner =
    user.email.toLowerCase() === (studio.ownerEmail ?? "").toLowerCase() &&
    Boolean(studio.ownerEmail);

  if (!isOwner) notFound();

  return (
    <EditStudioShell>
      <StudioForm mode="edit" initial={studio} studioId={studio.id} />
    </EditStudioShell>
  );
}

function EditStudioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink-950/[0.07] bg-ink-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-spotlight/[0.16] blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-11 sm:px-5 sm:py-13 xl:px-8">
          <Link
            href="/my-listings"
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-300 transition-colors hover:text-white"
          >
            <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            My Studio Listings
          </Link>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight">
            Update listing
          </p>
          <h1 className="mt-3 text-[2.2rem] font-semibold leading-[1.07] tracking-[-0.03em] sm:text-[2.7rem]">
            Edit your studio
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-300">
            Changes go live on the explore grid the moment you save them.
          </p>
        </div>
      </section>

      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-5 xl:px-8">{children}</div>
      </section>
    </>
  );
}
