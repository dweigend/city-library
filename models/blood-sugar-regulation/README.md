# Blood Sugar Regulation

Moving glucose and hormone particles interact with liver and pancreatic regions; opposing insulin and glucagon rules create feedback. Molecule counts and encounter rules do not supply clinical concentrations or dosing guidance.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Blood Sugar Regulation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/blood-sugar-regulation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `metabolicRate` | `100` | integer; ≥ 0; ≤ 200 |
| `glucoseSensitivity` | `0.75` | number; ≥ 0; ≤ 1 |
| `insulinSensitivity` | `0.75` | number; ≥ 0; ≤ 1 |
| `glucagonSensitivity` | `0.75` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `go`, `eat`, `addGlucose`, `makeLiver`, `makePancreas`, `randomPosition`, `randomBernoulli`, `randomBinomial`, `adjustGlucose`, `adjustHormones`, `metabolizeGlucose`, `signalDegradation`, `move`, `updateTotalGlucose`, `followGlucose`, `followInsulin`, `followGlucagon`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `eating`, `eatTime`, `totalGlucose`, `followingId`, `glucoseCount`, `insulinCount`, `glucagonCount`, `liverCells`, `pancreaticCells`, `storedGlucose`, `agents`.

The [UI binding](ui.ts) presents `Eat`, `Follow glucose`, `Follow insulin`, `Follow glucagon`, `Tick`, `Blood glucose`, `Insulin`, `Glucagon`, `Stored glucose`, `Meal time` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `blood-sugar-regulation` and links any shared checks.
