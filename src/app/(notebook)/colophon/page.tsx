import type { Metadata } from "next";
import { RouteMarker } from "@/components/notebook/RouteMarker";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.colophon.title };
}

// Colophon (pp. 11–12), the last spread.
export default function ColophonPage() {
  return <RouteMarker spread="colophon" />;
}
