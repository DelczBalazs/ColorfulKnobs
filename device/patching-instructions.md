# Patching instructions

Exact steps for the human maintainer to apply inside Max when the
`ColorfulKnobs.amxd` patch must change. Claude Code never edits the `.amxd`
directly (CLAUDE.md prime directive #3) — it updates this file instead.

The `v8` object must load only compiled output from `device/code/` — never
point it at `src/`. The one exception is `device/spike1.js`, a hand-written
throwaway file that exists only to run Spike 1 below.

---

## Spike 1 — does v8 load our compiled code? (~10 minutes in Live)

Goal: prove that Max's `v8` object can run a file from this folder and
`require()` the compiled TypeScript output in `device/code/`. Nothing else.

1. Open Ableton Live 12 and create a new empty set.
2. Add an audio track. In the Browser go to **Max for Live → Max Audio
   Effect** and drag **Max Audio Effect** (the default, empty one) onto the
   track.
3. On the device's title bar click the **edit button** (the small icon on
   the right). The Max editor opens. The default patch already contains
   `plugin~ → plugout~` (audio passthrough) — leave it exactly as is.
4. **Save the device into this folder first**, before adding anything:
   **File → Save As…**, navigate to `ColorfulKnobs/device/`, name it
   `ColorfulKnobs.amxd`, save. (Max looks for files next to the saved
   device, so this step decides whether the next steps can find `spike1.js`.)
5. Click an empty spot in the patch and press **N** to create a new object.
   Type exactly `v8 spike1.js` and press **Enter**. The box should turn
   into a solid object; if it stays with a dashed outline and the Max
   Console says it can't find the file, see *If it fails* below.
6. Press **N** again, type `button`, press **Enter**. Drag from the
   button's bottom-left outlet to the `v8` object's top-left inlet to
   connect them.
7. Open the Max Console: **Window → Max Console** (or `Ctrl+M` /
   `Cmd+M`).
8. Click the **button**. Read the lines starting with
   `[ColorfulKnobs] spike1:` in the console.
9. **Save** the device (`Ctrl+S` / `Cmd+S`). Keep it *unfrozen* during
   development.

### Expected result (PASS)

Three console lines:

```
[ColorfulKnobs] spike1: v8 alive
[ColorfulKnobs] spike1: require OK, luminance(white)=1
[ColorfulKnobs] spike1: typeof exports=<something>, typeof module=<something>
```

Copy the **third line verbatim** back to Claude Code — its two values
decide how the real entry file gets built. (`luminance(white)` may print
as `0.9999999…`; that's fine.)

### If it fails

- **Step 5: "can't find file spike1.js"** → the device was not saved in
  `ColorfulKnobs/device/`. Redo step 4, delete the `v8` box, redo step 5.
  Fallback if it still fails: **Options → File Preferences… → +** and add
  the `ColorfulKnobs/device` folder, then redo step 5.
- **Console shows `require FAILED: …`** → copy the full error text back
  to Claude Code. It tells us how `v8` resolves relative paths, and the
  next build layout will be adapted to it.
- **Nothing prints at all** → make sure the button is connected to the
  `v8` inlet (a line between them) and that the patch is unlocked while
  editing but the button is clicked in *locked* mode (`Ctrl+E` / `Cmd+E`
  toggles).

After the spike passes, commit `device/ColorfulKnobs.amxd` — it is part of
the project from now on.
