import type { Metadata } from "next";
import { ColophonSpread } from "@/components/notebook/spreads/Colophon";
import { loadPage, loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.colophon.title };
}

// Colophon (pp. 11–12), the last spread.
export default async function ColophonPage() {
  const [site, copy] = await Promise.all([loadSite(), loadPage("colophon")]);
  return <ColophonSpread site={site} copy={copy} />;
}
