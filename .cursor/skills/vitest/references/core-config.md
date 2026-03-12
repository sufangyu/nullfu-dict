## Core config (Vitest + Vite)

Prefer colocating Vitest config under `test:` in `vite.config.ts` so it shares Vite plugins/aliases.

### Example `vite.config.ts`

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.ts', '**/__tests__/**/*.ts'],
    environment: 'node',
    globals: false,
    setupFiles: ['./test.setup.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
})
```

### DOM environment

Use this for DOM/component tests:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
```

### Common knobs

- `environment`: `node` | `jsdom` | `happy-dom`
- `setupFiles`: global setup module(s)
- `include` / `exclude`: file patterns
- `restoreMocks` / `clearMocks` / `mockReset`: pick the least surprising default for the repo
- `pool`: worker pool configuration when debugging concurrency issues

