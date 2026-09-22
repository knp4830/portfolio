import type { Metadata } from "next";
import { RouteMarker } from "@/components/notebook/RouteMarker";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.skills.title };
}

// Skills (pp. 5–6).
export default function SkillsPage() {
  return <RouteMarker spread="skills" />;
}
