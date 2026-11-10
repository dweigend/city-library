# K-Means Clustering

Data points are assigned to the nearest centroid and centroids are recomputed until the tolerance-based stopping condition. Radial data generation, initialization and empty-cluster handling belong to the example; a partition is not evidence of natural categories.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `K-Means Clustering`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/k-means-clustering/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numClusters` | `7` | integer; ≥ 1; ≤ 14 |
| `numCentroids` | `7` | integer; ≥ 1; ≤ 14 |
| `numDataPoints` | `138` | integer; ≥ 2; ≤ 1000 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `assignClusters`, `updateClusters`, `resetCentroids`, `setScenario`, `squareDeviations`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `anyCentroidsMoved`, `diagnostic`, `points`, `centroids`, `deviations`, `meanDeviation`.

The [UI binding](ui.ts) presents `Requested points`, `Generated clusters / plot multiplier`, `Centroids on reset`, `Assign points`, `Update centroids`, `Reset centroids`, `Tick`, `Points`, `Mean centroid SSE`, `Clusters` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `k-means-clustering` and links any shared checks.
