// Bakes the design's paper wear, desk, and cover into images, and writes the
// per-page geometry the Page component needs. Run: `pnpm bake:paper`.
//
// Why bake: the mockups (design/html) draw texture, foxing, smudges, coffee rings,
// edge aging, desk grain, and props with live SVG filters (feTurbulence, blur).
// Those are slow to repaint, and the curl (M2) repaints pages every frame. The
// brief allows blur only inside baked textures, so each layer stack is rendered
// once per theme with headless Chrome, encoded to AVIF with sharp, and committed.
//
// Output
//   public/textures/page-<page>-<theme>.avif      desktop page wear (630×840, transparent)
//   public/textures/mobile-<id>-<theme>.avif      mobile page wear (382×H, transparent)
//   public/textures/desk-<main|scene>-<theme>.avif desk grain + props (1440×952, 1920×1200)
//   public/textures/cover-<theme>.avif            leather cover (1304×876)
//   src/lib/paper/pages.ts                         clip polygons, wear levels, texture paths
//
// Needs Chrome (set CHROME_PATH if it isn't in the default Windows/macOS location).
// sharp comes from Next's own dependencies, so nothing extra is installed.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const html = (name) => readFileSync(path.join(root, "design/html", `${name}.html`), "utf8");
const tokensCss = readFileSync(path.join(root, "design/tokens.css"), "utf8");
const outDir = path.join(root, "public/textures");
const work = path.join(tmpdir(), "bake-paper");
const SCALE = 2;

const requireFromNext = createRequire(createRequire(import.meta.url).resolve("next/package.json"));
const sharp = requireFromNext("sharp");

const chrome =
  process.env.CHROME_PATH ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].find((candidate) => existsSync(candidate));
if (!chrome) throw new Error("Chrome not found; set CHROME_PATH");

// Spread → the two page numbers it holds. Night files share the day geometry.
const SPREADS = [
  { id: "opening", day: "Main", night: "OpeningNight", pages: [1, 2] },
  { id: "timeline", day: "TimelineDay", night: "TimelineNight", pages: [3, 4] },
  { id: "skills", day: "SkillsDay", night: "SkillsNight", pages: [5, 6] },
  { id: "projects", day: "ProjectsDay", night: "ProjectsNight", pages: [7, 8] },
  { id: "colophon", day: "ColophonDay", night: "ColophonNight", pages: [9, 10] },
  { id: "contact", day: "ContactDay", night: "ContactNight", pages: [11, 12] },
];
const MOBILE = SPREADS.map(({ id }) => {
  const name = { opening: "Opening", timeline: "Timeline", skills: "Skills", projects: "Projects", colophon: "Colophon", contact: "Contact" }[id];
  return { id, day: `${name}MobileDay`, night: `${name}MobileNight` };
});
const DESKS = [
  { id: "main", day: "Main", night: "OpeningNight", width: 1440, height: 952 },
  { id: "scene", day: "SceneDay", night: "SceneNight", width: 1920, height: 1200 },
];

const px = (style, prop) => {
  const match = style.match(new RegExp(`(?:^|;)\\s*${prop}:\\s*(-?[\\d.]+)px`));
  return match ? Number(match[1]) : undefined;
};
const clean = (markup) => markup.replace(/ data-dc-tpl="\d+"/g, "");
const body = (doc) => doc.slice(doc.indexOf("<body"));
const topLevelSvgs = (markup) => [...markup.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => clean(m[0]));

/** Every page <section> in a mockup: geometry plus the paper layers drawn before its content column. */
function pageSections(doc) {
  // Page sections are absolutely positioned and labelled; content can nest its own <section>s,
  // so each page's end is found by counting depth rather than taking the next </section>.
  const sections = [];
  const open = /<section([^>]*aria-label="[^"]*"[^>]*style="position: absolute;[^"]*")>/g;
  for (const match of doc.matchAll(open)) {
    let depth = 1;
    const tags = /<(\/?)section\b[^>]*>/g;
    tags.lastIndex = match.index + match[0].length;
    let tag;
    while (depth > 0 && (tag = tags.exec(doc))) depth += tag[1] ? -1 : 1;
    sections.push([match[1], doc.slice(match.index + match[0].length, tag.index)]);
  }
  return sections;
}

function readPages(doc) {
  return pageSections(body(doc)).map(([attrs, inner]) => {
    const style = attrs.match(/style="([^"]*)"/)[1];
    const label = attrs.match(/aria-label="([^"]*)"/)[1];
    const clip = style.match(/clip-path: (polygon\([^)]*\))/)?.[1];
    const colAt = inner.search(/<div[^>]*class="col"/);
    if (colAt === -1) throw new Error(`${label}: no content column`);
    const paper = inner.slice(0, colAt);
    const [rules, ...wear] = topLevelSvgs(paper);
    const firstRule = rules.match(/d="M0 ([\d.]+)H/);
    if (!rules.includes("var(--rule)") || !firstRule) throw new Error(`${label}: first layer isn't the ruled lines`);
    const texture = paper.match(/class="tex (w-\w+)"/)?.[1].slice(2);
    const gutterLeft = paper.match(/left: (\d+)px; top: 0px; width: 12px;[^"]*paper-fold/)?.[1];
    return {
      label,
      width: px(style, "width"),
      height: px(style, "height"),
      clip,
      wear: texture,
      firstRule: Number(firstRule[1]),
      gutter: gutterLeft === undefined ? null : Number(gutterLeft) === 0 ? "left" : "right",
      layers: wear,
    };
  });
}

