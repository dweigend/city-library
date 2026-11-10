# Hex Cell Aggregation

One eligible cell grows at a time on a bounded six-neighbor hexagonal lattice. Neighbor switches determine eligibility; the displayed hexagons do not use a square-grid approximation.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Hex Cell Aggregation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/hex-cell-aggregation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `readSwitches`, `setSwitches`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `switches`, `eligibleCount`, `cells`.

The [UI binding](ui.ts) presents `Read switches`, `1 live neighbors`, `2 live neighbors`, `3 live neighbors`, `4 live neighbors`, `5 live neighbors`, `6 live neighbors`, `Tick`, `Alive`, `Eligible` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `hex-cell-aggregation` and links any shared checks.
