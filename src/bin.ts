//! This file can only import packages, the `./index.ts` file and types.
// TODO: Find a way to show this using tsconfig maybe

import { parseArgs, ParseArgsConfig } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';
import { objectToMap } from './index.js'; // 🧌
import type { ExtraOptionDataObject } from 'types';
import { basename } from 'node:path';

export const options = {
  input: {
    type: 'string',
    multiple: true,
    short: 'i',
  },
  output: {
    type: 'string',
    short: 'o',
  },
  name: {
    type: 'string',
    short: 'n',
  },
  syntax: {
    type: 'string',
    short: 's',
  },
} as const satisfies ParseArgsConfig['options'];

export type OptionsType = typeof options;

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options,
});

const defaults: ExtraOptionDataObject = {
  input: positionals,
  output: args.output ?? args.name ?? 'map',
  name: args.name ?? args.output ?? 'map',
  syntax: 'scss',
};

const values: typeof args = {
  ...defaults,
  ...args,
};

if (
  !values.syntax ||
  !['sass', 'scss'].includes(values.syntax)
) throw new Error('Syntax needs to be either "sass" or "scss"');
if (!values.input || values.input.length === 0) throw new Error('You need to specify at least one input file.');
if (!values.output) throw new Error('You need to specify an output location.'); // i hate that i had to specify this

const syntax = values.syntax as 'sass' | 'scss'; // i love typescript

for (const file of values.input) {
  const json = await readFile(file)
    .then((data) => data ? JSON.parse(data.toString()) : undefined)
    .catch(console.error);

  if (!json) {
    console.warn(`\nFailed to read or parse "${file}". Skipping.`);
    continue;
  }

  const output = (values.input.length === 1
    ? values.output
    : (values.output + '-' + (basename(file).split('.')[0] ?? 'file'))) + '.' + syntax;

  console.log(`Converting "${file}" to "${output}"...`);
  writeFile(output, objectToMap(json, {
    syntax,
    name: values.name
  })).catch(console.error)
    .then(() => console.log(`Converted "${file}" to "${output}" successfully.`));
}
