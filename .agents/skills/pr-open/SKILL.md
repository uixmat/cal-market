---
name: pr-open
description: >-
  Run pre-PR quality gates (Ultracite, ESLint, build), fix issues, then push and
  open a GitHub PR—or re-run checks only when updating an existing PR. Use when
  the user asks to open a PR, prepare a pull request, ship changes, or validate
  before updating an existing PR.
---

# PR Open

Prepare Discover changes for GitHub: lint, build, fix, commit, push, and optionally open a PR.

## Modes

Determine mode from the user request:

| Mode       | When                                                      | Push | Open PR              |
| ---------- | --------------------------------------------------------- | ---- | -------------------- |
| **open**   | User wants a new PR                                       | Yes  | Yes (`gh pr create`) |
| **update** | User is updating an existing PR / branch already has a PR | Yes  | No                   |

If unclear, default to **open** when there is no open PR for the current branch; otherwise **update**.

## Prerequisites

- Node.js **≥22.18** (Ultracite TS configs). Use `nvm use` with repo `.nvmrc`.
- pnpm 9+ (`corepack enable`)
- `gh` authenticated
- Changes on a feature branch (not `main`)

Create a branch if still on `main`:

```bash
git checkout -b feat/<short-description>
```

## Quality gate (both modes)

Run from repo root. **Do not skip steps.** Fix failures and re-run until all pass.

```bash
pnpm install
pnpm fix          # Ultracite auto-fix (Oxlint + Oxfmt)
pnpm check        # Ultracite check — must exit 0
pnpm build        # Production build (@cal-market/web)
```

### Fix loop

1. Read the failing command output.
2. Apply minimal fixes (prefer `pnpm fix` for format/lint auto-fixes).
3. Re-run the failed command, then re-run the full gate if multiple steps failed.
4. Do not commit secrets (`.env`, API keys).

### Common failures

| Failure                                | Fix                                                          |
| -------------------------------------- | ------------------------------------------------------------ |
| Ultracite Node version                 | Upgrade to Node ≥22.18 (`nvm install 22 && nvm use`)         |
| `DATABASE_URL is not set` during build | Ensure root `.env` exists locally; CI uses workflow env vars |
| ESLint in `apps/web`                   | Fix reported files; match existing COSS/Next patterns        |
| Type errors on build                   | Fix types in changed packages; run `pnpm build` again        |

## Git workflow (open mode)

After quality gate passes:

1. `git status`, `git diff`, `git log -5` — understand changes
2. Stage relevant files (never `.env` or secrets)
3. Commit with a concise message (why, not what laundry list)
4. `git push -u origin HEAD`
5. Open PR:

```bash
gh pr create --title "..." --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [ ] `pnpm check` passes
- [ ] `pnpm build` passes
- [ ] ...

EOF
)"
```

Return the PR URL to the user.

## Git workflow (update mode)

After quality gate passes:

1. Stage and commit fixes (same safety rules as open mode)
2. `git push`
3. **Do not** run `gh pr create`
4. Summarize what was fixed and that the existing PR is updated

Optionally comment on the PR with `gh pr comment` if the user asked for a summary.

## Alignment with CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR:

- `pnpm check` (Ultracite — Oxlint + Oxfmt)
- `pnpm build`

Local quality gate must match CI before push.

## Out of scope

- Force push to `main`
- `--no-verify` unless user explicitly requests
- Opening a second PR for a branch that already has one (update mode instead)
