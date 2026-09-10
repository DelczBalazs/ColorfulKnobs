# ColorfulKnobs — Build Plan

A free, open-source Max for Live device for Ableton Live that gives every track a row of send knobs automatically colored to match their return tracks — with right-click color picking that mirrors Live's own track-color UI.

**Mission:** as lightweight and as crash-free as humanly possible. Every decision below is filtered through those two goals.

---

## 0. Reality constraints (read first)

These are hard platform limits that shape the whole design:

1. **Live's native knobs are still untouchable — but its right-click menus no longer are.** No API (LOM, Remote Scripts, themes, Extensions) can recolor Live's *built-in* send-knob widgets, so ColorfulKnobs renders its own knobs with its own palette popup, pixel-styled after Live's swatch grid. However, Ableton's new **Extensions SDK** (public beta, June 2026, Live 12 Suite Beta 12.4.5+, Node.js/JavaScript) *can* add entries to Live's real right-click context menus and read/edit Set structure — tracks, clips, parameters. Extensions run as **one-shot tasks** (trigger → run → done), so they can't host persistent UI or continuous observers: perfect for *actions*, wrong for the always-on colored knobs. Hence the two-component design in §2b.
2. **A Max for Live device UI is a fixed-height strip** in Live's device chain. The color palette therefore opens as a compact popup overlay/floating window, positioned at the mouse.
3. **Right-clicking a `live.dial` is intercepted by Live** (automation/mapping menu). Custom right-click requires custom-drawn knobs (`jsui`) paired with hidden `live.*` parameter objects so we keep automation, MIDI mapping, Push banks, undo, and save-with-set. This "jsui front, hidden params back" pattern is the standard approach for polished M4L UIs.
4. **Target Live 12+** (bundles Max 9, whose `v8` object gives us modern JavaScript and clean module separation → real unit tests in Node). Live 11 backport is a stretch goal tracked as an issue, not a v1 requirement.
5. **Live supports up to 12 return tracks**; the device must handle 0–12 sends appearing, disappearing, and reordering at any moment.

## 1. Feature spec (v1)

- **Auto-color (default ON).** Each knob follows its return track's color, live-updating when the user recolors a return. 
- **First-run popup.** The first time the device is ever loaded, a small overlay explains: "Your send knobs are auto-colored from your return tracks. Right-click any knob to change or turn this off." One `Got it` button + `Don't show again`. Persisted globally (JSON prefs file), not per-set.
- **Right-click any knob → color palette.** Same 70-swatch grid layout as Live's track color picker, plus menu entries:
  - `Auto (follow return color)` — back to default behavior (shown when overridden)
  - `Set as default color` — appears once the user picks a non-default color; stores their preferred fallback/default globally
  - `Apply to all "<Return Name>" sends` — pushes this color to every instance's knob for that return, set-wide (same spirit as Live's "apply color to all clips")
  - `Auto-color: On/Off` — the master toggle for this device (mirrors the "toggle on the return track" idea; it lives here because Live's own return-track menu can't be extended)
- **Full parameter behavior.** Knobs bind to the real send parameters: automation, MIDI mapping, Push encoder banks, undo, and values saved with the set all work.
- **Zero-cost audio path.** Audio effect device that is a straight passthrough — no DSP, effectively 0% CPU per instance.

Out of scope for v1 (backlog): coloring arbitrary mapped parameters (Macrobs-style banks), Live 11 support, a single "mixer overlay" mega-device.

## 2a. Platform decision

Evaluated: **Max for Live**, **Ableton Extensions SDK**, **JUCE (C++ VST3/AU)**, **MIDI Remote Scripts**.

