import { z } from "zod";

// One schema per content type. The TypeScript types come from the schemas, so a
// field is declared once. Objects are strict: a misspelled field is an error, not
// a silently ignored extra. Limits that protect the layout (CLAUDE.md → Layout)
// live here too, so overflowing copy fails the build instead of breaking a spread.

const text = z.string().trim().min(1, "can't be empty");
/** A handwritten note: one string, or one string per line. */
const pen = z.union([text.transform((line) => [line]), z.array(text).min(1)]);

export const timelineEntrySchema = z.strictObject({
  entry: z.int().min(1),
  // Quoted in YAML: unquoted 1.0 would parse as the number 1.
  version: z.string().regex(/^\d+\.\d+$/, 'must look like "0.4"'),
  title: text,
  dates: text,
  // Two lines at 15/28 even at the deepest indent.
  description: text.max(125, "must be 125 characters or fewer to fit two lines"),
  // Handwritten note; ~~text~~ marks a crossed-out word.
  marginalia: text.optional(),
});

/** A chip. Written as { name, unconfirmed: true } it renders dashed until Kevin confirms it. */
const chipSchema = z.union([
  text.transform((name) => ({ name, unconfirmed: false })),
  z.strictObject({ name: text, unconfirmed: z.literal(true) }),
]);

export const skillsSchema = z.strictObject({
  groups: z
    .array(z.strictObject({ name: text, usedIn: text, items: z.array(chipSchema).min(1) }))
    .min(1),
  foundations: z.array(z.strictObject({ name: text, detail: text, from: text })).min(1),
});

// Every detail page has these parts; projects add their own (Rejected idea, Pipeline,
// Signature detail, …). A part without copy yet says "To be added".
export const REQUIRED_PROJECT_PARTS = ["Problem", "Role", "Key decisions", "Result"] as const;

export const projectSchema = z.strictObject({
  order: z.int().min(1),
  title: text,
  oneLiner: text,
  // The card is 245×308: its one-liner gets at most five lines at 15/22.
  cardLine: text.max(110, "must be 110 characters or fewer to fit the project card"),
  stack: z.array(chipSchema).min(1),
  dates: text,
  // "Stage; detail" — the card shows the stage, the detail page tags the detail.
  status: text,
  details: z
    .array(z.strictObject({ label: text, text }))
    .refine(
      (parts) => REQUIRED_PROJECT_PARTS.every((label) => parts.some((part) => part.label === label)),
      { message: `must include ${REQUIRED_PROJECT_PARTS.join(", ")}` },
    ),
  lineage: z
    .array(z.strictObject({ name: text, version: text.optional(), note: text, date: text }))
    .optional(),
  // No links or screenshots yet (CLAUDE.md → Content); fields get added when Kevin provides them.
});

const section = z.strictObject({ title: text, subtitle: text });

export const siteSchema = z.strictObject({
  name: text,
  tagline: text,
  mobileTagline: text,
  version: text,
  location: text,
  theme: z.strictObject({ group: text, day: text, night: text, toDay: text, toNight: text }),
  ribbon: text,
  turn: z.strictObject({ label: text, previous: text, next: text }),
  resume: z.strictObject({ label: text, format: text, href: text }),
  links: z.array(z.strictObject({ id: text, label: text, display: text, href: z.url() })).min(1),
  sections: z.strictObject({
    timeline: section,
    skills: section,
    projects: section,
    contact: section,
    colophon: section,
  }),
});

export const pageSchemas = {
  opening: z.strictObject({
    entry: text,
    propertyOf: text,
    headline: text,
    headlineMarked: text,
    line: text,
    startHere: text,
    startHereMobile: text,
    specimen: text,
    specimenNote: pen,
    contents: z.strictObject({
      label: text,
      title: text,
      count: text.includes("{sections}").includes("{pages}"),
      jump: text,
      hint: text,
      erased: text,
    }),
  }),
  timeline: z.strictObject({
    label: text,
    title: text,
    since: text,
    continued: text,
    continuedNote: text,
    nowNoteMobile: text,
    strikeNote: text.includes("{struck}").includes("{written}"),
  }),
  skills: z.strictObject({
    label: text,
    tag: text,
    meta: text,
    title: text,
    note: text,
    specimen: text,
    foundations: z.strictObject({ label: text, meta: text, title: text }),
  }),
  projects: z.strictObject({
    label: text,
    count: text.includes("{count}"),
    meta: text,
    title: text,
    note: text,
    specimen: text,
    specimenNote: text,
    detail: z.strictObject({ label: text, stack: text, lineage: text, live: text, github: text, close: text }),
    card: z.strictObject({ link: text }),
  }),
  contact: z.strictObject({
    backCover: z.strictObject({
      label: text,
      meta: text,
      title: text,
      note: z.array(text).min(1),
      pen: text,
      specimen: text,
    }),
    contact: z.strictObject({ label: text, title: text, roles: text, location: text }),
  }),
  colophon: z.strictObject({
    label: text,
    meta: text,
    title: text,
    notesLabel: text,
    notes: z.strictObject({ bisector: pen, library: pen }),
    body: z.array(text).min(1),
    buildNotes: z.strictObject({
      label: text,
      meta: text,
      figure: text,
      figureLabels: z.strictObject({
        rest: text,
        pointer: text,
        mirror: text,
        fold: text,
        spine: text,
        scroll: pen,
        width: text,
        height: text,
      }),
      caption: text,
      facts: z.array(z.strictObject({ label: text, value: text })).min(1),
    }),
  }),
};

export type PageId = keyof typeof pageSchemas;
export type PageCopy<Id extends PageId> = z.output<(typeof pageSchemas)[Id]>;
export type Site = z.output<typeof siteSchema>;
export type Chip = z.output<typeof chipSchema>;
export type TimelineEntry = z.output<typeof timelineEntrySchema> & { slug: string };
export type Skills = z.output<typeof skillsSchema>;
export type Project = z.output<typeof projectSchema> & { slug: string };
