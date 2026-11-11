# Partition Permutation Distribution

Does building a sum from random parts pick every way of splitting it equally often? Each trial draws random positive addends and keeps those that still fit until they add up to `targetTotal`. Over many trials, the model counts how often each addend appears. With `diminishingSampleSpace`, only values that still fit are drawn.

Things to try:

- Compare runs with `diminishingSampleSpace` on and off.
- Use a small `targetTotal` and list which addends appear most often.

## Use

Choose **Partition Permutation Distribution** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/partition-permutation-distribution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `targetTotal` | `72` | integer; ≥ 2; ≤ 100 |
| `successCount` | `10000` | integer; ≥ 0; ≤ 10000 |
| `diminishingSampleSpace` | `true` | boolean |
| `waitAtFull` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `successCount`, `seriesTrialCount`, `addend`, `current`, `previous`, `addends`, `series`, `ribbon`, `addendHistogram`, `seriesHistogram`, `runningTotal`.

## Sources and limits

Adapted from the NetLogo *Partition Permutation Distribution* model by Abrahamson and Wilensky (2004). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The stopping and retention rules make this different from sampling integer partitions uniformly. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `partition-permutation-distribution`.
