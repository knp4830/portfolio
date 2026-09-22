# Field Notebook — Kevin Pham's portfolio

## What this is

**A naturalist's field notebook where every career chapter is a software release.** Six two-page spreads, twelve pages: an opening with the contents, a two-page timeline of eleven releases (v0.1 → v1.1), skills, projects, a colophon, and contact — turned with a custom, draggable page curl.

**The look:** an old archaeologist's leather-bound working notebook, found open on a dark wooden cabin table at night under a single warm lamp — map, tin mug, pencil, compass around it. The paper is worn: wrinkles, chips, foxing, a coffee ring or tear here and there, and imperfect handwritten notes. The grid, type, and facts pages stay precise.

The site has to prove two things at once: **Kevin engineers well and designs well.** Every decision serves one of two audiences:

1. **Recruiters (30-second skim)** — every section is one click from the contents page; the whole career fits on the timeline spread.
2. **Readers (hiring managers, designers, engineers)** — project detail pages, marginalia, and the colophon.

The full spec is `docs/BRIEF.md` (exported from the Claude Docs brief). The visual spec is `design/` (from Claude Design). **Read both before building any UI.** When this file and the brief disagree, this file wins; when the design and the brief disagree, ask.

## Tech stack

- **Next.js 15** (App Router, static generation) + **TypeScript**
- **Tailwind CSS v4** — all tokens as CSS variables in `globals.css`
- **MDX** for content — one file per entry and per project, typed frontmatter
- **Custom page-curl engine** — pointer events + `requestAnimationFrame`, no page-flip library
- **Framer Motion** — small UI transitions only (project card slide-in, mobile sheet); never the curl
- **Vercel** hosting + Vercel Analytics
- **pnpm**

Fonts (Google Fonts via `next/font`): Fraunces (display), Newsreader (body), JetBrains Mono (labels), Special Elite (facts values + chapter line, set at 0.88×; Patrick Hand fallback), Nanum Pen Script (marginalia).

## Folder structure

<!-- Replace with the real `tree -L 3 -I node_modules` output at M0.3 -->
```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # html/body, fonts, theme script
│   │   ├── (notebook)/layout.tsx     # the notebook, built once and kept mounted across routes
│   │   ├── (notebook)/page.tsx       # opening (pp. 1–2); every route renders only a RouteMarker
│   │   ├── timeline/page.tsx         # pp. 3–4, entries 001–011 anchored #v0-1 … #v1-1
│   │   ├── skills/page.tsx           # pp. 5–6
│   │   ├── projects/page.tsx         # projects spread
│   │   ├── projects/[slug]/page.tsx  # deep link, same spread with that card selected
│   │   ├── contact/page.tsx          # pp. 9–10, back cover + contact + resume
│   │   ├── colophon/page.tsx         # pp. 11–12, the last spread
│   │   └── globals.css               # every color, font, and spacing token
│   ├── components/notebook/          # Notebook, Page, MobilePage, chrome, primitives (Marginalia, HandMark, …)
│   │   ├── spreads/                  # one builder per spread: left, right, and mobile content
│   │   ├── curl/                     # the page-curl engine: useTurn (shared state), PageCurl, MobileCurl
│   │   └── art/                      # specimens, icons, one-off marks (converted from design/html)
│   ├── lib/curl/                     # fold math (geometry.ts), timing + input rules (input.ts), with tests
│   ├── lib/notebook/                 # spread order, routes, page ranges, previous/next
│   ├── lib/paper/                    # generated page geometry (pages.ts) + responsive clip
│   └── lib/content/                  # MDX loading + frontmatter types
├── content/
│   ├── site.mdx                     # chrome copy + contents entries
│   ├── pages/*.mdx                  # each spread's own copy (labels, headings, notes)
│   ├── timeline/*.mdx               # one per entry, frontmatter only
│   ├── skills.mdx
│   └── projects/*.mdx
├── public/
│   ├── resume.pdf
│   └── textures/                     # baked paper wear, desk, cover (AVIF; `pnpm bake:paper`)
├── design/                           # Claude Design output — the visual spec
└── docs/                             # BRIEF, BUILD-PLAN, LEARNING-LOG, TERMINAL-LOG
```

