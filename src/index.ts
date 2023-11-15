import { convertToCssValue, convertToSassValue } from '#utils';

type MapOpts = {
  syntax: 'sass' | 'scss';
  name: string;
};
export function objectToMap<T extends Record<string, any>>(object: T, opts: Partial<MapOpts> = {}) {
  const { syntax = 'scss', name = 'map' } = opts;
  const isSass = syntax === 'sass';

  return `$${name}: ${convertToSassValue(object, syntax)} !default${isSass ? '' : ';'}`;
}

type PropsOpts = {
  prefix: string | false | null | undefined;
  selector: string;
};
export function objectToProps<T extends Record<string, any>>(object: T, opts: Partial<PropsOpts> = {}) {
  const { prefix = undefined, selector = ':root' } = opts;
  const lines: (string | undefined)[] = [selector ? `${selector} {` : undefined];

  function handleObject(object: T, prefix: PropsOpts['prefix']) {
    prefix = prefix ? prefix + '-' : '';
    for (const key in object) {
      const value = object[key];

      if (typeof value === 'object') return handleObject(value, `${prefix}${String(key)}`);
      else lines.push(`  --${prefix}${String(key)}: ${convertToCssValue(value)};`);
    }
  }

  handleObject(object, prefix);

  if (selector) lines.push('}');
  return lines.join('\n');
}
