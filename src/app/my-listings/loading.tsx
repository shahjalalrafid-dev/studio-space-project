import { StudioListSkeleton } from "@/components/ui/StudioLoader";

/** Route-level skeleton for /my-listings. */
export default function Loading() {
  return <StudioListSkeleton heading="Loading your studio listings…" />;
}
