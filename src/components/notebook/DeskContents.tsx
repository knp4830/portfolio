import Link from "next/link";
import type { Site } from "@/lib/content/schema";
import { PATHS, type SpreadId } from "@/lib/notebook/spreads";

// A quiet row of section names on the desk beside the theme switch, so a reader
// can jump from any spread without turning back to the contents (Kevin, Sep 22:
// words, no boxes; contents through contact — the colophon is one turn past
// contact and listed on p. 2). Plain links: clicking one riffles there exactly
// as the contents page does, and they work without JavaScript. The spread on
// screen is underlined, from the route marker's CSS in Notebook, so it's right
// on first paint.
export const DESK_SECTIONS: SpreadId[] = ["opening", "timeline", "skills", "projects", "contact"];

export function DeskContents({ site }: { site: Site }) {
  const title = (id: SpreadId) => (id === "opening" ? site.ribbon : site.sections[id as keyof Site["sections"]].title);
  return (
    <nav aria-label={site.turn.sections} className="flex h-11 items-center gap-5">
      {DESK_SECTIONS.map((id) => (
        <Link
          key={id}
          href={PATHS[id]}
          data-jump={id}
          className="type-label type-caps border-b border-transparent pb-0.5 text-desk-ink-soft no-underline hover:text-desk-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-desk-ink"
        >
          {title(id)}
        </Link>
      ))}
    </nav>
  );
}
