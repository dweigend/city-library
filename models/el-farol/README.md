# El Farol Bar

Can people coordinate without talking to each other? Everyone wants to go to a bar, but only if it is not crowded. Each person holds `strategyCount` simple predictors of attendance based on the last `memorySize` weeks, uses the one that has been most accurate and goes if it predicts fewer than `overcrowdingThreshold` guests.

Things to try:

- Change `memorySize` and compare how strongly attendance swings around the threshold.
- Give each person only one strategy. What changes?

## Use

Choose **El Farol Bar** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/el-farol/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `memorySize` | `5` | integer; ≥ 1; ≤ 10 |
| `strategyCount` | `10` | integer; ≥ 1; ≤ 20 |
| `overcrowdingThreshold` | `60` | integer; ≥ 0; ≤ 100 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `randomStrategy`, `updateStrategies`, `moveToEmptyOneOf`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `attendance`, `crowded`, `plotHistory`, `people`, `cells`.

## Sources and limits

Adapted from the NetLogo *El Farol* model by Rand and Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Attendance near the threshold in a run does not prove convergence to an optimal pattern. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `el-farol`.
