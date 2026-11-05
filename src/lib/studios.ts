import {
  Collection,
  Document,
  ObjectId,
  type InsertOneResult,
  type Sort,
} from "mongodb";

import { getDb } from "@/lib/mongo";

/**
 * The `studios` collection — read *and* write access.
 *
 * - Read helpers power the homepage (`getFeaturedStudios` → `.limit(6)`),
 *   the /studios explore page and the studio detail page.
 * - Write helpers power the CRUD routes (`POST/PUT/DELETE /api/studios`)
 *   used by /add-studio, /studios/edit/[id] and /my-listings.
 *
 * Every query is wrapped so a flaky connection degrades gracefully instead
 * of taking the page down; every mutation is validated and doubled back to
 * the caller as a plain object.
 */

const COLLECTION = "studios";

/** One review of a studio (stored on `reviewList` of the same document). */
export type StudioReview = {
  name: string;
  rating: number;
  date: string;
  comment: string;
};

/** Shape stored in (and returned for) the `studios` collection. */
export type StudioDocument = {
  slug: string;
  title: string;
  /** One of the STUDIO_CATEGORIES slugs, e.g. "photo-studio". */
  category: string;
  city: string;
  area: string;
  country?: string;
  /** Full street address (the /add-studio form's "Location / Address"). */
  address: string;
  pricePerHour: number;
  securityDeposit: number;
  rating: number;
  reviews: number;
  /** Card artwork (single URL). */
  image: string;
  /** Extra angles/hotspots shown in the detail-page gallery carousel. */
  gallery: string[];
  /** Rolling shot list on the `/studios/[slug]` detail page. */
  description: string;
  tags: string[];
  /** Full amenity checklist rendered on the detail page. */
  amenities: string[];
  capacity: number;
  sizeSqft?: number;
  host: { name: string; verified: boolean };
  reviewList: StudioReview[];
  /** Present on listing created through /add-studio; drives /my-listings. */
  ownerEmail: string;
  ownerName: string;
  createdAt: Date;
  updatedAt?: Date;
};

/** Public view-model handed to components and serialized through JSON APIs. */
export type Studio = Omit<StudioDocument, "createdAt" | "updatedAt" | "_id"> & {
  id: string;
  /** ISO string or empty string for seeded docs without a timestamp. */
  createdAt: string;
};

/** Payload accepted by POST /api/studios and PUT /api/studios/[id]. */
export type StudioInput = {
  title: string;
  category: string;
  pricePerHour: number;
  securityDeposit?: number;
  capacity: number;
  address: string;
  image: string;
  description: string;
  amenities?: string[];
};

function toStudio(doc: Document): Studio {
  const record = doc as Partial<StudioDocument> & {
    _id?: ObjectId | string;
    createdAt?: Date | string | null;
  };

  return {
    id: String(record._id ?? record.slug),
    slug: record.slug ?? "studio",
    title: record.title ?? "Untitled studio",
    category: record.category ?? "photo-studio",
    city: record.city ?? "",
    area: record.area ?? "",
    country: record.country,
    address: record.address ?? [record.area, record.city].filter(Boolean).join(", "),
    pricePerHour: Number(record.pricePerHour ?? 0),
    securityDeposit: Number(record.securityDeposit ?? 0),
    rating: Number(record.rating ?? 0),
    reviews: Number(record.reviews ?? 0),
    image: record.image ?? "",
    gallery: Array.isArray(record.gallery) ? record.gallery.filter(Boolean) : [],
    description: record.description ?? "",
    tags: Array.isArray(record.tags) ? record.tags : [],
    amenities: Array.isArray(record.amenities) ? record.amenities : [],
    capacity: Number(record.capacity ?? 0),
    sizeSqft: record.sizeSqft ? Number(record.sizeSqft) : undefined,
    host: {
      name: record.host?.name ?? record.ownerName ?? "StudioSpace host",
      verified: Boolean(record.host?.verified),
    },
    reviewList: Array.isArray(record.reviewList) ? record.reviewList : [],
    ownerEmail: record.ownerEmail ?? "",
    ownerName: record.ownerName ?? record.host?.name ?? "",
    createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : "",
  };
}

