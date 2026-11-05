import type { Document, ObjectId, Sort } from "mongodb";

import { getDb } from "@/lib/mongo";

/**
 * Read-only studio queries.
 *
 * Every homepage/listing section reads live from the `studios` collection
 * in MongoDB Atlas; the homepage's Featured section uses `.limit(6)`.
 * Every query is wrapped so a flaky connection degrades into an empty
 * state instead of a 500.
 */

const COLLECTION = "studios";

/** Shape stored in (and returned from) the `studios` collection. */
export type StudioDocument = {
  slug: string;
  title: string;
  /** One of the STUDIO_CATEGORIES slugs, e.g. "photo-studio". */
  category: string;
  city: string;
  area: string;
  country?: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  tags: string[];
  capacity: number;
  sizeSqft: number;
  host: { name: string; verified: boolean };
  createdAt?: Date | string;
};

/** Public view-model handed to components. */
export type Studio = Omit<StudioDocument, "createdAt"> & {
  id: string;
  createdAt: string | null;
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
    pricePerHour: Number(record.pricePerHour ?? 0),
    rating: Number(record.rating ?? 0),
    reviews: Number(record.reviews ?? 0),
    image: record.image ?? "",
    description: record.description ?? "",
    tags: Array.isArray(record.tags) ? record.tags : [],
    capacity: Number(record.capacity ?? 0),
    sizeSqft: Number(record.sizeSqft ?? 0),
    host: {
      name: record.host?.name ?? "StudioSpace host",
      verified: Boolean(record.host?.verified),
    },
    createdAt: record.createdAt
      ? new Date(record.createdAt).toISOString()
      : null,
  };
}

function collection() {
  return getDb().collection<StudioDocument>(COLLECTION);
}

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

/** Single studio for /studios/[slug]. */
export async function getStudioBySlug(slug: string): Promise<Studio | null> {
  try {
    const doc = await collection().findOne({ slug });
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
