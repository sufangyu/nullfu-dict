## Test environments

Choose the smallest environment that matches what you test.

### `node`

Use for pure modules and server-side logic.

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

### `jsdom`

Use for DOM APIs and component tests.

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
```

### `happy-dom`

Often faster than jsdom for some suites; still not a full browser.

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
})
```

### Guidance

- If you need browser-only behavior (layout, canvas rendering quirks), use e2e tools instead.
- If tests fail only in CI, check timezone/locale and consider setting them explicitly.