function collection() {
  return getDb().collection<StudioDocument>(COLLECTION);
}

function toObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) && /^[0-9a-f]{24}$/i.test(id)
    ? new ObjectId(id)
    : null;
}

async function findOneByIdOrSlug(id: string) {
  const objectId = toObjectId(id);

  return collection().findOne(
    objectId ? { $or: [{ _id: objectId }, { slug: id }] } : { slug: id },
  );
}

/* ------------------------------------------------------------------ */
/* Reads                                                              */
/* ------------------------------------------------------------------ */

/** Top-rated (then most-reviewed, then newest) studios — `.limit(6)` on the home page. */
export async function getFeaturedStudios(limit = 6): Promise<Studio[]> {
  try {
    const docs = await collection()
      .find({})
      .sort({ rating: -1, reviews: -1, createdAt: -1 })
      .limit(limit) // 6 cards on the homepage
      .toArray();

    return docs.map(toStudio);
  } catch (error) {
    console.error("[studios] featured query failed:", error);
    return [];
  }
}

/** Everything (optionally one category), for the /studios listing. */
export async function getStudios(options?: {
  category?: string;
  limit?: number;
  sort?: "rating" | "newest";
}): Promise<Studio[]> {
  const category = options?.category?.trim();
  const limit = options?.limit ?? 48;

  try {
    const sort: Sort =
      options?.sort === "newest" ? { createdAt: -1 } : { rating: -1, reviews: -1 };

    const docs = await collection()
      .find(category ? { category } : {})
      .sort(sort)
      .limit(limit)
      .toArray();

    return docs.map(toStudio);
  } catch (error) {
    console.error("[studios] listing query failed:", error);
    return [];
  }
}

/** Studios that belong to a signed-in host — the /my-listings page. */
export async function getStudiosByOwner(ownerEmail: string): Promise<Studio[]> {
  try {
    const docs = await collection()
      .find({ ownerEmail: ownerEmail.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(toStudio);
  } catch (error) {
    console.error("[studios] owner query failed:", error);
    return [];
  }
}

/** Single studio for /studios/[slug] — accepts a slug or a MongoDB _id. */
export async function getStudioByIdOrSlug(
  id: string,
): Promise<Studio | null> {
  try {
    const doc = await findOneByIdOrSlug(id);
    return doc ? toStudio(doc) : null;
  } catch (error) {
    console.error("[studios] detail query failed:", error);
    return null;
  }
}

/** `{ "photo-studio": 12, ... }` — powers the category card counters. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const rows = await collection()
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();

    return Object.fromEntries(
      rows.map((row) => [row._id ?? "unknown", row.count]),
    );
  } catch (error) {
    console.error("[studios] category counts failed:", error);
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* Writes (used by the CRUD API routes)                                */
/* ------------------------------------------------------------------ */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "studio";
}

/** Picks a unique slug by probing the collection (`title`, `title-2`, …). */
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);

  for (let suffix = 1; suffix <= 99; suffix += 1) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    const exists = await collection().findOne({ slug: candidate });
    if (!exists) return candidate;
  }

  return `${base}-${Date.now()}`;
}

type CreateStudioError =
  | "TITLE"
  | "CATEGORY"
  | "PRICE"
  | "CAPACITY"
  | "ADDRESS"
  | "IMAGE"
  | "DESCRIPTION";

