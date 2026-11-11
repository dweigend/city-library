# Muscle Development

How do training rhythm and sleep shape muscle growth? Each day the simulated person may lift weights (`lift`, `intensity`, `daysBetweenWorkouts`) and sleeps for `hoursOfSleep`. Lifting and sleep shift two simplified hormone levels, one that breaks muscle down and one that builds it up, and muscle fibers grow or shrink with their balance.

Things to try:

- Halve `hoursOfSleep` and compare muscle mass after the same number of steps.
- Change `daysBetweenWorkouts`. Is there a rhythm that works better under these rules?

## Use

Choose **Muscle Development** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/muscle-development/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `daysBetweenWorkouts` | `5` | integer; ≥ 1; ≤ 30 |
| `hoursOfSleep` | `8` | number; ≥ 0; ≤ 12 |
| `intensity` | `95` | number; ≥ 50; ≤ 100 |
| `lift` | `true` | boolean |
| `slowTwitchFiberPercent` | `50` | number; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `newMuscleFibers`, `regulateHormones`, `regulateMuscleFibers`, `performDailyActivity`, `liftWeights`, `sleep`, `grow`, `developMuscle`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `muscleMass`, `fibers`, `cells`.

## Sources and limits

Adapted from the NetLogo *Muscle Development* model by Wilensky (2002). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The hormone variables are explanatory abstractions, and research questions the simple link between circulating hormones and muscle growth. The model is not a training prescription. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `muscle-development`.
