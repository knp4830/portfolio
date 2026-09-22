import { notFound } from "next/navigation";
import { loadPage, loadProjects, loadSite, loadSkills, loadTimeline } from "@/lib/content/load";
import { type SpreadId, neighbors } from "@/lib/notebook/spreads";
import { Notebook } from "./Notebook";
import type { SpreadContent } from "./spreadContent";
import { colophonSpread } from "./spreads/Colophon";
import { contactSpread } from "./spreads/Contact";
import { openingSpread } from "./spreads/Opening";
import { projectsSpread } from "./spreads/Projects";
import { skillsSpread } from "./spreads/Skills";
import { timelineSpread } from "./spreads/Timeline";

type ProjectOptions = {
  /** /projects/<slug>: which project is selected. Defaults to the first. */
  project?: string;
  /** Open the mobile sheet (only on /projects/<slug>). */
  open?: boolean;
};

/** Loads one spread's content and builds its pages. */
export async function buildSpread(id: SpreadId, options: ProjectOptions = {}): Promise<SpreadContent> {
  const site = await loadSite();
  switch (id) {
    case "opening":
      return openingSpread({ site, copy: await loadPage("opening") });
    case "timeline":
      return timelineSpread({ copy: await loadPage("timeline"), entries: await loadTimeline() });
    case "skills":
      return skillsSpread({ copy: await loadPage("skills"), skills: await loadSkills() });
    case "projects": {
      const [copy, projects] = await Promise.all([loadPage("projects"), loadProjects()]);
      const selected = options.project ? projects.find((project) => project.slug === options.project) : projects[0];
      if (!selected) notFound();
      return projectsSpread({ copy, projects, selected, open: options.open ?? false });
    }
    case "contact":
      return contactSpread({ site, copy: await loadPage("contact") });
    case "colophon":
      return colophonSpread({ site, copy: await loadPage("colophon") });
  }
}

/**
 * A route's whole notebook: its own spread, plus the spreads either side of it.
 * The neighbours are rendered hidden and inert so a page turn has real pages to
 * show — the back of the turning page and the page underneath — before the
 * route changes.
 */
export async function renderNotebook(id: SpreadId, options: ProjectOptions = {}) {
  const { previous, next } = neighbors(id);
  const [site, current, before, after] = await Promise.all([
    loadSite(),
    buildSpread(id, options),
    previous ? buildSpread(previous) : undefined,
    next ? buildSpread(next) : undefined,
  ]);
  return <Notebook site={site} current={current} previous={before} next={after} />;
}
