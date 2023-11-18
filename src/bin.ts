//! This file can only import packages, the `./index.ts` file and types.
// TODO: Find a way to show this using tsconfig maybe

import { parseArgs, ParseArgsConfig } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';
import { objectToMap, objectToProps } from './index.js';
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
  language: {
    type: 'string',
    short: 'l',
  },
  selector: {
    type: 'string',
    short: 's',
  }
} as const satisfies ParseArgsConfig['options'];

export type OptionsType = typeof options;

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options,
});

const defaults: ExtraOptionDataObject = {
  input: positionals,
  output: 'out',
  name: args.language === 'css' ? '' : 'map',
  language: 'scss',
  selector: ':root'
};

const values: typeof args = {
  ...defaults,
  ...args,
};

if (values.language === 'scss' && args.selector) console.warn(`The "--selector" option is ignored for "scss" syntax.`);

if (
  !values.language ||
  !['css', 'sass', 'scss'].includes(values.language)
) throw new Error('Syntax needs to be either "sass" or "scss"');
if (!values.input || values.input.length === 0) throw new Error('You need to specify at least one input file.');
if (!values.output) throw new Error('You need to specify an output location.'); // i hate that i had to specify this

const language = values.language as 'css' | 'sass' | 'scss'; // i love typescript

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
    : (values.output + '-' + (basename(file).split('.')[0] ?? 'file'))) + '.' + language;

  console.log(`Converting "${file}" to "${output}"...`);
  const content = language === 'css'
    ? objectToProps(json, { selector: values.selector, prefix: values.name })
    : objectToMap(json, { syntax: language, name: values.name });

  writeFile(output, content)
    .catch(console.error)
    .then(() => console.log(`Converted "${file}" to "${output}" successfully.`));
}
