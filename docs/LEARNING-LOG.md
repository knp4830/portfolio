# Learning log

Why the code is the way it is, one entry per milestone.

## M0.1 — Scaffold (2026-09-21)

### What we built
A Next.js 15 app (TypeScript, Tailwind v4, ESLint, App Router, `src/`, pnpm) that deploys to Vercel on every push, with a CI job that lints and typechecks every pull request. The Claude Design export (`design/`) is in the repo as the visual spec.

### Key files
- `.github/workflows/ci.yml`: the CI job
- `package.json`: the `typecheck` script and the `packageManager` pin
- `pnpm-lock.yaml`: now also records which pnpm to use
- `pnpm-workspace.yaml`: `allowBuilds` for `unrs-resolver`
- `design/README.md`: entry point to the visual spec

### How it works
There are two independent robots watching the GitHub repo:

1. **GitHub Actions (CI)** answers "is this code healthy?" On every PR and every push to `main`, a fresh Ubuntu machine checks out the code, installs pnpm (the version from `packageManager`) and Node 24, runs `pnpm install --frozen-lockfile`, then `pnpm lint` and `pnpm typecheck`. If any step exits non-zero, the check goes red on the PR.
2. **Vercel's GitHub integration** answers "what does it look like?" The Vercel project `minced/portfolio` is linked to `knp4830/portfolio`. Every push builds a deployment: pushes to `main` go to production, other branches get a preview URL that's posted on the PR.

They don't know about each other. A PR can deploy fine on Vercel and still fail lint in CI, which is why both exist.

### Why this way, and what we rejected
- **`--frozen-lockfile` in CI.** A plain `pnpm install` would quietly update the lockfile if `package.json` and the lockfile disagreed, so CI would test something different from what's committed. Frozen mode fails instead, which is what you want from a check.
- **`typecheck` as its own step, not just `next build`.** `next build` also typechecks, but it's slower and mixes type errors with build errors. `tsc --noEmit` checks types only and writes nothing to disk.
- **Pinning pnpm with `packageManager`.** Without it, CI would pick whatever pnpm version the action defaults to. Pnpm majors change lockfile behavior, so matching local (12.5.1) avoids "works on my machine."
- **Lint + typecheck only; no build or tests yet.** That's the milestone's DoD, and Vercel already runs the build on every push. Tests arrive with the curl math in M2.1.
- **Rejected: deploying with the Vercel CLI.** It would be one more global install, and git-linked deploys give a preview per PR with no extra tooling.

### Gotchas
- **pnpm blocks install scripts by default.** `unrs-resolver` (pulled in by `eslint-config-next`) needs its postinstall, so it's allow-listed in `pnpm-workspace.yaml`. Without that the install aborts.
- **pnpm 12 stores the `packageManager` pin in the lockfile.** Adding the field without re-running `pnpm install` made `--frozen-lockfile` fail in a clean clone. Always re-run install after touching `package.json`.
- **Local success isn't CI success.** Locally, `.next/` and `next-env.d.ts` already exist; CI starts with neither (both are gitignored). Testing in a fresh `git clone` of the branch reproduces what CI sees.
- **Preview URLs are behind a login.** Vercel's default Deployment Protection sends anyone not logged in to your Vercel team to a login page (`302`). Production is public. Keep this in mind before sharing a preview link.
- **The Vercel connector said the project creation failed, but it had worked.** The project 404'd right afterwards but was linked; the first PR built it. Check the PR's status checks before retrying, or you could end up with a duplicate project.

## M0.2 — Tokens and type (2026-09-21)

### What we built
Every color, font, type role, and grid value from the design now lives in `src/app/globals.css`, in day and night. The five faces (plus Patrick Hand as a fallback) load through `next/font`. A test page at `/tokens` renders all of it in both themes side by side, and `pnpm test` (now in CI) fails if any text pairing drops below WCAG AA.

### Key files
- `src/app/globals.css`: the tokens, the Tailwind mapping, and the type-role utilities
- `src/app/fonts.ts`: the `next/font` setup; `layout.tsx` puts the font variables on `<html>`
- `src/lib/tokens/contrast.ts`: reads the tokens out of the CSS and computes contrast
- `src/lib/tokens/contrast.test.ts`: the checks, run with `pnpm test`
- `src/app/tokens/page.tsx`: the token test page (`noindex`, not linked from the site)

