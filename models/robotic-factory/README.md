# Robotic Factory

Can robots keep a factory running when they must stop to recharge? Orders for garments arrive at random. Robots carry material between cutting, stitching and finishing machines, storage and loading. Each trip costs energy, and a robot returns to charge when its battery runs low (`fullCharge`). A supply robot delivers new material sheets when stock falls below `justInTimeSupplyRobot`.

Things to try:

- Change `robotCount` and compare how many products are ready per tick.
- Lower `fullCharge`. Where do the queues build up?

## Use

Choose **Robotic Factory** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/robotic-factory/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `robotCount` | `5` | integer; ≥ 3; ≤ 20 |
| `fullCharge` | `350` | integer; ≥ 0; ≤ 1000 |
| `justInTimeSupplyRobot` | `150` | integer; ≥ 0; ≤ 300 |
| `showAgentName` | `true` | boolean |
| `makeTrails` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setScenario`, `moveRobot`, `finish`, `makeGarments`, `setRobotsDestination`, `returnHome`, `recharge`, `controllerSendsGarments`, `deliverMoreMaterialSheets`, `shiftChange`, `labelAgents`, `robotSupplyNeed`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `robots`, `machines`, `orders`, `diagnostic`, `newSheetCount`, `readyProductCount`, `idlePerTick`, `energySummary`, `energyHistogram`, `trails`.

## Sources and limits

Adapted from the NetLogo *Robotic Factory* model by Martin and Wilensky (2021). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Queues, orders and charging rules define a teaching factory, not a measured production schedule. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `robotic-factory`.
