import type { Metadata } from "next";
import { renderNotebook } from "@/components/notebook/renderNotebook";
import { loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.contact.title };
}

// Contact and the back cover (pp. 9–10).
export default async function ContactPage() {
  return renderNotebook("contact");
}
