# Heatbugs

Bugs seek preferred temperatures while avoiding occupied cells, emit heat and experience diffusion. Unhappiness measures deviation from an assigned ideal, not an independently observed biological welfare measure.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Heatbugs`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/heatbugs/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `bugCount` | `100` | integer; ≥ 0; ≤ 500 |
| `minIdealTemp` | `10` | integer; ≥ 0; ≤ 200 |
| `maxIdealTemp` | `40` | integer; ≥ 0; ≤ 200 |
| `minOutputHeat` | `5` | integer; ≥ 0; ≤ 100 |
| `maxOutputHeat` | `25` | integer; ≥ 0; ≤ 100 |
| `evaporationRate` | `0.01` | number; ≥ 0; ≤ 1 |
| `diffusionRate` | `0.9` | number; ≥ 0; ≤ 1 |
| `randomMoveChance` | `0` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `deepFreeze`, `heatUp`, `setColorMode`, `watch`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `colorByUnhappiness`, `watched`, `meanUnhappiness`, `maxUnhappiness`, `bugs`, `cells`.

The [UI binding](ui.ts) presents `Max ideal temperature`, `Min ideal temperature`, `Random move chance (%)`, `Deep freeze`, `Heat up`, `Ideal temperature`, `Happiness`, `Watch happiest`, `Watch saddest`, `Reset perspective` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `heatbugs` and links any shared checks.
