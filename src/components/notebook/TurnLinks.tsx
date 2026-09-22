import Link from "next/link";
import type { Site } from "@/lib/content/schema";
import { PATHS, type SpreadId, neighbors } from "@/lib/notebook/spreads";

// Plain previous/next links: the fallback for every way of turning a page. On
// desktop they sit on the grab corners (bottom-left of the left page,
// bottom-right of the right page), where the curl will start in M2.

export function spreadTitle(site: Site, spread: SpreadId) {
  return spread === "opening" ? site.ribbon : site.sections[spread].title;
}

export function CornerLinks({ spread, site }: { spread: SpreadId; site: Site }) {
  const { previous, next } = neighbors(spread);
  const corner =
    "absolute top-[848px] size-14 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-huckleberry";
  return (
    <nav aria-label={site.turn.label}>
      {previous && (
        <Link
          href={PATHS[previous]}
          aria-label={`${site.turn.previous}: ${spreadTitle(site, previous)}`}
          className={`${corner} left-[90px]`}
        />
      )}
      {next && (
        <Link
          href={PATHS[next]}
          aria-label={`${site.turn.next}: ${spreadTitle(site, next)}`}
          className={`${corner} left-[1294px]`}
        />
      )}
    </nav>
  );
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
