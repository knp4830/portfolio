# Portfolio build brief — Field Notebook

Kevin Pham · September 2026 · rev 8 (six spreads; wave trail, moss chips, ink contact links, beaver — Sep 21)

## Overview

Kevin Pham's personal portfolio is a naturalist's field notebook: six two-page spreads (twelve pages) turned with a draggable page curl — who he is, a two-page timeline of his career as numbered versions, skills, projects, how the notebook was built, and how to reach him. It has to prove two things at once: that he engineers well and that he designs well.

| Audience | What they need | Where they get it |
| --- | --- | --- |
| Recruiters (30-second skim) | Role, dates, stack, outcomes, resume | Table of contents and resume on the first screen; the whole timeline on one spread; skills one turn later |
| Hiring managers and designers | Process, taste, decision-making | Timeline, project detail pages, marginalia, colophon |
| Engineers | Craft and code quality | The custom page-curl engine, performance, accessibility |

**Success criteria**

- Every section reachable in one click from the contents page; the whole career readable on one spread
- Resume downloadable from two places only: the opening spread and the contact page
- Lighthouse 95+ on performance and accessibility
- Visitors remember the notebook, not a template

## Concept

The site is a field notebook whose entries are software releases: each career chapter is a version (v0.1, v0.4, v1.0 …), logged the way a naturalist logs observations.

| Element | Decision |
| --- | --- |
| Narrative | **Versions** — career as a changelog; each chapter is a release on a two-page roadmap, with a two-sentence "what changed" |
| Metaphor | **Field Notebook** — naturalist journal: ruled paper, entry numbers, specimen-style labels, pressed-leaf illustrations |
| Tone | Warm and human; an archaeologist's leather-bound working notebook, found on a cabin table and read by lamplight at night — worn, handled, imperfect, but always legible |
| Handwriting | Imperfect fine-pen notes: 2–4 per spread plus one note area (see Handwriting and note areas) |
| Illustration | Pacific Northwest specimen line drawings in salal, one per spread (see Specimens) |
| Voice | First person, plain, specific; entries read like honest observations ("First production release. Users never read the docs.") |

The reference is an old archaeologist's field notebook: a leather hardcover carried for years, written in on-site, a little battered — the feeling of discovering someone's journal left on a table in a cabin. Pages are not uniformly clean — some are more worn than others. The tension that makes it work: that wear sits on top of a rigorous grid and versioned structure, so it always reads as intentional. The type, spacing, and facts pages stay precise; the paper and the handwriting carry the age.

### Paper details

The paper should look genuinely used. Wear should be visible at a glance, not something you have to lean in to notice — and it varies page to page, so no two spreads look alike.

| Detail | Where | How it's built |
| --- | --- | --- |
| Paper tone | Every page | One base tone for every page; left and right pages never differ in overall colour. Discolouration lives only in local marks (coffee rings, foxing) |
| Wrinkles | Every page, varied in strength | Crease texture (AVIF), multiply blend at 9–12% on day (light / medium / heavy), 7–9% screen blend on night; 6 crease maps rotated so no two adjacent pages match; a few pages noticeably more crumpled than others |
| Crease folds | Several pages | Visible fold lines where a page was folded in half or dog-eared and flattened again |
| Aging | Every page | Faint foxing spots (mostly near the edges) and slightly darker page edges, the same strength on every page |
| Coffee stains | Occasional, 1 per spread at most | Natural spills in `coffee`, not drawn rings: an irregular faded pool (≈ 8%), a soft blurred tide line (≈ 14%), a spill tongue and a few droplets; partly off the page or in margins |
| Tears | 1–2 pages in the notebook | A short natural tear (25–40px) running in from the top edge (near the spine works) or the middle of an outer edge — never a corner, never into text; exposed `fiber` along the tear |
| Turn corner | Every turnable page | The grab corner is already slightly lifted, as if someone has started to turn it — bottom-right on right pages, bottom-left on left pages. 34px fold, flap in `paper-back` foreshortened to 60% of a flat fold with a slight curl, 1px fold line; lifts a further 16px on hover. Not on the first or last page; the contents page keeps its dog-ear instead |
| Edge chips | Outer edge: 2–5 larger chips (3.5–7.5px deep) plus 3–8 tiny ones (2–5px); top and bottom edges: 2–5 tiny chips each; the spine edge stays clean. Never at a tear or corner | A mix of rounded bites, jagged notches, shallow flakes and the occasional V cut; worn corners and a slightly frayed bottom edge via SVG `clip-path`; varied per page. The page block under each page is an aged tone (`paper-back` mixed with `edge-age`), so chips read as darker nicks |
| Dog-ear | Table of contents, bottom-right | Folded corner that peels on hover |
| Field marks | Scattered, 1–2 per spread | Pencil smudges, a faint erased note still visible, a small ink blot, a tape strip holding something in |
| Strike-through | Timeline, entry 004 | "Public health" crossed out in pen with "CS + Econ" written above it, beside the 004 title |
| Scissor cut | Tipped-in items (tickets, photos) | Straight notch cuts where an item is tucked into the page |

Rules: no text ever sits on a crease line; wear never drops body text below 4.5:1 contrast; cuts and tears combine with the curl clip through one SVG mask; decorative corner folds stay at the top corners so bottom corners only ever signal "turn".

### Handwriting and note areas

The handwriting should look like a real person wrote it in the field — quickly, not perfectly.