- **JUCE is ruled out** — not "worse," but incapable: a VST3/AU plugin is a sandboxed guest that cannot enumerate Live's return tracks, read their colors, bind to the host mixer's send parameters, or touch Live's menus. Its headline benefit (cross-DAW portability) is worthless here because the feature is Ableton-specific by definition. A JUCE + Remote-Script-bridge hybrid exists in the wild but means double installs, sockets, and an undocumented API — the opposite of lightweight and crash-free.
- **Remote Scripts are ruled out** — no in-Live UI at all; they exist to drive hardware controllers, and the API is unofficial.
- **Max for Live = the core product.** Only environment that can host persistent, always-visible knobs in the device chain, bound to real send parameters (automation/MIDI/Push/undo), with live LOM observers for return colors. Runs on *stable* Live 12, Suite **and** Standard+M4L.
- **Extensions SDK = the companion (v1.x).** One-shot right-click actions in Live's *native* menus — the original dream UX: right-click a return track → "ColorfulKnobs: apply this color to all sends," "Toggle auto-color." Beta + Suite-only today, so it ships as an optional bonus, clearly labeled experimental, never a dependency of the core device.
- **Synergy:** both are JavaScript. `src/colors.js`, the state schema, and the message contracts are shared between the M4L `v8` code and the Node-based extension — one test suite covers both.
- **Bridge design (validate in Phase 1 spike):** the extension communicates with device instances by writing the device's own exposed `live.*` parameters through the Set structure — an official, undo-friendly channel, no sockets, no file-watching.

## 2. Architecture

```
ColorfulKnobs/
├── device/
│   ├── ColorfulKnobs.amxd          # thin Max patch: audio passthrough, v8 host, jsui, hidden live.* params
│   ├── code/                       # compiled JS build output loaded by the v8 object — never hand-edited
│   └── patching-instructions.md    # human-readable patch wiring steps (Claude Code writes, human patches)
├── src/                            # ALL logic lives here, in TypeScript (Claude Code's domain, unit-testable)
│   ├── lom.ts                      # guarded LiveAPI wrapper: deferred init, id-0 guards, observer lifecycle
│   ├── colors.ts                   # Live's 70-color palette table, contrast math for needle/label legibility
│   ├── state.ts                    # per-knob mode (auto/manual), default color, first-run flag, (de)serialization
│   ├── bus.ts                      # cross-instance sync over global send/receive, versioned + validated messages
│   ├── ui.ts                       # jsui draw + hit-testing for knobs and the palette popup
│   └── prefs.ts                    # global JSON prefs (default color, popup-seen) in Max preferences path
├── extension/                      # Phase 7: Ableton Extensions SDK companion (TypeScript, Node 24, vendored SDK tarballs)
├── tests/                          # vitest (native TS) + LiveAPI/Max mocks; runs in Node, no Live needed
├── docs/QA.md                      # manual in-Live test checklist + test .als recipe
├── .github/workflows/ci.yml        # typecheck + lint + unit tests on every push/PR
├── tsconfig.json · CLAUDE.md · README.md · LICENSE (MIT)
```

**Language & build:** TypeScript with `strict: true` across device and extension — static types are a crash-prevention tool (typed LOM ids, discriminated-union bus messages, exhaustive knob-state switches). The Max `v8` object executes JavaScript, so `npm run build` compiles `src/*.ts` → `device/code/*.js` via per-file tsc output — no bundling, no minification — keeping Max console line numbers ~1:1 with source. TypeScript is a dev-dependency only; the shipped device remains dependency-free plain JS. The extension side uses TS first-class per the SDK ecosystem.

**Division of labor:** Claude Code owns everything in `src/`, `extension/`, `tests/`, `docs/`, and CI; the human does the visual patching in Max following `patching-instructions.md`. Claude Code never hand-edits the `.amxd` or `device/code/` — the patch stays a thin shell precisely so all reviewable, testable logic is in typed source.

**Data flow:** `live.thisdevice` bang → `lom.ts` walks `live_set return_tracks`, attaches color/name observers + a returns-list observer → resolves this track's `mixer_device sends` → `state.ts` decides each knob's effective color (manual override > auto > default) → `ui.ts` repaints (deferred to low-priority thread). Bus messages from other instances flow through `bus.ts` validation before touching state.

## 3. Crash-free engineering rules (non-negotiable)

