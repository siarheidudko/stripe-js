# stripe-js — instructions for Claude

Enhanced methods for `@stripe/stripe-js`. Published to npm as `@sergdudko/stripe-js`.

## Stack

- TypeScript (`tsc`), targeting CJS + ESM dual build with type declarations.
- ESLint + Prettier.
- Test runner: `node --test` with `tsx` import, wrapped by `nyc` for coverage.

## Commands you must know

```bash
npm run lint           # ESLint over src/**/*.ts — must exit 0
npm run build          # Clean (via prebuild) + tsc CJS + tsc ESM + write package.json shims
npm run test:only      # Direct test suite (no rebuild) — used by PR checks
npm test               # pretest (build) + test:only — used by autoupdate verification
npm run test:local     # Same as test:only but with .env.local secrets (local dev)
```

## Definition of "done" for any change you make

You are NOT done with a code change until **all three** of the following exit 0 in the working tree on the branch you're going to push:

```bash
npm run lint
npm run build
npm test
```

Run these explicitly with the `Bash` tool before your last commit on the branch. Do not assume "the change looks right" is sufficient — `tsc` errors and ESLint errors must be observed as exit code 0, not inferred. If any of them fail, fix the failure and re-run all three from a clean state until they all pass. Only then commit and push.

If `npm install` is needed (e.g. lockfile changed), run it with `--no-audit --no-fund` and ensure it returned 0 before running checks.

## Test secrets

CI loads `STRIPE_TEST_PK` and `STRIPE_TEST_SK` from repo secrets. Locally, copy them into `.env.local` and run `npm run test:local`. Do not commit `.env*` files.

## Boundaries

- Do not modify product logic when fixing dependency-compatibility issues. Acceptable edits: type adjustments, renamed exports, breaking-change shims, ESLint-config tweaks for new rule defaults.
- Do not bump the package `version` manually. Versioning is handled by the autoupdate flow / maintainer on release.
- Do not edit `.github/workflows/build-and-deploy.yml` unless explicitly asked — it is the release pipeline.
- Do not push to `main` directly. Always work on the existing branch you were summoned to.

## When you are working on an autoupdate PR

- Branch will be `chore/autoupdate-<run_id>`.
- Goal: bring `npm run lint && npm run build && npm test` to green.
- Push compatibility fixes onto this branch. Each push re-runs `pr-checks.yml` automatically; you don't need to mention checks back to the maintainer until they're green.
- If a fix is impossible without changing product behavior, stop and leave a comment explaining what's blocked rather than guessing.

## CI quirks specific to this repo

This repo follows the unified `autoupdate-with-claude` baseline. Several workarounds are intentional:
- `autoupdate.yml` uses `GITHUB_TOKEN` and explicitly dispatches `pr-checks.yml` after PR creation.
- `autoupdate.yml` dispatches `claude.yml` directly via `workflow_dispatch` instead of an `@claude` comment.
- Releases are wired via `release-on-version-bump.yml`.
- All actions pinned to the `@v4` line because the runner image currently lacks `externals/node24`.
- Test jobs require `STRIPE_TEST_PK` + `STRIPE_TEST_SK` secrets; without them tests will fail.

Do **not** "fix" any of the above by replacing dispatch calls with comment-based mentions, or by bumping action versions back to `@v5/@v6`.