- **Imperfect by design:** each note gets its own slight rotation (−4° to 3°), a wavering baseline, and uneven letter spacing; no two notes sit at the same angle
- **Hand-drawn marks:** rough underlines, circled words, arrows pointing at the printed text, brackets, a crossed-out word or two — drawn as slightly wobbly SVG strokes, never perfect geometry
- **Note areas:** notes live in page margins and the gaps between timeline entries; some spreads also have a tipped-in index card, a small sketch with a measurement label, or a sticky-note-style scrap holding a longer note
- **Density:** 2–4 notes per spread; timeline descriptions and facts values stay clean so recruiters can scan them
- **Ink:** huckleberry for most notes; the occasional note in graphite pencil (`ink-soft`), as if written on a different day

### Specimens

One Pacific Northwest specimen per spread, drawn as fine line work in salal.

| Spread | Specimen | Why |
| --- | --- | --- |
| Opening | Sword fern | The most common PNW understory plant — the ground everything starts from |
| Timeline | — | The dashed trail is the illustration |
| Skills | North American beaver, front-facing and upright, paws clasped at the chest, paddle tail hanging from the body in a U (drawn in `walnut`, the one non-salal specimen) | The builder |
| Projects | Licorice fern | Grows on other trees — things built on things |
| Colophon | Fig. 1, the fold sketch | The engine is the specimen |
| Contact | Banana slug | The easter egg — slow, friendly, unmistakably PNW |

The per-entry specimens from earlier drafts (hemlock, yew, moss, vine maple, thimbleberry, madrone, salal, fir cone, cedar, rhododendron, huckleberry) are retired; they can return later as tiny icons beside timeline nodes.

## Information architecture

The notebook is **six spreads, twelve pages**. Desktop (1024px and up) shows two-page spreads, one flip per section; below 1024px each spread merges into one scrolling page.

```mermaid
flowchart LR
  A[pp. 1–2 Opening<br/>intro + contents + resume] --> B[pp. 3–4 Timeline<br/>001 → 011]
  B --> C[pp. 5–6 Skills]
  C --> D[pp. 7–8 Projects<br/>grid + detail]
  D --> E[pp. 9–10 Colophon]
  E --> F[pp. 11–12 Contact<br/>+ resume]
  A -. jump from contents .-> B & C & D & E & F
```

| Pages | Screen | Desktop spread (left / right) | Mobile merged page | Route |
| --- | --- | --- | --- | --- |
| 1–2 | Opening | "Property of Kevin Pham" intro + resume download / table of contents | Intro line, resume, then contents | `/` |
| 3–4 | Timeline | 001–005 / 006–011 as a dashed roadmap | All 11 entries on one page | `/timeline` (entries anchored `#v0-4`) |
| 5–6 | Skills | Tool groups as stack chips / foundations & practice | Tool groups, then a foundations card | `/skills` |
| 7–8 | Projects | Project cards, up to 9 / detail of the selected project | Card list; tapping a card expands it to a full sheet, X closes back to the cards | `/projects`, `/projects/<slug>` |
| 9–10 | Colophon | How the notebook was built / stack, curl engine notes | Single page | `/colophon` |
| 11–12 | Contact | Closing note / email, LinkedIn, GitHub (84px rows, 20px links in `ink` with an `ink-soft` underline, not indented), resume download | Single page | `/contact` |

**Table of contents (page 2)**

- Five numbered sections — 1 Timeline, 2 Skills, 3 Projects, 4 Colophon, 5 Contact — numbers in huckleberry, each with a one-line subtitle and its page range (`pp. 3–4`, `pp. 5–6`, `pp. 7–8`, `pp. 9–10`, `pp. 11–12`)
- Hover (and keyboard focus): the title turns huckleberry with a soft huckleberry highlighter swash behind it, the dotted leader and page range tint huckleberry, and "jump →" appears. Huckleberry rather than white, because white disappears on day paper
- Click: riffles straight to that section's spread (Jump behavior below) and updates the route
- The ribbon bookmark returns to the contents from anywhere

**Timeline spread (pages 3–4)**

- A trail map: 001–005 on the left page, 006–011 on the right. Entries indent and un-indent in a gentle wave (0 → 19 → 49 → 49 → 19px, repeating), and a dashed huckleberry trail joins the nodes with smooth S-curves. No line crosses the spine; a pencil "cont. p. 4 →" bridges the pages
- The wave is final. Considered and rejected: a topographic contour map (too noisy), switchbacks, and a bottom-up ascent
- Each entry: entry number in `ink-soft` gray and version tag in huckleberry (mono), title (Fraunces 20px), date range, and a two-sentence description (Newsreader 15/28, ≤ 125 characters, two lines)
- 011 Now: filled huckleberry node, title circled by hand in huckleberry, and a "← you are here" note
- 004 keeps the strike-through note: "public health" crossed out, "CS + Econ" above it
- Mobile: one page, the trail runs down the left edge

**Skills spread (pages 5–6)**

- Left: tool groups (Languages, Frontend, Backend & data, Infra & delivery, Design & tools). Group labels in huckleberry; the skills themselves are StackChips in `moss`, with a mono "used in" reference to projects or versions; dashed chips for anything unconfirmed
- Right: Foundations & practice as a facts grid (mono labels, Special Elite values), one blank ruled line between rows so the list fills the page; each tagged with the timeline version it came from

**Projects spread behavior**

- Left page: grid of specimen-label cards (2×2 for up to 4 projects, 3×3 for 5–9); each card shows name, one-liner, stack chips, status
- Right page: detail of the selected card; the most recent project is preselected so the page is never empty
- Selecting a card swaps the right page like a new index card sliding in from under the page edge (200ms) — no curl, the reader stays on the spread
- Selection updates the URL to `/projects/<slug>` so a single project is linkable
- Mobile: tapped card expands in place into a full-height sheet (shared-element transition); X, swipe down, or back gesture collapses it to the card

