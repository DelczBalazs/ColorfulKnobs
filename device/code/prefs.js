"use strict";
/**
 * Global JSON preferences (default color, first-run popup seen), stored in
 * the Max preferences path. File IO side effects are isolated here — Phase 2.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PREFS = void 0;
const colors_1 = require("./colors");
/** Defaults used on first run or when the prefs file is missing/corrupt. */
exports.DEFAULT_PREFS = {
    defaultColor: colors_1.FALLBACK_GRAY,
    firstRunSeen: false
};
