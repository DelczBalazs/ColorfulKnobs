/**
 * Per-knob color state and the resolution rule: manual override > auto
 * (follow return color) > user default. Pure logic only — no LOM, no UI.
 */

import { FALLBACK_GRAY, type RGB } from './colors';

/** Live supports at most 12 return tracks; knobs must handle 0–12 sends. */
export const MAX_RETURN_TRACKS = 12;

/** How a single knob decides its color. */
export type KnobColorMode =
  | { readonly kind: 'auto' }
  | { readonly kind: 'manual'; readonly color: RGB };

/** State of one send knob. */
export interface KnobState {
  /** Index of the send / return track this knob is bound to (0-based). */
  readonly sendIndex: number;
  readonly mode: KnobColorMode;
}

/** A fresh knob starts in auto mode (auto-color is the default-ON feature). */
export function createKnobState(sendIndex: number): KnobState {
  return { sendIndex, mode: { kind: 'auto' } };
}

/**
 * Resolve the color a knob should paint with.
 * Precedence: manual override > auto (live return color) > default color.
 * Never throws; missing return colors fall back to gray.
 */
export function effectiveColor(
  state: KnobState,
  returnColor: RGB | null,
  autoColorEnabled: boolean,
  defaultColor: RGB = FALLBACK_GRAY
): RGB {
  switch (state.mode.kind) {
    case 'manual':
      return state.mode.color;
    case 'auto':
      return autoColorEnabled ? (returnColor ?? defaultColor) : defaultColor;
    default: {
      const exhaustive: never = state.mode;
      return exhaustive;
    }
  }
}
