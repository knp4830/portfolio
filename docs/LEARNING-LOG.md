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

## M1.2 — Pages and chrome (2026-09-21, combined M1.2–M1.4)

### What we built
All six spreads with their content, desktop and mobile, day and night:
- **opening:** property card, headline, resume, contents with hover
- **timeline:** the two-page trail
- **skills:** chips and the foundations grid
- **projects:** cards, detail, and the mobile sheet
- **contact:** back cover and contact details
- **colophon:** the build notes and Fig. 1

Plus the chrome: the name on the desk, the day/night toggle, the ribbon bookmark, previous/next links, specimens, and handwritten notes. Contact now comes before the colophon (pp. 9–10), so the colophon is the last spread (pp. 11–12).

### Key files
- `src/lib/notebook/spreads.ts`: the running order, routes, page ranges, previous/next (+ tests)
- `content/site.mdx`, `content/pages/*.mdx`: chrome copy and each spread's own copy; schemas in `src/lib/content/schema.ts`
- `src/components/notebook/spreads/*.tsx`: one component per spread; each returns `left`, `right`, and `mobile` content for `Notebook`
- `src/components/notebook/`:
  - `Marginalia`, `HandMark`, `PageHeader`, `StackChip`, `FactsPanel`, `ResumeButton`, `Tape`
  - `ThemeToggle`, `RibbonBookmark`, `TurnLinks`, `ProjectSheet`
- `src/components/notebook/art/`: specimens, icons, and one-off marks, converted from `design/html`
- `src/app/*/page.tsx`: six routes plus `/projects/[slug]` (static params, `dynamicParams = false`)

### How it works
**One order, everything derived.** `SPREADS` lists the spreads in reading order. Page numbers come from the baked page data, and a test asserts that they run 1–12 with no gaps. The contents page's numbers and ranges, the "5 sections · 12 pages" count, and every previous/next link are computed from it. Moving the colophon after contact meant changing one array and re-running the bake.

**Two trees, one shown.** Each spread renders the desktop scene and the mobile merged page. CSS shows one (`hidden spread:block` / `spread:hidden`), and `display: none` removes the other from the accessibility tree and from tab order. Both are static HTML, with no JavaScript needed to pick a layout.

**Handwriting is deterministic.** `Marginalia` splits a note into glyphs and gives each a baseline wobble (a sine plus jitter), a rotation, and uneven spacing. The randomness is seeded by hashing the text (FNV-1a → mulberry32). So the same note looks the same on every render, and the server and browser always agree (no hydration mismatch). Screen readers get the plain text; decorative marks pass `label={null}`.

**Hand marks are the design's strokes.** `HandMark` wraps text in a relative span and stretches one of the design's underline or circle paths to it: `preserveAspectRatio="none"` plus `vector-effect: non-scaling-stroke`, so the line stays 2.2px at any word length.

**Projects selection is a URL.** Cards are links to `/projects/<slug>`. The spread's `selected` prop comes from the route, so selection works without JavaScript, every project is linkable, and back/forward step through selections. The detail's slide-in is a CSS keyframe keyed by slug (`motion-safe:` only). On mobile the same route renders a fixed sheet over the card list:
- **X** is a link back to `/projects#slug`
- **Back** works because opening the sheet was a navigation
- **Swipe down** is a small client component: it only engages when the sheet is scrolled to the top and the finger moves down, so it never blocks scrolling

**Theme toggle without a flash.**
- **Before paint:** an inline script in `<head>` applies a saved choice.
- **Pressed styling:** uses the `night:` variant, so it's correct before hydration.
- **After hydration:** `useSyncExternalStore` watches `data-theme` (MutationObserver) and the OS preference for `aria-pressed`.
- **Storage:** `localStorage` holds the choice, the one allowed use of browser storage.

