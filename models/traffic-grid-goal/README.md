# Traffic Grid Goal

Cars choose local moves toward assigned destinations while respecting source-specific signals and following constraints. Local goal seeking is distinct from globally shortest or equilibrium routing.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Traffic Grid Goal`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/traffic-grid-goal/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `gridSizeX` | `5` | integer; ≥ 1; ≤ 9 |
| `gridSizeY` | `5` | integer; ≥ 1; ≤ 9 |
| `carCount` | `200` | integer; ≥ 1; ≤ 400 |
| `speedLimit` | `1` | number; ≥ 0.1; ≤ 1 |
| `ticksPerCycle` | `20` | integer; ≥ 1; ≤ 100 |
| `currentPhase` | `0` | integer; ≥ 0; ≤ 99 |
| `currentAuto` | `true` | boolean |
| `power` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `step`, `snapshot`, `setParameters`, `selectIntersection`, `changeLight`, `watchCar`, `stopWatching`, `cars`, `setSignalColors`, `recordData`, `setCarColor`, `setCarSpeed`, `nextField`, `updateCurrent`, `setSignals`, `nextPhase`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `phase`, `stoppedCarCount`, `currentIntersectionId`, `watchedCarId`, `cars`, `intersections`, `cells`.

The [UI binding](ui.ts) presents `Change light`, `Watch a car`, `Stop watching`, `Tick`, `Phase`, `Stopped cars`, `Traffic grid`, `Average speed of cars`, `Average wait time of cars`, `Car`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](original.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `traffic-grid-goal` and links any shared checks.
