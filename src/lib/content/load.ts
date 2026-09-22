import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import { z } from "zod";
import {
  type PageCopy,
  type PageId,
  type Project,
  type Site,
  type Skills,
  type TimelineEntry,
  pageSchemas,
  projectSchema,
  siteSchema,
  skillsSchema,
  timelineEntrySchema,
} from "./schema.ts";

// Reads content/*.mdx at build time. Every loader validates what it reads and
// throws a ContentError naming the file and field, which fails `next build`
// (and `pnpm build` runs checkContent first, so Vercel fails even before any
// page uses a loader). Imports keep their .ts extension so Node can run this
// file directly for the check script and tests.

export class ContentError extends Error {
  constructor(file: string, problem: string) {
    super(`${file}\n${problem}`);
    this.name = "ContentError";
  }
}

const defaultRoot = () => path.join(process.cwd(), "content");

async function readMdx<T extends z.ZodType>(root: string, relative: string, schema: T) {
  const file = `content/${relative}`;
  const source = await readFile(path.join(root, relative), "utf8");
  let compiled: { content: ReactElement; frontmatter: Record<string, unknown> };
  try {
    compiled = await compileMDX({ source, options: { parseFrontmatter: true } });
  } catch (error) {
    throw new ContentError(file, error instanceof Error ? error.message : String(error));
  }
  const result = schema.safeParse(compiled.frontmatter);
  if (!result.success) throw new ContentError(file, z.prettifyError(result.error));
  return { data: result.data as z.output<T>, body: compiled.content };
}

async function mdxFiles(root: string, dir: string): Promise<string[]> {
  const names = await readdir(path.join(root, dir));
  return names.filter((name) => name.endsWith(".mdx")).sort();
}

const slugOf = (name: string) => name.replace(/\.mdx$/, "");

/** Entries 001–011 in order. Slugs match the /timeline anchors: version 0.4 → "v0-4". */
export async function loadTimeline(root = defaultRoot()): Promise<TimelineEntry[]> {
  const names = await mdxFiles(root, "timeline");
  const entries = await Promise.all(
    names.map(async (name) => {
      const { data } = await readMdx(root, `timeline/${name}`, timelineEntrySchema);
      const slug = slugOf(name);
      const expected = `v${data.version.replace(".", "-")}`;
      if (slug !== expected) {
        throw new ContentError(`content/timeline/${name}`, `file name must be ${expected}.mdx for version ${data.version}`);
      }
      return { ...data, slug };
    }),
  );
  entries.sort((a, b) => a.entry - b.entry);
  entries.forEach((entry, i) => {
    if (entry.entry !== i + 1) {
      throw new ContentError(`content/timeline/${entry.slug}.mdx`, `entry ${entry.entry} is out of sequence; expected ${i + 1}`);
    }
  });
  return entries;
}

export async function loadSkills(root = defaultRoot()): Promise<Skills> {
  return (await readMdx(root, "skills.mdx", skillsSchema)).data;
}

/** Projects in display order. The first is preselected on the projects spread. */
export async function loadProjects(root = defaultRoot()): Promise<(Project & { body: ReactElement })[]> {
  const names = await mdxFiles(root, "projects");
  const projects = await Promise.all(
    names.map(async (name) => {
      const { data, body } = await readMdx(root, `projects/${name}`, projectSchema);
      return { ...data, slug: slugOf(name), body };
    }),
  );
  projects.sort((a, b) => a.order - b.order);
  projects.forEach((project, i) => {
    if (i > 0 && project.order === projects[i - 1].order) {
      throw new ContentError(`content/projects/${project.slug}.mdx`, `order ${project.order} is also used by ${projects[i - 1].slug}`);
    }
  });
  return projects;
}

/** Chrome copy shared by every spread (name, theme toggle, links, contents entries). */
export async function loadSite(root = defaultRoot()): Promise<Site> {
  return (await readMdx(root, "site.mdx", siteSchema)).data;
}

/** One spread's own copy: labels, headings, and handwritten notes. */
export async function loadPage<Id extends PageId>(id: Id, root = defaultRoot()): Promise<PageCopy<Id>> {
  return (await readMdx(root, `pages/${id}.mdx`, pageSchemas[id])).data as PageCopy<Id>;
}

/** Loads everything; used by the build step and tests. */
export async function checkContent(root = defaultRoot()) {
  const ids = Object.keys(pageSchemas) as PageId[];
  const [timeline, skills, projects, site, ...pages] = await Promise.all([
    loadTimeline(root),
    loadSkills(root),
    loadProjects(root),
    loadSite(root),
    ...ids.map((id) => loadPage(id, root)),
  ]);
  return { timeline, skills, projects, site, pages };
}
