# Field Notebook — Kevin Pham's portfolio

## What this is

**A naturalist's field notebook where every career chapter is a software release.** Eleven entries (v0.1 → v1.1), a projects spread, a colophon, and a contact page — turned page by page with a custom, draggable page curl.

**The look:** an old archaeologist's working notebook, open on a dark wooden desk at night under a single warm lamp. The paper is worn: wrinkles, chips, foxing, and imperfect handwritten notes. The grid, type, and facts pages stay precise.

The site has to prove two things at once: **Kevin engineers well and designs well.** Every decision serves one of two audiences:

1. **Recruiters (30-second skim)** — facts are one click from the landing screen and always on the right-hand page.
2. **Readers (hiring managers, designers, engineers)** — the story lives on the left-hand page, plus marginalia and the colophon.

The full spec is `docs/BRIEF.md` (exported from the Claude Docs brief). The visual spec is `design/` (from Claude Design). **Read both before building any UI.** When this file and the brief disagree, this file wins; when the design and the brief disagree, ask.

## Tech stack

- **Next.js 15** (App Router, static generation) + **TypeScript**
- **Tailwind CSS v4** — all tokens as CSS variables in `globals.css`
- **MDX** for content — one file per entry and per project, typed frontmatter
- **Custom page-curl engine** — pointer events + `requestAnimationFrame`, no page-flip library
- **Framer Motion** — small UI transitions only (project card slide-in, mobile sheet); never the curl
- **Vercel** hosting + Vercel Analytics
- **pnpm**

Fonts (Google Fonts via `next/font`): Fraunces (display), Newsreader (body), JetBrains Mono (labels), Nanum Pen Script (marginalia).

## Folder structure

<!-- Replace with the real `tree -L 3 -I node_modules` output at M0.3 -->
```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # opening spread (intro + contents + resume)
│   │   ├── v/[slug]/page.tsx         # entries 001–011  (/v/0-1 … /v/1-1)
│   │   ├── projects/page.tsx         # projects spread
│   │   ├── projects/[slug]/page.tsx  # deep link, same spread with that card selected
│   │   ├── colophon/page.tsx
│   │   ├── contact/page.tsx          # contact + resume
│   │   └── globals.css               # every color, font, and spacing token
│   ├── components/notebook/          # Notebook, Page, PageCurl, FactsPanel, Project*, …
│   ├── lib/curl/                     # fold math, clip polygon, reflection matrix, input → progress
│   └── lib/content/                  # MDX loading + frontmatter types
├── content/
│   ├── entries/*.mdx
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
- Desktop flap shows the next spread's left page mirrored; mobile flap shows `paper-back`. The flap is `aria-hidden`.
- Every turn updates the route; browser back/forward replays the curl.
- `prefers-reduced-motion` → 200ms crossfade. Always.

**Layout**
- **Desktop spreads (≥ 1024px) never scroll internally** — wheel input belongs to the curl. Story pages are capped at ~180 words (18 ruled lines at 18/28). If content overflows, fix the content, not the layout.
- **Mobile never hijacks vertical scroll.** The peel starts only past the page's bottom edge, from the corner, or on a horizontal swipe.
- Body text sits on the **28px ruled-line baseline**. No text on a crease line.
- Below 1024px each spread merges into one page: facts summary card first, then story.

**Content**
- **Resume download appears on exactly two pages:** the opening spread and the contact page.
- No phone number anywhere. No LeetCode.
- Project cards have **no links or screenshots** until Kevin provides them — leave the slots empty, don't invent placeholders that look real.
- Salal (`--salal`) is never used for text under 24px — it fails contrast.

## Do NOT

- Do not install packages without asking first.
- Do not add a page-flip, carousel, or scroll-hijacking library.
- Do not write or rewrite site copy — it comes from `docs/BRIEF.md` via `content/`. Flag copy problems instead.
- Do not add features that aren't in the current milestone.
- Do not use gradients, drop shadows, or blur in UI elements. The only exceptions: the lamp's radial falloff on the desk, its faint warm cast on the paper, and one soft shadow under the notebook.
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
- ☐ **M0.3 Content pipeline** — MDX loading, typed frontmatter, all 11 entries + 3 projects stubbed from the brief. DoD: build fails on a missing required frontmatter field.

### Phase 1 — Static notebook (no curl)
- ☐ **M1.1 Page and Notebook** — ruled paper, texture overlay, edge chips, desk surface, spread layout. DoD: matches the design at 1440px and 390px.
- ☐ **M1.2 Opening spread and entries** — intro, contents, resume; story + facts pages; mobile merged pages; plain next/previous links. DoD: every route renders; every entry fits its page with no internal scroll at 1440×900.
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

## Design handoff — fill in after Claude Design returns

<!-- Everything below is a placeholder. Update it when the design is in design/. -->

- **Design source:** `design/` — _file names TBD_
- **Screens delivered:** _list them_ (expected: opening spread, version spread, projects spread, colophon, contact; each at 1440px and 390px, day and night)
- **Tokens confirmed or changed:** _note any palette, type, or spacing changes from the brief_
- **Component map:** _design component → code component_ (expected: Notebook, Page, PageCurl, EntryHeader, FactsPanel, ProjectGrid, ProjectCard, ProjectDetail, ProjectSheet, StackChip, Marginalia, Specimen, PaperEdge, RibbonBookmark, ThemeToggle, ResumeButton)
- **Deviations from the brief:** _anything the design changed, and whether Kevin approved it_
- **Assets to produce:** _specimen SVGs, crease textures, edge-chip masks_

## Reference docs

- `docs/BRIEF.md` — the full spec: concept, IA, tokens, type, curl behavior, screens, and all site copy.
- `design/` — the visual spec from Claude Design.
- `docs/LEARNING-LOG.md` — why the code is the way it is.
- `docs/TERMINAL-LOG.md` — command reference.

## Current status

**Phase: Design.** The brief is complete; waiting on Claude Design for the wireframes and visual spec.

**Next up: fill in "Design handoff" above, then M0.1 — Scaffold.**
