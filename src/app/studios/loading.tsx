import { StudioGridSkeleton } from "@/components/ui/StudioLoader";

/** Route-level skeleton for /studios while MongoDB answers. */
export default function Loading() {
  return <StudioGridSkeleton cards={6} />;
}
