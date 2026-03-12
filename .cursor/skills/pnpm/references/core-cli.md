# pnpm CLI (core)

## Install

- `pnpm install`
- CI/reproducible: `pnpm install --frozen-lockfile`
- Prefer not to use: `--no-frozen-lockfile` (only when you intentionally want lockfile updates)

## Add / remove

- Runtime dependency: `pnpm add <pkg>`
- Dev dependency: `pnpm add -D <pkg>`
- Optional dependency: `pnpm add -O <pkg>`
- Exact version: `pnpm add -E <pkg>@<ver>`
- Remove: `pnpm remove <pkg>`

## Update

- Update within ranges: `pnpm update`
- Update a package: `pnpm update <pkg>`
- Update to latest: `pnpm update --latest` (or `pnpm update <pkg> --latest`)

## Run commands

- Run script from `package.json`: `pnpm <script>` (shorthand for `pnpm run <script>`)
- Pass args to scripts: `pnpm <script> -- <args...>`
- Run local binary: `pnpm exec <cmd> [args...]`
- One-off binary/package: `pnpm dlx <pkg> [args...]`

## Introspection

- Why a dependency exists: `pnpm why <pkg>`
- List installed: `pnpm list` (add `--depth 999` for deep)
- Store location: `pnpm store path`