### Why this way, and what we rejected
- **Rejected: absolute positioning copied from the mockups.** Text uses flow layout on the 28px grid (the mockups' own fixed heights: 28/56/84/112…). Only decorative art and notes are placed absolutely, at the design's page coordinates.
- **Rejected: Framer Motion for the sheet.** CSS keyframes and ~30 lines of touch handling cover it with no new dependency.
- **Rejected: a portal for the sheet.** It would need JavaScript to render; kept inline so `/projects/<slug>` works without it.
- **Rejected: client state for project selection.** A URL is shareable, survives reload, and gets back/forward for free.
- **No "← → turn pages" hint on the desk yet.** It describes the curl (M2), so it would be false today.

### Gotchas
- **The design PNGs were rendered without the web fonts** (Times/serif fallbacks). Fraunces and JetBrains Mono are wider, so a few design positions collided. The 004 strike note moved 14px right, and the skills specimen caption is right-aligned.
- **Flex rows shrink by default.** On projects, the card grid is taller than the column, so flex quietly squeezed the page header by 5px. Page columns now use `*:shrink-0`, as the mockup's `.col > *` did.
- **The design's two rows of project cards run 28px into the footer.** The cards now sit above the page number instead of it printing over them.
- **Pinning mobile wear to the top** left the baked bottom edge-aging band across the middle of tall pages; mobile wear now stretches to the page (`100% 100%`).
- **Animations that fade can leave a dialog see-through** if caught mid-way. The sheet now only slides.
- **Scaling a figure scales its caption.** The colophon's drawing scales to the phone column; its caption sits outside the scaled box.
- **The mockups draw an erased note as text inside the wear layers**, which the bake (SVG only) skipped. It's now a live 24%-opacity `Marginalia`.
- **Correction to M1.1:** the grab-corner turn corners were never baked. They're drawn after the content column in the mockups, so the bake skipped them. M2 adds them fresh.
- **Checked in a real browser, not just screenshots:** a DevTools-protocol script covered routes, no-scroll at 1440×900, selection, keyboard reach, theme persistence, and the sheet's X/swipe/back with emulated touch (25/25).

## Phase 2 — The curl engine (2026-09-21, M2.1–M2.6 built together)

### What we built
Pages turn. On desktop:
- **Keyboard:** ← and → turn pages.
- **Mouse:** clicking or dragging a lifted corner turns the page, and the corner follows the pointer exactly.
- **Wheel and trackpad:** the turn scrubs as you scroll and snaps done or back when you stop.
- **Contents jumps:** a quick riffle of blank pages, then the target spread.
- **Browser back and forward:** replay the turn.

On mobile:
- A horizontal swipe, the lifted corner, or pulling past the bottom of a page peels to the next page.
- Swiping right or pulling past the top brings the previous page back.
- Vertical scrolling is never taken over.

With reduced motion, every turn is a 200ms crossfade and no curl frame is ever drawn.

### Key files
- `src/lib/curl/geometry.ts` (+ tests): fold line, half-plane clip, reflection `matrix()`, corner path, spine hinge, foreshortening
- `src/lib/curl/input.ts` (+ tests): timings, the snap rule, the riffle plan, the wheel state machine
- `src/components/notebook/curl/useTurn.ts`: the shared turn driver (one state, all inputs, navigation, replay)
- `src/components/notebook/curl/PageCurl.tsx`: the desktop renderer, plus corner links, drag, and hover
- `src/components/notebook/curl/MobileCurl.tsx`: the mobile renderer and gestures
- `src/components/notebook/curl/memory.ts`: what survives a route change
- `src/components/notebook/renderNotebook.tsx`: builds a route's spread and its neighbours; spreads now return content instead of a `Notebook`

### How it works
**The fold is a perpendicular bisector.** Fold paper so its corner C lands on the pointer P, and the crease is the set of points equally far from C and P. The page splits along that line:
- The part on P's side stays put, clipped with `clip-path: polygon(…)`. A Sutherland–Hodgman clip of the page rectangle against the half-plane gives the polygon.
- The part on C's side lifts and is reflected across the crease. The reflection is `I − 2nnᵀ` plus an offset: one CSS `matrix()`.

**The flap is the next page, pre-mirrored.** The back of the turning right page *is* the next spread's left page. The flap renders that page at its normal (left) position and applies `reflect(fold) ∘ mirror(spine)`. At a full turn the fold is the spine, so the two mirrors cancel and the page lands exactly where the next route will draw it. That's why finishing a turn and changing the route shows no jump. The flap's clip is the lifted region mapped into the element's own coordinates (`mirror(spine)` of it, because reflections are their own inverse). The next spread's right page lies underneath and shows through the clipped-away part.

**Neighbours are real pages, hidden.** Each route renders its previous and next spreads' pages as replicas (`aria-hidden`, `inert`, visibility-hidden until a turn needs them). Visibility-hidden still loads their textures, so the first turn never shows unloaded paper.

**One state, many inputs.** `useTurn` keeps `{ direction, progress, pointer?, blank }`, and every input writes it:
- **Keys and clicks** animate progress 0→1 (450ms, ease-in-out) along an arc that lifts the corner 55% of the page height mid-turn.
- **The wheel** runs through `wheelStep`: 600px is a full turn; scrolling against a turn reverses it, and through 0 it becomes a turn the other way.
- **A drag** sets `pointer` directly: the corner follows the pointer, held inside the spine hinge. A page can't reach further from the spine's bottom than its width, or from the spine's top than its diagonal.
- **A turn in motion** can be caught near its moving corner and dragged from there.
- **Release, or 150ms of wheel silence:** at 35% or more (or on a flick) the turn completes in 250ms, otherwise it falls back. Nothing stays half-turned.

**Routes and history.** A finished turn calls `router.push`. `memory` (module state, which lives as long as the tab) records that we caused the navigation, so the arriving spread doesn't replay it. When the route changes any other way (browser back or forward), the arriving spread sees where it came from and plays the turn in reverse from a fully turned state.

**One page per gesture.** After a turn completes, the wheel is locked, and every event during the lock extends it. The lock only ends after 350ms of genuine quiet. A fixed 350ms isn't enough: trackpad inertia can run for over a second and would turn a second page.

**Mobile.** The curl works on the part of the page that's on screen, in viewport coordinates. The flap is a fixed `paper-back` shape (the reflected polygon, so no matrix is needed) over a blank page. Going back is the same geometry in reverse: a blank "previous page" is clipped to the flat part and settles back over the current one. Gestures use passive touch listeners and `touch-action: pan-y`, so the browser keeps vertical scrolling. A turn starts only from a horizontal swipe, the lifted corner, or pulling 24px past the page's end.

**Reduced motion.** Drags follow silently (no frames), and completing a turn is a 100ms fade-out, the route change, and a 100ms fade-in. The wheel steps one page per 120px, with the same lock.

### Why this way, and what we rejected
- **Rejected: a page-flip library** (CLAUDE.md), **canvas or screenshots** (text must stay real DOM), and **CSS 3D transforms** (a real page folds along an arbitrary line, not a hinge).
- **Rejected: rendering all six spreads on every route.** Only the neighbours can appear in a single turn; riffles show blank pages and then cut, as the brief allows.
- **Rejected: letting Next's `<Link>` navigate.** A capture-phase click listener stops it first, so the turn plays and then the route changes. Links still work without JavaScript.
- **Rejected: letting React render each frame.** The renderers write `clip-path`, `transform`, and SVG attributes directly from `requestAnimationFrame`; React renders the DOM once.
- **Rest corners come from the same fold math** as the turn (`restCorner` + `foreshorten` at 60%), as CLAUDE.md requires, so grabbing one continues smoothly into a drag.

### Gotchas
- **Full-stage wrappers eat clicks.** Each page sits in an `absolute inset-0` wrapper so the fold clip can use stage coordinates. Empty boxes are still hit targets, so the right page's wrapper blocked links on the left page. The wrappers are `pointer-events: none`, with the pages inside set back to `auto`.
- **Anchors went to hidden copies.** With desktop, mobile, and replica copies of a page, `#contents` matched the first (hidden) one. IDs now live only in the mobile tree, which renders first; desktop doesn't scroll to anchors anyway.
- **A drag ends in a click.** Releasing a dragged corner fires a click on the corner link, which would start a second turn. The next click after a drag is swallowed.
- **`useLayoutEffect` for arrival.** The replay's first frame (fully turned) has to be painted before the browser shows the new route at rest, or the spread flashes before turning back.
- **Tests that pass for the wrong reason.** The DoD script's "is a flap visible" check first matched the mobile fold-line `<svg>`, which is always visible (only its line hides). The old M1.2 checks needed updating too, because pages now sit inside curl wrappers and replicas add inert copies.
- **Page weight.** The replicas roughly double each page's HTML (28–43 KB gzipped). If M3.2 needs it, render them after first paint.
