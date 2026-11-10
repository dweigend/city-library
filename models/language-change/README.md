# Language Change

How do social networks and learning shape which grammar a community uses? Speakers in a network use one of two grammars with some probability. After hearing their neighbors, they update this probability using one of three rules (`updateAlgorithm`): copy one neighbor, follow the local majority above `thresholdVal`, or learn from reward at rate `alpha`. With `sinkState1`, a speaker who fully adopts grammar 1 never leaves it.

Things to try:

- Compare the three update rules with the same network and seed.
- Start with grammar 1 in the minority (`percentGrammar1`). Can it still spread?

## Use

Choose **Language Change** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/language-change/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `nodeCount` | `100` | integer; ≥ 2; ≤ 100 |
| `percentGrammar1` | `60` | number; ≥ 0; ≤ 100 |
| `updateAlgorithm` | `"individual"` | `individual`, `threshold`, `reward` |
| `thresholdVal` | `0.3` | number; ≥ 0; ≤ 1 |
| `sinkState1` | `true` | boolean |
| `logistic` | `true` | boolean |
| `alpha` | `0.025` | number; ≥ 0; ≤ 0.05 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `resetNodes`, `redistributeGrammars`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `nodes`, `edges`.

## Sources and limits

Adapted from the NetLogo *Language Change* model (© 2007 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The interaction rules do not reconstruct the history of any real language. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `language-change`.