**Persistent chrome on every screen**

- Ribbon bookmark (top edge) → table of contents
- Day / night journal toggle
- Section label and tag in the page header

The resume download appears only on the opening spread and the contact page.

**Navigation inputs**

| Input | Desktop | Mobile |
| --- | --- | --- |
| Forward | Scroll down; drag or click right page corner; right arrow key | Pull past the bottom of the page; peel right corner; swipe left |
| Back | Scroll up; drag or click left page corner; left arrow key | Pull past the top of the page; swipe right (curl plays in reverse) |
| Jump | Contents section → quick riffle to its spread (at most 5 flips) | Contents section → riffle |

## Color — Huckleberry

Huckleberry is the only accent for anything readable; salal is decoration only. Both modes ship at launch: day journal (light) and night journal (dark).

| Token | Day journal | Night journal | Use |
| --- | --- | --- | --- |
| `paper` | `#EFEDE6` | `#1E2122` | Page background |
| `paper-back` | `#E2DED3` | `#26292A` | Back of a turning page (curl flap) |
| `ink` | `#262A2B` | `#E6E2D8` | Headings, body text |
| `ink-soft` | `#5C605F` | `#A9A69E` | Secondary text, captions, pencil notes |
| `huckleberry` | `#6A3552` | `#C28AA6` | Links, version tags, marginalia, ribbon |
| `salal` | `#5F7A63` | `#8FAE93` | Illustrations, dividers, large decorative type |
| `rule` | `#D8D4C8` | `#34383A` | Ruled lines, borders |
| `desk` | `#1C1714` | `#110E0C` | Dark walnut tabletop behind the notebook |
| `desk-grain` | `#2A221D` | `#1A1512` | Wood grain lines on the desk |
| `lamp` | `#F4D9A8` at 18% | `#F4D9A8` at 10% | Warm pool of lamplight centered on the notebook |
| `leather` | `#5B3A29` | `#4A2E20` | Hardcover leather wrap; mobile edge strip |
| `leather-dark` | `#3A2419` | `#2C1A11` | Spine hinge, tie cord |
| `leather-wear` | `#7E5842` | `#654433` | Rubbed lighter cover edges, scuffs |
| `stitch` | `#9A785C` | `#7A5B45` | Cover stitching |
| `paper-fold` | `#E9E6DD` | `#222526` | Half-step shade for folds, creases, spine gutter |
| `desk-ink` | `#E6E2D8` | `#E6E2D8` | Text and focus rings on the desk (huckleberry is 1.9:1 on the day desk) |
| `desk-ink-soft` | `#A9A69E` | `#A9A69E` | Secondary text on the desk |
| `foxing` | `#9C7A52` | `#7A6248` | Foxing spots |
| `edge-age` | `#8A6A45` | `#000000` | Darkened page edges (baked into the page texture) |
| `coffee` | `#8A5A36` | `#8A6242` | Coffee rings on the paper |
| `moss` | `#3A5340` | `#9CBA9F` | Skill chips — the earthy counterpart to huckleberry (7.2:1 day, 7.7:1 night) |
| `walnut` | `#5B3A29` | `#B08A6E` | The beaver sketch on the skills page (illustration only) |
| `fiber` | `#FAF8F2` | `#33383A` | Exposed paper along a tear |
| `tape` | `#F4D9A8` at 55% | `#F4D9A8` at 16% | Tape strips |
| `cast` | `#F4D9A8` at 14% | `#F4D9A8` at 6% | Warm lamp cast on the paper |

**The scene:** a leather-bound notebook lies open on a dark wooden cabin table at night, lit by a single warm lamp. The desk is dark in both themes. Light falls off toward the screen edges, so the notebook glows and everything around it recedes. The paper picks up a faint warm cast where the light is strongest.

- **Cover:** a leather hardcover wraps the page block, overhanging 22px left/right and 18px top/bottom, with rubbed lighter edges, a stitched border, a darker spine hinge, and a tie cord trailing onto the table. On mobile (one page at a time) the cover shows as an 8px leather strip along the top, right, and bottom edges; the spine side stays open.
- **Table props:** an old topographic map tucked under the notebook, an enamel tin mug with coffee rings, a pencil, a brass compass, a magnifying glass, and a Douglas fir sprig with a cone. Decorative and `aria-hidden`, drawn under the lamp's falloff, and never over a page corner (the curl zones).

**Rules**

- Salal fails small-text contrast on day paper — never use it for text under 24px
- No gradients in UI elements; the one exception is the lamp — a soft radial falloff on the desk and a faint warm cast on the paper
- Blur appears only inside baked textures (page-edge aging, smudges), never on UI elements
- Page depth comes from flat shade steps (`paper` → `paper-back`), fold lines, and the paper texture; a soft shadow under the notebook is allowed so it sits on the desk
- Theme follows `prefers-color-scheme` first; the toggle overrides and persists in `localStorage`
- Keep clear of navy and amber so it never resembles the photography site; brass props stay dark and muted

## Typography — Soft editorial

Fraunces for display, Newsreader for reading, JetBrains Mono for labels, Special Elite (typewriter) for facts values, Nanum Pen Script for marginalia — all on a 28px baseline that matches the ruled lines.

