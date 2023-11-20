import { is } from 'superstruct';
import { convertColorToString } from './convertColorToString.js';
import { color } from '#structs';

export function convertToCssValue(item: any): string {
  const type = typeof item;

  // unsupported
  if (['symbol', 'undefined', 'function'].includes(type)) throw new Error(`Unsupported value: ${item}`);

  // array
  if (Array.isArray(item)) return `'${item.join(' ')}'`;

  // color
  if (is(item, color)) return convertColorToString(item);

  // string
  if (type === 'string') return `'${item}'`;

  // everything else
  return String(item);
}
