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
