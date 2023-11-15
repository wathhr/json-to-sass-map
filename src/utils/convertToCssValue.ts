import { is } from 'superstruct';
import { convertColorToString } from './convertColorToString';
import { color } from '#structs';

export function convertToCssValue(item: any): string {
  const type = typeof item;

  // unsupported
  if (['symbol', 'undefined', 'function'].includes(type)) throw new Error(`Unsupported value: ${item}`);

  // color
  if (is(item, color)) return convertColorToString(item);

  // string
  if (type === 'string') return `'${item}'`;

  // everything else
  return String(item);
}
