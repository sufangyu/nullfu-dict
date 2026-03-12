---
name: pnpm
description: pnpm package manager workflow for Node.js repos. Use when installing dependencies, adding/removing/updating packages, running scripts, working in pnpm workspaces/monorepos, fixing lockfile/install issues, or converting npm/yarn commands to pnpm.
---

# pnpm

pnpm is a fast package manager with strict dependency resolution and a shared content-addressable store.

## Quick start (do this first)

- Detect pnpm usage:
  - Prefer pnpm when `pnpm-lock.yaml` exists or `packageManager` in `package.json` is `pnpm@...`.
  - For monorepos, check `pnpm-workspace.yaml` and prefer workspace-aware commands.
- Prefer repeatable installs:
  - Local dev: `pnpm install`
  - CI: `pnpm install --frozen-lockfile`

## Common commands

- Install dependencies: `pnpm install`
- Add dependency:
  - runtime: `pnpm add <pkg>`
  - dev: `pnpm add -D <pkg>`
  - exact: `pnpm add -E <pkg>`
- Remove dependency: `pnpm remove <pkg>`
- Update dependencies:
  - within ranges: `pnpm update`
  - latest: `pnpm update --latest`
- Run scripts:
  - in current package: `pnpm <script>`
  - list scripts: `pnpm run`
- Execute binaries:
  - project bin: `pnpm exec <cmd>`
  - one-off: `pnpm dlx <pkg> [args...]`

## Workspaces / monorepo essentials

- Run in all packages: `pnpm -r <script>`
- Target specific packages:
  - `pnpm -r --filter <name> <script>`
  - `pnpm -r --filter "./packages/*" <script>`
  - include deps: `pnpm -r --filter "<name>..." <script>`
- Add dependency to a workspace package:
  - from workspace root: `pnpm --filter <name> add <pkg>`
- Depend on a workspace package:
  - `pnpm add <workspace-pkg> --workspace`
  - or in `package.json`: `"dep": "workspace:*"`

See:
- CLI basics: [references/core-cli.md](references/core-cli.md)
- Workspace patterns: [references/core-workspaces.md](references/core-workspaces.md)
- Config & files: [references/core-config.md](references/core-config.md)
- Troubleshooting: [references/troubleshooting.md](references/troubleshooting.md)

## Defaults for this repo

- Use pnpm by default (repo includes `pnpm-workspace.yaml`).
- Prefer workspace-aware commands (`-r`, `--filter`) instead of running per-package manually.
