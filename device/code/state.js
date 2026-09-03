"use strict";
/**
 * Per-knob color state and the resolution rule: manual override > auto
 * (follow return color) > user default. Pure logic only — no LOM, no UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_RETURN_TRACKS = void 0;
exports.createKnobState = createKnobState;
exports.effectiveColor = effectiveColor;
const colors_1 = require("./colors");
/** Live supports at most 12 return tracks; knobs must handle 0–12 sends. */
exports.MAX_RETURN_TRACKS = 12;
/** A fresh knob starts in auto mode (auto-color is the default-ON feature). */
function createKnobState(sendIndex) {
    return { sendIndex, mode: { kind: 'auto' } };
}
/**
 * Resolve the color a knob should paint with.
 * Precedence: manual override > auto (live return color) > default color.
 * Never throws; missing return colors fall back to gray.
 */
function effectiveColor(state, returnColor, autoColorEnabled, defaultColor = colors_1.FALLBACK_GRAY) {
    switch (state.mode.kind) {
        case 'manual':
            return state.mode.color;
        case 'auto':
            return autoColorEnabled ? (returnColor ?? defaultColor) : defaultColor;
        default: {
            const exhaustive = state.mode;
            return exhaustive;
        }
    }
}
