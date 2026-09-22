import type { Metadata } from "next";
import { renderNotebook } from "@/components/notebook/renderNotebook";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.skills.title };
}

// Skills (pp. 5–6).
export default async function SkillsPage() {
  return renderNotebook("skills");
}
