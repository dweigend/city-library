# Flocking

Birds turn using separation, circular heading alignment and cohesion, then move in sequential activation order. Turn limits and perception range are explicit assumptions; a coherent flock does not imply global route planning.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Flocking`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/flocking/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `population` | `300` | integer; ≥ 1; ≤ 1000 |
| `vision` | `5` | number; ≥ 0; ≤ 10 |
| `minimumSeparation` | `1` | number; ≥ 0; ≤ 5 |
| `maxAlignTurn` | `5` | number; ≥ 0; ≤ 20 |
| `maxCohereTurn` | `3` | number; ≥ 0; ≤ 20 |
| `maxSeparateTurn` | `1.5` | number; ≥ 0; ≤ 20 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `birds`.

The [UI binding](ui.ts) presents `Max alignment turn`, `Max cohesion turn`, `Max separation turn`, `Tick`, `Birds`, `Flock`, `Selected bird`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `flocking` and links any shared checks.
