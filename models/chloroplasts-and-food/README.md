# Chloroplasts and Food

Photons, water, gases and energy carriers feed simplified chloroplast reactions and sugar production. The molecule animation is a curricular dependency model rather than a complete biochemical pathway or productivity estimate.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Chloroplasts and Food`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/chloroplasts-and-food/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialChloroplasts` | `3` | integer; ≥ 0; ≤ 6 |
| `initialCarbonDioxide` | `100` | integer; ≥ 0; ≤ 200 |
| `waterflowThroughLeaf` | `25` | number; ≥ 0; ≤ 50 |
| `intensityOfLight` | `50` | number; ≥ 0; ≤ 100 |
| `autoStop` | `false` | boolean |
| `stopAt` | `2000` | number; ≥ 100; ≤ 5000 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `go`, `makeSystemBoundary`, `makeInitialChloroplasts`, `doPhotonFlow`, `doWaterAndSugarFlow`, `doGasFlow`, `wiggle`, `updateADPATPs`, `updateChloroplasts`, `updateCounts`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `carbonDioxide`, `oxygen`, `glucoseProduced`, `agents`, `flowEdges`, `chloroplasts`, `atpSites`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `CO2`, `O2`, `Glucose produced`, `Chloroplasts and Food`, `Molecules`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `chloroplasts-and-food` and links any shared checks.
