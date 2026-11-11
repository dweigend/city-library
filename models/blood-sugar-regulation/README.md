# Blood Sugar Regulation

How does the body pull blood sugar back into range after a meal? Glucose, insulin and glucagon move as particles between a liver region and a pancreas region. When glucose is high, the pancreas releases insulin and the liver stores glucose; when it is low, glucagon makes the liver release it. Glucose is used up at `metabolicRate`, and `eat` or `addGlucose` disturb the balance on purpose.

The sensitivity inputs set how strongly each part reacts, so you can weaken one side of the feedback and compare.

Things to try:

- Lower `insulinSensitivity` and use `eat`. How long does total glucose stay high?
- Raise `metabolicRate`. Does glucagon become more active?

## Use

Choose **Blood Sugar Regulation** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/blood-sugar-regulation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `metabolicRate` | `100` | integer; ≥ 0; ≤ 200 |
| `glucoseSensitivity` | `0.75` | number; ≥ 0; ≤ 1 |
| `insulinSensitivity` | `0.75` | number; ≥ 0; ≤ 1 |
| `glucagonSensitivity` | `0.75` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `go`, `eat`, `addGlucose`, `makeLiver`, `makePancreas`, `randomPosition`, `randomBernoulli`, `randomBinomial`, `adjustGlucose`, `adjustHormones`, `metabolizeGlucose`, `signalDegradation`, `move`, `updateTotalGlucose`, `followGlucose`, `followInsulin`, `followGlucagon`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `eating`, `eatTime`, `totalGlucose`, `followingId`, `glucoseCount`, `insulinCount`, `glucagonCount`, `liverCells`, `pancreaticCells`, `storedGlucose`, `agents`.

## Sources and limits

Adapted from the NetLogo *Blood Sugar Regulation* model by Woods and Wilensky (2017). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Particle counts and encounter rules are not clinical concentrations, and the model gives no dosing or medical guidance. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `blood-sugar-regulation`.