## Conventions

- **Server Components by default.** `"use client"` only for the curl, theme toggle, project selection, and mobile sheet — pushed as far down the tree as possible.
- **All colors come from CSS variables in `globals.css`. No raw hex anywhere else.**
- **All copy lives in `content/`.** Never hardcode story text, facts, or project details in components.
- Named exports only (except Next.js pages/layouts). Components `PascalCase`, functions and files `camelCase`.
- Every entry and project route is statically generated; no runtime data fetching.
- Theme: `prefers-color-scheme` first; the toggle overrides and persists in `localStorage` (the only allowed use of browser storage).

## Rules that are easy to get wrong

**The curl**
- **One shared turn progress (0 → 1) is the single source of truth.** Wheel, trackpad, drag, keys, and clicks all write to it. Never let two inputs animate independently.
- A half-finished turn **never sticks**: 150ms after input stops, ≥ 35% (or a fast flick) completes; below that it falls back.
- **One page per gesture:** after a turn completes, ignore wheel input until it has been quiet for 350ms (each ignored event restarts the wait, so a long trackpad inertia tail is swallowed whole).
- The curl is built on the **real DOM** — `clip-path` polygon on the fold line, flap reflected with one `matrix()`. No canvas, no screenshots: text must stay selectable and indexable.
- Fold line = perpendicular bisector of the corner's rest point C and the pointer P (not of P and its mirror Q — that's the spine).
- Desktop flap shows the next spread's left page mirrored; mobile flap shows `paper-back`. The flap is `aria-hidden`.
- Every turn updates the route; browser back/forward replays the curl.
- `prefers-reduced-motion` → 200ms crossfade. Always.

**Layout**
- **Desktop spreads (≥ 1024px) never scroll internally** — wheel input belongs to the curl. The timeline fits 11 entries at 4 ruled lines each: descriptions ≤ 125 characters (two lines at 15/28 even at the deepest indent), 001–005 left, 006–011 right. Entries indent in a wave (0/19/49/49/19px); the trail never crosses the spine. If content overflows, fix the content, not the layout.
- **Mobile never hijacks vertical scroll.** The peel starts only past the page's bottom edge, from the corner, or on a horizontal swipe.
- Body text sits on the **28px ruled-line baseline**. No text on a crease line.
- Mobile shows one page at a time inside an **8px leather strip** on the top, right, and bottom edges (spine side open).
- Below 1024px each spread merges into one page (timeline: one list; skills: groups, then the foundations card).