/** Validates + normalizes the payload shared by POST and PUT. */
export function normalizeStudioInput(input: Record<string, unknown>): {
  data?: Pick<StudioDocument, keyof StudioInput> & {
    securityDeposit: number;
    capacity: number;
  };
  error?: CreateStudioError;
} {
  const title = String(input.title ?? "").trim();
  const category = String(input.category ?? "").trim();
  const pricePerHour = Number(input.pricePerHour);
  const securityDeposit = Number(input.securityDeposit ?? 0);
  const capacity = Number(input.capacity);
  const address = String(input.address ?? "").trim();
  const image = String(input.image ?? "").trim();
  const description = String(input.description ?? "").trim();
  const amenities = Array.isArray(input.amenities)
    ? input.amenities.map(String).map((a) => a.trim()).filter(Boolean)
    : [];

  if (title.length < 4) return { error: "TITLE" };
  if (!category) return { error: "CATEGORY" };
  if (!Number.isFinite(pricePerHour) || pricePerHour <= 0) return { error: "PRICE" };
  if (!Number.isFinite(securityDeposit) || securityDeposit < 0)
    return { error: "PRICE" };
  if (!Number.isInteger(capacity) || capacity <= 0) return { error: "CAPACITY" };
  if (address.length < 4) return { error: "ADDRESS" };
  if (!/^https?:\/\//i.test(image)) return { error: "IMAGE" };
  if (description.length < 24) return { error: "DESCRIPTION" };

  return {
    data: {
      title,
      category,
      pricePerHour: Math.round(pricePerHour),
      securityDeposit: Math.round(securityDeposit),
      capacity,
      address,
      image,
      description,
      amenities,
    },
  };
}

/** Validated insertion — called by `POST /api/studios` after the session check. */
export async function createStudio(
  input: StudioInput,
  owner: { ownerEmail: string; ownerName: string },
): Promise<Studio> {
  const slug = await uniqueSlug(input.title);

  const doc: StudioDocument = {
    slug,
    ...input,
    securityDeposit: input.securityDeposit ?? 0,
    amenities: input.amenities ?? [],
    city: "",
    area: "",
    rating: 0,
    reviews: 0,
    tags: [],
    reviewList: [],
    gallery: [],
    host: { name: owner.ownerName, verified: true },
    ownerEmail: owner.ownerEmail.toLowerCase(),
    ownerName: owner.ownerName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const inserted: InsertOneResult<StudioDocument> = await collection().insertOne(
    doc,
  );

  return {
    ...doc,
    id: String(inserted.insertedId),
    createdAt: doc.createdAt.toISOString(),
  };
}

/**
 * Owner-guarded update — returns the fresh document, `null` when not found
 * and `"forbidden"` when someone else's listing is touched.
 */
export async function updateStudio(
  id: string,
  input: StudioInput,
  ownerEmail: string,
): Promise<Studio | "forbidden" | null> {
  try {
    const existing = await findOneByIdOrSlug(id);
    if (!existing) return null;
    if (existing.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
      return "forbidden";
    }

    await collection().updateOne(
      { _id: existing._id },
      {
        $set: {
          ...input,
          updatedAt: new Date(),
        },
      },
    );

    const fresh = await collection().findOne({ _id: existing._id });
    return fresh ? toStudio(fresh) : null;
  } catch (error) {
    console.error("[studios] update failed:", error);
    return null;
  }
}

/** Owner-guarded delete — same contract as `updateStudio`. */
export async function deleteStudio(
  id: string,
  ownerEmail: string,
): Promise<Studio | "forbidden" | null> {
  try {
    const existing = await findOneByIdOrSlug(id);
    if (!existing) return null;
    if (existing.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
      return "forbidden";
    }

    const removed = toStudio(existing);
    await collection().deleteOne({ _id: existing._id });
    return removed;
  } catch (error) {
    console.error("[studios] delete failed:", error);
    return null;
  }
}

/** Tiny headline numbers for the homepage stats strip. */
export async function getMarketplaceStats(): Promise<{
  studios: number;
  categories: number;
}> {
  try {
    const studios = await collection().countDocuments();
    return { studios, categories: Object.keys(await getCategoryCounts()).length };
  } catch {
    return { studios: 0, categories: 0 };
  }
}
