import { StudioFormSkeleton } from "@/components/ui/StudioLoader";

/** Route-level skeleton for /add-studio (session + form resolve together). */
export default function Loading() {
  return <StudioFormSkeleton title="Preparing the listing form…" />;
}
