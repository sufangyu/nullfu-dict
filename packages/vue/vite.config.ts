import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const IS_DEV = mode === 'development';

  return {
    root: __dirname,
    plugins: [
      dts({
        outDir: 'types',
        entryRoot: 'src',
        tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
        rollupTypes: true,
        insertTypesEntry: true,
        include: ['src/**/*.ts', 'src/**/*.d.ts'],
        exclude: ['node_modules', 'dist'],
      }),
    ],
    build: {
      sourcemap: IS_DEV,
      minify: IS_DEV ? false : 'esbuild',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs'),
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  };
});
