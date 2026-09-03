# 🎨 ColorfulKnobs

**Send knobs that match your return tracks — automatically.**

ColorfulKnobs is a free, open-source Max for Live device for Ableton Live. Drop it on a track and it gives you a row of send knobs, each colored to match its return track. Recolor a return, and every knob follows instantly. Like Live's colored macros — but for your sends.

> Live colors your tracks. Live colors your macros. Your sends deserve it too.

> **Status: in active development** — ⭐ star/watch the repo to catch v1.0.

## Roadmap

- **v1.0 — The device (in progress):** auto-colored send knobs as a Max for Live device. Everything below describes this.
- **v1.x — Extensions companion (experimental):** built on Ableton's new [Extensions SDK](https://www.ableton.com/en/blog/introducing-extensions-sdk/), adding actions to Live's *native* right-click menus — right-click a return track → *Apply this color to all sends*, *Toggle auto-color*. Optional bonus; requires Live 12 **Suite** beta 12.4.5+, and the core device will never depend on it.
- **Backlog:** freely mappable colored knob banks, Live 11 support.

## Features

- **Auto-color, on by default** — every knob follows its return track's color, live. A one-time popup explains this on first load (and how to turn it off).
- **Right-click any knob to pick a color** — same swatch grid you know from Live's track colors, so nothing feels foreign.
- **Set your own default** — override a color once and you'll get the option to make it your default everywhere.
- **Apply to all** — push one return's color to every ColorfulKnobs instance in your set with one click, just like applying a track color to all its clips.
- **Real send knobs** — automation, MIDI mapping, Push encoders, and undo all work exactly like Live's own sends. Values save with your set.
- **Featherweight & crash-averse** — no audio processing, no background timers, defensive coding everywhere. If anything ever goes wrong, your sends keep working; only the color falls back to gray. The project's stated mission is to be as crash-free as humanly possible.

## Requirements

- Ableton Live **12** Suite, or Live 12 Standard with the **Max for Live** add-on
- macOS or Windows

*(Live 11 support is being explored — see Issues.)*

## Install

1. Download `ColorfulKnobs.amxd` from the [latest release](../../releases).
2. Drag it into your Live User Library (or straight onto a track).
3. Drop it on any track that has sends. Done — your knobs are colored.

**Tip:** add ColorfulKnobs to your default audio/MIDI track (right-click a track with the device → *Save as Default*) and every new track comes pre-colored.

## Usage

| Action | How |
|---|---|
| Change a knob's color | Right-click the knob → pick a swatch |
| Back to auto | Right-click → *Auto (follow return color)* |
| Turn auto-color off/on | Right-click any knob → *Auto-color* |
| Make a color your default | Pick a custom color → *Set as default color* |
| Color this return everywhere | Right-click → *Apply to all "Return" sends* |

## FAQ

**Can it recolor Live's built-in mixer knobs?**
No — and nothing can. Ableton doesn't expose its native widgets' styling to Max for Live, Remote Scripts, themes, or even the new Extensions SDK (extensions edit your Set's *data*, not Live's UI rendering). ColorfulKnobs instead gives you its own knobs that do everything Live's do, plus color — and the planned Extensions companion adds actions to Live's real right-click menus. If Ableton ever ships colored sends natively, we'll happily retire. 🫡

**Does it touch my audio?**
Never. The device is a straight passthrough — zero DSP, effectively zero CPU.

**Where do my color settings live?**
Per-knob choices save inside your Live set. Your global default color and "seen the intro popup" flag live in a tiny JSON file in your Max preferences folder.

## Contributing

Issues and PRs are very welcome. All logic is **TypeScript** (`strict: true`) under `src/`, compiled to plain JS for Max's `v8` engine — with a full unit-test suite you can run without Max or Live open: `npm run typecheck && npm test && npm run lint`. Start with `PLAN.md` and `CLAUDE.md` (yes, this repo is built with [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) — the conventions file will onboard you too). Crash reports are treated as the highest-priority bugs in this repo.

## Credit

ColorfulKnobs is made by **[Délczeg Balázs](https://github.com/DelczBalazs)**. It's MIT-licensed, so you can do nearly anything with it — the license just requires keeping the copyright notice intact. If you use it in a template, pack, video, or tutorial, a shout-out is warmly appreciated. 💛

## License

[MIT](LICENSE) © 2026 Délczeg Balázs
