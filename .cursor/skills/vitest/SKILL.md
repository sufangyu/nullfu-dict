---
name: vitest
description: Vitest unit testing skill for Vite projects. Use when writing or updating tests, setting up Vitest config (node/jsdom), mocking modules/timers, enabling coverage, or using Vitest CLI/watch/filtering.
---

# Vitest

Vitest is a fast unit testing framework powered by Vite with a Jest-compatible API. Prefer Vitest when this repo uses Vite and TypeScript.

## Quick start (do this first)

- Identify the test target:
  - Pure functions/modules → `environment: 'node'`
  - DOM/components → `environment: 'jsdom'` (or `happy-dom`)
- Locate config:
  - If repo already has a Vite config, prefer `vite.config.ts` with a `test:` block.
  - Otherwise add `vitest.config.ts` with `defineConfig`.
- Ensure `package.json` has scripts:
  - `test`: `vitest`
  - `test:watch`: `vitest --watch`
  - `test:run`: `vitest run`
  - `test:coverage`: `vitest run --coverage`

If scripts already exist, follow the project’s naming and only add missing ones.

## Authoring tests (defaults)

- Use BDD style: `describe`, `it`/`test`, `expect`
- Prefer deterministic tests:
  - No real time/network/filesystem unless explicitly needed
  - Use fake timers and module mocks when appropriate
- Keep assertions specific:
  - Prefer `toBe`, `toEqual`, `toMatchObject`, `toThrow`, `toHaveBeenCalledWith`

## Common patterns

### Basic test file

```ts
import { describe, expect, it } from 'vitest'

describe('sum', () => {
  it('adds two numbers', () => {
    expect(1 + 2).toBe(3)
  })
})
```

### Table-driven tests

```ts
import { describe, expect, it } from 'vitest'

describe('clamp', () => {
  it.each([
    { v: -1, min: 0, max: 10, out: 0 },
    { v: 5, min: 0, max: 10, out: 5 },
    { v: 99, min: 0, max: 10, out: 10 },
  ])('clamps $v to $out', ({ v, min, max, out }) => {
    expect(Math.min(max, Math.max(min, v))).toBe(out)
  })
})
```

## Mocking & spies (vi)

Use `vi.fn()` for callbacks, `vi.spyOn()` for existing methods, and `vi.mock()` for modules.

### Spy on a method

```ts
import { describe, expect, it, vi } from 'vitest'

describe('logger', () => {
  it('calls console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    console.error('x')
    expect(spy).toHaveBeenCalledWith('x')
    spy.mockRestore()
  })
})
```

### Mock a module (partial)

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./dep', async () => {
  const actual = await vi.importActual<typeof import('./dep')>('./dep')
  return {
    ...actual,
    expensive: vi.fn(() => 123),
  }
})

describe('uses dep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses mocked function', async () => {
    const dep = await import('./dep')
    expect(dep.expensive()).toBe(123)
  })
})
```

### Fake timers

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('timers', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('advances time', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    setTimeout(fn, 1000)
    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
```

## Configuration checklist

Follow these conventions unless the repo already uses different ones.

- **File patterns**: `**/*.{test,spec}.ts` and `**/__tests__/**/*.ts`
- **Globals**: prefer `globals: false` (explicit imports), unless existing tests rely on globals
- **Setup file**: use `test.setup.ts` for global hooks/matchers
- **Alias resolution**: reuse Vite `resolve.alias` so app imports work in tests
- **Environment**:
  - `node` for modules
  - `jsdom` for DOM

See:
- Config patterns: [references/core-config.md](references/core-config.md)
- CLI usage: [references/core-cli.md](references/core-cli.md)
- Mocking: [references/features-mocking.md](references/features-mocking.md)
- Coverage: [references/features-coverage.md](references/features-coverage.md)
- Environments: [references/advanced-environments.md](references/advanced-environments.md)

## When diagnosing failures

- Re-run a single file: `vitest path/to/file.test.ts`
- Filter by name: `vitest -t "pattern"`
- Inspect failed snapshots: run with `-u` only when snapshot update is intended
- If a test is flaky:
  - remove shared mutable state
  - add `vi.restoreAllMocks()` / `vi.resetModules()` as needed
  - avoid relying on wall-clock time, locale, timezone, or random seeds

