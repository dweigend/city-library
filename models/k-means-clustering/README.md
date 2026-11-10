# K-Means Clustering

How does k-means divide points into groups? Data points are generated around `clusterCount` centers. The algorithm starts with `centroidCount` centroids, assigns every point to its nearest centroid, then moves each centroid to the mean of its points. It repeats until the centroids barely move.

Things to try:

- Use more centroids than clusters. How are the true groups split?
- Reset the centroids with `resetCentroids` and compare the final partition.

## Use

Choose **K-Means Clustering** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/k-means-clustering/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `clusterCount` | `7` | integer; ≥ 1; ≤ 14 |
| `centroidCount` | `7` | integer; ≥ 1; ≤ 14 |
| `dataPointCount` | `138` | integer; ≥ 2; ≤ 1000 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `assignClusters`, `updateClusters`, `resetCentroids`, `setScenario`, `squareDeviations`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `anyCentroidsMoved`, `diagnostic`, `points`, `centroids`, `deviations`, `meanDeviation`.

## Sources and limits

Adapted from the NetLogo *K-Means Clustering* model by Hjorth, Head and Wilensky (2014). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Data generation and initialization belong to the example. A clean partition is not evidence that the groups exist in real data. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `k-means-clustering`.
