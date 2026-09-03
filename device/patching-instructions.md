# Patching instructions

Exact steps for the human maintainer to apply inside Max when the
`ColorfulKnobs.amxd` patch must change. Claude Code never edits the `.amxd`
directly (CLAUDE.md prime directive #3) — it updates this file instead.

The `v8` object must load only compiled output from `device/code/` — never
point it at `src/`.

*No steps yet — Phase 1 spike wiring instructions land here.*