### How it works
**Three layers of variables.**
1. Raw tokens (`--paper`, `--ink`, …) are plain CSS custom properties. They're defined once for day on `:root, [data-theme="day"]` and once for night on `[data-theme="night"]`. Custom properties inherit, so any element with `data-theme` re-themes everything inside it. That's how `/tokens` shows both themes on one page.
2. The system preference: inside `@media (prefers-color-scheme: dark)`, `:root:not([data-theme="day"])` gets the night values. The `:not()` is what lets the toggle (M1.4) override: pinning `data-theme="day"` beats a dark OS setting.
3. Tailwind names: `@theme inline` maps `--color-paper: var(--paper)` etc., so `bg-paper` or `text-ink` exist as utilities. `inline` makes the utility contain `var(--paper)` itself rather than a copy of the value, so it re-resolves per element and follows the theme.

**Tailwind's defaults are removed.** `--color-*: initial` and `--font-*: initial` clear the built-in palette and font stacks. `bg-blue-500` or `font-sans` now generate nothing, which enforces "no colors outside `globals.css`."

**Type roles are one class each.** `@utility type-display` (and heading, body, detail, card, semi, label, caps, pen) sets face, weight, size, leading, and Fraunces' `SOFT`/`WONK`/`opsz` axes together. Sizes come from variables (`--display-size` …) that switch at 1024px, so the classes are responsive without needing `spread:` prefixes.

**Special Elite at 0.88×.** The typewriter face runs wide, so its size is `calc(0.88 × 18px)` ≈ 16px on desktop and `0.88 × 17px` ≈ 15px on mobile. That's the brief's 16/15 and matches the mockup HTML.

**Contrast checks read the real CSS.** The test and the page both parse `globals.css`, so there's no second copy of the palette to fall out of sync. Each pairing is a foreground token on a surface. A surface can be a stack of layers, e.g. `paper + cast` (the lamp's warm glow) or `paper + edge-age @ 7%` (worn paper). The checker blends translucent layers the way the browser does before computing the ratio. Thresholds: 4.5:1 for text, 3:1 for large text (salal) and focus rings.

### Why this way, and what we rejected
- **Rejected: a contrast library or axe for this step.** The WCAG formula is ~15 lines, and adding packages needs approval. axe comes in M3.1 for the real pages.
- **Rejected: Tailwind's `dark:` variant.** Swapping variable values means components never mention the theme. With `dark:`, every component would need two classes per color.
- **Rejected: storing the palette in TS and generating CSS.** CSS is the source of truth the brief asks for, and the design's `tokens.css` pastes straight in.
- **The night block is written twice** (forced and system) because CSS can't share one declaration block between a selector and a media query without a preprocessor. A test asserts the two blocks are identical.
- **Motion and curl constants aren't here yet.** They belong to M2.x and will live next to the curl code.

### Gotchas
- **Tailwind only emits utilities that some file uses.** After M0.2's first build, none of the new classes were in the CSS, because nothing used them yet. That's expected, not a bug.
- **Node runs `.ts` directly (Node 24), but imports need the `.ts` extension** (`./contrast.ts`). TypeScript only allows that with `allowImportingTsExtensions` (fine because we never emit JS). Keep `contrast.ts` import-free, so the test never has to resolve `@/` paths.
- **`"type": "module"` in package.json** stops Node's "reparsing as ES module" warning on every test run. Next, ESLint, and PostCSS configs are already ESM (`.ts`/`.mjs`), so nothing else changed.
- **Headless Chrome won't shrink a window below ~500px.** A "390px" screenshot is a crop of a wider layout and looks like horizontal overflow. To check mobile, put the page in a 390px `<iframe>`.
- **The starter home page lost its colors** because Tailwind's palette is cleared. It's replaced in M1.2.

## M0.3 — Content pipeline (2026-09-21)

### What we built
All site content from the brief now lives in `content/` as MDX files with typed frontmatter:
- 11 timeline entries (`content/timeline/v0-1.mdx` … `v1-1.mdx`)
- the skills page (`content/skills.mdx`)
- 3 projects (`content/projects/minced.mdx`, `polypaper.mdx`, `world-map-photo-album.mdx`)

A loader reads and validates them. `pnpm build` refuses to build if any file is missing a field, has a misspelled field, or breaks a layout limit.

### Key files
- `src/lib/content/schema.ts`: one zod schema per content type; the TypeScript types are inferred from them
- `src/lib/content/load.ts`: `loadTimeline`, `loadSkills`, `loadProjects`, `checkContent`, and `ContentError`
- `src/lib/content/check.ts`: the build step (`pnpm content:check`, also run by `pnpm build`)
- `src/lib/content/load.test.ts`: proves valid content loads and six kinds of broken content are rejected
- `package.json`: `"build": "node src/lib/content/check.ts && next build"`

