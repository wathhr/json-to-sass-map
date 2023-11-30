import { defineConfig } from 'tsup';

// https://pauloe-me.medium.com/typescript-npm-package-publishing-a-beginners-guide-40b95908e69c

// Read the docs for this https://github.com/egoist/tsup
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
