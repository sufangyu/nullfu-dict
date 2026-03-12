# pnpm configuration & files

## Key files

- `pnpm-lock.yaml`: lockfile (commit to VCS)
- `pnpm-workspace.yaml`: workspace package globs and workspace-level config
- `.npmrc`: pnpm/npm config (often used for store, shamefully-hoist, registries, auth, etc.)
- `package.json`:
  - `packageManager`: preferred manager/version (e.g. `pnpm@10.x`)
  - `pnpm.overrides`: force dependency versions (including transitive)

## Common `.npmrc` knobs (project-level)

- `public-hoist-pattern[]=`: selectively hoist packages (escape hatch; prefer fixing phantom deps instead)
- `auto-install-peers=`: automatically install peer deps (project choice)
- `strict-peer-dependencies=`: fail on peer issues (often true in strict repos)
- `node-linker=`: installation strategy (default is usually fine; don’t change unless required)

## CI default

- Prefer `pnpm install --frozen-lockfile` to ensure lockfile is respected.
