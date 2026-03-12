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
      // copyFilesPlugin({
      //   targets: [
      //     {
      //       src: path.join(__dirname, 'dist/index.umd.js'),
      //       dest: path.join(__dirname, '../../', 'examples/native'),
      //     },
      //   ],
      // }),
    ],
    build: {
      sourcemap: IS_DEV,
      minify: IS_DEV ? false : 'esbuild',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'DictUtils',
        formats: ['es', 'cjs', 'umd'],
        fileName: format => `index.${format}.js`,
      },
    },
  };
});
