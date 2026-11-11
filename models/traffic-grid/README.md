# Traffic Grid

How do traffic lights and car density shape congestion on a street grid? Cars drive along one-way streets, speed up to `speedLimit` and queue behind other cars. Lights switch every `ticksPerCycle` steps when `currentAuto` is on, or you can switch a selected intersection by hand. With `power` off, the lights stop working.

Things to try:

- Change `ticksPerCycle` and compare the average wait time.
- Turn `power` off. What happens at the intersections?

## Use

Choose **Traffic Grid** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/traffic-grid/model.ts";

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

Other actions: `step`, `snapshot`, `setParameters`, `selectIntersection`, `changeLight`, `cars`, `setSignalColors`, `recordData`, `setCarColor`, `setCarSpeed`, `updateCurrent`, `setSignals`, `nextPhase`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `phase`, `stoppedCarCount`, `currentIntersectionId`, `watchedCarId`, `cars`, `intersections`, `cells`.

## Sources and limits

Adapted from the NetLogo *Traffic Grid* model by Wilensky (2003). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Movement is sequential and local; the model is not a network-wide traffic assignment. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `traffic-grid`.
