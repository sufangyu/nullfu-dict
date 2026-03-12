## Coverage

### CLI

- Run coverage: `vitest run --coverage`

### Config example

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/*.d.ts', '**/dist/**', '**/node_modules/**'],
    },
  },
})
```

### Guidance

- Prefer `vitest run --coverage` in CI over watch mode.
- Keep excludes minimal; exclude generated files and build output.
- Use HTML reports for local inspection; text summary for CI logs.

