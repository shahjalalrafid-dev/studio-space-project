import { StudioDetailSkeleton } from "@/components/ui/StudioLoader";

/** Route-level skeleton for /studios/[slug] while the document loads. */
export default function Loading() {
  return <StudioDetailSkeleton />;
}
