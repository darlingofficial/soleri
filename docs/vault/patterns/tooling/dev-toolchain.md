# Dev Toolchain — Soleri Monorepo

**Type:** pattern
**Domain:** tooling
**Severity:** critical
**Tags:** linting, formatting, dead-code, security, ci, hooks

## Overview

Soleri uses a Rust-based (Oxc) toolchain for speed, with three enforcement layers: pre-commit hooks, CI gates, and weekly scheduled audits.

## Tools

| Tool              | Version | Purpose                                                         |
| ----------------- | ------- | --------------------------------------------------------------- |
| oxlint            | ^1.51.0 | TypeScript/JavaScript linter (Rust, 50-100x faster than ESLint) |
| oxfmt             | ^0.35.0 | Code formatter (Rust, replaces Prettier)                        |
| secretlint        | ^11.3.1 | Leaked secrets scanner                                          |
| markdownlint-cli2 | ^0.21.0 | Markdown linting                                                |
| cspell            | ^9.7.0  | Spell checking for docs                                         |
| knip              | ^5.85.0 | Dead code detection (unused files, exports, dependencies)       |
| ts-prune          | ^0.10.3 | Unused TypeScript exports (secondary cross-check)               |
| lint-staged       | ^16.3.2 | Runs linters on git-staged files only                           |
| husky             | ^9.1.7  | Git hooks manager                                               |

All tools are root-level devDependencies — they govern the entire monorepo, not individual packages.

## Three Enforcement Layers

### 1. Pre-commit (fast, staged files only)

Triggered by husky → lint-staged on every `git commit`.

**TypeScript files** (`packages/*/src/**/*.ts`):

1. `oxfmt` — auto-format
2. `oxlint --fix` — lint + auto-fix
3. `secretlint` — scan for leaked secrets

**Markdown files** (`*.md`):

1. `markdownlint-cli2` — structural lint
2. `cspell` — spell check

### 2. CI Quality Gate (thorough, full codebase)

Runs on every push to `main` and every PR. Parallel job alongside `forge` (build+test) and `website` (HTML validation).

Steps: oxlint → oxfmt --check → secretlint → markdownlint → cspell → knip

### 3. Weekly Dead Code Audit (scheduled)

`.github/workflows/deadcode.yml` — runs every Monday 9:00 UTC (also supports manual trigger).

- Runs knip + ts-prune on the full codebase
- If dead code found: creates/updates a GitHub issue labeled `dead-code`
- If clean: no issue created
- Reuses the same open issue (no duplicates) — closing it means next finding creates a fresh one

## Config Files

| File                       | Purpose                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `.oxlintrc.json`           | Linter rules — correctness, perf, suspicious categories. Test files get relaxed rules. |
| `.oxfmtrc.jsonc`           | Formatter — single quotes, 100 char width, organize imports, sort package.json         |
| `.secretlintrc.json`       | Secret detection with recommended preset                                               |
| `.secretlintignore`        | Excludes dist/, node_modules/, website/, package-lock.json                             |
| `.markdownlint.json`       | Markdown rules — relaxed heading structure, allows HTML                                |
| `.markdownlint-cli2.jsonc` | File globs for markdownlint — README, CHANGELOG, docs/\*_/_.md, packages/\*/README.md  |
| `.markdownlintignore`      | Excludes node_modules                                                                  |
| `cspell.json`              | Dictionary with project-specific words (soleri, gaudi, oxlint, etc.)                   |
| `knip.config.ts`           | Workspace-aware dead code config — maps npm workspaces to analysis scopes              |
| `.husky/pre-commit`        | Runs `npx lint-staged`                                                                 |

## npm Scripts

| Script                      | Command                   | When to use             |
| --------------------------- | ------------------------- | ----------------------- |
| `npm run lint`              | `oxlint packages/`        | Check lint errors       |
| `npm run lint:fix`          | `oxlint packages/ --fix`  | Auto-fix lint errors    |
| `npm run format`            | `oxfmt packages/`         | Auto-format all code    |
| `npm run format:check`      | `oxfmt --check packages/` | Verify formatting (CI)  |
| `npm run lint:md`           | `markdownlint-cli2`       | Lint markdown files     |
| `npm run lint:spell`        | `cspell --no-progress`    | Spell check docs        |
| `npm run secrets:check`     | `secretlint packages/`    | Scan for leaked secrets |
| `npm run deadcode:knip`     | `knip`                    | Full dead code analysis |
| `npm run deadcode:ts-prune` | `ts-prune`                | Unused exports check    |

## Key Decisions

| Decision                           | Rationale                                                        |
| ---------------------------------- | ---------------------------------------------------------------- |
| Oxc toolchain over ESLint+Prettier | 50-100x faster, single ecosystem, Rust-native                    |
| Root-level devDeps                 | Git hooks fire from repo root; one config for all packages       |
| knip not in pre-commit             | Needs full codebase analysis, too slow for per-file              |
| ts-prune manual-only               | Secondary cross-check tool, knip covers most cases               |
| Weekly audit → GitHub issue        | Non-blocking but ensures visibility; paper trail for tech debt   |
| File-based report passing in CI    | Avoids injection risks from tool output containing special chars |

## Anti-Patterns

- **Don't skip hooks with `--no-verify`** — if a hook fails, fix the root cause
- **Don't add `// @ts-ignore` to suppress oxlint** — fix the actual issue or configure the rule
- **Don't commit `.secretlintignore` changes without review** — could mask leaked secrets
- **Don't close the dead-code issue without addressing findings** — it will reopen next week
