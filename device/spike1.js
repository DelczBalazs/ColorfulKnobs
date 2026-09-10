// Phase 1 · Spike 1 — throwaway file, hand-written on purpose (this is NOT
// compiled output; see patching-instructions.md). It answers two questions
// before any real device code exists:
//   A) does v8's require() resolve a compiled module in ./code/ relative to
//      this file?
//   B) does the main script receive CommonJS globals (exports / module)? If
//      yes, compiled TypeScript can be the entry file directly; if no, the
//      entry stays a tiny shim like this one that requires the compiled code.
// Every step is wrapped so a failure prints a diagnosis instead of a stack.

autowatch = 1;
inlets = 1;
outlets = 0;

function bang() {
  post('[ColorfulKnobs] spike1: v8 alive\n');

  try {
    var colors = require('./code/colors');
    var white = colors.relativeLuminance({ r: 255, g: 255, b: 255 });
    post('[ColorfulKnobs] spike1: require OK, luminance(white)=' + white + '\n');
  } catch (err) {
    post('[ColorfulKnobs] spike1: require FAILED: ' + err + '\n');
  }

  post(
    '[ColorfulKnobs] spike1: typeof exports=' + typeof exports +
    ', typeof module=' + typeof module + '\n'
  );
}
