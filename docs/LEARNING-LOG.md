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
