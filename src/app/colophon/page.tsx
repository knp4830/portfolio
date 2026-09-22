import type { Metadata } from "next";
import { renderNotebook } from "@/components/notebook/renderNotebook";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.colophon.title };
}

// Colophon (pp. 11–12), the last spread.
export default async function ColophonPage() {
  return renderNotebook("colophon");
}
