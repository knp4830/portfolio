import { loadPage, loadProjects, loadSite, loadSkills, loadTimeline } from "@/lib/content/load";
import { SPREADS, type SpreadId } from "@/lib/notebook/spreads";
import type { SpreadContent } from "./spreadContent";
import { colophonSpread } from "./spreads/Colophon";
import { contactSpread } from "./spreads/Contact";
import { openingSpread } from "./spreads/Opening";
import { projectSheets, projectsSpread } from "./spreads/Projects";
import { skillsSpread } from "./spreads/Skills";
import { timelineSpread } from "./spreads/Timeline";

/** Loads one spread's content and builds its pages. */
export async function buildSpread(id: SpreadId): Promise<SpreadContent> {
  const site = await loadSite();
  switch (id) {
    case "opening":
      return openingSpread({ site, copy: await loadPage("opening") });
    case "timeline":
      return timelineSpread({ copy: await loadPage("timeline"), entries: await loadTimeline() });
    case "skills":
      return skillsSpread({ copy: await loadPage("skills"), skills: await loadSkills() });
    case "projects":
      return projectsSpread({ copy: await loadPage("projects"), projects: await loadProjects() });
    case "contact":
      return contactSpread({ site, copy: await loadPage("contact") });
    case "colophon":
      return colophonSpread({ site, copy: await loadPage("colophon") });
  }
}

/** Every spread in notebook order, plus each project's mobile sheet. */
export async function buildNotebook() {
  const [site, spreads, projectsCopy, projects] = await Promise.all([
    loadSite(),
    Promise.all(SPREADS.map((id) => buildSpread(id))),
    loadPage("projects"),
    loadProjects(),
  ]);
  return { site, spreads, projects, sheets: projectSheets({ copy: projectsCopy, projects }) };
}
