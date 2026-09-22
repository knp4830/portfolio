import type { Metadata } from "next";
import { RouteMarker } from "@/components/notebook/RouteMarker";
import { loadProjects, loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.projects.title };
}

// Projects (pp. 7–8) with the first project selected; the most recent is first,
// so the detail page is never empty.
export default async function ProjectsPage() {
  const [first] = await loadProjects();
  return <RouteMarker spread="projects" project={first.slug} />;
}
