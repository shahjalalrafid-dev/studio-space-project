import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  deleteStudio,
  getStudioByIdOrSlug,
  normalizeStudioInput,
  updateStudio,
} from "@/lib/studios";

/**
 * /api/studios/[id] — accepts either the MongoDB `_id` or the slug.
 *
 * GET    — public single studio (the /studios/edit/[id] form prefills from this).
 * PUT    — owner-only update (the Update Studio page).
 * DELETE — owner-only delete, behind the confirmation modal on /my-listings.
 */

type RouteContext = { params: Promise<{ id: string }> };

async function currentSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const studio = await getStudioByIdOrSlug(id);

  if (!studio) {
    return NextResponse.json({ error: "Studio not found." }, { status: 404 });
  }
  return NextResponse.json({ studio });
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await currentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to update a studio." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

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
    const result = await updateStudio(id, data, user.email);

    if (result === null) {
      return NextResponse.json({ error: "Studio not found." }, { status: 404 });
    }
    if (result === "forbidden") {
      return NextResponse.json(
        { error: "You can only update studios that you listed." },
        { status: 403 },
      );
    }

    return NextResponse.json({ studio: result });
  } catch (cause) {
    console.error("[api/studios[id]] update failed:", cause);
    return NextResponse.json(
      { error: "MongoDB rejected that save — try again in a moment." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await currentSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to delete a studio." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const result = await deleteStudio(id, user.email);

    if (result === null) {
      return NextResponse.json({ error: "Studio not found." }, { status: 404 });
    }
    if (result === "forbidden") {
      return NextResponse.json(
        { error: "You can only delete studios that you listed." },
        { status: 403 },
      );
    }

    return NextResponse.json({ deleted: result.slug });
  } catch (cause) {
    console.error("[api/studios[id]] delete failed:", cause);
    return NextResponse.json(
      { error: "MongoDB rejected the delete — try again in a moment." },
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
