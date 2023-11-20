import { color } from '#structs';
import { is } from 'superstruct';
import { convertColorToString } from './convertColorToString.js';

export function convertToSassValue<T extends any>(item: T, syntax: 'sass' | 'scss', depth = 0): string {
  const type = typeof item;
  const isSass = syntax === 'sass';

  // unsupported
  if (['symbol', 'undefined', 'function'].includes(type)) throw new Error(`Unsupported value: ${item}`);

  // list
  if (Array.isArray(item)) return `(${item.map((i) => convertToSassValue(i, syntax, depth)).join(', ')}, )`;

  // color
  if (is(item, color)) return convertColorToString(item);

  // map
  if (type === 'object') {
    if (isSass) depth = 0;
    else depth++;

    const lines = ['('];
    for (const key in item) {
      const value = item[key];

      lines.push(`${'  '.repeat(depth)}${String(key)}: ${convertToSassValue(value, syntax, depth)},`);
    }

    lines.push(`${'  '.repeat(isSass ? 0 : depth - 1)})`);
    return lines.join(isSass ? ' ' : '\n');
  }

  // string
  if (type === 'string') return `'${item}'`;

  // everything else
  return String(item);
}
