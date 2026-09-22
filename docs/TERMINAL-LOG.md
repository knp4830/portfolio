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
