# Heat Diffusion

Randomly ordered local heat updates operate inside fixed-temperature boundary strips. Material diffusivity and alpha change the numerical transfer rule; this update order differs from a simultaneous field solve.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Heat Diffusion`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/heat-diffusion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `51` | integer; ≥ 5; ≤ 101 |
| `height` | `51` | integer; ≥ 5; ≤ 101 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialPlateTemp` | `44` | number; ≥ 1; ≤ 100 |
| `leftTemp` | `1` | number; ≥ 1; ≤ 100 |
| `rightTemp` | `50` | number; ≥ 1; ≤ 100 |
| `topTemp` | `50` | number; ≥ 1; ≤ 100 |
| `bottomTemp` | `50` | number; ≥ 1; ≤ 100 |
| `alpha` | `0.8418` | number; ≥ 0.001; ≤ 10 |
| `materialType` | `"aluminum"` | `wood`, `stone`, `iron`, `aluminum`, `silver`, `other` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `updateFieldAt`, `updateAlpha`, `heatDiffusivity`, `setRules`, `setTemperatures`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `plateSize`, `minTemp`, `maxTemp`, `heatDiffusivity`, `cells`.

The [UI binding](ui.ts) presents `Initial plate temperature`, `Update alpha`, `Tick`, `Heat diffusivity`, `Plate temperature`, `ModelField`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `heat-diffusion` and links any shared checks.
