import { z } from "zod";

// One schema per content type. The TypeScript types come from the schemas, so a
// field is declared once. Objects are strict: a misspelled field is an error, not
// a silently ignored extra. Limits that protect the layout (CLAUDE.md → Layout)
// live here too, so overflowing copy fails the build instead of breaking a spread.

const text = z.string().trim().min(1, "can't be empty");

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

const skillItemSchema = z.union([
  text.transform((name) => ({ name, unconfirmed: false })),
  // Rendered as a dashed chip until Kevin confirms it.
  z.strictObject({ name: text, unconfirmed: z.literal(true) }),
]);

export const skillsSchema = z.strictObject({
  groups: z
    .array(z.strictObject({ name: text, usedIn: text, items: z.array(skillItemSchema).min(1) }))
    .min(1),
  foundations: z.array(z.strictObject({ name: text, detail: text, from: text })).min(1),
});

// Every detail page has these five parts (brief → Project detail pages); projects can add
// their own (Pipeline, Signature detail, …). A part without copy yet says "To be added".
export const REQUIRED_PROJECT_PARTS = ["Problem", "Role", "Key decisions", "Rejected idea", "Result"] as const;

export const projectSchema = z.strictObject({
  order: z.int().min(1),
  title: text,
  oneLiner: text,
  stack: z.array(text).min(1),
  dates: text,
  status: text,
  details: z
    .array(z.strictObject({ label: text, text }))
    .refine(
      (parts) => REQUIRED_PROJECT_PARTS.every((label) => parts.some((part) => part.label === label)),
      { message: `must include ${REQUIRED_PROJECT_PARTS.join(", ")}` },
    ),
  lineage: z.array(z.strictObject({ name: text, note: text, date: text })).optional(),
  // No links or screenshots yet (CLAUDE.md → Content); fields get added when Kevin provides them.
});

export type TimelineEntry = z.infer<typeof timelineEntrySchema> & { slug: string };
export type Skills = z.infer<typeof skillsSchema>;
export type Project = z.infer<typeof projectSchema> & { slug: string };
