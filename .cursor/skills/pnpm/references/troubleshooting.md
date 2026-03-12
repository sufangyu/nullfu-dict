# Troubleshooting

## Lockfile / install issues

- **`ERR_PNPM_OUTDATED_LOCKFILE` in CI**
  - Cause: lockfile differs from `package.json` / workspace manifests.
  - Fix: run `pnpm install` locally to update `pnpm-lock.yaml`, commit it, keep CI using `--frozen-lockfile`.

- **Unexpected dependency missing at runtime**
  - pnpm is strict; if code imports a package that is not in that package’s `dependencies`, it will fail.
  - Fix: add the missing dependency to the correct workspace package (often via `pnpm --filter <pkg> add <dep>`).

## Workspace / filter surprises

- **`--filter` selects nothing**
  - Confirm the package name matches `package.json#name`, or use a path filter like `--filter "./packages/core"`.

- **Script runs in the wrong package**
  - From workspace root, prefer `pnpm --filter <name> <script>` (single package) or `pnpm -r --filter <selector> <script>` (multi-package).

## Store / disk issues

- **Reclaim disk space**
  - `pnpm store prune`

## “Nuke it from orbit” (last resort)

If installs are badly corrupted:

- delete `node_modules/` (workspace root and packages if they have local ones)
- keep `pnpm-lock.yaml` unless you intentionally want a full re-resolve
- run `pnpm install`
