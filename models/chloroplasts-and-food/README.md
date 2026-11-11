# Chloroplasts and Food

How does light energy end up as stored sugar in a plant cell? Light particles, water and carbon dioxide flow through a simplified leaf cell. Chloroplasts use light to charge energy carriers, which then help turn carbon dioxide into glucose and release oxygen. The counts of carbon dioxide, oxygen and produced glucose follow these steps.

`intensityOfLight`, `waterflowThroughLeaf` and the initial carbon dioxide control the supply side.

Things to try:

- Dim `intensityOfLight` and compare the glucose count over time.
- Remove all chloroplasts with `initialChloroplastCount` 0. Which counts stay constant?

## Use

Choose **Chloroplasts and Food** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/chloroplasts-and-food/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialChloroplastCount` | `3` | integer; ≥ 0; ≤ 6 |
| `initialCarbonDioxideCount` | `100` | integer; ≥ 0; ≤ 200 |
| `waterflowThroughLeaf` | `25` | number; ≥ 0; ≤ 50 |
| `intensityOfLight` | `50` | number; ≥ 0; ≤ 100 |
| `autoStop` | `false` | boolean |
| `stopAt` | `2000` | number; ≥ 100; ≤ 5000 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `go`, `makeSystemBoundary`, `makeInitialChloroplasts`, `doPhotonFlow`, `doWaterAndSugarFlow`, `doGasFlow`, `wiggle`, `updateADPATPs`, `updateChloroplasts`, `updateCounts`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `carbonDioxideCount`, `oxygenCount`, `producedGlucoseCount`, `agents`, `flowEdges`, `chloroplasts`, `atpSites`, `cells`.

## Sources and limits

Adapted from the NetLogo *Chloroplasts and Food* model by Novak, Penuel and Wilensky (2016). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

This is a teaching sequence of interacting parts, not a reconstruction of the Calvin cycle or electron transport, and its counts are not measured productivity. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `chloroplasts-and-food`.
