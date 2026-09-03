import { describe, expect, it } from 'vitest';
import { FALLBACK_GRAY, type RGB } from '../src/colors';
import { createKnobState, effectiveColor, MAX_RETURN_TRACKS, type KnobState } from '../src/state';

const RETURN_COLOR: RGB = { r: 10, g: 200, b: 30 };
const MANUAL_COLOR: RGB = { r: 200, g: 10, b: 30 };
const DEFAULT_COLOR: RGB = { r: 1, g: 2, b: 3 };

const manualKnob: KnobState = { sendIndex: 0, mode: { kind: 'manual', color: MANUAL_COLOR } };

describe('createKnobState', () => {
  it('starts in auto mode (auto-color is default ON)', () => {
    expect(createKnobState(3)).toEqual({ sendIndex: 3, mode: { kind: 'auto' } });
  });
});

describe('effectiveColor precedence: manual > auto > default', () => {
  it('manual override wins even when auto is enabled and a return color exists', () => {
    expect(effectiveColor(manualKnob, RETURN_COLOR, true, DEFAULT_COLOR)).toEqual(MANUAL_COLOR);
    expect(effectiveColor(manualKnob, null, false, DEFAULT_COLOR)).toEqual(MANUAL_COLOR);
  });

  it('auto mode follows the return color when auto-color is enabled', () => {
    expect(effectiveColor(createKnobState(0), RETURN_COLOR, true, DEFAULT_COLOR)).toEqual(RETURN_COLOR);
  });

  it('auto mode falls back to the default color when the return color is unknown', () => {
    expect(effectiveColor(createKnobState(0), null, true, DEFAULT_COLOR)).toEqual(DEFAULT_COLOR);
  });

  it('auto mode uses the default color when auto-color is disabled', () => {
    expect(effectiveColor(createKnobState(0), RETURN_COLOR, false, DEFAULT_COLOR)).toEqual(DEFAULT_COLOR);
  });

  it('falls back to gray when no default color was ever set', () => {
    expect(effectiveColor(createKnobState(0), null, true)).toEqual(FALLBACK_GRAY);
  });
});

describe('platform constants', () => {
  it('models Live’s 12-return maximum', () => {
    expect(MAX_RETURN_TRACKS).toBe(12);
  });
});
