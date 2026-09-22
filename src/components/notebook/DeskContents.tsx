import Link from "next/link";
import type { Site } from "@/lib/content/schema";
import { PATHS, SPREADS, type SectionId } from "@/lib/notebook/spreads";

// The contents, on the desk beside the theme switch: one numbered box per
// section, numbered as on the contents page, so a reader can jump from any
// spread without turning back to p. 2 (Kevin, Sep 22). Plain links — clicking
// one riffles the pages the same way the contents page does, and they still
// work without JavaScript. The box for the spread on screen is filled in; that
// comes from the route marker's CSS in Notebook, so it's right on first paint.
export function DeskContents({ site }: { site: Site }) {
  const sections = SPREADS.filter((id): id is SectionId => id !== "opening");
  return (
    <nav aria-label={site.ribbon} className="flex h-11 items-center gap-2.5">
      <span aria-hidden className="type-label type-caps text-desk-ink-soft">
        {site.ribbon}
      </span>
      <span className="flex items-center gap-1.5">
        {sections.map((id, i) => (
          <Link
            key={id}
            href={PATHS[id]}
            data-jump={id}
            title={site.sections[id].title}
            className="type-label inline-flex size-9 items-center justify-center rounded-chip border border-desk-ink-soft text-desk-ink no-underline hover:border-desk-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-desk-ink"
          >
            <span className="sr-only">{site.sections[id].title}</span>
            <span aria-hidden>{i + 1}</span>
          </Link>
        ))}
      </span>
    </nav>
  );
}
