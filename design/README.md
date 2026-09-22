# design/ — Field Notebook visual spec (Claude Design rev 8)

Exported from the Claude Design canvas **"Field Notebook Portfolio"** (Sep 21 2026). This folder is the visual spec referenced in `CLAUDE.md`. **Read this file, then look at the screens, before building any UI.**

## What's here

| Folder | What it is | Use it for |
|---|---|---|
| `screens/` | Full-size PNG of every artboard | **Visual truth.** Open the PNG for the screen you're building and match it. |
| `html/` | Rendered static HTML of every artboard (no JS; opens in any browser) | **Exact values**: spacing, font sizes, colors, SVG paths (beaver, specimens, trail, turn corners, chips). Read the markup; don't copy it wholesale. |
| `source/` | Original `.dc.html` artboards + `canvas.json` | Archive only. Needs the Claude Design runtime to render; not for the build. |
| `tokens.css` | Every color token, day + night, and texture opacities | Seed for `src/app/globals.css` in M0.2. |

## How to use it when building

1. Find the artboard(s) for the milestone in the table below; view the PNG at 1440 and 390, day and night.
2. Grep the matching `html/` file for exact numbers (e.g. `top:`, `font-size`, `var(--`) and SVG `d=` paths.
3. Rebuild it as real components per `CLAUDE.md` (component map, Server Components, tokens only from `globals.css`, copy from `content/`).
4. Where the mockup and the brief disagree, ask Kevin. `CLAUDE.md` wins over both.

### Things the mockups do that production must do differently

- **Paper texture, desk grain, leather** are drawn with inline SVG filters (`feTurbulence`, `feDiffuseLighting`). In production these become baked assets (`public/textures/*.avif`, leather + walnut textures) per the brief's asset list.
- **Fonts** load from one big Google Fonts link that includes the font-options board. Production uses `next/font` with only: Fraunces, Newsreader, JetBrains Mono, Special Elite (0.88×, Patrick Hand fallback), Nanum Pen Script.
- **The day/night toggle** in the mockups is static. Production: `prefers-color-scheme` first, toggle overrides, persisted in `localStorage`.
- **Mid-curl frame and turn corners** are static drawings; the real ones come from the curl engine (M2.x) and must share its fold math.
- **Absolute positioning** is used everywhere in the mockups. Production uses flex/grid on the 28px baseline; the positions are the target, not the method.
- Copy in the mockups matches `docs/BRIEF.md`; if they differ, the brief (via `content/`) wins.

## Screen index (by canvas row)