### How it works
1. **Read.** The loader lists `content/<type>/*.mdx`. The file name is the slug: `v0-4` is the `/timeline#v0-4` anchor, `minced` is `/projects/minced`.
2. **Compile.** `compileMDX` from `next-mdx-remote/rsc` splits off the YAML frontmatter and compiles the MDX body into a React element. Timeline and skills are frontmatter only; projects keep the body (empty for now) so detail pages can add prose later.
3. **Validate.** zod checks the frontmatter against the schema. `safeParse` either returns typed data or an error listing every problem. `z.prettifyError` turns that into `✖ Invalid input: expected string, received undefined → at dates`, and `ContentError` puts the file path on top.
4. **Cross-file rules** the schema can't see: the file name must match the version (`0.4` → `v0-4.mdx`), entry numbers must run 1…N with no gaps, and no two projects may share an `order`.
5. **Fail the build.** No page uses the loaders until M1.2, so `next build` alone wouldn't notice bad content yet. `pnpm build` (which Vercel runs) therefore starts with `check.ts`, which loads everything and exits 1 on the first problem. Once pages call the loaders at build time, Next would fail on its own too; the check just makes that true from day one.

**Schema is the type.** `type TimelineEntry = z.infer<typeof timelineEntrySchema>` means a field is declared once. Components in M1.2 get exactly the shape the validator guarantees, so there's no second hand-written interface to drift.

**Layout limits live in the schema.** `description` is `.max(125)` because the timeline fits two lines per entry (CLAUDE.md). Copy that would overflow the spread fails the build instead of being discovered visually.

### Why this way, and what we rejected
- **next-mdx-remote + zod** (Kevin chose). **Rejected: `@next/mdx`**, which turns `.mdx` files into imported components. It needs extra remark plugins for frontmatter, and validation would happen per import, so "every file is valid" is hard to guarantee in one place. **Rejected: a hand-written validator**: every field would need its check and its type written separately.
- **Strict objects** (`z.strictObject`). A typo like `date:` for `dates:` is an error. A loose schema would silently drop it and the date would vanish from the page.
- **Details as an ordered `{label, text}` list, not fixed keys.** Labels ("What sets it apart", "Pipeline") are copy and belong in `content/`, and each project has different extras. The four parts every project has (Problem, Role, Key decisions, Result) are enforced by a `refine`; a part with no copy yet says "To be added" rather than being left out.
- **Lineage is structured** (`name`, `note`, `date`) because the design draws it as a version history, not a sentence.
- **No link or screenshot fields yet.** CLAUDE.md says leave the slots empty until Kevin provides them; the schema gets those fields then.
- **Unconfirmed skills** are written `{ name, unconfirmed: true }` so they render as dashed chips; plain strings are confirmed. zod's `transform` normalizes both into `{ name, unconfirmed }`, so components handle one shape.

### Gotchas
- **YAML types are guessed from how a value is written.** `version: 1.0` is the number `1`, not the string `"1.0"`. Every version is quoted, and the schema's regex rejects a bare number (tested).
- **Quote any value with a colon**: `title: "Added dependency: math"`. Unquoted, YAML reads it as a nested key.
- **Node's type stripping needs `.ts` in imports** (`./schema.ts`), same as M0.2. Next's bundler accepts them too. Verified with a throwaway page that called `checkContent()` during `next build` and rendered the data.
- **Windows paths.** `path.join` gives `content\timeline\…` on Windows. Error labels are built with `/` so messages look the same locally and on Vercel.
- **The copy is still draft.** The brief marks the timeline descriptions and skills lists "Kevin to confirm". Editing them means editing the `.mdx` files only.
- **Deleted pages leave stale types in `.next/`.** After removing the throwaway probe page, `tsc` failed with "Cannot find module …/zz-content-probe/page.js" from `.next/types/`. `rm -rf .next && pnpm build` fixes it. CI never sees this because `.next/` isn't committed.

## M1.1 — Page and Notebook (2026-09-21)

### What we built
The empty notebook, matching the design at 1440 and 390 in day and night:
- the walnut desk with its props, the lamp pool, and the vignette
- the leather cover with its shadow, and the page block
- two 630×840 pages with torn, chipped edges, ruled lines, and page-by-page wear (texture, foxing, edge aging, coffee rings, smudges, tears, folds)
- the spine gutter and page numbers
- below 1024px, one page inside an 8px leather strip

`/` now shows the opening spread (pp. 1–2) with no content; M1.2 fills it.

### Key files
- `scripts/bakePaper.mjs` (`pnpm bake:paper`): extracts every page's wear, the desk, and the cover from `design/html/`, renders them with headless Chrome, encodes AVIF with sharp
- `public/textures/*.avif`: 42 baked images (12 desktop pages, 6 mobile pages, 2 desks, 1 cover; × day/night), ~2 MB total, ~170 KB per spread
- `src/lib/paper/pages.ts`: generated; per-page clip polygon, wear level, gutter side, texture paths
- `src/lib/paper/clip.ts`: re-anchors a px polygon to any size (mobile)
- `src/components/notebook/`: `Notebook`, `Page`, `MobilePage`, `Desk`, `LeatherCover`
- `src/app/globals.css`: the `night:` variant, `stage-scale` and `ruled` utilities, vignette/shadow tokens

