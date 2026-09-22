import type { Metadata } from "next";
import { TimelineSpread } from "@/components/notebook/spreads/Timeline";
import { loadPage, loadSite, loadTimeline } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.timeline.title };
}

// Timeline (pp. 3–4). Entries are anchored #v0-1 … #v1-1.
export default async function TimelinePage() {
  const [site, copy, entries] = await Promise.all([loadSite(), loadPage("timeline"), loadTimeline()]);
  return <TimelineSpread site={site} copy={copy} entries={entries} />;
}
