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
