import { describe, expect, it } from 'vitest';
import { isValidLomId } from '../src/lom';

describe('isValidLomId', () => {
  it('accepts real positive integer ids', () => {
    expect(isValidLomId(1)).toBe(true);
    expect(isValidLomId(4212)).toBe(true);
  });

  it('rejects the id-0 set-loading case and every other malformed id', () => {
    expect(isValidLomId(0)).toBe(false);
    expect(isValidLomId(-3)).toBe(false);
    expect(isValidLomId(2.5)).toBe(false);
    expect(isValidLomId('5')).toBe(false);
    expect(isValidLomId(null)).toBe(false);
    expect(isValidLomId(undefined)).toBe(false);
  });
});
