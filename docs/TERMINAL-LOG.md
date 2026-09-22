# Terminal log

Commands run while building the portfolio, including failures.

## M0.1 — Scaffold (2026-09-21)

```bash
# pnpm wasn't installed yet
npm install -g pnpm

# Scaffold. Pinned to @15 because CLAUDE.md specifies Next.js 15 (@latest now gives 16).
pnpm create next-app@15 portfolio --ts --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*" --no-turbopack --yes
```

**Failed:** `ERR_PNPM_IGNORED_BUILDS — Ignored build scripts: unrs-resolver`.
pnpm blocks dependency install scripts by default. `unrs-resolver` (used by eslint-config-next) needs its
postinstall, so the install aborted before `git init`.

```bash
# Allow that one package's build script (writes allowBuilds to pnpm-workspace.yaml)
pnpm approve-builds unrs-resolver

# Verify
pnpm install
pnpm lint
pnpm exec tsc --noEmit
pnpm build

# Git + GitHub
git init -b main
git add .
git commit -m "Scaffold + brief"
gh repo create portfolio --public --source=. --push
```

## M0.1 — Design commit, CI, Vercel (2026-09-21)

```bash
# One milestone = one branch
git checkout -b m0.1-scaffold

# Commit the Claude Design export, then the rev 8 doc updates, separately
git add design && git commit -m "Add Claude Design rev 8 visual spec"
git add CLAUDE.md docs/BRIEF.md && git commit -m "Update CLAUDE.md and brief for design rev 8"

# CI: .github/workflows/ci.yml runs lint + typecheck; package.json gets
# "typecheck": "tsc --noEmit" and "packageManager": "pnpm@12.5.1"
pnpm lint
pnpm typecheck
```

**Failed:** in a fresh clone, `pnpm install --frozen-lockfile` →
`Cannot update packageManagerDependencies with "frozen-lockfile" because the lockfile is not up to date`.
pnpm 12 records the `packageManager` pin in the lockfile, so adding the field means the lockfile has to be regenerated.

```bash
pnpm install        # rewrites pnpm-lock.yaml with packageManagerDependencies
# Re-verify exactly what CI will do, in a clean clone
git clone --branch m0.1-scaffold . <scratch>/clone
pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm build

git push -u origin m0.1-scaffold
gh pr create --base main --head m0.1-scaffold
```

**Looked failed, wasn't:** the Vercel connector's project creation reported "created, but git link could not be
verified", then the project 404'd and didn't appear in the team's project list. It was linked anyway: opening the PR
triggered a Vercel build (`vercel.com/minced/portfolio`, "Deployment has completed").

```bash
gh pr checks 1 --watch                      # CI "check" pass (25s); Vercel pass
gh api repos/knp4830/portfolio/deployments  # → portfolio-n6zep6wm5-minced.vercel.app
curl -I https://portfolio-n6zep6wm5-minced.vercel.app
```

**Blocked (expected):** `302` → Vercel login. Preview URLs are behind Vercel Authentication (Deployment Protection) by
default, so it only loads for a logged-in team member.

## M0.1 — Close-out (2026-09-21)

```bash
# After PR #1 merged: move the close-out edits onto a fresh branch from main
git checkout main
git pull
git checkout -b m0.1-closeout
git add CLAUDE.md docs/LEARNING-LOG.md docs/TERMINAL-LOG.md
git commit -m "Close out M0.1"
git push -u origin m0.1-closeout
```

## M0.2 — Tokens and type (2026-09-21)

```bash
git checkout -b m0.2-tokens          # (Kevin)

pnpm test                            # node --test "src/**/*.test.ts": 34 contrast/token checks
pnpm lint && pnpm typecheck && pnpm build

# Look at /tokens in a real browser
pnpm start -p 3123
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --window-size=1440,3600 \
  --screenshot=tokens-1440.png http://localhost:3123/tokens
```

**Warning:** `Reparsing as ES module because module syntax was detected` on every `pnpm test`.
Fixed by adding `"type": "module"` to package.json.

