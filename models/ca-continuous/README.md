# CA Continuous

Each new row averages three parent values, adds a constant and retains the fractional part at the chosen precision. Finite precision matters: a visually irregular image is not evidence of random forcing or physical diffusion.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `CA Continuous`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/ca-continuous/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each progress step writes one generation as a display row. When the display fills, use Continue (`continueRun()`) to carry the final row into the next display, or enable `autoContinue`; this preserves evolution rather than drawing a new initial condition.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `201` | integer; ≥ 3; ≤ 501 |
| `height` | `201` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialization` | `"single"` | `single`, `random` |
| `maxValue` | `0.5` | number; ≥ 0; ≤ 1 |
| `addConstant` | `0.47` | number; ≥ 0; ≤ 1 |
| `precisionLevel` | `16` | integer; ≥ 1; ≤ 16 |
| `autoContinue` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setupSingle`, `setupRandom`, `continueRun`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `row`, `cells`.

The [UI binding](ui.ts) presents `Setup single`, `Setup random`, `Continue`, `Tick`, `Row`, `Rows`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `ca-continuous` and links any shared checks.
