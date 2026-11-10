# Rabbits Grass Weeds

Rabbits move, eat growing resources, lose energy and reproduce when the configured conditions allow. Resource growth and consumption are sequential, so population cycles depend on the explicit local order and energy assumptions.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Rabbits Grass Weeds`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/rabbits-grass-weeds/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `150` | integer; ≥ 0; ≤ 500 |
| `birthThreshold` | `15` | integer; ≥ 0; ≤ 20 |
| `weedEnergy` | `0` | number; ≥ 0; ≤ 10 |
| `weedsGrowRate` | `0` | integer; ≥ 0; ≤ 20 |
| `grassEnergy` | `5` | number; ≥ 0; ≤ 10 |
| `grassGrowRate` | `15` | integer; ≥ 0; ≤ 20 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `rabbits`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `Rabbits`, `Rabbits and resources`, `Populations (resources / 4)`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `rabbits-grass-weeds` and links any shared checks.
