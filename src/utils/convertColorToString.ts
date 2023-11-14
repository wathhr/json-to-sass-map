import { Infer, create, is } from 'superstruct';
import { colorHSL, colorHWB, colorLCH, colorLab, colorOkLCH, colorOkLab, colorRGB, color as colorStruct } from '#structs';

export function convertColorToString(color: Infer<typeof colorStruct>): string {
  color = create(color, colorStruct);
  if (typeof color === 'string') return color;

  if (is(color, colorRGB)) return `rgb(${color.r} ${color.g} ${color.b} / ${color.A})`;
  if (is(color, colorHSL)) return `hsl(${color.h} ${color.s}% ${color.l}% / ${color.A})`;
  if (is(color, colorHWB)) return `hwb(${color.h} ${color.w}% ${color.b}% / ${color.A})`;
  if (is(color, colorOkLab)) return `oklab(${color.l} ${color.a}% ${color.b}% / ${color.A})`;
  if (is(color, colorOkLCH)) return `oklch(${color.l}% ${color.c}% ${color.h}% / ${color.A})`;
  if (is(color, colorLab)) return `lab(${color.l} ${color.a}% ${color.b}% / ${color.A})`;
  if (is(color, colorLCH)) return `lch(${color.l}% ${color.c}% ${color.h}% / ${color.A})`;

  return 'unset';
}
