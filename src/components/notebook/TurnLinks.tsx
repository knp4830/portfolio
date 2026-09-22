import Link from "next/link";
import type { Site } from "@/lib/content/schema";
import { PATHS, type SpreadId, neighbors } from "@/lib/notebook/spreads";

// Plain previous/next links in the mobile footer: the fallback for every way of
// turning a page (the curl intercepts them and turns first). On desktop the grab
// corners are the links (see curl/PageCurl).

export function spreadTitle(site: Site, spread: SpreadId) {
  return spread === "opening" ? site.ribbon : site.sections[spread].title;
}

export function FooterLinks({ spread, site }: { spread: SpreadId; site: Site }) {
  const { previous, next } = neighbors(spread);
  return (
    <nav aria-label={site.turn.label} className="flex gap-4">
      {previous && (
        <Link href={PATHS[previous]} className="type-label text-huckleberry">
          <span className="sr-only">{site.turn.previous}: </span>
          <span aria-hidden>← </span>
          {spreadTitle(site, previous)}
        </Link>
      )}
      {next && (
        <Link href={PATHS[next]} className="type-label text-huckleberry">
          <span className="sr-only">{site.turn.next}: </span>
          {spreadTitle(site, next)}
          <span aria-hidden> →</span>
        </Link>
      )}
    </nav>
  );
}
