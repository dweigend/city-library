# Cyclic Cellular Automaton

Can a random field organize itself into waves and spirals? Each cell holds one of `stateCount` states arranged in a cycle. A cell moves to the next state when at least `threshold` cells in its neighborhood (Moore or von Neumann, up to `radius`) already hold that next state. `preset` loads known parameter combinations.

Things to try:

- Try a few `preset` values and compare the patterns.
- Raise `threshold` step by step from a preset. When does the field freeze?

## Use

Choose **Cyclic Cellular Automaton** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/cyclic-ca/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `201` | integer; ≥ 3; ≤ 501 |
| `height` | `201` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `preset` | `"none"` | 22 named choices; see `inputs.preset` |
| `neighborhood` | `"moore"` | `moore`, `von-neumann` |
| `radius` | `3` | integer; ≥ 1; ≤ 6 |
| `stateCount` | `3` | integer; ≥ 2; ≤ 14 |
| `threshold` | `3` | integer; ≥ 1; ≤ 168 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setThreshold`, `setCells`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `colorList`, `neighborCount`, `warning`, `cells`.

## Sources and limits

Adapted from the NetLogo *Cyclic CA* model by Gurkan and Wilensky (2025). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Neighborhood shape, state count and the wrapping edges decide which patterns can spread. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `cyclic-ca`.
