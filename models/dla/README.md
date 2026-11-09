# DLA

Off-lattice random walkers attach to a lattice aggregate when they meet the growth condition. The deposited pattern and its radius depend on the finite world and stopping rule; resemblance to a natural aggregate is not a material calibration.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `DLA`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/dla/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `171` | integer; ≥ 9; ≤ 301 |
| `height` | `171` | integer; ≥ 9; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `maxParticles` | `100` | integer; ≥ 1; ≤ 300 |
| `wiggleAngle` | `60` | number; ≥ 0; ≤ 360 |
| `useWholeWorld` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `makeNewAgent`, `wander`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `radius`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Tick`, `Radius`, `Walkers`, `Aggregate and walkers`, `Walker`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `dla` and links any shared checks.
