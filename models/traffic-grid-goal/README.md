# Traffic Grid Goal

Do commuters with destinations behave differently from cars that just circle? Each car has a home and a workplace on the street grid. It moves toward its current goal, choosing locally which way to turn, and switches goal when it arrives. Traffic lights and car-following work as in Traffic Grid.

Things to try:

- Compare the average wait time with Traffic Grid at the same `carCount`.
- Change `ticksPerCycle` and follow a single car with `watchCar`.

## Use

Choose **Traffic Grid Goal** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/traffic-grid-goal/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `step`, `snapshot`, `setParameters`, `selectIntersection`, `changeLight`, `watchCar`, `stopWatching`, `cars`, `setSignalColors`, `recordData`, `setCarColor`, `setCarSpeed`, `nextField`, `updateCurrent`, `setSignals`, `nextPhase`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `phase`, `stoppedCarCount`, `currentIntersectionId`, `watchedCarId`, `cars`, `intersections`, `cells`.

## Sources and limits

Adapted from the NetLogo *Traffic Grid Goal* model by Rand and Wilensky (2008). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Local goal seeking is not the same as shortest-path or equilibrium routing. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `traffic-grid-goal`.