| Role | Face | Size / leading (desktop) | Mobile | Notes |
| --- | --- | --- | --- | --- |
| Display (version titles) | Fraunces 500 | 56px / 1.1 | 40px | `SOFT` 100, `WONK` 1, high optical size — display only |
| Heading | Fraunces 400 | 28px / 1.15 | 24px | `SOFT` 50, `WONK` 0 |
| Body | Newsreader 400 | 18px / 28px | 17px / 28px | Sits on the ruled lines |
| Facts labels, tags, dates | JetBrains Mono 400 | 12px / 16px | 12px | Huckleberry; entry numbers and version tags |
| Facts values, chapter line | Special Elite 400 | 16px / 28px | 15px / 28px | Typewriter face for the facts values and the chapter line under each title — what an archaeologist's typed field notes would look like. Set at 0.88× because it runs wide; Patrick Hand is the fallback. Project detail paragraphs stay in Newsreader |
| Marginalia | Nanum Pen Script | 24px | 22px | Huckleberry or pencil gray; rotated −4° to 3° with a wavering baseline; 2–4 per spread |

**Grid**

- Baseline unit: 28px; ruled lines drawn every 28px on each page
- Page padding: 56px desktop, 24px mobile
- Spread: two pages on a centered desk surface, max width about 1280px, each page about 3:4 portrait
- Facts page uses a two-column label/value grid in mono + Newsreader

Fonts load from Google Fonts via `next/font` with `display: swap` and system serif fallbacks.

## Page curl interaction

Every page turn is a corner curl built on the real DOM — a custom engine, no page-flip library — so text stays selectable and indexable.

**Mechanics**

- The dragged corner moves from its rest point C toward its mirror across the spine, Q; the fold line is the perpendicular bisector of C and the pointer P (bisecting P and Q would just give the spine)
- The page in place is clipped with a CSS `clip-path` polygon on the fold line
- The flap is the region past the fold, reflected across it with one CSS `matrix()` transform
- Desktop: the flap shows the next spread's left page, mirrored; mobile: the flap shows `paper-back`
- Depth: flat `paper-back` shade on the flap plus a 1px fold line; no gradients or blur

| Behavior | Spec |
| --- | --- |
| Auto-curl (click, key, tap) | 450ms, ease-in-out; corner arcs up about 55% of page height mid-turn |
| Drag | Corner follows the pointer exactly; release past 40% completes the turn, otherwise it springs back |
| Hover hint (desktop) | The turn corner is lifted 34px at rest; on hover it lifts about 16px more to signal it's grabbable |
| Riffle (contents jump) | About 150ms per page, capped at 6 pages; beyond that, riffle 3 then cut |
| Back, mobile | Swipe right plays the curl in reverse (page settles back into place) |
| Vertical scroll | Never hijacked on mobile; curl gestures start only from the corner zones, horizontal swipes, or pulling past the page edge |
| Reduced motion | `prefers-reduced-motion` → 200ms crossfade, no curl |
| URL | Each turn updates the route; back/forward buttons replay the curl |

### Scroll to turn

Scrolling scrubs the curl directly, and a half-finished turn snaps to completion or falls back — it never stays stuck mid-page.

**One shared progress value.** Every input — wheel, trackpad, drag, keys, clicks — writes to the same turn progress (0 = flat, 1 = turned). So the corner is always grabbable mid-scroll: scroll a page halfway, then grab the corner to finish it, drag it back, or keep scrolling. Scrolling up mid-curl reverses it.

| Behavior | Desktop | Mobile |
| --- | --- | --- |
| Scrub | Vertical wheel or trackpad delta drives progress; about 600px of scroll = one full turn | Native vertical scroll inside the page; at the bottom, continued pull drives the peel from the corner |
| Snap | 150ms after input stops: progress ≥ 35% (or a fast flick) completes the turn in about 250ms; below that, it falls back | On release: past 35% completes, otherwise the page settles back |
| One page per gesture | After a turn completes, ignore wheel input for 350ms to swallow trackpad inertia | Same, after each completed peel |
| Back | Scroll up at progress 0 curls the left page back | Pull past the top of the page |
| Reduced motion | Wheel still steps pages, with a crossfade | Same |

**Design constraint this creates:** desktop pages never scroll internally, so every spread must fit the viewport. The timeline holds 11 entries at 4 ruled lines each (title, two description lines, a gap): descriptions stay at or under 125 characters. Skills groups stay to two chip rows each.

**Considered and rejected:** plain continuous scroll. It's the simplest to build but drops the page-turn metaphor that the whole concept rests on.

The engine is a colophon case study in its own right: document the fold math and the clip-path approach there.

## Screens and components

Claude Design should wireframe five screens at desktop (1440px) and mobile (390px), in both day and night journal.

**Screens to wireframe**

1. **Opening spread (pp. 1–2)** — left: "Property of Kevin Pham", positioning headline, resume download, sword fern specimen, handwritten notes; right: table of contents with five sections, page ranges, hover state, and a dog-eared bottom-right corner
2. **Timeline (pp. 3–4)** — the dashed roadmap from 001 to 011, Now circled, the 004 strike-through
3. **Skills (pp. 5–6)** — tool groups / foundations & practice
4. **Projects spread (pp. 7–8)** — left: grid of project cards (3 cards now, 3×3 at full); right: selected project detail — problem, role, decisions, a rejected idea, stack, status; screenshot and link slots left empty for now
5. **Colophon (pp. 9–10)** — how the notebook and curl engine were built
6. **Contact / back cover (pp. 11–12)** — closing note, email, LinkedIn, GitHub, resume download, banana slug

Also wireframe the mobile project sheet (card expanded, X in the top corner).

**Components**

