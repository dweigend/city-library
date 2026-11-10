# Robotic Factory

Robots route garments between machines, spend finite energy, recharge and process stochastic orders. Queues, orders and charging rules define the factory example rather than a measured production schedule.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Robotic Factory`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/robotic-factory/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numberOfRobots` | `5` | integer; ≥ 3; ≤ 20 |
| `fullCharge` | `350` | integer; ≥ 0; ≤ 1000 |
| `justInTimeSupplyRobot` | `150` | integer; ≥ 0; ≤ 300 |
| `showAgentName` | `true` | boolean |
| `makeTrails` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setScenario`, `moveRobot`, `finish`, `makeGarments`, `setRobotsDestination`, `returnHome`, `recharge`, `controllerSendsGarments`, `deliverMoreMaterialSheets`, `shiftChange`, `labelAgents`, `robotSupplyNeed`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `robots`, `machines`, `orders`, `diagnostic`, `newSheets`, `productsReady`, `idlePerTick`, `energySummary`, `energyHistogram`, `trails`.

The [UI binding](ui.ts) presents `Robots`, `Dispatch charge`, `Agent names`, `Trails`, `Tick`, `New sheets`, `Products ready`, `Idle / tick`, `Diagnostic`, `Factory floor` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `robotic-factory` and links any shared checks.
