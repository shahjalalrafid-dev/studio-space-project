import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  createStudio,
  getStudios,
  getStudiosByOwner,
  normalizeStudioInput,
} from "@/lib/studios";

/**
 * /api/studios
 *
 * GET  — public listing (prunes the payload); `?mine=1` returns only the
 *        signed-in host's spaces (401 when logged out).
 * POST — publishes a new studio on the signed-in account, stamped with its
 *        ownerEmail / ownerName so it shows up in /my-listings.
 */

async function currentSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(), // works on both Next 16 standalone + middleware lambdas
  });
  return session?.user ?? null;
}

export async function GET(request: Request) {
  const mine = new URL(request.url).searchParams.get("mine") === "1";

  if (mine) {
    const user = await currentSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to view your listings." },
        { status: 401 },
      );
    }
    return NextResponse.json({ studios: await getStudiosByOwner(user.email) });
  }

  return NextResponse.json({ studios: await getStudios({ limit: 60 }) });
}

export async function POST(request: Request) {
  const user = await currentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to publish a studio." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const { data, error } = normalizeStudioInput(
    (body ?? {}) as Record<string, unknown>,
  );

  if (!data) {
    return NextResponse.json(
      { error: VALIDATION_MESSAGES[error ?? "TITLE"] },
      { status: 400 },
    );
  }

  try {
    const studio = await createStudio(data, {
      ownerEmail: user.email,
      ownerName: user.name,
    });

    return NextResponse.json({ studio }, { status: 201 });
  } catch (cause) {
    console.error("[api/studios] create failed:", cause);
    return NextResponse.json(
      { error: "MongoDB rejected that save — try again in a moment." },
      { status: 500 },
    );
  }
}

const VALIDATION_MESSAGES: Record<string, string> = {
  TITLE: "Give the studio a title (at least 4 characters).",
  CATEGORY: "Choose the studio category.",
  PRICE: "Hourly rate and deposit must be positive numbers.",
  CAPACITY: "Max capacity must be a whole number above zero.",
  ADDRESS: "Add the location / address of the space.",
  IMAGE: "Upload or paste a valid image URL (https://…).",
  DESCRIPTION: "Write an overview of at least 24 characters.",
};
