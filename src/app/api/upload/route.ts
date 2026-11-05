import { NextResponse } from "next/server";

/**
 * POST /api/upload — image uploading through imgbb.
 *
 * The browser sends a `multipart/form-data` body with an `image` file; this
 * route re-encodes it as base64 and hands it to imgbb (keep the API key on
 * the server, never ship it to the client). The response carries the hosted
 * URL that the caller drops into the "Image URL" field.
 *
 * Env: `IMGBB_API_KEY` in .env — get a free one at imgbb.com → API.
 */

const MAX_BYTES = 32 * 1024 * 1024; // imgbb's own limit

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Image hosting isn't configured yet — add IMGBB_API_KEY to .env (free key from imgbb.com), or paste a direct image URL instead.",
      },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const raw = formData.get("image");
    if (raw instanceof File) file = raw;
  } catch {
    return NextResponse.json(
      { error: "Send the image as multipart/form-data under the `image` field." },
      { status: 400 },
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: "No image file arrived — choose a file and try again." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files (jpg, png, webp, gif…) can be uploaded." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is over imgbb's 32 MB limit — pick a smaller file." },
      { status: 413 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");

  const upstream = new URLSearchParams();
  upstream.set("image", base64);
  upstream.set("name", file.name.replace(/\.[^.]+$/, "").slice(0, 64));

  try {
    // imgbb accepts POST with base64 in the `image` form field.
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: upstream,
      },
    );

    const payload = (await response.json()) as {
      success?: boolean;
      status?: number;
      data?: { url?: string; display_url?: string };
      error?: { message?: string };
    };

    const hostedUrl = payload.data?.url ?? payload.data?.display_url;

    if (!payload.success || !hostedUrl) {
      console.error("[api/upload] imgbb error:", payload);
      return NextResponse.json(
        {
          error:
            payload.error?.message ??
            "imgbb refused the upload — try another image.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: hostedUrl });
  } catch (cause) {
    console.error("[api/upload] imgbb request failed:", cause);
    return NextResponse.json(
      { error: "Couldn't reach imgbb — check your connection and retry." },
      { status: 502 },
    );
  }
}
