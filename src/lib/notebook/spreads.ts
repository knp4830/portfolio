import { PAGES } from "../paper/pages.ts";

// The notebook's running order. Everything that depends on sequence — routes,
// page numbers, the contents page's ranges, previous/next links, and later the
// curl's riffle — reads from here. Contact comes before the colophon (Kevin, Sep 21).

export const SPREADS = ["opening", "timeline", "skills", "projects", "contact", "colophon"] as const;
export type SpreadId = (typeof SPREADS)[number];
/** Spreads listed on the contents page (everything after the opening). */
export type SectionId = Exclude<SpreadId, "opening">;

export const PATHS: Record<SpreadId, string> = {
  opening: "/",
  timeline: "/timeline",
  skills: "/skills",
  projects: "/projects",
  contact: "/contact",
  colophon: "/colophon",
};

/** The spread's left and right page numbers, from the baked page data. */
export function pagesOf(spread: SpreadId): [left: number, right: number] {
  const numbers = Object.entries(PAGES)
    .filter(([, page]) => page.spread === spread)
    .map(([number]) => Number(number))
    .sort((a, b) => a - b);
  if (numbers.length !== 2) throw new Error(`${spread} should have 2 pages, has ${numbers.length}`);
  return [numbers[0], numbers[1]];
}

/** "3–4", for "pp. 3–4". */
export const pageRange = (spread: SpreadId) => pagesOf(spread).join("–");

export const TOTAL_PAGES = SPREADS.length * 2;

export function neighbors(spread: SpreadId): { previous?: SpreadId; next?: SpreadId } {
  const i = SPREADS.indexOf(spread);
  return { previous: SPREADS[i - 1], next: SPREADS[i + 1] };
}
