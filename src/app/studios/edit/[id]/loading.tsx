import { StudioFormSkeleton } from "@/components/ui/StudioLoader";

/** Route-level skeleton for /studios/edit/[id] while the doc prefills. */
export default function Loading() {
  return <StudioFormSkeleton title="Filling the form with your listing…" />;
}
