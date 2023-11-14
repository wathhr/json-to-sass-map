import { convertToSassValue } from '#utils';

export function objectToMap<T extends object>(object: T, syntax: 'sass' | 'scss' = 'scss', name = 'map') {
  const isSass = syntax === 'sass';

  return `$${name}: ${convertToSassValue(object, syntax)} !default${isSass ? '' : ';'}`;
}
