/**
 * Global JSON preferences (default color, first-run popup seen), stored in
 * the Max preferences path. File IO side effects are isolated here — Phase 2.
 */

import { FALLBACK_GRAY, type RGB } from './colors';

/** Persisted global preferences, shared by all instances on this machine. */
export interface Prefs {
  readonly defaultColor: RGB;
  readonly firstRunSeen: boolean;
}

/** Defaults used on first run or when the prefs file is missing/corrupt. */
export const DEFAULT_PREFS: Prefs = {
  defaultColor: FALLBACK_GRAY,
  firstRunSeen: false
};
