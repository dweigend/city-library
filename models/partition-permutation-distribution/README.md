# Partition Permutation Distribution

Trials add random values toward a target and retain overshoot outcomes in the resulting distribution. The stopping and retention rules distinguish this experiment from uniformly sampling integer partitions.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Partition Permutation Distribution`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/partition-permutation-distribution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `targetTotal` | `72` | integer; ≥ 2; ≤ 100 |
| `successCount` | `10000` | integer; ≥ 0; ≤ 10000 |
| `diminishingSampleSpace` | `true` | boolean |
| `waitAtFull` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `successes`, `seriesTrials`, `addend`, `current`, `previous`, `addends`, `series`, `ribbon`, `addendHistogram`, `seriesHistogram`, `runningTotal`.

The [UI binding](ui.ts) presents `Number of successes`, `Tick`, `Successes`, `Running total`, `Previous addends`, `Addend`, `Current addends`, `Addends`, `Trials`, `Addends per total` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `partition-permutation-distribution` and links any shared checks.
