import type { Metadata } from "next";
import { ContactSpread } from "@/components/notebook/spreads/Contact";
import { loadPage, loadSite } from "@/lib/content/load";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await loadSite()).sections.contact.title };
}

// Contact and the back cover (pp. 9–10).
export default async function ContactPage() {
  const [site, copy] = await Promise.all([loadSite(), loadPage("contact")]);
  return <ContactSpread site={site} copy={copy} />;
}
