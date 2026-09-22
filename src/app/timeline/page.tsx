import type { Metadata } from "next";
import { renderNotebook } from "@/components/notebook/renderNotebook";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.timeline.title };
}

// Timeline (pp. 3–4). Entries are anchored #v0-1 … #v1-1.
export default async function TimelinePage() {
  return renderNotebook("timeline");
}
