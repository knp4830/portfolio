import { checkContent } from "./load.ts";

// Runs before `next build` (see package.json). Exits non-zero on any invalid
// content file, so a missing frontmatter field fails the build on Vercel.
try {
  const { timeline, skills, projects } = await checkContent();
  const chips = skills.groups.reduce((sum, group) => sum + group.items.length, 0);
  console.log(
    `content ok: ${timeline.length} timeline entries, ${skills.groups.length} skill groups (${chips} chips), ${projects.length} projects`,
  );
} catch (error) {
  console.error(`\ncontent check failed: ${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
}