**Content**
- **Resume download appears on exactly two pages:** the opening spread and the contact page.
- **The notebook is exactly 12 pages** — 1–2 opening, 3–4 timeline, 5–6 skills, 7–8 projects, 9–10 contact, 11–12 colophon (Kevin moved the colophon last, Sep 21). The order lives in `src/lib/notebook/spreads.ts`; page numbers, contents ranges, and previous/next all derive from it.
- **Contents:** five sections with page ranges. Hover and keyboard focus turn the title huckleberry with a highlighter swash, tint the leader and range, and show "jump →"; click riffles straight to the section and updates the route.
- No phone number anywhere. No LeetCode.
- Project cards have **no links or screenshots** until Kevin provides them — leave the slots empty, don't invent placeholders that look real.
- Salal (`--salal`) is never used for text under 24px — it fails contrast.
- Huckleberry is 1.9:1 on the day desk: text and focus rings **on the desk** use `--desk-ink`.
- Facts values use Special Elite at 0.88×; labels stay JetBrains Mono in huckleberry. Project detail paragraphs stay Newsreader.
- `--moss` (#3A5340 day / #9CBA9F night) is for skill chips only; contact links are `--ink` with an `--ink-soft` underline. Huckleberry stays the accent everywhere else, including the contents numbers.
- Specimens are salal line work, except the skills-page beaver in `--walnut` (front-facing, upright, U-shaped paddle tail joined to the body).

**Paper**
- **One paper tone on every page.** No per-page tint; left and right pages never differ in overall colour. Wear levels change crumple and edge damage only.
- **Edge chips on the top, bottom, and outer edges** (spine edge clean): a few larger chips plus many tiny ones, more at heavier wear. The page block underneath is an aged tone, so chips read as dark nicks.
- Discolouration is local: foxing near edges, at most one coffee ring per spread, 1–2 tears in the whole notebook (top edge or mid outer edge, never a corner, never into text).
- **Every turnable page shows a lifted turn corner** at its grab corner (bottom-right on right pages, bottom-left on left pages): 34px, flap in `paper-back` at 60% of a flat fold, slight curl, 1px fold line; +16px on hover. It's the curl engine's rest state, so it must share the fold math and clip mask. Not on the first or last page; the contents page keeps its dog-ear. Decorative corner folds go at the top corners only.

## Do NOT

- Do not install packages without asking first.
- Do not add a page-flip, carousel, or scroll-hijacking library.
- Do not write or rewrite site copy — it comes from `docs/BRIEF.md` via `content/`. Flag copy problems instead.
- Do not add features that aren't in the current milestone.
- Do not use gradients, drop shadows, or blur in UI elements. The only exceptions: the lamp's radial falloff on the desk, its faint warm cast on the paper, and one soft shadow under the notebook (on the leather cover). Blur is allowed only inside baked paper textures (edge aging, smudges).
- Do not make the paper or handwriting clean and uniform. Wear varies page to page, and notes are deliberately imperfect (see the brief's "Paper details" and "Handwriting and note areas").

## Working agreement

- Work **one milestone at a time** from the roadmap below. One milestone = one branch = one PR.
- When I ask you to explain code, explain the concept, not just the syntax.
- Add new terminal or git commands to `docs/TERMINAL-LOG.md`, including failures.

### Closing out a milestone

A milestone is done when its **Definition of Done is observably true**, not when the code is written.

When the DoD is met, without being asked:
1. Check its box in the roadmap below (`☐` → `☑`). Never delete a checked box.
2. Append a `docs/LEARNING-LOG.md` entry: what we built, key files, how it works, why this way and what we rejected, gotchas.
3. Update **Current status** at the bottom of this file.
4. Give me the PR body, including `Closes #<issue>`.

Then stop. I review and merge.

If the DoD can't be met, don't check the box. Say what's blocking, what you tried, and what decision you need.

## Roadmap

### Phase 0 — Foundations
- ☑ **M0.1 Scaffold** — Next.js 15 + TS + Tailwind v4 + pnpm, deployed to Vercel. DoD: preview URL loads; lint and typecheck pass in CI.
- ☑ **M0.2 Tokens and type** — palette (day + night), fonts, type scale, 28px baseline in `globals.css`. DoD: a token test page renders every token in both themes; contrast checks pass.
- ☑ **M0.3 Content pipeline** — MDX loading, typed frontmatter, 11 timeline entries, skills, and 3 projects stubbed from the brief. DoD: build fails on a missing required frontmatter field.

### Phase 1 — Static notebook (no curl)
- ☑ **M1.1 Page and Notebook** — ruled paper, texture overlay, edge chips, desk surface, spread layout. DoD: matches the design at 1440px and 390px.
- ☑ **M1.2 Pages and chrome** (was M1.2–M1.4, combined by Kevin Sep 21) — opening (intro, contents with page ranges + hover, resume), two-page timeline, skills spread, projects spread (card grid, detail page, selection via URL, mobile sheet), colophon, contact; ribbon bookmark, theme toggle, specimens; mobile merged pages; plain next/previous links. DoD: every route renders; the timeline and skills spreads fit with no internal scroll at 1440×900; `/projects/minced` opens with Minced selected; the sheet closes with X, swipe down, and back; keyboard-only navigation reaches everything.

### Phase 2 — The curl engine (built together as one PR, Kevin Sep 21)
- ☑ **M2.1 Fold math** — pure functions for fold line, clip polygon, reflection matrix, with unit tests. DoD: tests cover corner, mid-turn, and fully turned states.
- ☑ **M2.2 Auto-curl** — click, key, and tap turn pages at 450ms. DoD: arrow keys turn every page; route updates.
- ☑ **M2.3 Drag and snap** — corner drag, 35% threshold, spring back, hover lift. DoD: releasing at 30% falls back; at 40% completes.
- ☑ **M2.4 Scroll to turn** — wheel scrub, idle snap, inertia lockout. DoD: one trackpad flick turns exactly one page.
- ☑ **M2.5 Mobile peel and riffle** — bottom-edge peel, swipe back, contents riffle. DoD: vertical scroll inside a page never triggers a turn.
- ☑ **M2.6 Reduced motion** — crossfade fallback. DoD: with reduced motion on, no curl frames render.

### Phase 3 — Launch
- ☐ **M3.1 Accessibility pass** — landmarks, focus rings, screen-reader labels, no-JS fallback. DoD: axe reports zero violations; VoiceOver reads every entry in order.
- ☐ **M3.2 Performance and SEO** — lazy-load the curl, subset fonts, OG images, sitemap. DoD: Lighthouse 95+ in all four categories on mobile.
- ☐ **M3.3 Ship** — production deploy. DoD: live URL shared; domain decision revisited.

## Design handoff

- **Design source:** `design/` — Claude Design canvas "Field Notebook Portfolio" (rev 8, Sep 21 2026). Exported to `design/` (Sep 21): `screens/` PNGs, `html/` static renders, `source/` originals, `tokens.css`; start at `design/README.md`.
- **Screens delivered:** opening + contents (pp. 1–2), timeline (3–4), skills (5–6), projects + mobile sheet (7–8), colophon (9–10), contact (11–12) — each at 1440 and 390, day and night; a 1920 cabin-table scene (day + night); mid-curl frame; States board (wear levels, note area, dog-ear and lifted turn corner at rest/hover, contents hover, focus rings, empty slots); token sheet; component list; font options board.
- **Tokens confirmed or changed:** brief palette unchanged. Added: `moss`, `walnut`, `leather`, `leather-dark`, `leather-wear`, `stitch`, `paper-fold`, `desk-ink`, `desk-ink-soft`, `foxing`, `edge-age`, `coffee`, `fiber`, `tape`, `cast` (values in `docs/BRIEF.md` → Color). Texture opacity 9 / 10 / 12% day, 7 / 8 / 9% night. Per-page warm tint dropped. New type role: Special Elite 16/28 (0.88×) for facts values and the chapter line.
- **Component map:** Notebook, Page, PageCurl, EntryHeader, Contents, Timeline, TimelineEntry, SkillGroup, FactsPanel, ProjectGrid, ProjectCard, ProjectDetail, ProjectSheet, StackChip, Marginalia, HandMark, NoteArea, IndexCard, FieldMark, TapedPhoto, Specimen, PaperEdge, RibbonBookmark, ThemeToggle, ResumeButton, LeatherCover, DeskProps.
- **Deviations from the brief (all approved and now in the brief):** leather hardcover + table props; Special Elite facts values; lifted turn corners; one paper tone; corrected fold math; rev 6 restructure to six spreads (timeline + skills replace the eleven entry spreads; per-entry specimens retired); timeline descriptions 15/28, not the token sheet's 16/28 (Kevin, Sep 21).
- **Assets to produce:** 14 specimen SVGs; 6 crease-map AVIFs with edge aging baked in; leather grain texture; walnut desk texture; table-prop SVGs (map, mug, pencil, compass, magnifier, fir sprig, tie cord); edge-chip / tear masks.

## Reference docs

- `docs/BRIEF.md` — the full spec: concept, IA, tokens, type, curl behavior, screens, and all site copy.
- `design/` — the visual spec from Claude Design; start at `design/README.md` (screen index, how to use PNGs vs HTML, what production does differently).
- `docs/LEARNING-LOG.md` — why the code is the way it is.
- `docs/TERMINAL-LOG.md` — command reference.

## Current status

**Phase: Design → build.** Design rev 8 (six spreads, twelve pages) is delivered and the handoff above is filled in. Design is settled (rev 8); the build history is in the "Field Notebook — how it was built" doc. Waiting on Kevin to confirm the 11 timeline descriptions and the skills lists (drafts in `docs/BRIEF.md`); body stays Newsreader.

**M0.1 done** (PR #1). Next.js 15 scaffold, CI, and the Vercel project `minced/portfolio` deploying every push (previews sit behind Vercel login).

**M0.2 done** (branch `m0.2-tokens`). Every token lives in `globals.css` (day, night, system preference). Fonts load via `src/app/fonts.ts`. Type roles are `type-*` utilities; `/tokens` shows everything in both themes, and `pnpm test` runs 34 contrast/token checks in CI. Decided: timeline descriptions are 15/28 (Kevin, Sep 21: the extra room is wanted); headings keep the design's 1.15 leading inside a fixed two-line (56px) box, text bottom-aligned, so the page stays on the 28px grid; card copy stays 15/22 as designed.

**M0.3 done** (branch `m0.3-content`). Content lives in `content/` (11 timeline entries, skills, 3 projects, stubbed verbatim from the brief). `src/lib/content/` loads it with next-mdx-remote and validates it with zod; `pnpm build` runs `content:check` first, so a missing or misspelled field fails the build. Content decisions (Kevin, Sep 21 — these override the brief):
- Missing copy says **"To be added"**: World Map Photo Album's Rejected idea and second stack item (was "TBD"). PolyPaper has no Rejected idea. Required detail parts: Problem, Role, Key decisions, Result.
- Minced: "What sets it apart" is left out of the detail page (it isn't in the design); the stack says "Supabase" (Kevin will revisit Minced's copy once the app is further along).
- Skills → Design & tools is just "UI design"; "prototyping" and the design-tools placeholder are out.
- Straight apostrophes (ReuMo's), and status reads "Shipped (team of 5)".
- Each project card keeps its screenshot slot as a **blank square** until Kevin adds pictures (no fake image).
- Still waiting on Kevin to confirm the timeline descriptions and skills lists.

**M1.1 done** (branch `m1.1-notebook`). The empty notebook matches the design at 1440 and 390, day and night: desk + props, lamp, leather cover, page block, torn edges (live clip-path), ruled lines, baked wear per page, gutter, page numbers; one page in a leather strip below 1024px. Wear, desk, and cover are baked from `design/html` by `pnpm bake:paper` (see LEARNING-LOG). (Correction: the grab-corner turn corners were never baked; M2 draws them.)

**M1.2 done** (branch `m1.2-pages`, combined M1.2–M1.4). All six spreads, desktop and mobile, day and night, with content from `content/` (site chrome in `site.mdx`, per-spread copy in `pages/*.mdx`). Contact is now pp. 9–10 and keeps its back-cover wording; the colophon is last (pp. 11–12); each keeps its own baked wear. Projects selection is the URL; on mobile `/projects/<slug>` opens a sheet (X, swipe down, back). Theme toggle persists in localStorage with no flash. Verified in headless Chrome: 25/25 DoD checks. Open items for Kevin:
- **`public/resume.pdf` doesn't exist yet**, so both resume buttons 404 until it's added (the brief also lists resume updates).
- **Colophon copy is stale** (from the design): "Every version is one MDX file: the facts page renders from its frontmatter, the story from its body" describes the retired per-entry pages, and the Type row omits Special Elite. Flagged, not rewritten.
- Project card lines (`cardLine`) and lineage version tags (v0.1, v0.2, v1.0) come from the design; confirm.
- The design's two rows of project cards run into the p. 07 footer; the cards now sit over the page number.
- The mobile project sheet stops 8px short of the right edge (it's clipped with the page's torn edge).

**Phase 2 done** (branch `m2-curl`, M2.1–M2.6 in one PR). Pages turn with a custom curl on the real DOM: keys, clicks, corner drag, wheel/trackpad scrub with idle snap and inertia lock, contents riffle, browser back/forward replay; mobile peel from swipes, the corner, and pulls past the page ends; reduced motion crossfades. Each route renders its neighbours' pages as inert replicas for the flap and the page beneath. Verified in headless Chrome: 22/22 Phase 2 checks, 25/25 M1.2 checks still pass; 72 unit tests. Notes for Kevin:
- The flap rises above the page edge mid-turn (the corner arcs 55% of the page height, per the brief), unlike the design's static mid-curl frame, which keeps it inside.
- Riffles show blank pages between spreads, then cut to the target (the pages in between aren't rendered).
- The neighbour replicas roughly double page HTML (28–43 KB gzipped); M3.2 can defer them if Lighthouse wants.
- `public/resume.pdf` is still missing (from M1.2).

**Polish after local testing** (branch `polish-curl`): seamless handoff at the end of a turn (landed frame painted before the route swaps), the ribbon pulls up while a page turns, project detail titles fit one line and parts get breathing room when there's space, "turn the page →" sits bottom-right of p. 10, contact wording updated (Kevin: "Product engineering · Design engineering", "Based in Seattle · Open to many locations").

**The notebook stays mounted** (branch `persistent-notebook`): the notebook lives in the `(notebook)` layout and is built once; routes render only a `RouteMarker`, and CSS (`body:has([data-route~=…])`) shows the right spread, project, and sheet. A turn only reassigns page roles, so the landed page is the element already on screen: no rebuild, no flash. The project slide-in plays only when switching projects. Cost: each page's HTML carries the whole notebook (107 KB gzipped), a target for M3.2.

**Four fixes** (branch `four-fixes`): the spine line, lamp cast, and ribbon paint over the pages again (the curl is `isolate`); contents jumps riffle the real spreads back to back (220ms each, one route change at the end); p. 8 shows Minced by default, so it's there while you turn to it; all pages stay painted and stacked, so an arrow turn only reveals pages the browser has already drawn. Verified: 9/9 targeted, 22/22, 25/25, 8/8 checks; 72 unit tests.

**Deploy check** (Sep 22): every merge to `main` deploys to production, but production is behind Vercel Authentication too (`portfolio-minced.vercel.app` → login). Kevin to switch Deployment Protection to previews only. `public/resume.pdf` still missing.

**Fanned riffle** (branch `fanned-riffle`): contents jumps turn every page in between at once, each 18ms behind the one in front (`riffleLeaves`, one shared progress), so the edges of the pages behind show and they land stacked; "turn the page →" moved from p. 10 to p. 02 (Kevin, Sep 22); the frond scale and note moved toward the spine, clear of the leaves; switching projects fades the new detail in (180ms, opacity only) instead of sliding. Verified: 9/9, 22/22, 25/25, 8/8; 73 unit tests.

**Wheel, desk contents, corner hints** (same branch): the curl swallows wheel events (non-passive listener + `overscroll-behavior-y: none`), so the page never rubber-bands; `SCROLL_PER_TURN` 600 → 420; a row of section links (Contents · Timeline · Skills · Projects · Contact, words not boxes) sits on the desk beside the day/night switch, so any spread can jump to any section; "drag to turn →" (p. 2, ink) and "← drag back" (p. 3) name the gesture. Kevin's new p. 9 line: "I'm in Seattle for now, and I'd love to travel anywhere for work." Verified: 9/9 new, 9/9, 22/22, 25/25, 8/8; 73 unit tests.

**Flagged, not changed:** the colophon's fold diagram still says "600px of scroll = 1 turn" — now 420. Needs Kevin's word.

**Next up: M3.1 — Accessibility pass.**
