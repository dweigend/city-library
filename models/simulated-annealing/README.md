# Simulated Annealing

Image elements swap under anisotropic local energy and a temperature-dependent acceptance rule. Cooling changes the chance of accepting worse moves; reaching a low-energy image does not prove a global minimum.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Simulated Annealing`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/simulated-annealing/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `30` | integer; ≥ 2; ≤ 201 |
| `height` | `30` | integer; ≥ 2; ≤ 201 |
| `seed` | `1` | integer |
| `coolingRate` | `1` | number; ≥ 0; ≤ 50 |
| `swapRadius` | `1` | integer; ≥ 1; ≤ 5 |
| `acceptEqualChanges` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `energyAt`, `attemptSwap`, `setScenario`, `totalEnergy`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `temperature`, `globalEnergy`, `attempts`, `accepted`, `brightness`, `cells`.

The [UI binding](ui.ts) presents `Cooling (%)`, `Tick`, `Temperature`, `Global energy`, `Accepted / attempted`, `Brightness`, `Energy`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `simulated-annealing` and links any shared checks.
