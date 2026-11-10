# Wolf Sheep Predation

Wolves eat sheep and spend energy; the optional grass variant also gives sheep renewable food and energy costs. Local reproduction and movement can create population feedback without being identical to aggregate predator–prey equations.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Wolf Sheep Predation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/wolf-sheep-predation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `mode` | `"sheep-wolves"` | `sheep-wolves`, `sheep-wolves-grass` |
| `initialSheep` | `100` | integer; ≥ 0; ≤ 250 |
| `initialWolves` | `50` | integer; ≥ 0; ≤ 250 |
| `sheepGain` | `4` | integer; ≥ 0; ≤ 50 |
| `wolfGain` | `20` | integer; ≥ 0; ≤ 100 |
| `sheepReproduce` | `4` | integer; ≥ 1; ≤ 20 |
| `wolfReproduce` | `5` | integer; ≥ 0; ≤ 20 |
| `grassRegrowth` | `30` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `counts`, `agents`, `cells`, `stopReason`.

The [UI binding](ui.ts) presents `Sheep food gain`, `Wolf food gain`, `Sheep reproduction (%)`, `Wolf reproduction (%)`, `Tick`, `Sheep`, `Wolves`, `Grass / 4`, `Selected`, `Animals and grass` and further views or controls.

## Sources and acceptance

Attribution and rights: [adaptation comments](model.ts) and the retained source notices. Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `wolf-sheep-predation` and links any shared checks.