| Artboard | Title | Route | Size | Files |
|---|---|---|---|---|
| `SceneDay` | Cabin table scene · 1920 · day | — (full desk scene, 1920) | 1920×1200 | [png](screens/SceneDay.png) · [html](html/SceneDay.html) |
| `SceneNight` | Cabin table scene · 1920 · night | — (full desk scene, 1920) | 1920×1200 | [png](screens/SceneNight.png) · [html](html/SceneNight.html) |
| `Main` | Opening · pp. 1–2 · 1440 · day | / | 1440×952 | [png](screens/Main.png) · [html](html/Main.html) |
| `OpeningNight` | Opening · pp. 1–2 · 1440 · night | / | 1440×952 | [png](screens/OpeningNight.png) · [html](html/OpeningNight.html) |
| `OpeningMobileDay` | Opening · 390 · day | / | 390×1456 | [png](screens/OpeningMobileDay.png) · [html](html/OpeningMobileDay.html) |
| `OpeningMobileNight` | Opening · 390 · night | / | 390×1456 | [png](screens/OpeningMobileNight.png) · [html](html/OpeningMobileNight.html) |
| `TimelineDay` | Timeline · pp. 3–4 · 1440 · day | /timeline | 1440×952 | [png](screens/TimelineDay.png) · [html](html/TimelineDay.html) |
| `TimelineNight` | Timeline · pp. 3–4 · 1440 · night | /timeline | 1440×952 | [png](screens/TimelineNight.png) · [html](html/TimelineNight.html) |
| `TimelineMobileDay` | Timeline · 390 · day | /timeline | 390×2072 | [png](screens/TimelineMobileDay.png) · [html](html/TimelineMobileDay.html) |
| `TimelineMobileNight` | Timeline · 390 · night | /timeline | 390×2072 | [png](screens/TimelineMobileNight.png) · [html](html/TimelineMobileNight.html) |
| `SkillsDay` | Skills · pp. 5–6 · 1440 · day | /skills | 1440×952 | [png](screens/SkillsDay.png) · [html](html/SkillsDay.html) |
| `SkillsNight` | Skills · pp. 5–6 · 1440 · night | /skills | 1440×952 | [png](screens/SkillsNight.png) · [html](html/SkillsNight.html) |
| `SkillsMobileDay` | Skills · 390 · day | /skills | 390×1960 | [png](screens/SkillsMobileDay.png) · [html](html/SkillsMobileDay.html) |
| `SkillsMobileNight` | Skills · 390 · night | /skills | 390×1960 | [png](screens/SkillsMobileNight.png) · [html](html/SkillsMobileNight.html) |
| `ProjectsDay` | Projects · pp. 7–8 · 1440 · day | /projects | 1440×952 | [png](screens/ProjectsDay.png) · [html](html/ProjectsDay.html) |
| `ProjectsNight` | Projects · pp. 7–8 · 1440 · night | /projects | 1440×952 | [png](screens/ProjectsNight.png) · [html](html/ProjectsNight.html) |
| `ProjectsMobileDay` | Projects · 390 · day | /projects | 390×1708 | [png](screens/ProjectsMobileDay.png) · [html](html/ProjectsMobileDay.html) |
| `ProjectsMobileNight` | Projects · 390 · night | /projects | 390×1708 | [png](screens/ProjectsMobileNight.png) · [html](html/ProjectsMobileNight.html) |
| `ProjectSheetDay` | ProjectSheet · 390 · day | /projects/[slug] (mobile sheet) | 390×2156 | [png](screens/ProjectSheetDay.png) · [html](html/ProjectSheetDay.html) |
| `ProjectSheetNight` | ProjectSheet · 390 · night | /projects/[slug] (mobile sheet) | 390×2156 | [png](screens/ProjectSheetNight.png) · [html](html/ProjectSheetNight.html) |
| `ColophonDay` | Colophon · pp. 9–10 · 1440 · day | /colophon | 1440×952 | [png](screens/ColophonDay.png) · [html](html/ColophonDay.html) |
| `ColophonNight` | Colophon · pp. 9–10 · 1440 · night | /colophon | 1440×952 | [png](screens/ColophonNight.png) · [html](html/ColophonNight.html) |
| `ColophonMobileDay` | Colophon · 390 · day | /colophon | 390×1848 | [png](screens/ColophonMobileDay.png) · [html](html/ColophonMobileDay.html) |
| `ColophonMobileNight` | Colophon · 390 · night | /colophon | 390×1848 | [png](screens/ColophonMobileNight.png) · [html](html/ColophonMobileNight.html) |
| `ContactDay` | Contact · pp. 11–12 · 1440 · day | /contact | 1440×952 | [png](screens/ContactDay.png) · [html](html/ContactDay.html) |
| `ContactNight` | Contact · pp. 11–12 · 1440 · night | /contact | 1440×952 | [png](screens/ContactNight.png) · [html](html/ContactNight.html) |
| `ContactMobileDay` | Contact · 390 · day | /contact | 390×1428 | [png](screens/ContactMobileDay.png) · [html](html/ContactMobileDay.html) |
| `ContactMobileNight` | Contact · 390 · night | /contact | 390×1428 | [png](screens/ContactMobileNight.png) · [html](html/ContactMobileNight.html) |
| `MidCurl` | State · mid-curl · 1440 · day | — (curl state) | 1440×952 | [png](screens/MidCurl.png) · [html](html/MidCurl.html) |
| `States` | States · contents hover, turn corners, focus, empty slots | — (states board) | 1440×2980 | [png](screens/States.png) · [html](html/States.html) |
| `Tokens` | Token sheet | — (token sheet) | 1440×3400 | [png](screens/Tokens.png) · [html](html/Tokens.html) |
| `Components` | Component list | — (component list) | 1440×5500 | [png](screens/Components.png) · [html](html/Components.html) |
| `Fonts` | Font options | — (font options, reference only) | 1440×3900 | [png](screens/Fonts.png) · [html](html/Fonts.html) |

## Beaver (skills page)

Front-facing, upright, paws clasped at the chest, U-shaped paddle tail joined to the bottom of the body, drawn in `--walnut`. Exact SVG in `html/SkillsDay.html` (search `viewBox="0 0 200 236"`).
