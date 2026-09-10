# ColorfulKnobs

A Max for Live device, in early development, that adds a row of send knobs colored to match your return tracks.

**Status: early development.** Nothing is usable yet — there is no release and no timeline. The repository is public so the work happens in the open.

## What it will do

- Show one send knob per return track, colored like that return, and follow along when you recolor a return.
- Right-click a knob for Live's swatch palette; set your own default color; apply a color to every instance in the set.
- Behave like real send controls: automation, MIDI mapping, Push encoders, undo, and values saved with the set.
- Pass audio straight through — no processing, no measurable CPU.

## What it will not do

Recolor Live's own built-in mixer knobs. No API exposes Live's widgets — not Max for Live, not the Extensions SDK, not themes. ColorfulKnobs draws its own knobs instead. If Ableton ever ships colored sends natively, this device becomes unnecessary, which would be fine.

## Requirements (planned)

- Ableton Live 12 Suite, or Live 12 Standard with the Max for Live add-on
- macOS or Windows

## Extensions SDK companion (later, uncertain)

Ableton's Extensions SDK could add ColorfulKnobs actions to Live's native right-click menus. As of September 2026 the SDK is in beta — Live 12 Suite Beta only, downloadable through Ableton's beta program — so this is an idea, not a commitment. It would never be required by the device.

## Development

All logic is TypeScript (`strict: true`) in `src/`, compiled to plain JavaScript for Max 9's `v8` object; the `.amxd` is a thin shell. Run `npm run typecheck && npm test && npm run lint`. Start with `PLAN.md` and `CLAUDE.md`.

## License

[MIT](LICENSE) © 2026 Délczeg Balázs