**Looked failed, wasn't:** the `--window-size=390` screenshot looked clipped on the right. Headless Chrome won't
make a window narrower than ~500px. Rendering the page inside a 390px `<iframe>` showed it fits.

```powershell
# Stop a server started in the background (PowerShell)
$c = Get-NetTCPConnection -LocalPort 3124 -State Listen; Stop-Process -Id $c.OwningProcess -Force
```

```bash
# Kevin: commit, push, PR
git add .github package.json tsconfig.json src docs CLAUDE.md
git commit -m "M0.2: tokens, fonts, type scale, contrast checks"
git push -u origin m0.2-tokens
```

## M0.3 — Content pipeline (2026-09-21)

```bash
git checkout -b m0.3-content origin/main   # (Kevin)

pnpm add next-mdx-remote zod     # approved by Kevin: 6.0.0, 4.6.5
pnpm content:check               # node src/lib/content/check.ts
pnpm test                        # 41 tests: 34 contrast/token + 7 content

# DoD: delete a required field and confirm the build fails
sed -i '/^dates:/d' content/timeline/v0-7.mdx
pnpm build
```

**Failed (on purpose):**
```
content check failed: content/timeline/v0-7.mdx
✖ Invalid input: expected string, received undefined
  → at dates
[ELIFECYCLE] Command failed with exit code 1.
```
Restored the file afterwards; `pnpm build` passes again (`content ok: 11 timeline entries, 5 skill groups (24 chips), 3 projects`).

```bash
# Kevin: commit, push, PR
git add package.json pnpm-lock.yaml content src docs CLAUDE.md
git commit -m "M0.3: content pipeline — MDX loading, typed frontmatter, all content stubbed"
git push -u origin m0.3-content
```

**Failed:** `pnpm typecheck` → `TS2307: Cannot find module '../../../../src/app/zz-content-probe/page.js'`, from stale
`.next/types` after deleting a throwaway page. Fixed with:
```bash
rm -rf .next && pnpm build
```

## M1.1 — Page and Notebook (2026-09-21)

```bash
pnpm bake:paper      # node scripts/bakePaper.mjs → public/textures/*.avif + src/lib/paper/pages.ts
```

**Failed:** `TypeError: Cannot read properties of null (reading '1')` at `attrs.match(/aria-label=…/)[1]`.
The skills mockup nests `<section>`s inside its pages; matching to the next `</section>` picked up an inner one.
Fixed by matching page sections by aria-label + `position: absolute` and finding each end by depth.

```bash
# Visual check: production build + headless Chrome screenshots (day, forced dark, 1920, 1280×720)
pnpm build && pnpm start -p 3130
chrome --headless=new --window-size=1440,952 --screenshot=home-1440.png http://localhost:3130/
chrome --headless=new --force-dark-mode --window-size=1440,952 --screenshot=home-night.png http://localhost:3130/
# Mobile: render inside a 390px <iframe> (headless Chrome won't make a window narrower than ~500px)
```

**Looked failed:** the first mobile screenshot was Chrome's "Your file couldn't be accessed" page. The iframe HTML was
opened as `file:////c/Users/…` (Git Bash path) instead of `file:///C:/Users/…`.

**Failed:** a long bash heredoc writing these notes died with `unexpected EOF while looking for matching '` before running
anything. Wrote the notes to files first and appended them instead.

```bash
git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg   # starter leftovers (staged)
```

```bash
# Kevin: commit, push, PR
git fetch
git checkout -b m1.1-notebook origin/main
git add -A
git commit -m "M1.1: page and notebook — baked paper wear, desk, cover, spread and mobile layout"
git push -u origin m1.1-notebook
```

## M1.2 — Pages and chrome (2026-09-21)

```bash
pnpm bake:paper        # re-bake after reordering (contact pp. 9–10, colophon 11–12), adding tears and separate crease maps
pnpm content:check     # 11 timeline entries, 5 skill groups (24 chips), 3 projects, site + 6 page files
pnpm test              # 46 tests
pnpm build && pnpm start -p 3130
node dod.mjs           # headless Chrome over the DevTools protocol (Node 24's built-in WebSocket): 25/25
```

