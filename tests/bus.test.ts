import { describe, expect, it } from 'vitest';
import { BUS_VERSION, parseBusMessage } from '../src/bus';

const COLOR = { r: 10, g: 20, b: 30 };

describe('parseBusMessage', () => {
  it('accepts a well-formed apply-to-all message', () => {
    const raw = { v: BUS_VERSION, type: 'apply-to-all', returnIndex: 2, color: COLOR, senderId: 'abc' };
    expect(parseBusMessage(raw)).toEqual(raw);
  });

  it('accepts a well-formed default-color message', () => {
    const raw = { v: BUS_VERSION, type: 'default-color', color: COLOR, senderId: 'abc' };
    expect(parseBusMessage(raw)).toEqual(raw);
  });

  it('drops extra unknown fields from parsed messages', () => {
    const raw = { v: BUS_VERSION, type: 'default-color', color: COLOR, senderId: 'abc', evil: 'payload' };
    expect(parseBusMessage(raw)).toEqual({ v: BUS_VERSION, type: 'default-color', color: COLOR, senderId: 'abc' });
  });

  it('rejects other schema versions (never crash across device versions)', () => {
    expect(parseBusMessage({ v: 0, type: 'default-color', color: COLOR, senderId: 'abc' })).toBeNull();
    expect(parseBusMessage({ v: 2, type: 'default-color', color: COLOR, senderId: 'abc' })).toBeNull();
    expect(parseBusMessage({ type: 'default-color', color: COLOR, senderId: 'abc' })).toBeNull();
  });

  it('rejects unknown message types', () => {
    expect(parseBusMessage({ v: BUS_VERSION, type: 'reboot', color: COLOR, senderId: 'abc' })).toBeNull();
  });

  it('rejects malformed payloads instead of throwing', () => {
    expect(parseBusMessage(null)).toBeNull();
    expect(parseBusMessage(undefined)).toBeNull();
    expect(parseBusMessage('apply-to-all')).toBeNull();
    expect(parseBusMessage(42)).toBeNull();
    expect(parseBusMessage([])).toBeNull();
    expect(parseBusMessage({})).toBeNull();
  });

  it('rejects bad colors, sender ids, and return indices', () => {
    expect(parseBusMessage({ v: BUS_VERSION, type: 'default-color', color: { r: 256, g: 0, b: 0 }, senderId: 'abc' })).toBeNull();
    expect(parseBusMessage({ v: BUS_VERSION, type: 'default-color', color: COLOR, senderId: '' })).toBeNull();
    expect(parseBusMessage({ v: BUS_VERSION, type: 'default-color', color: COLOR, senderId: 7 })).toBeNull();
    expect(parseBusMessage({ v: BUS_VERSION, type: 'apply-to-all', returnIndex: -1, color: COLOR, senderId: 'abc' })).toBeNull();
    expect(parseBusMessage({ v: BUS_VERSION, type: 'apply-to-all', returnIndex: 1.5, color: COLOR, senderId: 'abc' })).toBeNull();
    expect(parseBusMessage({ v: BUS_VERSION, type: 'apply-to-all', color: COLOR, senderId: 'abc' })).toBeNull();
  });
});
