/**
 * Cross-instance sync over Max global send/receive. Everything arriving here
 * is untrusted input: schema + version validated, self-messages ignored by
 * the caller, bursts debounced (Phase 4). This module is pure parsing/validation.
 */

import { isRgb, type RGB } from './colors';

/** Bump when the message schema changes incompatibly. */
export const BUS_VERSION = 1;

/** Messages exchanged between ColorfulKnobs instances in one set. */
export type BusMessage =
  | {
      readonly v: typeof BUS_VERSION;
      readonly type: 'apply-to-all';
      /** Return track whose sends should adopt the color, 0-based. */
      readonly returnIndex: number;
      readonly color: RGB;
      readonly senderId: string;
    }
  | {
      readonly v: typeof BUS_VERSION;
      readonly type: 'default-color';
      readonly color: RGB;
      readonly senderId: string;
    };

/**
 * Validate an incoming raw bus payload. Returns the typed message, or null
 * for anything malformed, unknown, or from another schema version. Never throws.
 */
export function parseBusMessage(raw: unknown): BusMessage | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const msg = raw as Record<string, unknown>;
  if (msg.v !== BUS_VERSION) return null;
  if (typeof msg.senderId !== 'string' || msg.senderId.length === 0) return null;
  if (!isRgb(msg.color)) return null;

  switch (msg.type) {
    case 'apply-to-all': {
      const { returnIndex } = msg;
      if (
        typeof returnIndex !== 'number' ||
        !Number.isInteger(returnIndex) ||
        returnIndex < 0
      ) {
        return null;
      }
      return {
        v: BUS_VERSION,
        type: 'apply-to-all',
        returnIndex,
        color: msg.color,
        senderId: msg.senderId
      };
    }
    case 'default-color':
      return {
        v: BUS_VERSION,
        type: 'default-color',
        color: msg.color,
        senderId: msg.senderId
      };
    default:
      return null;
  }
}
