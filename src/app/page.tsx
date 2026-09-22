import { OpeningSpread } from "@/components/notebook/spreads/Opening";
import { loadPage, loadSite } from "@/lib/content/load";

// Opening spread (pp. 1–2).
export default async function Home() {
  const [site, copy] = await Promise.all([loadSite(), loadPage("opening")]);
  return <OpeningSpread site={site} copy={copy} />;
}
