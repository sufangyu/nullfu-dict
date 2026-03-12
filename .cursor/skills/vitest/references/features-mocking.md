## Mocking & spies

### `vi.fn()` for callbacks

```ts
import { expect, it, vi } from 'vitest'

it('calls callback', () => {
  const cb = vi.fn()
  cb('a', 1)
  expect(cb).toHaveBeenCalledWith('a', 1)
})
```

### `vi.spyOn()` for existing functions/methods

```ts
import { expect, it, vi } from 'vitest'

it('spies on Date.now', () => {
  const spy = vi.spyOn(Date, 'now').mockReturnValue(123)
  expect(Date.now()).toBe(123)
  spy.mockRestore()
})
```

### `vi.mock()` for modules

Rules of thumb:

- Prefer module mocks at top-level (hoisted) so imports see the mocked version.
- For partial mocks, use `vi.importActual()` and spread the actual exports.
- Reset carefully:
  - `vi.clearAllMocks()` clears call history
  - `vi.restoreAllMocks()` restores original implementations for spies
  - `vi.resetModules()` resets module cache (useful if per-test import state matters)

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./api', () => ({
  fetchThing: vi.fn(async () => ({ ok: true })),
}))

describe('consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses mocked api', async () => {
    const api = await import('./api')
    const r = await api.fetchThing()
    expect(r).toEqual({ ok: true })
    expect(api.fetchThing).toHaveBeenCalledTimes(1)
  })
})
```

### Fake timers

- `vi.useFakeTimers()` then `vi.advanceTimersByTime(ms)` / `vi.runAllTimers()`
- Always `vi.useRealTimers()` in `afterEach`