1. Every LiveAPI touch goes through `lom.js`; every callback is wrapped in try/catch and logs `[ColorfulKnobs]`-prefixed warnings to the Max console — never throws upward.
2. No work before `live.thisdevice` fires (the set may still be loading; LOM ids can be 0). Guard every id.
3. Event-driven only: no polling, no metro timers. Idle device = zero scheduled work.
4. All UI paints and LOM writes deferred off the high-priority thread (`defer`/`deferlow`).
5. Observers are registered in one place and torn down on device delete (`notifydeleted`) — no leaked LiveAPI objects.
6. Fail soft: if color sync ever errors, knobs keep functioning in neutral gray. A broken color is cosmetic; a broken send is not.
7. Bus input is untrusted: schema + version check, ignore self, debounce bursts.
8. Handle gracefully: 0 returns, 12 returns, returns added/removed/renamed/reordered mid-session, device dropped on a return/main track (show "sends live on regular tracks" hint), duplicated devices, undo/redo, set save/load, freeze/flatten, offline export.

## 4. Testing strategy

- **Static (automated, CI):** `npm run typecheck` on every push — `strict: true`, and the compiled `device/code/` output is rebuilt in CI to catch drift.
- **Unit (automated, CI):** `colors.ts`, `state.ts`, `bus.ts`, and `lom.ts` logic run under vitest (native TypeScript) with a mocked `LiveAPI`/Max environment. Target: every state transition (auto→manual→default→apply-all), palette math, contrast picker, malformed bus messages, id-0 and mid-load callback storms.
- **Contract:** bus message schema snapshot tests so instances of different versions never crash each other.
- **Manual QA (docs/QA.md):** scripted checklist against a purpose-built test set — light/dark themes, macOS + Windows, Intel + Apple Silicon, 100-track set with device on every track (CPU meter must not move at idle), 30-minute soak with return add/remove churn.

## 5. Phases (Claude Code task list)

**Phase 0 — Scaffold** ✅ *(this commit: docs; next: `npm init`, tsconfig strict, vitest, eslint, CI with typecheck+build, src/tests stubs)*

**Phase 1 — De-risk spikes** *(human in Live + Claude Code writing spike code; each has pass/fail criteria)*
1. `v8` object loads our compiled `device/code/*.js` (tsc output) in current Live 12; module resolution path confirmed.
2. jsui right-click capture + popup overlay/floating window renders above device UI.
3. Hidden `live.dial` params driven from jsui: automation, MIDI map, Push, undo all intact.
4. Global `send`/`receive` reaches all device instances in one set; measure latency.
5. 50 instances in a set: load time, RAM, idle CPU recorded → budget set.

**Phase 2 — Core engine:** `lom.ts`, `state.ts`, `prefs.ts` + full unit suite. Definition of done: all edge cases in §3.8 covered by tests.

**Phase 3 — UI:** `ui.ts` knob row + palette popup (Live-style grid, menu entries from §1), first-run popup, luminance-based needle/label contrast so pale colors stay readable.

**Phase 4 — Sync bus:** `bus.ts` + apply-to-all + default-color propagation across instances.

**Phase 5 — Hardening:** execute docs/QA.md, fix, soak, repeat. Freeze perf budget in README.

**Phase 6 — Release:** freeze .amxd, screenshots/GIF, GitHub release + maxforlive.com listing, README polish, tag v1.0.0.

**Phase 7 — Extensions SDK companion (v1.x, experimental):** *Status 2026-09-11 (verified against Ableton's official pages): the SDK is v1.0.0-beta1, downloadable only through the Ableton beta program (Centercode login); extensions run only in Live 12 Suite Beta — stable 12.4.5 shipped without them; the execution model is strictly one-shot (right-click → run once → exit), with no persistent UI, no event triggers, and no widget styling. Nothing here starts until the SDK zip is in hand; never code against third-party reconstructions of its API.* Node 24 LTS toolchain per Ableton's SDK docs (https://ableton.github.io/extensions-sdk). Spike first: confirm an Extension can read return colors and set our device's exposed parameters. Then ship right-click actions on tracks/returns: `Apply return color to all sends`, `Toggle auto-color`, `Reset overrides`. Reuse `src/colors.js` + state schema; separate `extension/` folder; marked beta in README; core device must never require it. Track SDK maturation — if Extensions ever gain persistent UI or native-widget styling, revisit the architecture.

## 6. Definition of "lightweight" (budgets)

- Idle CPU per instance: indistinguishable from an empty passthrough device.
- No timers while idle; redraw only on actual change.
- RAM per instance: < a few MB; 100 instances must not visibly affect set load beyond seconds.
- Zero audio processing; zero allocations on the audio thread.
