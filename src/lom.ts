/**
 * Guarded LiveAPI wrapper — the ONLY module allowed to touch the LOM.
 * Phase 2 adds deferred init, observers, and teardown. Until then this holds
 * the guards every LOM code path must use.
 */

/**
 * LiveAPI callbacks can fire during set load with id 0 (object not yet
 * resolvable). Guard every id before use.
 */
export function isValidLomId(id: unknown): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}
