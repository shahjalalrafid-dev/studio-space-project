import type { Document, ObjectId } from "mongodb";

import { getDb } from "@/lib/mongo";

/**
 * The `bookings` collection — one document per reservation.
 *
 * Created by `POST /api/bookings` (the booking modal on /studios/[slug]),
 * listed by `GET /api/bookings?mine=1` (the /my-bookings page) and cancelled
 * with `PATCH /api/bookings/[id]` while the slot is still "Pending".
 */

const COLLECTION = "bookings";

export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Snapshot stored at booking time (prices are immutable once booked). */
export type BookingDocument = {
  studioId: string;
  studioSlug: string;
  studioTitle: string;
  studioImage: string;
  studioCategory: string;
  pricePerHour: number;
  securityDeposit: number;
  name: string;
  email: string;
  phone: string;
  /** ISO date (yyyy-mm-dd) of the shoot. */
  date: string;
  /** First slot of the day block, e.g. "09:00". */
  startTime: string;
  hours: number;
  guests: number;
  message: string;
  /** `pricePerHour * hours + securityDeposit` — card is charged the deposit. */
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
};

export type Booking = Omit<BookingDocument, "createdAt"> & {
  id: string;
  createdAt: string;
};

/** Booking request payload from the booking modal. */
export type BookingInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  hours: number;
  guests: number;
  message: string;
};

function toBooking(doc: Document): Booking {
  const record = doc as Partial<BookingDocument> & { _id?: ObjectId | string };

  return {
    id: String(record._id),
    studioId: record.studioId ?? "",
    studioSlug: record.studioSlug ?? "",
    studioTitle: record.studioTitle ?? "Studio",
    studioImage: record.studioImage ?? "",
    studioCategory: record.studioCategory ?? "",
    pricePerHour: Number(record.pricePerHour ?? 0),
    securityDeposit: Number(record.securityDeposit ?? 0),
    name: record.name ?? "",
    email: record.email ?? "",
    phone: record.phone ?? "",
    date: record.date ?? "",
    startTime: record.startTime ?? "",
    hours: Number(record.hours ?? 0),
    guests: Number(record.guests ?? 0),
    message: record.message ?? "",
    totalPrice: Number(record.totalPrice ?? 0),
    status: record.status ?? "Pending",
    createdAt: record.createdAt
      ? new Date(record.createdAt).toISOString()
      : "",
  };
}

function collection() {
  return getDb().collection<BookingDocument>(COLLECTION);
}

export function normalizeBookingInput(input: Record<string, unknown>): {
  data?: BookingInput;
  error?: "NAME" | "EMAIL" | "DATE" | "HOURS" | "GUESTS";
} {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const phone = String(input.phone ?? "").trim();
  const date = String(input.date ?? "").trim();
  const startTime = String(input.startTime ?? "").trim() || "09:00";
  const hours = Number(input.hours);
  const guests = Number(input.guests ?? 1);
  const message = String(input.message ?? "").trim();

  if (name.length < 2) return { error: "NAME" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "EMAIL" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "DATE" };
  if (!Number.isInteger(hours) || hours < 1 || hours > 12) return { error: "HOURS" };
  if (!Number.isInteger(guests) || guests < 1 || guests > 500) return { error: "GUESTS" };

  return {
    data: { name, email, phone, date, startTime, hours, guests, message },
  };
}

export async function createBooking(
  booking: BookingInput,
  studio: {
    id: string;
    slug: string;
    title: string;
    image: string;
    category: string;
    pricePerHour: number;
    securityDeposit: number;
  },
): Promise<Booking> {
  const doc: BookingDocument = {
    studioId: studio.id,
    studioSlug: studio.slug,
    studioTitle: studio.title,
    studioImage: studio.image,
    studioCategory: studio.category,
    pricePerHour: studio.pricePerHour,
    securityDeposit: studio.securityDeposit,
    ...booking,
    message: booking.message.slice(0, 600),
    totalPrice: studio.pricePerHour * booking.hours + studio.securityDeposit,
    status: "Pending",
    createdAt: new Date(),
  };

  const inserted = await collection().insertOne(doc);

  return {
    ...doc,
    id: String(inserted.insertedId),
    createdAt: doc.createdAt.toISOString(),
  };
}

/** Every reservation made with this account's email — the /my-bookings page. */
export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  try {
    const docs = await collection()
      .find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(toBooking);
  } catch (error) {
    console.error("[bookings] list query failed:", error);
    return [];
  }
}

export type CancelResult =
  | { ok: true; booking: Booking }
  | { ok: false; reason: "not-found" | "forbidden" | "not-cancellable" };

/**
 * Cancels a booking: only the owner (same email) may cancel, and only a
 * "Pending" reservation can be cancelled — confirmed past slots are final.
 */
export async function cancelBooking(
  id: string,
  email: string,
): Promise<CancelResult> {
  try {
    if (!ObjectId.isValid(id)) return { ok: false, reason: "not-found" };

    const doc = await collection().findOne({ _id: new ObjectId(id) });
    if (!doc) return { ok: false, reason: "not-found" };
    if (doc.email.toLowerCase() !== email.toLowerCase())
      return { ok: false, reason: "forbidden" };
    if (doc.status !== "Pending") return { ok: false, reason: "not-cancellable" };

    await collection().updateOne(
      { _id: doc._id },
      { $set: { status: "Cancelled" as BookingStatus } },
    );

    return { ok: true, booking: toBooking({ ...doc, status: "Cancelled" }) };
  } catch (error) {
    console.error("[bookings] cancel failed:", error);
    return { ok: false, reason: "not-found" };
  }
}
