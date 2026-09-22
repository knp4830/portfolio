import type { Metadata } from "next";
import { RouteMarker } from "@/components/notebook/RouteMarker";
import { loadProjects } from "@/lib/content/load";

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
  return <RouteMarker spread="projects" project={slug} sheet />;
}