**Failed:** long bash heredocs containing JSX with `'` (e.g. `[font-variation-settings:'SOFT'_50]`) died with
`unexpected EOF while looking for matching '` before running. Wrote those files with the editor instead.

**Failed:** a Python template for HandMark used `%` formatting and the JSX contains `106%` →
`TypeError: not enough arguments for format string`. Switched to placeholder `.replace()`.

**Failed (test bug, not site bug):** the DoD script counted 7 "pages" on /skills; the tool groups are labelled
`<section>`s too. Counting only `main > section[aria-label]` fixed it.

```bash
# Kevin: commit, push, PR
git fetch
git checkout -b m1.2-pages origin/main
git add -A
git commit -m "M1.2: pages and chrome — all six spreads, contents, theme toggle, projects sheet"
git push -u origin m1.2-pages
```

## Phase 2 — The curl engine (2026-09-21)

```bash
pnpm test        # 72 tests (geometry: corner / mid-turn / fully turned; input: flick, snap, riffle)
pnpm build && pnpm start -p 3130
node curl-dod.mjs   # DevTools-protocol checks for M2.1–M2.6: 22/22
node dod.mjs        # M1.2 checks re-run after the refactor: 25/25
```

**Failed (test data):** the first "one flick turns one page" test flicked only 1158px, short of the 1200px I meant it
to cover (two turns' worth). Stronger flick in the test; the rule was right.

**Failed (test bugs, not site bugs):** "vertical scroll never turns" saw 430 "curl frames". The selector matched the
always-visible fold-line `<svg>`, and the test swiped down at the very top (which is the pull-back gesture). The M1.2
checks counted pages as direct children of `<main>` (they're now inside curl wrappers) and counted inert replicas.

```bash
# Kevin: commit, push, PR
git fetch
git checkout -b m2-curl origin/main
git add -A
git commit -m "Phase 2: the curl engine — fold math, auto-curl, drag, scroll, mobile peel, reduced motion"
git push -u origin m2-curl
```

## Polish after local testing (2026-09-21)

```bash
pnpm build && pnpm start -p 3000     # local test server (production build: the curl runs smoothly)
node flicker2.mjs                    # rapid screenshots across a turn → found the flap short of landing at the swap
node flicker4.mjs                    # screencast frames + pixel diffs between consecutive frames (sharp via Next)
node curl-dod.mjs && node dod.mjs    # 22/22 and 25/25 after the fixes
```

```bash
# Kevin: commit, push, PR
git fetch
git checkout -b polish-curl origin/main
git add -A
git commit -m "Polish: seamless turn handoff, ribbon pull-up, fitted project titles, contact tweaks"
git push -u origin polish-curl
```

## The notebook stays mounted (2026-09-21)

```bash
git mv src/app/page.tsx "src/app/(notebook)/page.tsx"        # routes into a route group with a shared layout
git mv src/app/timeline "src/app/(notebook)/timeline"         # (same for skills, contact, colophon)
```

**Failed:** `git mv src/app/projects …` → `Permission denied` (a Windows file lock, probably the running server). Moved
`projects/page.tsx` and `projects/[slug]/page.tsx` individually instead.

**Failed:** `tsc` → `Cannot find module '../../src/app/projects/page.js'` from stale `.next/types` after the move. `rm -rf .next`.

**Looked failed:** my frame-recording script's key press "did nothing". Git Bash had rewritten the `/timeline` argument
to `C:/Program Files/Git/timeline`, a 404. `MSYS_NO_PATHCONV=1 node glitch.mjs /timeline`.

```bash
node verify-persist.mjs   # 8/8: no page nodes change in a turn; no slide-in on arrival; no-JS routes correct
node curl-dod.mjs && node dod.mjs   # 22/22, 25/25

# Kevin: commit, push, PR
git fetch
git checkout -b persistent-notebook origin/main
git add -A
git commit -m "Keep the notebook mounted across routes: seamless turns, project slide-in only on switch"
git push -u origin persistent-notebook
```

## Four fixes: spine, riffle, page 8, flash (2026-09-21)

```bash
pnpm build && pnpm start -p 3000   # serve the production build locally
node four.mjs            # 9/9 (one check per reported problem)
node curl-dod.mjs        # 22/22
node dod.mjs             # 25/25
node verify-persist.mjs  # 8/8
pnpm lint && pnpm typecheck && pnpm test   # clean; 72 unit tests
```

**Looked failed:** `four.mjs` said the spine line wasn't on top. `document.elementsFromPoint` ignores elements with
`pointer-events: none` (the spine has it). A zoomed screenshot showed the line was there; the check now enables
pointer events on the line while it tests.

```bash
# Kevin: commit, push, PR
git fetch
git checkout -b four-fixes origin/main
git add -A
git commit -m "Restore the spine line, riffle real pages, show Minced mid-turn, stop turn flashes"
git push -u origin four-fixes
```

## Deploy check (2026-09-22)

```bash
gh api "repos/knp4830/portfolio/deployments?environment=Production&per_page=3"   # production deploys per merge to main
gh api repos/knp4830/portfolio/commits/8ab6f21/status   # Vercel: "Deployment has completed" (PR #10 on production)
curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://portfolio-minced.vercel.app
```

**Blocked:** `302` → `vercel.com/sso-api`. Production is behind Vercel Authentication too, not only previews.

**Failed:** the Vercel connector can't see `minced/portfolio` (`list_projects` shows only `mise`; `list_deployments` → 403,
`list_project_domains` → 404). Deployment settings have to be changed in the Vercel dashboard.

## Fanned riffle, p. 02 hint, frond scale (2026-09-22)

```bash
pnpm typecheck && pnpm lint && pnpm test   # 73 unit tests (new: riffle fan)
pnpm build && pnpm start -p 3000
node fan.mjs             # screenshots of the opening spread and a slowed (12×) opening → contact riffle
node four.mjs && node curl-dod.mjs && node dod.mjs && node verify-persist.mjs   # 9/9, 22/22, 25/25, 8/8
```

**Failed:** `pnpm start -p 3000` → `EADDRINUSE :::3000`. Stopping the old background task killed pnpm but not its
`next start` child. Found it by command line and stopped it (PowerShell):

```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like '*next*start*3000*' } | ForEach-Object { Stop-Process -Id $_.ProcessId }
```

```bash
# Kevin: commit, push, PR
git fetch
git checkout -b fanned-riffle origin/main
git add -A
git commit -m "Fan the contents riffle, move the turn-the-page hint to p. 02, clear the frond scale"
git push -u origin fanned-riffle
```

## Wheel, desk contents, corner hints (2026-09-22)

```bash
node desk.mjs            # 9/9: wheel never scrolls, contents boxes jump and mark the spread, hints in ink
node hints.mjs           # screenshots of pp. 1–2 and 3–4 with the new corner notes
node four.mjs && node curl-dod.mjs && node dod.mjs && node verify-persist.mjs && node switch.mjs
```

**Failed (test, not code):** `M2.4 a 30% scroll snaps back` and `a 40% scroll completes` after `SCROLL_PER_TURN`
600 → 420. The checks scrolled 18px and 24px per event, which used to be 30% and 40% of a turn. They now import
`SCROLL_PER_TURN` and scroll in tenths of a turn.

## Desk nav: words, not boxes (2026-09-22)

```bash
node desk.mjs   # 9/9 with the reworked nav checks (words, contents → contact, current underlined)
node four.mjs && node curl-dod.mjs && node dod.mjs && node verify-persist.mjs   # 9/9, 22/22, 25/25, 8/8
pnpm test       # 73

# Kevin: commit, push, PR
git fetch
git checkout -b desk-nav origin/main
git add -A
git commit -m "Make the desk contents a row of section names"
git push -u origin desk-nav
```
