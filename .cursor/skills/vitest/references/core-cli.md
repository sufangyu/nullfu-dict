## Core CLI

Run tests:

- Watch (default): `vitest`
- Run once (CI): `vitest run`
- Single file: `vitest path/to/foo.test.ts`
- Filter by test name: `vitest -t "pattern"`

Debugging:

- Increase verbosity: `vitest --reporter verbose`
- Run a subset (fast iteration): `vitest -t "pattern" path/to/file.test.ts`
- Update snapshots (only when intended): `vitest -u`

Coverage:

- `vitest run --coverage`
- Optionally add config via `test.coverage` in config file.

