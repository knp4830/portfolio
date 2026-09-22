import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { ContentError, checkContent, loadProjects, loadTimeline } from "./load.ts";

const realRoot = path.join(process.cwd(), "content");

test("the real content is valid", async () => {
  const { timeline, skills, projects } = await checkContent(realRoot);
  assert.equal(timeline.length, 11);
  assert.deepEqual(
    timeline.map((entry) => entry.slug),
    ["v0-1", "v0-2", "v0-3", "v0-4", "v0-5", "v0-6", "v0-7", "v0-8", "v0-9", "v1-0", "v1-1"],
  );
  assert.equal(skills.groups.length, 5);
  assert.deepEqual(
    projects.map((project) => project.slug),
    ["minced", "polypaper", "world-map-photo-album"],
  );
});

// Each case copies content/ to a temp folder, breaks one file, and expects the loader to say which.
let root: string;
before(async () => {
  root = await mkdtemp(path.join(tmpdir(), "content-"));
});
after(async () => {
  await rm(root, { recursive: true, force: true });
});

async function broken(file: string, edit: (source: string) => string) {
  const dir = await mkdtemp(path.join(root, "case-"));
  await cp(realRoot, dir, { recursive: true });
  const target = path.join(dir, file);
  await writeFile(target, edit(await readFile(target, "utf8")));
  return dir;
}

async function rejects(load: Promise<unknown>, file: string, message: RegExp) {
  await assert.rejects(load, (error: unknown) => {
    assert.ok(error instanceof ContentError, `expected ContentError, got ${error}`);
    assert.ok(error.message.includes(file), `error should name ${file}: ${error.message}`);
    assert.match(error.message, message);
    return true;
  });
}

test("a missing required field fails", async () => {
  const dir = await broken("timeline/v0-4.mdx", (s) => s.replace(/^title:.*\n/m, ""));
  await rejects(loadTimeline(dir), "v0-4.mdx", /title/);
});

test("a misspelled field fails", async () => {
  const dir = await broken("timeline/v0-4.mdx", (s) => s.replace("dates:", "date:"));
  await rejects(loadTimeline(dir), "v0-4.mdx", /date/);
});

test("an unquoted version fails", async () => {
  const dir = await broken("timeline/v1-0.mdx", (s) => s.replace('version: "1.0"', "version: 1.0"));
  await rejects(loadTimeline(dir), "v1-0.mdx", /version/);
});

test("a description over 125 characters fails", async () => {
  const dir = await broken("timeline/v0-1.mdx", (s) => s.replace(/^description: "/m, `description: "${"x".repeat(30)} `));
  await rejects(loadTimeline(dir), "v0-1.mdx", /125/);
});

test("a file name that doesn't match its version fails", async () => {
  const dir = await broken("timeline/v0-2.mdx", (s) => s.replace('version: "0.2"', 'version: "0.12"'));
  await rejects(loadTimeline(dir), "v0-2.mdx", /v0-12\.mdx/);
});

test("a project missing a required part fails", async () => {
  const dir = await broken("projects/polypaper.mdx", (s) => s.replace('label: "Result"', 'label: "Outcome"'));
  await rejects(loadProjects(dir), "polypaper.mdx", /Result/);
});
