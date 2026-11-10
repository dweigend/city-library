# PageRank

Rank is redistributed along directed links while a separate random surfer accumulates visit counts. Damping and dangling-node treatment shape the result; a short stochastic visit history need not equal the rank vector.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `PageRank`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/pagerank/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `networkChoice` | `"Example 1"` | `Example 1`, `Example 2`, `Preferential Attachment` |
| `calculationMethod` | `"random-surfer"` | `diffusion`, `random-surfer` |
| `dampingFactor` | `0.85` | number; ≥ 0; ≤ 1 |
| `numberOfSurfers` | `5` | integer; ≥ 1; ≤ 100 |
| `watchSurfers` | `true` | boolean |
| `showPageRanks` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `diffuse`, `surf`, `globals`, `setParameters`, `setScenario`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `pages`, `edges`, `surfers`.

The [UI binding](ui.ts) presents `Network`, `Tick`, `Total rank`, `Maximum rank`, `Surfers`, `Pages and edges`, `${p.id}${s.parameters.showPageRanks ? `, `Current ranks`, `PageRank`, `Page visits`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `pagerank` and links any shared checks.
