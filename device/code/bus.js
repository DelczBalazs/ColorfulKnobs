"use strict";
/**
 * Cross-instance sync over Max global send/receive. Everything arriving here
 * is untrusted input: schema + version validated, self-messages ignored by
 * the caller, bursts debounced (Phase 4). This module is pure parsing/validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUS_VERSION = void 0;
exports.parseBusMessage = parseBusMessage;
const colors_1 = require("./colors");
/** Bump when the message schema changes incompatibly. */
exports.BUS_VERSION = 1;
/**
 * Validate an incoming raw bus payload. Returns the typed message, or null
 * for anything malformed, unknown, or from another schema version. Never throws.
 */
function parseBusMessage(raw) {
    if (typeof raw !== 'object' || raw === null)
        return null;
    const msg = raw;
    if (msg.v !== exports.BUS_VERSION)
        return null;
    if (typeof msg.senderId !== 'string' || msg.senderId.length === 0)
        return null;
    if (!(0, colors_1.isRgb)(msg.color))
        return null;
    switch (msg.type) {
        case 'apply-to-all': {
            const { returnIndex } = msg;
            if (typeof returnIndex !== 'number' ||
                !Number.isInteger(returnIndex) ||
                returnIndex < 0) {
                return null;
            }
            return {
                v: exports.BUS_VERSION,
                type: 'apply-to-all',
                returnIndex,
                color: msg.color,
                senderId: msg.senderId
            };
        }
        case 'default-color':
            return {
                v: exports.BUS_VERSION,
                type: 'default-color',
                color: msg.color,
                senderId: msg.senderId
            };
        default:
            return null;
    }
}
