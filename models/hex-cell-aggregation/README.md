# Hex Cell Aggregation

How do simple growth rules shape a growing cluster? Growth starts from one occupied cell in the middle of a hexagonal grid. Each step, one empty cell becomes occupied. A cell is eligible only if its number of occupied neighbors, from one to six, is switched on (`oneNeighbor` … `sixNeighbors`).

Things to try:

- Allow only `oneNeighbor`. What shape grows?
- Allow one and three neighbors but not two, and compare.

## Use

Choose **Hex Cell Aggregation** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/hex-cell-aggregation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `101` | integer; ≥ 3; ≤ 201 |
| `height` | `101` | integer; ≥ 3; ≤ 201 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `oneNeighbor` | `true` | boolean |
| `twoNeighbors` | `true` | boolean |
| `threeNeighbors` | `true` | boolean |
| `fourNeighbors` | `true` | boolean |
| `fiveNeighbors` | `true` | boolean |
| `sixNeighbors` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `readSwitches`, `setSwitches`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `switches`, `eligibleCount`, `cells`.

## Sources and limits

Adapted from the NetLogo *Hex Cell Aggregation* model by Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The grid is a true hexagonal lattice with fixed edges; the model explores growth rules, not a particular physical process. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `hex-cell-aggregation`.
