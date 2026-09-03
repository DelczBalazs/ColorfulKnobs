# Manual QA — in-Live checklist

Numbered steps for everything that can only be verified inside Ableton Live,
written so a non-programmer can follow them. Each phase appends its steps here.

These checks require a working device build, so they become runnable from
Phase 1 onward and are re-run in full during Phase 5 hardening — and any time
a change touches the audio path, observers, or the bus.

**Opening the Max console** (used in several steps): right-click the
ColorfulKnobs device's title bar in Live and choose *Open Max Window*. Errors
from the device always start with `[ColorfulKnobs]`.

---

## A. Performance & latency

### QA-1: Zero-latency null test (audio must be untouched)

Proves the device passes audio through bit-perfectly with no added delay.

1. Create a new Live set. Drag any short drum loop onto audio track 1.
2. Duplicate the track (right-click the track name → *Duplicate*). Both
   tracks now play the identical clip.
3. On track 2 only, add Live's **Utility** device (Audio Effects → Utility)
   and turn on both **Phase Invert** buttons (marked *Ø L* and *Ø R*).
4. Play both tracks together and watch the main output meter (top right):
   it must show **complete silence** — the two tracks cancel perfectly.
   If not silent, stop: the test setup is wrong; fix that first.
5. Now add **ColorfulKnobs** to track 1 only, and play again.
6. **Pass:** the output is still complete silence.
   **Fail:** any sound or meter movement at all — report immediately; this is
   a highest-priority bug (the device must never touch audio).

### QA-2: Idle CPU + RAM with 100 instances

Proves an idle device costs effectively nothing, and records our budgets.

1. Create a new empty set. Add 3 return tracks (right-click in the track
   area → *Insert Return Track*) and give each a distinct color.
2. Note Live's CPU meter reading (top-right corner) with nothing playing.
   Also open Task Manager (Windows) / Activity Monitor (macOS), find the
   Ableton Live process, and note its memory use. Write both down.
3. Add ColorfulKnobs to audio track 1. Select the track and duplicate it
   repeatedly until the set has **100 tracks** (select multiple tracks and
   duplicate to double each time — this takes ~7 duplications).
4. Save the set as `qa-100-instances.als` (later steps reuse it). Wait one
   minute without touching anything.
5. Record: CPU meter reading, Live's memory use, and how long the set takes
   to load when you close and reopen it.
6. **Pass:** idle CPU is within ~1% of the empty-set reading, every knob
   shows its return's color, and no errors are in the Max console.
   Enter the numbers in the results table below — they become the frozen
   budget in the README at Phase 5.

### QA-3: 30-minute soak (observer-leak check)

Catches slow leaks from observers that aren't torn down properly.

1. Open `qa-100-instances.als` from QA-2. Note CPU and memory as before.
2. Over 30 minutes, every few minutes do a small batch of: add a return
   track, rename a return, recolor a return, delete a return, then undo and
   redo a few of those actions. Keep the Max console open the whole time.
3. **Pass:** CPU stays flat the entire time, memory does not climb steadily
   (small fluctuation is fine; a continuous upward trend is a fail), knob
   colors are always correct after each change, and the Max console shows no
   repeating `[ColorfulKnobs]` errors.

### QA-4: Set-load callback storm

Set loading fires huge bursts of Live API callbacks; the device must absorb
them without freezing or misrendering.

1. Close and reopen `qa-100-instances.als`.
2. **Pass:** Live's UI stays responsive during and immediately after the
   load, every knob shows the correct color as soon as its track is visible,
   and the Max console shows no `[ColorfulKnobs]` errors and no warning spam.

### Results table

| Date | Live ver. | OS / machine | QA-1 null | Idle CPU delta | RAM total / per instance | Load time | QA-3 soak | QA-4 storm |
|------|-----------|--------------|-----------|----------------|--------------------------|-----------|-----------|------------|
|      |           |              |           |                |                          |           |           |            |

---

*Phase 1 spike steps land here next.*
