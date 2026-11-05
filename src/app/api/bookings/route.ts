import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  createBooking,
  getBookingsByEmail,
  normalizeBookingInput,
} from "@/lib/bookings";
import { getStudioByIdOrSlug } from "@/lib/studios";

/**
 * /api/bookings
 *
 * GET  `?mine=1` — the signed-in account's reservations (/my-bookings).
 * POST — creates a reservation in the `bookings` collection with status
 *        "Pending"; requires a session so it lands in the booker's list.
 */

async function currentSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET(request: Request) {
  const mine = new URL(request.url).searchParams.get("mine") === "1";
  if (!mine) {
    return NextResponse.json(
      { error: "Only `?mine=1` listings are exposed here." },
      { status: 400 },
    );
  }

  const user = await currentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to view your bookings." },
      { status: 401 },
    );
  }

  return NextResponse.json({ bookings: await getBookingsByEmail(user.email) });
}

export async function POST(request: Request) {
  const user = await currentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Log in first so the booking lands in My Bookings." },
      { status: 401 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const studioId = String(body.studioId ?? "");
  const studio = await getStudioByIdOrSlug(studioId);
  if (!studio) {
    return NextResponse.json(
      { error: "That studio is no longer listed." },
      { status: 404 },
    );
  }

  const { data, error } = normalizeBookingInput(body);
  if (!data) {
    return NextResponse.json(
      { error: BOOKING_MESSAGES[error ?? "DATE"] },
      { status: 400 },
    );
  }

  if (data.guests > studio.capacity) {
    return NextResponse.json(
      { error: `That space fits ${studio.capacity} people — trim the guest list.` },
      { status: 400 },
    );
  }

  try {
    const booking = await createBooking(
      {
        ...data,
        name: data.name || user.name,
        email: user.email.toLowerCase(), // always book on the session's email
      },
      {
        id: studio.id,
        slug: studio.slug,
        title: studio.title,
        image: studio.image,
        category: studio.category,
        pricePerHour: studio.pricePerHour,
        securityDeposit: studio.securityDeposit,
      },
    );

    return NextResponse.json({ booking }, { status: 201 });
  } catch (cause) {
    console.error("[api/bookings] create failed:", cause);
    return NextResponse.json(
      { error: "MongoDB rejected the booking — try again in a moment." },
      { status: 500 },
    );
  }
}

const BOOKING_MESSAGES: Record<string, string> = {
  NAME: "Add the name the booking is for.",
  EMAIL: "That email looks invalid.",
  DATE: "Pick the shoot date.",
  HOURS: "Book between 1 and 12 hours.",
  GUESTS: "Tell us how many people are coming.",
};
