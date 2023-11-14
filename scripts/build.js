#!/bin/env node
// @ts-check

import { createRequire } from 'node:module';
import * as esbuild from 'esbuild';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

/** @type {esbuild.BuildOptions[]} */
const builds = [{
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  minify: false,
  bundle: true,
  sourcemap: 'linked',
  external: [
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.dependencies ?? {}),
  ],
  platform: 'neutral',
  format: 'esm',
  logLevel: 'info',
}];

if (process.argv.includes('--bin')) builds.push({
  entryPoints: ['./src/bin.ts'],
  outfile: './dist/bin.js',
  banner: {
    'js': '#!/usr/bin/env node',
  },
  minify: false,
  bundle: false,
  sourcemap: false,
  platform: 'node',
  format: 'esm',
  logLevel: 'info',
});

builds.map(async (context) => {
  if (process.argv.includes('--watch')) return (await esbuild.context(context)).watch();
  return await esbuild.build(context);
});
