# pnpm workspaces

pnpm workspaces are defined by `pnpm-workspace.yaml` (package globs) and share a single lockfile at the workspace root by default.

## Recursive execution (`-r`)

- Run a script in all workspace packages:
  - `pnpm -r test`
  - `pnpm -r build`
- Run a command (not a script):
  - `pnpm -r exec eslint .`

## Filtering (`--filter`)

Filter accepts package names and selectors.

- By package name:
  - `pnpm -r --filter <name> test`
- By path/glob:
  - `pnpm -r --filter "./packages/*" build`
- Include dependencies / dependents:
  - `<name>...` includes dependencies
  - `...<name>` includes dependents
  - `...<name>...` includes both

Examples:

- Build a package and its deps:
  - `pnpm -r --filter "core..." build`
- Lint everything affected by a package (dependents):
  - `pnpm -r --filter "...core" lint`

## Adding deps to one package

From workspace root:

- `pnpm --filter <name> add <pkg>`
- `pnpm --filter <name> add -D <pkg>`

## Workspace protocol (`workspace:*`)

Use the workspace protocol to depend on local workspace packages without pinning a published semver:

- In `package.json`: `"dep": "workspace:*"`

Common variants:
- `workspace:^` / `workspace:~` to mirror ranges (when publishing packages)
- `workspace:*` for “always link to workspace version”
