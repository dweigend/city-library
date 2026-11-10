# Stochastic Cellular Automaton

What changes when a cellular rule involves chance? As in the elementary one-dimensional automata, each cell's next value depends on itself and its two neighbors. Here each of the eight neighborhoods (`OOO` … `III`) has its own probability of producing a 1. Values of 0 and 100 make that case deterministic. Each generation is drawn as a new row.

Things to try:

- Load the prepared settings with `example` and compare.
- Set all probabilities to 50. Is the picture distinguishable from noise?

## Use

Choose **Stochastic Cellular Automaton** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/ca-stochastic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each progress step writes a sampled generation into the next row. Continue (`continueRun()`) carries the last row into a new display when it fills; `autoContinue` does this automatically, with an additional stop for the model’s recognized absorbing cases. Setup random and Setup example replace the initial condition.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `161` | integer; ≥ 5; ≤ 501 |
| `height` | `161` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `density` | `25` | number; ≥ 0; ≤ 100 |
| `OOO` | `0` | number; ≥ 0; ≤ 100 |
| `OOI` | `50` | number; ≥ 0; ≤ 100 |
| `OIO` | `50` | number; ≥ 0; ≤ 100 |
| `OII` | `50` | number; ≥ 0; ≤ 100 |
| `IOO` | `50` | number; ≥ 0; ≤ 100 |
| `IOI` | `50` | number; ≥ 0; ≤ 100 |
| `IIO` | `50` | number; ≥ 0; ≤ 100 |
| `III` | `0` | number; ≥ 0; ≤ 100 |
| `autoContinue` | `false` | boolean |
| `autoClear` | `true` | boolean |
| `plot` | `true` | boolean |
| `onColor` | `95` | number; ≥ 0; ≤ 139.9 |
| `offColor` | `0` | number; ≥ 0; ≤ 139.9 |
| `example` | `1` | integer; ≥ 1; ≤ 5 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setupRandom`, `continueRun`, `setRules`, `setupExample`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `row`, `absorbing`, `probabilities`, `entropy`, `cells`.

## Sources and limits

Adapted from the NetLogo *CA Stochastic* model by Wilensky (2003). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The space-time picture shows one random realization; another seed gives another picture. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `ca-stochastic`.
