import type { Metadata } from "next";
import { RouteMarker } from "@/components/notebook/RouteMarker";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.timeline.title };
}

// Timeline (pp. 3–4). Entries are anchored #v0-1 … #v1-1.
export default function TimelinePage() {
  return <RouteMarker spread="timeline" />;
}
