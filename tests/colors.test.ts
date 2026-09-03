import { describe, expect, it } from 'vitest';
import {
  FALLBACK_GRAY,
  isRgb,
  prefersDarkForeground,
  relativeLuminance,
  rgbFromLiveInt
} from '../src/colors';

describe('rgbFromLiveInt', () => {
  it('unpacks a 0x00RRGGBB integer', () => {
    expect(rgbFromLiveInt(0xff8800)).toEqual({ r: 255, g: 136, b: 0 });
    expect(rgbFromLiveInt(0)).toEqual({ r: 0, g: 0, b: 0 });
    expect(rgbFromLiveInt(0xffffff)).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('returns null for anything malformed instead of throwing', () => {
    expect(rgbFromLiveInt(-1)).toBeNull();
    expect(rgbFromLiveInt(0x1000000)).toBeNull();
    expect(rgbFromLiveInt(1.5)).toBeNull();
    expect(rgbFromLiveInt('16744448')).toBeNull();
    expect(rgbFromLiveInt(null)).toBeNull();
    expect(rgbFromLiveInt(undefined)).toBeNull();
    expect(rgbFromLiveInt(Number.NaN)).toBeNull();
  });
});

describe('isRgb', () => {
  it('accepts well-formed colors', () => {
    expect(isRgb({ r: 0, g: 128, b: 255 })).toBe(true);
    expect(isRgb(FALLBACK_GRAY)).toBe(true);
  });

  it('rejects malformed colors', () => {
    expect(isRgb(null)).toBe(false);
    expect(isRgb('red')).toBe(false);
    expect(isRgb({ r: 0, g: 0 })).toBe(false);
    expect(isRgb({ r: 0, g: 0, b: 256 })).toBe(false);
    expect(isRgb({ r: 0, g: 0, b: -1 })).toBe(false);
    expect(isRgb({ r: 0.5, g: 0, b: 0 })).toBe(false);
  });
});

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
  });

  it('weights green > red > blue like human vision', () => {
    const red = relativeLuminance({ r: 255, g: 0, b: 0 });
    const green = relativeLuminance({ r: 0, g: 255, b: 0 });
    const blue = relativeLuminance({ r: 0, g: 0, b: 255 });
    expect(green).toBeGreaterThan(red);
    expect(red).toBeGreaterThan(blue);
  });
});

describe('prefersDarkForeground', () => {
  it('wants dark needles on light colors and light needles on dark ones', () => {
    expect(prefersDarkForeground({ r: 255, g: 255, b: 255 })).toBe(true);
    expect(prefersDarkForeground({ r: 250, g: 240, b: 180 })).toBe(true);
    expect(prefersDarkForeground({ r: 0, g: 0, b: 0 })).toBe(false);
    expect(prefersDarkForeground(FALLBACK_GRAY)).toBe(false);
  });
});
