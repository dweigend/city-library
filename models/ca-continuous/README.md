# Continuous Cellular Automaton

What happens when a cellular rule works with real numbers instead of bits? Each cell holds a value. The next row takes the average of a cell and its two neighbors, adds `addConstant` and keeps only the fractional part, at the chosen `precisionLevel`.

Things to try:

- Change `addConstant` slightly and compare the images.
- Lower `precisionLevel`. Does the pattern become regular?

## Use

Choose **Continuous Cellular Automaton** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/ca-continuous/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each progress step writes one generation as a display row. When the display fills, use Continue (`continueRun()`) to carry the final row into the next display, or enable `autoContinue`; this preserves evolution rather than drawing a new initial condition.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `201` | integer; ≥ 3; ≤ 501 |
| `height` | `201` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialization` | `"single"` | `single`, `random` |
| `maxValue` | `0.5` | number; ≥ 0; ≤ 1 |
| `addConstant` | `0.47` | number; ≥ 0; ≤ 1 |
| `precisionLevel` | `16` | integer; ≥ 1; ≤ 16 |
| `autoContinue` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setupSingle`, `setupRandom`, `continueRun`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `row`, `cells`.

## Sources and limits

Adapted from the NetLogo *CA Continuous* model by Wilensky (2003). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Finite precision matters. An irregular-looking image is not evidence of randomness or physical diffusion. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `ca-continuous`.
