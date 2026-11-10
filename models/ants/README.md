# Ants

Searching ants respond to nearby scent, carry food home and deposit pheromone. Diffusion and evaporation change the field after local decisions; the three food piles can be depleted independently.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Ants`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/ants/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `population` | `125` | integer; ≥ 0; ≤ 200 |
| `diffusionRate` | `50` | integer; ≥ 0; ≤ 99 |
| `evaporationRate` | `10` | integer; ≥ 0; ≤ 99 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `ants`, `cells`, `foodByPile`.

The [UI binding](ui.ts) presents `Diffusion rate (%)`, `Evaporation rate (%)`, `Tick`, `Carrying food`, `Food remaining`, `Nest, food and pheromone`, `Selected ant`, `Food in each pile`, `Pile ${n}`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `ants` and links any shared checks.
