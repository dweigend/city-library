# Two-Lane Traffic

Do lane changes help or hurt traffic flow? Cars drive on a two-lane ring road. They speed up when there is room and brake behind slower cars. A car that is held up loses patience and changes lanes once its patience (`maxPatience`) runs out and the other lane is free.

Things to try:

- Change `maxPatience` and compare the average speed.
- Raise `carCount` until jams form. Does lane changing still help?

## Use

Choose **Two-Lane Traffic** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/traffic-2-lanes/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `carCount` | `40` | integer; ≥ 1; ≤ 82 |
| `acceleration` | `0.005` | number; ≥ 0.001; ≤ 0.01 |
| `deceleration` | `0.02` | number; ≥ 0.01; ≤ 0.1 |
| `maxPatience` | `50` | integer; ≥ 1; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `step`, `snapshot`, `setParameters`, `selectCar`, `selectCarAt`, `setPerspective`, `createOrRemoveCars`, `speedUpCar`, `slowDownCar`, `moveForward`, `chooseNewLane`, `moveToTargetLane`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `selectedCarId`, `perspective`, `cells`, `cars`.

## Sources and limits

Adapted from the NetLogo *Traffic 2 Lanes* model by Wilensky and Payette (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The ring road has no merges or exits, and all drivers follow the same rules. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `traffic-2-lanes`.
