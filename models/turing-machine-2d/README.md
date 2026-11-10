# Two-Dimensional Turing Machine

What can simple read-write machines draw on a shared field? Each head has an internal state (0 or 1) and reads the cell below it (on or off). A table of four rules, one per state and cell combination, says what to write, how to turn and which state to enter next. Many heads (`headCount`) share the same field, so the order in which they move matters. `example` loads prepared rule tables.

Things to try:

- Load each `example` and compare the patterns.
- Change a single turn, for example `on1Turn`, and see how the drawing changes.

## Use

Choose **Two-Dimensional Turing Machine** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/turing-machine-2d/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `151` | integer; ≥ 3; ≤ 301 |
| `height` | `151` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `headCount` | `32` | integer; ≥ 1; ≤ 256 |
| `colorPaths` | `true` | boolean |
| `example` | `1` | integer; ≥ 1; ≤ 5 |
| `off0State` | `1` | integer; ≥ 0; ≤ 1 |
| `off0Turn` | `"backwards"` | `straight`, `right`, `backwards`, `left` |
| `off0On` | `true` | boolean |
| `off1State` | `0` | integer; ≥ 0; ≤ 1 |
| `off1Turn` | `"right"` | `straight`, `right`, `backwards`, `left` |
| `off1On` | `true` | boolean |
| `on0State` | `0` | integer; ≥ 0; ≤ 1 |
| `on0Turn` | `"straight"` | `straight`, `right`, `backwards`, `left` |
| `on0On` | `true` | boolean |
| `on1State` | `1` | integer; ≥ 0; ≤ 1 |
| `on1Turn` | `"left"` | `straight`, `right`, `backwards`, `left` |
| `on1On` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setConfiguration`, `setupExample`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `rules`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *Turing Machine 2D* model by Wilensky (2002). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

A complex trace does not prove that the machine computes anything in particular. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `turing-machine-2d`.
