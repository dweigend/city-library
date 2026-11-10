# Percolation

Oil enters permeable soil according to sequential local rules while the displayed landscape scrolls. The finite porous grid and entrance geometry determine penetration; this is not a calibrated groundwater flow model.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Percolation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/percolation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `150` | integer; ≥ 3; ≤ 300 |
| `height` | `221` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `porosity` | `60.5` | number; ≥ 0; ≤ 99 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setFront`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `currentRow`, `totalOil`, `counts`.

The [UI binding](ui.ts) presents `Tick`, `Total oil`, `Front`, `Current row`, `Soil`, `Saturated soil`, `Percolating oil`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `percolation` and links any shared checks.
