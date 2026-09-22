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
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # opening spread (intro + contents + resume)
│   │   ├── timeline/page.tsx         # pp. 3–4, entries 001–011 anchored #v0-1 … #v1-1
│   │   ├── skills/page.tsx           # pp. 5–6
│   │   ├── projects/page.tsx         # projects spread
│   │   ├── projects/[slug]/page.tsx  # deep link, same spread with that card selected
│   │   ├── colophon/page.tsx
│   │   ├── contact/page.tsx          # contact + resume
│   │   └── globals.css               # every color, font, and spacing token
│   ├── components/notebook/          # Notebook, Page, PageCurl, FactsPanel, Project*, …
│   ├── lib/curl/                     # fold math, clip polygon, reflection matrix, input → progress
│   └── lib/content/                  # MDX loading + frontmatter types
├── content/
│   ├── timeline/*.mdx               # one per entry, frontmatter only
│   ├── skills.mdx
│   └── projects/*.mdx
├── public/
│   ├── resume.pdf
│   ├── textures/                     # 4 crease maps (AVIF)
│   └── specimens/                    # PNW line drawings (SVG)
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
- **One page per gesture:** ignore wheel input for 350ms after a turn completes (swallows trackpad inertia).
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
- **The notebook is exactly 12 pages** — 1–2 opening, 3–4 timeline, 5–6 skills, 7–8 projects, 9–10 colophon, 11–12 contact. Page numbers in footers and the contents page ranges must match.
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
- ☐ **M0.1 Scaffold** — Next.js 15 + TS + Tailwind v4 + pnpm, deployed to Vercel. DoD: preview URL loads; lint and typecheck pass in CI.
- ☐ **M0.2 Tokens and type** — palette (day + night), fonts, type scale, 28px baseline in `globals.css`. DoD: a token test page renders every token in both themes; contrast checks pass.
- ☐ **M0.3 Content pipeline** — MDX loading, typed frontmatter, 11 timeline entries, skills, and 3 projects stubbed from the brief. DoD: build fails on a missing required frontmatter field.

### Phase 1 — Static notebook (no curl)
- ☐ **M1.1 Page and Notebook** — ruled paper, texture overlay, edge chips, desk surface, spread layout. DoD: matches the design at 1440px and 390px.
- ☐ **M1.2 Opening, timeline, skills** — intro, contents (page ranges + hover), resume; two-page timeline roadmap; skills spread; mobile merged pages; plain next/previous links. DoD: every route renders; the timeline and skills spreads fit with no internal scroll at 1440×900.
- ☐ **M1.3 Projects spread** — card grid, detail page, selection via URL, mobile sheet. DoD: `/projects/minced` opens with Minced selected; the sheet closes with X, swipe down, and back.
- ☐ **M1.4 Colophon, contact, chrome** — ribbon bookmark, theme toggle, specimens. DoD: keyboard-only navigation reaches everything.

### Phase 2 — The curl engine
- ☐ **M2.1 Fold math** — pure functions for fold line, clip polygon, reflection matrix, with unit tests. DoD: tests cover corner, mid-turn, and fully turned states.
- ☐ **M2.2 Auto-curl** — click, key, and tap turn pages at 450ms. DoD: arrow keys turn every page; route updates.
- ☐ **M2.3 Drag and snap** — corner drag, 35% threshold, spring back, hover lift. DoD: releasing at 30% falls back; at 40% completes.
- ☐ **M2.4 Scroll to turn** — wheel scrub, idle snap, inertia lockout. DoD: one trackpad flick turns exactly one page.
- ☐ **M2.5 Mobile peel and riffle** — bottom-edge peel, swipe back, contents riffle. DoD: vertical scroll inside a page never triggers a turn.
- ☐ **M2.6 Reduced motion** — crossfade fallback. DoD: with reduced motion on, no curl frames render.

### Phase 3 — Launch
- ☐ **M3.1 Accessibility pass** — landmarks, focus rings, screen-reader labels, no-JS fallback. DoD: axe reports zero violations; VoiceOver reads every entry in order.
- ☐ **M3.2 Performance and SEO** — lazy-load the curl, subset fonts, OG images, sitemap. DoD: Lighthouse 95+ in all four categories on mobile.
- ☐ **M3.3 Ship** — production deploy. DoD: live URL shared; domain decision revisited.

## Design handoff

- **Design source:** `design/` — Claude Design canvas "Field Notebook Portfolio" (rev 8, Sep 21 2026). Exported to `design/` (Sep 21): `screens/` PNGs, `html/` static renders, `source/` originals, `tokens.css`; start at `design/README.md`.
- **Screens delivered:** opening + contents (pp. 1–2), timeline (3–4), skills (5–6), projects + mobile sheet (7–8), colophon (9–10), contact (11–12) — each at 1440 and 390, day and night; a 1920 cabin-table scene (day + night); mid-curl frame; States board (wear levels, note area, dog-ear and lifted turn corner at rest/hover, contents hover, focus rings, empty slots); token sheet; component list; font options board.
- **Tokens confirmed or changed:** brief palette unchanged. Added: `moss`, `walnut`, `leather`, `leather-dark`, `leather-wear`, `stitch`, `paper-fold`, `desk-ink`, `desk-ink-soft`, `foxing`, `edge-age`, `coffee`, `fiber`, `tape`, `cast` (values in `docs/BRIEF.md` → Color). Texture opacity 9 / 10 / 12% day, 7 / 8 / 9% night. Per-page warm tint dropped. New type role: Special Elite 16/28 (0.88×) for facts values and the chapter line.
- **Component map:** Notebook, Page, PageCurl, EntryHeader, Contents, Timeline, TimelineEntry, SkillGroup, FactsPanel, ProjectGrid, ProjectCard, ProjectDetail, ProjectSheet, StackChip, Marginalia, HandMark, NoteArea, IndexCard, FieldMark, TapedPhoto, Specimen, PaperEdge, RibbonBookmark, ThemeToggle, ResumeButton, LeatherCover, DeskProps.
- **Deviations from the brief (all approved and now in the brief):** leather hardcover + table props; Special Elite facts values; lifted turn corners; one paper tone; corrected fold math; rev 6 restructure to six spreads (timeline + skills replace the eleven entry spreads; per-entry specimens retired).
- **Assets to produce:** 14 specimen SVGs; 6 crease-map AVIFs with edge aging baked in; leather grain texture; walnut desk texture; table-prop SVGs (map, mug, pencil, compass, magnifier, fir sprig, tie cord); edge-chip / tear masks.

## Reference docs

- `docs/BRIEF.md` — the full spec: concept, IA, tokens, type, curl behavior, screens, and all site copy.
- `design/` — the visual spec from Claude Design; start at `design/README.md` (screen index, how to use PNGs vs HTML, what production does differently).
- `docs/LEARNING-LOG.md` — why the code is the way it is.
- `docs/TERMINAL-LOG.md` — command reference.

## Current status

**Phase: Design → build.** Design rev 8 (six spreads, twelve pages) is delivered and the handoff above is filled in. Design is settled (rev 8); the build history is in the "Field Notebook — how it was built" doc. Waiting on Kevin to confirm the 11 timeline descriptions and the skills lists (drafts in `docs/BRIEF.md`); body stays Newsreader.

**M0.1 in progress** on branch `m0.1-scaffold`. Scaffolded with `create-next-app@15` (TS, Tailwind v4, ESLint, App Router, `src/`, pnpm). Design export committed. CI (`.github/workflows/ci.yml`) runs `pnpm lint` + `pnpm typecheck` on every push to main and every PR; verified in a clean clone. Still to do for the DoD: import the repo into Vercel (the connector's project creation didn't stick) and confirm the PR's preview URL loads and CI is green.
