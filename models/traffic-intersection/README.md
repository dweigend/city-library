# Traffic Intersection

Can a traffic light reduce waiting without causing crashes? Cars arrive from the north and from the east with frequencies `freqNorth` and `freqEast`. They accelerate and brake within limits and stop for red lights, with green and yellow phases of chosen length. Cars that collide are removed and counted.

Things to try:

- Change `greenLength` and compare the waiting counts.
- Set `yellowLength` to 0. Do crashes appear?

## Use

Choose **Traffic Intersection** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/traffic-intersection/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `auto` | `true` | boolean |
| `speedLimit` | `5` | integer; ≥ 1; ≤ 10 |
| `maxAccel` | `2` | integer; ≥ 1; ≤ 10 |
| `maxBrake` | `4` | integer; ≥ 1; ≤ 10 |
| `freqNorth` | `60` | number; ≥ 0; ≤ 100 |
| `freqEast` | `100` | number; ≥ 0; ≤ 100 |
| `greenLength` | `12` | integer; ≥ 1; ≤ 50 |
| `yellowLength` | `3` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `step`, `snapshot`, `setParameters`, `changeToYellow`, `changeToRed`, `elapsed`, `brakingDistanceAt`, `nextBlockedField`, `isBlocked`, `adjustSpeed`, `move`, `checkForCollisions`, `makeNewCar`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `ticksAtLastChange`, `cells`, `cars`, `lights`, `accidents`.

## Sources and limits

Adapted from the NetLogo *Traffic Intersection* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Wait and crash counts describe this single intersection, not a safety assessment. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `traffic-intersection`.
