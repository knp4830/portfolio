import type { Metadata } from "next";
import { SkillsSpread } from "@/components/notebook/spreads/Skills";
import { loadPage, loadSite, loadSkills } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.skills.title };
}

// Skills (pp. 5–6).
export default async function SkillsPage() {
  const [site, copy, skills] = await Promise.all([loadSite(), loadPage("skills"), loadSkills()]);
  return <SkillsSpread site={site} copy={copy} skills={skills} />;
}