| Component | Description |
| --- | --- |
| `Notebook` | Lamplit cabin-table scene, table props, leather hardcover + spread container; handles breakpoints and theme |
| `Page` | Ruled paper, 28px lines, texture overlay, aging, edge chips, lifted turn corner, page number in footer |
| `PageCurl` | Shared turn progress; wheel scrub, drag, keys, riffle, snap and fall-back, reduced-motion fallback |
| `EntryHeader` | Section label or entry number + tag in mono, huckleberry outline |
| `Contents` | Five sections with page ranges; hover/focus highlight in huckleberry; click riffles to the section |
| `Timeline` | Two-page roadmap: dashed trail, nodes, 5 entries left / 6 right; single page on mobile |
| `TimelineEntry` | Gray entry number, huckleberry version tag, title, dates, two-sentence description; indent follows the trail; anchored `#v0-4` |
| `SkillGroup` | Huckleberry label, "used in" refs, `moss` StackChip row; dashed chip for unconfirmed items |
| `FactsPanel` | Mono huckleberry labels + Special Elite values (skills foundations, colophon); merges into a summary card on mobile |
| `ProjectGrid` | Left-page card grid, 2×2 or 3×3 by count |
| `ProjectCard` | Specimen-label card: name, one-liner, stack chips, status; selected state with huckleberry pin |
| `ProjectDetail` | Right-page detail; index-card slide-in on selection |
| `ProjectSheet` | Mobile full-height sheet expanded from a card; X, swipe down, and back close it |
| `StackChip` | Mono label in a thin outline — huckleberry on project cards, `moss` on the skills page |
| `Marginalia` | Imperfect Nanum Pen note with hand-drawn underline, circle, or arrow; aria-hidden if purely decorative |
| `HandMark` | Wobbly SVG mark attached to printed text: underline, double underline, circle, strike, bracket, arrow |
| `IndexCard` | Tipped-in ruled card with tape, lines on the same 28px baseline |
| `NoteArea` | Margin column, tipped-in index card, sketch, or scrap holding a longer note |
| `FieldMark` | Smudges, ink blots, erased-note ghosts, tape |
| `TapedPhoto` | Screenshot with a flat tape strip and slight rotation (used once screenshots exist) |
| `Specimen` | PNW line illustration in salal, one per spread |
| `PaperEdge` | Edge chips, worn corners, tears, and scissor-cut shapes as SVG masks |
| `RibbonBookmark` | Top-edge ribbon linking to contents |
| `ThemeToggle` | Day / night journal switch |
| `ResumeButton` | PDF download — opening spread and contact page only |
| `LeatherCover` | Leather hardcover behind the page block (desktop) or 8px edge strip (mobile); part of `Notebook` |
| `DeskProps` | Cabin-table objects around the notebook; decorative, `aria-hidden` |

**States to show**: contents hover and focus, the notebook on the lamplit cabin table, the lifted turn corner at rest, a heavily worn page next to a lighter one, a note area with hand-drawn marks, corner hover lift, mid-curl frame, focus rings on all links, empty stack chip row, night journal.

## Accessibility and performance

Target WCAG 2.1 AA and Lighthouse 95+ in all four categories; the curl must never block content.

| Area | Requirement |
| --- | --- |
| Contrast | Body and labels ≥ 4.5:1 in both themes, including on worn paper; salal never for small text |
| Keyboard | Arrow keys turn pages; Tab reaches every link; visible huckleberry focus ring |
| Screen readers | Each page is a landmark with its section title; the timeline is an ordered list of articles; curl flap is `aria-hidden`; decorative marginalia `aria-hidden`, meaningful notes kept as text |
| Motion | `prefers-reduced-motion` → crossfade; no auto-playing animation |
| No-JS fallback | Pages render as normal routes with plain next/previous links |
| Load | LCP < 2.0s on 4G; curl engine lazy-loaded after first paint; fonts subset; textures compressed |
| Images | `next/image`, AVIF/WebP, explicit dimensions (no layout shift) |
| SEO | Per-route titles and descriptions, Open Graph image per section, sitemap |

## Tech stack and build notes

Next.js App Router with TypeScript and Tailwind, deployed on Vercel; content lives in MDX: one file per timeline entry and per project.

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router), TypeScript | Static generation for every route |
| Styling | Tailwind CSS v4 with CSS variables for tokens | Theme via `data-theme` on `<html>` |
| Motion | Custom curl engine (pointer events + `requestAnimationFrame`); Framer Motion only for small UI transitions | No page-flip library |
| Content | MDX in `/content/timeline`, `/content/skills.mdx`, and `/content/projects` with typed frontmatter | Timeline entries are frontmatter only |
| Hosting | Vercel + Vercel Analytics | Custom domain after launch |

**Suggested structure**

```
src/app/
  page.tsx                  opening spread (pp. 1–2)
  timeline/page.tsx         pp. 3–4
  skills/page.tsx           pp. 5–6
  projects/page.tsx         pp. 7–8
  projects/[slug]/page.tsx
  colophon/page.tsx         pp. 9–10
  contact/page.tsx          pp. 11–12
src/components/notebook/    Notebook, Page, PageCurl, Contents, Timeline, SkillGroup …
src/lib/curl/               fold math, clip + reflection helpers
content/timeline/*.mdx      one per entry, frontmatter only
content/skills.mdx
content/projects/*.mdx
```

**Timeline entry frontmatter**

```
entry: 4
version: "0.4"
title: "Breaking change"
dates: "2023–24"
description: "An intro CS class pulled me back to engineering and math. Same goal of helping people, a new way to do it."
marginalia: "~~public health~~ CS + Econ"
```

**Build order**

1. Tokens, fonts, `Page` and ruled grid
2. Static spreads and mobile merged pages with plain links
3. `PageCurl` engine (auto-curl, then drag, then scroll, then riffle)
4. Content in MDX
5. Accessibility, performance, SEO pass

## Content

All copy below is final-draft content for the build. Versions below 1.0 are the beta years; graduation ships v1.0. Project links and screenshots are added after development.

**Positioning**

