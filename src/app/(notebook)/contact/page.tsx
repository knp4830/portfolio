import type { Metadata } from "next";
import { RouteMarker } from "@/components/notebook/RouteMarker";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.contact.title };
}

// Contact and the back cover (pp. 9–10).
export default function ContactPage() {
  return <RouteMarker spread="contact" />;
}
