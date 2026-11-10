# Traffic 2 Lanes

Cars accelerate, brake behind other cars and change lanes after patience is exhausted when the switching rule allows. The wrapping two-lane road omits merges and measured driver heterogeneity.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Traffic 2 Lanes`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/traffic-2-lanes/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numberOfCars` | `40` | integer; ≥ 1; ≤ 82 |
| `acceleration` | `0.005` | number; ≥ 0.001; ≤ 0.01 |
| `deceleration` | `0.02` | number; ≥ 0.01; ≤ 0.1 |
| `maxPatience` | `50` | integer; ≥ 1; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `step`, `snapshot`, `setParameters`, `selectCar`, `selectCarAt`, `setPerspective`, `createOrRemoveCars`, `speedUpCar`, `slowDownCar`, `moveForward`, `chooseNewLane`, `moveToTargetLane`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `selectedCarId`, `perspective`, `cells`, `cars`.

The [UI binding](ui.ts) presents `Watch selected car`, `Follow selected car`, `Reset perspective`, `Tick`, `Selected speed`, `Two lanes`, `Car speeds`, `Driver patience`, `Cars per lane`, `Car` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](original.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `traffic-2-lanes` and links any shared checks.
