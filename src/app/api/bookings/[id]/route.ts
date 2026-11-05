import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { cancelBooking } from "@/lib/bookings";

/**
 * /api/bookings/[id] — PATCH is the "Cancel Booking" action from
 * /my-bookings: owner-only (same account email) and the reservation has to
 * still be "Pending".
 */

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to cancel a booking." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const result = await cancelBooking(id, user.email);

  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "not-found"
            ? "Booking not found."
            : result.reason === "forbidden"
              ? "That booking belongs to another account."
              : "Only pending bookings can be cancelled.",
      },
      { status: result.reason === "not-found" ? 404 : 403 },
    );
  }

  return NextResponse.json({ booking: result.booking });
}