/** Render markup at width×height (CSS px) with headless Chrome, then encode to AVIF. */
function render(name, { width, height, theme, markup, background = "transparent" }) {
  mkdirSync(work, { recursive: true });
  const file = path.join(work, `${name}.html`);
  const png = path.join(work, `${name}.png`);
  writeFileSync(
    file,
    `<!doctype html><html data-theme="${theme === "day" ? "day" : "night"}"><head><meta charset="utf-8"><style>${tokensCss}
html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${background}}
.stage{position:relative;width:${width}px;height:${height}px}
.stage>svg{position:absolute;left:0;top:0}</style></head>
<body><div class="stage">${markup}</div></body></html>`,
  );
  rmSync(png, { force: true });
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--default-background-color=00000000",
    `--force-device-scale-factor=${SCALE}`,
    `--window-size=${Math.max(width, 600)},${height}`,
    "--virtual-time-budget=3000",
    `--screenshot=${png}`,
    pathToFileURL(file).href,
  ], { stdio: "ignore" });
  if (!existsSync(png)) throw new Error(`Chrome didn't write ${png}`);
  return png;
}

async function encode(png, name, { width, height }) {
  const out = path.join(outDir, `${name}.avif`);
  // Crop: Chrome keeps a minimum window width, so narrow renders come back wider.
  await sharp(png)
    .extract({ left: 0, top: 0, width: width * SCALE, height: height * SCALE })
    .avif({ quality: 55, effort: 6 })
    .toFile(out);
  return `/textures/${name}.avif`;
}

async function bake(name, options) {
  const src = await encode(render(name, options), name, options);
  console.log(`  ${src}`);
  return src;
}

mkdirSync(outDir, { recursive: true });
const pages = {};
const mobile = {};

console.log("desktop pages");
for (const spread of SPREADS) {
  const day = readPages(html(spread.day));
  const night = readPages(html(spread.night));
  if (day.length !== 2 || night.length !== 2) throw new Error(`${spread.id}: expected 2 pages, found ${day.length}/${night.length}`);
  for (const [i, number] of spread.pages.entries()) {
    const geometry = day[i];
    if (night[i].clip !== geometry.clip) console.warn(`  note: page ${number} night clip differs from day; using day`);
    const textures = {};
    for (const [theme, page] of [["day", geometry], ["night", night[i]]]) {
      textures[theme] = await bake(`page-${number}-${theme}`, {
        width: geometry.width,
        height: geometry.height,
        theme,
        markup: page.layers.join(""),
      });
    }
    pages[number] = {
      spread: spread.id,
      label: geometry.label,
      clip: geometry.clip,
      wear: geometry.wear,
      gutter: geometry.gutter,
      textures,
    };
  }
}

console.log("mobile pages");
for (const page of MOBILE) {
  const [day] = readPages(html(page.day));
  const [night, extra] = readPages(html(page.night));
  if (!day || !night || extra) throw new Error(`${page.id}: expected 1 mobile page`);
  const textures = {};
  for (const [theme, source] of [["day", day], ["night", night]]) {
    textures[theme] = await bake(`mobile-${page.id}-${theme}`, {
      width: day.width,
      height: day.height,
      theme,
      markup: source.layers.join(""),
    });
  }
  mobile[page.id] = { clip: day.clip, wear: day.wear, width: day.width, height: day.height, textures };
}

console.log("desk and cover");
const desk = {};
for (const scene of DESKS) {
  desk[scene.id] = {};
  for (const theme of ["day", "night"]) {
    const [grain, props] = topLevelSvgs(body(html(theme === "day" ? scene.day : scene.night)));
    desk[scene.id][theme] = await bake(`desk-${scene.id}-${theme}`, {
      width: scene.width,
      height: scene.height,
      theme,
      markup: grain + props,
      background: "var(--desk)",
    });
  }
}
const cover = {};
for (const theme of ["day", "night"]) {
  const doc = body(html(theme === "day" ? "Main" : "OpeningNight"));
  const coverSvg = topLevelSvgs(doc.slice(doc.indexOf("box-shadow: rgba(0, 0, 0, 0.75)")))[0];
  cover[theme] = await bake(`cover-${theme}`, { width: 1304, height: 876, theme, markup: coverSvg, background: "var(--leather)" });
}

const ts = `// Generated by scripts/bakePaper.mjs from design/html — do not edit by hand.
// Re-run \`pnpm bake:paper\` after the design changes.

export type Wear = "light" | "medium" | "heavy";
export type ThemedImage = { day: string; night: string };

export type PageSpec = {
  spread: string;
  /** Section title in the mockup (for reference only; real labels come from content). */
  label: string;
  /** Torn and chipped edges, in px of the 630×840 page. */
  clip: string;
  wear: Wear;
  /** Which edge touches the spine; that strip gets the paper-fold shade. */
  gutter: "left" | "right";
  textures: ThemedImage;
};

export type MobilePageSpec = {
  clip: string;
  wear: Wear;
  width: number;
  height: number;
  textures: ThemedImage;
};

export const PAGES: Record<number, PageSpec> = ${JSON.stringify(pages, null, 2)};

export const MOBILE_PAGES: Record<string, MobilePageSpec> = ${JSON.stringify(mobile, null, 2)};

export const DESK: Record<"main" | "scene", ThemedImage> = ${JSON.stringify(desk, null, 2)};

export const COVER: ThemedImage = ${JSON.stringify(cover, null, 2)};
`;
mkdirSync(path.join(root, "src/lib/paper"), { recursive: true });
writeFileSync(path.join(root, "src/lib/paper/pages.ts"), ts);
console.log("wrote src/lib/paper/pages.ts");
