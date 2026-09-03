/**
 * Color model, Live-color conversion, and contrast math for knob rendering.
 * Phase 3 adds the full 70-swatch palette table; this module ships the
 * fail-soft fallback and the pure math it depends on.
 */

/** An sRGB color with integer channels in 0–255. */
export interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** Neutral gray used whenever color resolution fails (prime directive: fail soft). */
export const FALLBACK_GRAY: RGB = { r: 125, g: 125, b: 125 };

/** True when the value is a well-formed RGB object with in-range integer channels. */
export function isRgb(value: unknown): value is RGB {
  if (typeof value !== 'object' || value === null) return false;
  const { r, g, b } = value as Record<string, unknown>;
  return [r, g, b].every(
    (c) => typeof c === 'number' && Number.isInteger(c) && c >= 0 && c <= 255
  );
}

/**
 * Convert a LOM color value (0x00RRGGBB integer, as returned by e.g. a
 * track's `color` property) to RGB. Returns null on any malformed input.
 */
export function rgbFromLiveInt(value: unknown): RGB | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  if (value < 0 || value > 0xffffff) return null;
  return { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: value & 0xff };
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance of a color (linearized sRGB): 0 = black, 1 = white. */
export function relativeLuminance(color: RGB): number {
  return (
    0.2126 * linearize(color.r) +
    0.7152 * linearize(color.g) +
    0.0722 * linearize(color.b)
  );
}

/**
 * True when a knob painted in this color needs a dark needle/label to stay
 * legible (i.e. the color itself is light).
 */
export function prefersDarkForeground(color: RGB): boolean {
  return relativeLuminance(color) > 0.45;
}
