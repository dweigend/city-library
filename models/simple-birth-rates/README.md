# Simple Birth Rates

Birth and death draws change finite populations according to the selected fertility experiment. Extinction and demographic sampling remain possible even when an average-rate calculation suggests growth.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Simple Birth Rates`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/simple-birth-rates/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `carryingCapacity` | `1000` | integer; ≥ 1; ≤ 4000 |
| `redFertility` | `2` | number; ≥ 0; ≤ 10 |
| `blueFertility` | `2` | number; ≥ 0; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `advanceUntilRestart`, `initializePopulation`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `agents`, `output`.

The [UI binding](ui.ts) presents `Advance population`, `Repeat experiment`, `Initialize population`, `Generation`, `Reds`, `Blues`, `Population`, `Populations`, `Experiment output`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `simple-birth-rates` and links any shared checks.