### How it works
**Bake once, render cheaply.** In the mockups, paper texture is `feTurbulence` + `feDiffuseLighting`, foxing is displaced circles, and stains and edge aging are Gaussian blurs. Live SVG filters like these are expensive to repaint, and the curl (M2) repaints pages every frame. The brief also allows blur only inside baked textures. So `bakePaper.mjs`:
1. finds each page `<section>` in a mockup and takes the SVG layers drawn before its content column (skipping the ruled lines, which stay live)
2. writes them into a bare HTML file with `tokens.css` and the right `data-theme`
3. screenshots it with Chrome at 2× on a transparent background (`--default-background-color=00000000`)
4. crops and encodes it to AVIF with alpha

The page's own color stays a token (`bg-paper`), so the baked layer is just the wear on top.

**What stays live DOM:**
- the paper color
- the **clip-path polygon** that makes the torn edge (so text inside stays selectable, and M2's fold clip can combine with it)
- the ruled lines, the gutter shade, the spine rule, the lamp cast, and all text

**Theme swap for images.** Colors follow tokens automatically; baked images can't. Each image element gets `--img-day` and `--img-night` URLs inline and uses `bg-[image:var(--img-day)] night:bg-[image:var(--img-night)]`. `night:` is a custom Tailwind variant that matches both `data-theme="night"` and the OS dark preference (unless pinned to day), mirroring the token selectors. Only the image the current theme uses is downloaded.

**Scaling without scrolling.** The desktop scene is laid out at exactly the design's 1440×952 in px, then scaled by `--stage-scale = min(1, 100vw / 1440px, 100dvh / 952px)`. CSS can't divide a length by a length, so it's written `tan(atan2(100vw, 1440px))`, which equals 100vw ÷ 1440px as a plain number. The notebook never grows past design size: on a 1920 screen you see more desk, as in the design's 1920 scene.

**The desk covers from the center.** The desk image uses `background-size: cover` centered on the window. At 1440×952 (and 1920×1200 for the wide arrangement) it's pixel-for-pixel the design. At other sizes it scales at least as much as the notebook, so props move outward and never under a page.

**Ruled lines** are one `bg-rule` div with a repeating mask: a 1px opaque band at `--rule-offset` in every `--baseline`. A mask with hard stops draws lines, not a visible gradient, and both numbers come from tokens.

**Mobile edges.** A mobile page's height depends on its content, and its width on the phone. `responsiveClip` rewrites the design's polygon so points in the right half measure from the right edge (`calc(100% - 2px)`) and points in the bottom half from the bottom. The chips keep their shape; only the gaps between them stretch. The baked wear is pinned to the top.

### Why this way, and what we rejected
- **Rejected: live SVG filters in production.** They look identical but cost a filter pass per page, per repaint. That's fine for a static mockup and bad under a 60fps curl.
- **Rejected: a random-but-seeded wear generator.** It would be smaller, but the design already has a hand-tuned wear layout for all 12 pages (one coffee ring per spread, tears only on the edges the brief allows). Extracting keeps it exact.
- **Rejected: baking the whole page including paper color and rules.** That would need a new image for every token change, and the rules must stay crisp and on the baseline.
- **Rejected: scaling the desk with the notebook.** Tried first: at 1280×720 the 1440 desk image ended in hard edges. Cover-from-center fixed it.
- **Two desk arrangements** (the design's 1440 and 1920), switched at 1536px, because the 1440 artboard pulls the props in closer than the 1920 scene.
- **`sharp` is loaded through Next's dependencies** (`createRequire` from `next/package.json`) rather than added to `package.json`. It's only used by the bake script, and Next already ships it.

### Gotchas
- **Nested `<section>`s in the mockups.** The skills page has sections inside the page section, so "next `</section>`" grabbed the wrong end. Page sections are now found by aria-label + `position: absolute`, and their end by counting depth. The script also asserts 2 pages per spread and 1 per mobile page.
- **Headless Chrome's minimum window width** (~500px) again. The bake renders mobile pages in a 600px window and crops with sharp.
- **The bake depends on Chrome being installed** (`CHROME_PATH` to override). The output is committed, so neither CI nor Vercel runs the bake.
- **Grab-corner folds are baked in for now.** CLAUDE.md says lifted turn corners are the curl engine's rest state and must share its fold math. When M2 builds them, the bake has to drop those corner layers.
- **Mobile page numbers don't sit on a rule yet.** The page height is `100dvh` for the empty shell; once M1.2 gives pages real content, heights should snap to whole lines.
