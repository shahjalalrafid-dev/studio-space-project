import { StudioListSkeleton } from "@/components/ui/StudioLoader";

/** Route-level skeleton for /my-bookings. */
export default function Loading() {
  return <StudioListSkeleton heading="Loading your reservations…" />;
}
