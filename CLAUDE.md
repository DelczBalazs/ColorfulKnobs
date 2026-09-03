# CLAUDE.md — ColorfulKnobs

Project instructions for Claude Code. Read PLAN.md before starting any task.

## What this project is

A Max for Live (M4L) device for Ableton Live 12+ that renders auto-colored send knobs, plus a planned Ableton Extensions SDK companion (Phase 7). All logic is TypeScript in `src/`, compiled to plain JS for the Max 9 `v8` engine; the `.amxd` is a thin shell patched by the human maintainer.

## Prime directives

1. **Crash-free beats feature-complete.** Never ship a code path that can throw uncaught. Fail soft to gray knobs; log with the `[ColorfulKnobs]` prefix.
2. **Lightweight is a feature.** No polling, no timers at idle, no work before `live.thisdevice` fires, defer all UI/LOM writes off the high-priority thread.
3. **Stay out of the .amxd.** Never edit `device/ColorfulKnobs.amxd` directly. If the patch must change, update `device/patching-instructions.md` with exact steps for the human instead.

## Hard platform constraints (do not "fix" these)

- Live's native knob *widgets* cannot be recolored by any API. Our knobs are custom-drawn (`jsui`) backed by hidden `live.*` parameter objects. (Live's right-click menus *can* be extended — but only via the one-shot Extensions SDK companion, never from the device.)
- LiveAPI callbacks may fire during set load with id 0 — guard everything, route all LOM access through `src/lom.ts`.
- Cross-instance messages (global `send`/`receive`) are untrusted input: validate schema + version in `src/bus.ts`, ignore self, debounce.
- The Max `v8` object runs JavaScript, not TypeScript. Never point the patch at `src/`; it loads only compiled output from `device/code/`.

## Workflow

- Tests first for `state.ts`, `colors.ts`, `bus.ts` logic. Run `npm run typecheck`, `npm test` (vitest), and `npm run lint` before considering any task done. All three must pass in CI.
- `npm run build` compiles `src/*.ts` → `device/code/*.js` (per-file tsc output, no bundling, no minification, so Max console line numbers map ~1:1 to source). `npm run watch` for live development. Never hand-edit anything in `device/code/`.
- The mocked Max/LiveAPI environment lives in `tests/mocks/` — extend the mock rather than skipping a test.
- Anything that can only be verified inside Live goes into `docs/QA.md` as a numbered manual step, written so a non-programmer could follow it.
- Conventional commits (`feat:`, `fix:`, `test:`, `docs:`). Keep PRs small and single-purpose.

## Style

- TypeScript everywhere, `strict: true`, no `any` without an inline justification comment. Discriminated unions for bus messages and knob state; exhaustive `switch` with `never` checks.
- Zero runtime dependencies — the shipped device is dependency-free compiled JS. Dev-dependencies only (typescript, vitest, eslint).
- Small pure functions; side effects isolated in `lom.ts`, `prefs.ts`, `ui.ts`.
- Every exported function gets a doc comment; every bug fix gets a regression test.

## Reference

- Claude Code docs: https://docs.claude.com/en/docs/claude-code/overview
- Live Object Model docs: https://docs.cycling74.com/apiref/lom/
- Max `v8` / jsui docs: https://docs.cycling74.com/
