# Rabbits, Grass and Weeds

How do food quality and regrowth shape a population of consumers? Rabbits wander, spend energy and eat the grass or weeds on their cell. Each plant type has its own growth rate and energy value (`grassGrowRate`, `grassEnergy`, `weedsGrowRate`, `weedEnergy`). A rabbit that collects more than `birthThreshold` energy has offspring; a rabbit with no energy left dies.

By default weeds neither grow nor feed rabbits, so you can switch them on and compare.

Things to try:

- Give weeds some energy and growth. How do the rabbit count and the plant cover change?
- Lower `grassGrowRate`. Does the rabbit population settle, swing or die out?

## Use

Choose **Rabbits, Grass and Weeds** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/rabbits-grass-weeds/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `rabbitCount` | `150` | integer; ≥ 0; ≤ 500 |
| `birthThreshold` | `15` | integer; ≥ 0; ≤ 20 |
| `weedEnergy` | `0` | number; ≥ 0; ≤ 10 |
| `weedsGrowRate` | `0` | integer; ≥ 0; ≤ 20 |
| `grassEnergy` | `5` | number; ≥ 0; ≤ 10 |
| `grassGrowRate` | `15` | integer; ≥ 0; ≤ 20 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `rabbits`, `cells`.

## Sources and limits

Adapted from the NetLogo *Rabbits Grass Weeds* model by Wilensky (2001). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Random movement and cell-level eating replace plant physiology, age structure and real feeding behavior. Population curves show consequences of the energy assumptions, not predictions for a real habitat. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `rabbits-grass-weeds`.
