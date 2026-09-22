import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsSpread } from "@/components/notebook/spreads/Projects";
import { loadPage, loadProjects, loadSite } from "@/lib/content/load";

type Params = { params: Promise<{ slug: string }> };

// Every project is built ahead of time; anything else is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await loadProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = (await loadProjects()).find((candidate) => candidate.slug === slug);
  return { title: project?.title };
}

// /projects/<slug>: the same spread with that project selected (desktop), or
// opened as a sheet over the card list (mobile).
export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [site, copy, projects] = await Promise.all([loadSite(), loadPage("projects"), loadProjects()]);
  const selected = projects.find((project) => project.slug === slug);
  if (!selected) notFound();
  return <ProjectsSpread site={site} copy={copy} projects={projects} selected={selected} open />;
}
