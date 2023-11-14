// TODO: Make these optionally strict (error if for example angle is above 360deg)
// TODO: Support the `none` keyword

import { min, number, object, size, union, pattern, string, trimmed, defaulted, optional, literal } from 'superstruct';
import toRegexRange from 'to-regex-range';
import { NumRange } from 'types';

function numWithUnit(range: NumRange, unit: string) {
  const regexRange = toRegexRange(range.min ?? 0, range.max);
  const regex = new RegExp(`^${regexRange}${unit}$`);

  return pattern(string(), regex);
};

const percentage = numWithUnit({ min: 0, max: 100 }, '%');
const alpha = optional(defaulted(union([number(), percentage]), 1));
const angle = numWithUnit({ min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }, 'deg');

export const colorRGB = object({
  r: number(),
  g: number(),
  b: number(),
  A: alpha,
});

export const colorHSL = object({
  h: union([number(), angle]),
  s: percentage,
  l: percentage,
  A: alpha,
});

export const colorHWB = object({
  h: union([number(), angle]),
  w: percentage,
  b: percentage,
  A: alpha,
});

export const colorOldLab = object({
  ok: literal(false),
  l: union([number(), angle]),
  a: union([percentage, size(number(), -125, 125)]),
  b: union([percentage, size(number(), -125, 125)]),
  A: alpha,
});

export const colorOldLCH = object({
  ok: literal(false),
  l: union([number(), percentage]),
  c: union([number(), percentage]),
  h: union([number(), angle]),
  A: alpha,
});

export const colorOkLab = object({
  ok: optional(literal(true)),
  l: union([number(), percentage]),
  a: union([number(), percentage]),
  b: union([number(), percentage]),
  A: alpha,
});

export const colorOkLCH = object({
  ok: optional(literal(true)),
  l: union([number(), percentage]),
  c: union([min(number(), 0), percentage]),
  h: union([number(), angle]),
  A: alpha,
});

export const colorLab = union([colorOkLab, colorOldLab]);
export const colorLCH = union([colorOkLCH, colorOldLCH]);

// TODO: Add color()
export const color = union([
  //! https://github.com/Kyza/color-regex/
  pattern(trimmed(string()), /^(#)(?:([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?|([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])?)|(rgb|rgba)\((?:\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s*,\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s*,\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)(?:\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*|\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s*|\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*|\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s*|\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\.[0-9]+)?|255(?:\.0+)?|\.[0-9]+)(?:\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*|\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*)\)|(hsl|hsla)\((?:\s*(-?[0-9]+(?:\.[0-9]+)?(?:deg|rad|grad|turn)?)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*|\s*(-?[0-9]+(?:\.[0-9]+)?(?:deg|rad|grad|turn)?)\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:\s*,\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*|\s*(-?[0-9]+(?:\.[0-9]+)?(?:deg|rad|grad|turn)?)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s*)\)|(hwb)\(\s*(-?[0-9]+(?:\.[0-9]+)?(?:deg|rad|grad|turn)?)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:(?:\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*)?\)|(lab|oklab)\(\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?)\s+(-?(?:0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|(?:0|1(?:[0-1][0-9]?|2[0-4]?|[3-9])?|[2-9][0-9]?)(?:\.[0-9]+)?|125(?:\.0+)?))\s+(-?(?:0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|(?:0|1(?:[0-1][0-9]?|2[0-4]?|[3-9])?|[2-9][0-9]?)(?:\.[0-9]+)?|125(?:\.0+)?))\s*(?:(?:\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*)?\)|(lch|oklch)\(\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?)\s+(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|(?:0|1(?:[0-4][0-9]?|[5-9])?|[2-9][0-9]?)(?:\.[0-9]+)?|150(?:\.0+)?)\s+(-?[0-9]+(?:\.[0-9]+)?(?:deg|rad|grad|turn)?)\s*(?:(?:\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*)?\)|(color)\((?:(srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020)(?:\s+|\s*,\s*)(0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+|0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:\s+|\s*,\s*)(0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+|0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:\s+|\s*,\s*)(0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+|0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%)(?:(?:\s+\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*)?|(xyz|xyz-d50|xyz-d65)(?:\s+|\s*,\s*)(-?[0-9]+(?:\.[0-9]+)?%?)(?:\s+|\s*,\s*)(-?[0-9]+(?:\.[0-9]+)?%?)(?:\s+|\s*,\s*)(-?[0-9]+(?:\.[0-9]+)?%?)(?:(?:\s+\s*(?:\/)\s*(0*(?:(?:0|[1-9][0-9]?)(?:\.[0-9]+)?|100(?:\.0+)?|\.[0-9]+)%|0*0*(?:\.[0-9]+)?|1(?:\.0+)?|\.[0-9]+))?\s*)?)\)|(yellowgreen|yellow|whitesmoke|white|wheat|VisitedText|violet|turquoise|transparent|tomato|thistle|teal|tan|steelblue|springgreen|snow|slategrey|slategray|slateblue|skyblue|silver|sienna|SelectedItemText|SelectedItem|seashell|seagreen|sandybrown|salmon|saddlebrown|royalblue|rosybrown|red|rebeccapurple|purple|powderblue|plum|pink|peru|peachpuff|papayawhip|palevioletred|paleturquoise|palegreen|palegoldenrod|orchid|orangered|orange|olivedrab|olive|oldlace|navy|navajowhite|moccasin|mistyrose|mintcream|midnightblue|mediumvioletred|mediumturquoise|mediumspringgreen|mediumslateblue|mediumseagreen|mediumpurple|mediumorchid|mediumblue|mediumaquamarine|maroon|MarkText|Mark|magenta|LinkText|linen|limegreen|lime|lightyellow|lightsteelblue|lightslategrey|lightslategray|lightskyblue|lightseagreen|lightsalmon|lightpink|lightgrey|lightgreen|lightgray|lightgoldenrodyellow|lightcyan|lightcoral|lightblue|lemonchiffon|lawngreen|lavenderblush|lavender|khaki|ivory|indigo|indianred|hotpink|honeydew|HighlightText|Highlight|grey|greenyellow|green|GrayText|gray|goldenrod|gold|ghostwhite|gainsboro|fuchsia|forestgreen|floralwhite|firebrick|FieldText|Field|dodgerblue|dimgrey|dimgray|deepskyblue|deeppink|darkviolet|darkturquoise|darkslategrey|darkslategray|darkslateblue|darkseagreen|darksalmon|darkred|darkorchid|darkorange|darkolivegreen|darkmagenta|darkkhaki|darkgrey|darkgreen|darkgray|darkgoldenrod|darkcyan|darkblue|cyan|currentColor|crimson|cornsilk|cornflowerblue|coral|chocolate|chartreuse|CanvasText|Canvas|cadetblue|ButtonText|ButtonFace|ButtonBorder|burlywood|brown|blueviolet|blue|blanchedalmond|black|bisque|beige|azure|aquamarine|aqua|antiquewhite|aliceblue|ActiveText|AccentColorText|AccentColor)$/),
  colorRGB,
  colorHSL,
  colorHWB,
  colorLab,
  colorLCH,
  colorOkLab,
  colorOkLCH,
]);