- Opening spread headline: Useful apps, thoughtful design, people first.
- Line beneath it: Full-stack engineer with a designer's eye, building apps that make everyday life a little easier.
- The same pair doubles as the site's meta description and LinkedIn headline.

| Target | Detail |
| --- | --- |
| Primary role | Full-stack engineer |
| Also open to | Product engineer, design engineer |
| Location | Based in Seattle; open to many locations; would love to return to New York |

**Version list** (source for the timeline)

| Entry | Version | Title | Chapter | Dates | Facts page highlights |
| --- | --- | --- | --- | --- | --- |
| 001 | v0.1 | Hello, world | Graduated Kent-Meridian High School, Kent, WA | June 2022 | Hometown, sports medicine, what came next |
| 002 | v0.2 | Pre-health build | Entered NYU to pursue public health and medicine | Sep 2022 | NYU College of Arts and Sciences; hospital volunteering; assistant martial arts instructor |
| 003 | v0.3 | First commit | ReuMo — website for stormwater-filtration moss kits | June 2023 – present | HTML/CSS/JS site; $20,000 VentureWell Propel Stage 2 team; customer discovery; 3D prototypes |
| 004 | v0.4 | Breaking change | Switched to Economics + Computer Science, sophomore year | 2023–24 | Strike-through marginalia marks the pivot |
| 005 | v0.5 | Proofing | Front of house lead, Paris Baguette store launch | Summer 2024 | Launched a new store; staffed and ran the customer-facing floor |
| 006 | v0.6 | Localization | Study abroad, NYU Madrid | Aug – Dec 2024 | Coursework, what changed |
| 007 | v0.7 | Concurrency | Server at Fer (Long Island City) and OBAO (Hell's Kitchen), overlapping | May 2025 – Feb 2026 | Two restaurants at once; ~10 tables per shift; real-time prioritization |
| 008 | v0.8 | Added dependency: math | Added the mathematics minor, senior year | 2025–26 | Algorithms, OS, systems coursework |
| 009 | v0.9 | Release candidate | Built PolyPaper with a team of 5; built Momentum and MyRecipePal, the prototypes that became Minced | Sep 2025 – present | Team of 5; CI/CD to DigitalOcean on every commit |
| 010 | v1.0 | Stable release | Graduated NYU: B.A. Economics and Computer Science, minor in Mathematics | May 2026 | Degree, coursework |
| 011 | v1.1 | Now | Full-stack engineer in Seattle, eyeing a return to New York; shipping Minced | 2026 – | Open to full-stack, product, and design engineering roles |

### Timeline descriptions (draft — Kevin to confirm)

Condensed from the long drafts below. Each stays at or under 125 characters so it fits two lines.

| Entry | Title | Dates | Description |
| --- | --- | --- | --- |
| 001 · v0.1 | Hello, world | June 2022 | Graduated Kent-Meridian, set on becoming a doctor. Chose NYU because it was the farthest thing from comfortable. |
| 002 · v0.2 | Pre-health build | Sep 2022 | Arrived at NYU on the pre-health track, aiming for pediatrics. Volunteered at hospitals and taught kids martial arts. |
| 003 · v0.3 | First commit | June 2023 – present | Built ReuMo's website while teaching myself HTML, CSS, and JavaScript. Our team won a $20,000 VentureWell Propel award. |
| 004 · v0.4 | Breaking change | 2023–24 | An intro CS class pulled me back to engineering and math. Same goal of helping people, a new way to do it. |
| 005 · v0.5 | Proofing | Summer 2024 | Front of house lead for a brand-new Paris Baguette. Launch month taught me that running a store is running people. |
| 006 · v0.6 | Localization | Aug – Dec 2024 | Studied abroad at NYU Madrid, where lunch took two hours. Came home just as ambitious, clearer about what for. |
| 007 · v0.7 | Concurrency | May 2025 – Feb 2026 | Served at Fer and OBAO at once, ten tables a shift. A packed section is a real-time system. |
| 008 · v0.8 | Added dependency: math | 2025–26 | Added a math minor: algorithms, OS, data structures. Economics taught me tradeoffs; math taught me to prove them. |
| 009 · v0.9 | Release candidate | Sep 2025 – present | Shipped PolyPaper with a team of five, CI/CD on every commit. Built Momentum and MyRecipePal, the prototypes of Minced. |
| 010 · v1.0 | Stable release | May 2026 | Graduated NYU: B.A. Economics and Computer Science, minor in Mathematics. The destination changed; the reason didn't. |
| 011 · v1.1 | Now | 2026 – | Back in the Pacific Northwest, building Minced. Open to full-stack, product, and design engineering roles. |

### Skills (draft — Kevin to confirm)

Drawn only from the projects and timeline above.

| Group | Items | Used in |
| --- | --- | --- |
| Languages | TypeScript, JavaScript, Python, SQL, HTML, CSS | Minced · PolyPaper · v0.3 |
| Frontend | Next.js, React, Tailwind CSS, shadcn/ui, d3 | Minced · World Map Photo Album |
| Backend & data | Supabase, Postgres + RLS, Flask, FastAPI, MongoDB, Redis, Zod | Minced · PolyPaper |
| Infra & delivery | Vercel, Docker Compose, GitHub Actions, DigitalOcean, CI/CD | PolyPaper · Minced |
| Design & tools | UI design, prototyping, *[design tools to confirm]* | This notebook · Minced |

| Foundation | Detail | From |
| --- | --- | --- |
| Computer science | Algorithms, data structures, operating systems, computer systems organization | v0.8 |
| Mathematics | Minor in mathematics: proving why something is fast or slow | v0.8 |
| Economics | B.A. in Economics: thinking in tradeoffs | v1.0 |
| Product | Customer discovery, writing specs, shipping in weekly sprints | v0.3 · v0.9 |
| Teamwork | Standups, code review, issue assignment, GitHub done properly | v0.9 |
| Under pressure | Ran a launch-month floor; ten tables at once | v0.5 · v0.7 |

### Archive — long-form story drafts

No longer shown on the site (the timeline replaced the per-entry spreads). Kept as source material for descriptions, the About copy, and interviews.

**001 · v0.1 · Hello, world**

I grew up in Kent, Washington, and for most of high school I was sure I'd become a doctor. My sister and my family were the reason. I'd seen what care looks like up close, and I wanted to give it. I took every sports medicine class Kent-Meridian offered.

When it came time to choose a college, I picked the one farthest from comfortable. NYU meant leaving my friends, my family, and everything familiar for a city of strangers. That was the point. I wanted to learn who I was without a safety net: how to take care of myself, make my own calls, and navigate life on my own.

Marginalia: "first time on my own →"

**002 · v0.2 · Pre-health build**

My sister went into public health, and she showed me what a life spent helping people looks like. Medicine felt like the most direct, hands-on version of that. I volunteered at hospitals and set my sights on pediatrics.

Kids were the part that made sense. I'd trained in martial arts since I was young and eventually became an assistant instructor. Being someone a kid looked up to, and earning it, was the best feeling I knew.

So I arrived at NYU on the pre-health track, sure of the destination.

Marginalia: "the thread starts here"

**003 · v0.3 · First commit**

The summer after my first year, I joined ReuMo, a Seattle startup making moss kits that filter stormwater: a cheaper, more accessible take on green infrastructure. They needed a website. I said I could build one. I had never shipped anything.

I learned HTML, CSS, and JavaScript by building the real thing. Alongside the site, I sat in on customer discovery interviews, helped write the specs, and kept monthly records of how the technology was developing. Our team earned a $20,000 Propel Stage 2 award through VentureWell's Summer 2023 cohort.

It was the first time code I wrote did something in the world.

Marginalia: "moss. really."

**004 · v0.4 · Breaking change**

Medicine is a long road: years of school, fierce competition, and real cost. I weighed that against what my family needed from me, and the math got harder to ignore.

Then I took an intro to computer science class, and something from childhood came back: the pull of engineering, math, and a problem that won't let go. I took more classes, and added economics to make every semester and every dollar count.

I never stopped wanting to help people. I changed how. Today that means building apps that help people learn, get organized, and take care of themselves, including their health. If good tools keep people healthier, maybe fewer of them need the doctor I wanted to become.

Marginalia: ~~public health~~ → CS + Econ

**005 · v0.5 · Proofing**

Paris Baguette hired me as front of house lead for a brand-new store, so I saw a business from its first day. Working close to the owners and managers, I learned how thin the margins are, and how much of running a store is running people.

Launch month was everything at once: restocking, checkout, bathrooms, breaks, drinks, clearing tables. With a big new team, no single task was the hard part. Covering all of them at the same moment was. My job became putting the right people in the right spots at the right time, and shifting them as the rush moved.

I learned that happy customers start with a happy team. I think about the same thing in product work now: the person on the other side of the counter, or the screen.

Marginalia: "day one, all hands"

**006 · v0.6 · Localization**

In New York, lunch was thirty minutes, often eaten while working. In Madrid, it was two hours at a table. At first the slowness felt like a bug. By December it looked like a feature.

People there made room to rest and to be human, not machines. Work mattered, but it came second to who you were. Watching that shifted something: chasing prestige isn't the only way to build a life, and maybe not the best one.

I came home still ambitious, but clearer about what the ambition is for.

Marginalia: "2-hour lunch. worth it."

**007 · v0.7 · Concurrency**

For a stretch of senior year, I worked two restaurants at once: Fer, a Chinese restaurant in Long Island City, and OBAO, a Thai-Vietnamese spot in Hell's Kitchen. Some days ran from lecture to one dinner rush to the next.

A packed section is a real-time system. Ten tables, each at a different stage, each with its own allergies, timing, and mood. You learn to hold the whole menu in your head, triage without looking rushed, and hand off cleanly to the kitchen and the bar.

It's still the best training I've had for building software: everything happens at once, and the person waiting deserves your full attention anyway.

Marginalia: "table 7 needs water"

**008 · v0.8 · Added dependency: math**

Senior year, I added a mathematics minor. The problems I liked best kept turning out to be math underneath: algorithms, systems, the logic of why something is fast or slow.

Operating systems, algorithms, data structures, computer systems organization. The classes that felt hardest are the ones I use most. Economics taught me to think in tradeoffs; math taught me to prove them.

It's also why this notebook's page curl runs on geometry instead of a library. A fold line is just a perpendicular bisector.

Marginalia: "a fold is a bisector →"

**009 · v0.9 · Release candidate**

In my senior fall software engineering class, we split into teams to ship a real product. Ours was PolyPaper: a place to practice prediction-market trading with fake money before risking real money. Five people, weekly sprints, standups on Zoom.

It was my first time building software the way teams do: issues, branches, reviews, and a pipeline that tested and deployed every commit. Around the same time, on my own, I built Momentum, a fitness tracker, and MyRecipePal, a recipe book. Neither was the final product. Both taught me what the final product should be.

Marginalia: "139 commits later"

**010 · v1.0 · Stable release**

In May 2026, I graduated from NYU with a B.A. in Economics and Computer Science and a minor in Mathematics. Four years earlier, I'd arrived on the pre-health track, sure of the destination.

The destination changed. The reason didn't. I still want to help people take better care of themselves. I just build the tools now instead of writing the prescriptions.

v1.0 isn't the finished product. It's the first version stable enough to ship.

Marginalia: "4 years, 1 switch"

**011 · v1.1 · Now**

I'm back in the Pacific Northwest, building Minced: an app that tells you what to cook with what's already in your kitchen, and helps you hit your goals along the way. It started with someone close to me and a simple realization: not everyone knows how to cook, or has time to figure it out.

I'm looking for full-stack roles, and I'm just as excited by product and design engineering: teams where how something feels matters as much as how it works. I'm in Seattle for now, and I'd love to get back to New York.

If you've read this far, the next pages are the work.

Marginalia: "turn the page →"

### Projects

Cards only for now; links and screenshots are added after the next few weeks of development.

| Project | One-liner | Stack | Dates | Status |
| --- | --- | --- | --- | --- |
| Minced | Tells you what to cook, whether or not you already know: match recipes to what's in your kitchen, or search by name. Planned: shopping lists for missing ingredients, nutrition goals, workout logs | Next.js 15, TypeScript, Tailwind v4, shadcn/ui, Supabase (Postgres, Auth, RLS), Zod, Vercel, USDA FoodData Central | July 2025 – present | In development; Phase 1 complete |
| PolyPaper | Polymarket-style paper trading: portfolios, auth, and event-market browsing | Flask, FastAPI, MongoDB, Redis, Docker Compose, GitHub Actions, DigitalOcean | Sep – Dec 2025 | Shipped (team of 5) |
| World Map Photo Album | Photography site where a globe morphs into a flat map and each visited country opens its photos | d3, TBD | Aug 2026 – present | In development |

**Minced lineage** — shown on its detail page as a version history, echoing the site's own concept: Momentum (fitness analytics, July 2025) → MyRecipePal (recipes and nutrition, Dec 2025) → Minced (the product that ships, 2026).

### Project detail pages

Each detail page follows the same five parts: problem, role, key decisions, a rejected idea, and result.

**Minced**

| Part | Draft |
| --- | --- |
| Problem | Someone close to me made me realize not everyone knows how to cook, what to cook, or has time to figure it out. Students and gym-goers chasing protein and carb targets have it hardest, but it works for anyone. |
| Role | Solo designer and engineer. Built for friends and family first; the goal is for it to become something everyone keeps on their phone. |
| Key decisions | Two doors into one catalog: match recipes to your pantry, or search by name — every feature works for both. Ranking runs inside Postgres as a database function, never in the browser. Every ingredient resolves to one canonical entry, and pantry staples like salt and oil never count as missing. |
| What sets it apart | All in one: recipes, fridge inventory, shopping lists, nutrition goals, and gym logs and workout schedules, instead of four separate apps |
| Rejected idea | Paste a TikTok cooking video and get a full recipe with nutrition. Exciting, but too much for v1 — cut to keep the core fast. |
| Result | In development. Phase 1 complete: live database with row-level security and seed recipes. Next: an ingredient vocabulary for a 500+ recipe catalog. |
| Lineage | Momentum (July 2025) → MyRecipePal (Dec 2025) → Minced (2026) |

**PolyPaper**

| Part | Draft |
| --- | --- |
| Problem | Polymarket and Kalshi went mainstream fast, but there was no way to practice predicting with fake money before putting real money on the line. |
| Role | One of five engineers on a semester team project |
| Key decisions | Split the product in two: a Flask web app for accounts, sessions, and UI, and two FastAPI microservices — search and pricing — that proxy Polymarket's data and cache it in Redis. Every piece runs in its own Docker container. |
| Pipeline | GitHub Actions tests, builds images, pushes to Docker Hub, and redeploys the DigitalOcean server on every commit to main |
| Result | Shipped trading on live Polymarket data, with sign-up, login, account reset, adjustable trading balance and position sizing, and market search. 139 commits. The bigger win: learning to work as a team — standups, issue assignment, splitting work, and GitHub done properly. |

**World Map Photo Album**

| Part | Draft |
| --- | --- |
| Problem | Hundreds of travel photos and no good way to revisit favorites or share them with friends and family |
| Role | Solo. A test of my own design abilities, and of how far I could push building with Claude |
| Key decisions | Organize by place, inspired by trip-tracking apps: a globe that morphs into a flat map, with every visited country lit up and clickable |
| Signature detail | Each country gets its own design motif — a gondola for Switzerland, Tram 28 for Portugal |
| Result | Close to deploying: 11 countries, 10 favorite photos each |

### Contact

| Channel | Value | Where it appears |
| --- | --- | --- |
| Email | kevinpham4830@gmail.com (move to a domain alias once one exists) | Contact page |
| LinkedIn | [linkedin.com/in/kevinpham4830](https://www.linkedin.com/in/kevinpham4830/) | Contact page, opening spread footer |
| GitHub | [github.com/knp4830](https://github.com/knp4830) | Contact page, project details |
| LeetCode | Not included | — |
| Phone | Not shown | — |
| Domain | Deferred until the site is built and running | — |

### Still needed

- [x] Resume, dates, roles, positioning, targets, contact
- [x] Story drafts for all 11 entries
- [x] Project detail drafts for Minced, PolyPaper, and World Map Photo Album
- [ ] Confirm the 11 timeline descriptions (≤ 125 characters each)
- [ ] Confirm the skills lists: languages, design tools, anything to add or drop
- [ ] Update the resume PDF: Minced replaces MyRecipePal and Momentum; add Fer (May – Dec 2025); OBAO July 2025 – Feb 2026; PolyPaper as a team of 5; fix typos
- [ ] Links and screenshots for each project (after development)
- [ ] Domain (after launch)
