import type { Metadata } from "next";
import { ProjectsSpread } from "@/components/notebook/spreads/Projects";
import { loadPage, loadProjects, loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.projects.title };
}

// Projects (pp. 7–8) with the first project selected; the most recent is first,
// so the detail page is never empty.
export default async function ProjectsPage() {
  const [site, copy, projects] = await Promise.all([loadSite(), loadPage("projects"), loadProjects()]);
  return <ProjectsSpread site={site} copy={copy} projects={projects} selected={projects[0]} open={false} />;
}
