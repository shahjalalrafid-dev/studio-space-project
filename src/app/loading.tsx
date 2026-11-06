import { StudioLoader } from "@/components/ui/StudioLoader";

/** Root fallback shown while the first dynamic route resolves. */
export default function Loading() {
  return <StudioLoader full label="Warming up the studio lights…" />;
}
