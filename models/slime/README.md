# Slime

Mobile cells sense and contribute to a chemical field that diffuses and decays. Local attraction can create aggregates without a pacemaker, while differentiation and a complete slime-mold life cycle are outside the model.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Slime`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/slime/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `population` | `400` | integer; ≥ 1; ≤ 1500 |
| `sniffThreshold` | `1` | number; ≥ 0; ≤ 5 |
| `sniffAngle` | `45` | number; ≥ 0; ≤ 180 |
| `wiggleAngle` | `40` | number; ≥ 0; ≤ 45 |
| `wiggleBias` | `0` | number; ≥ -40; ≤ 40 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `go`, `turnTowardChemical`, `chemicalAhead`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `chemicalTotal`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Tick`, `Population`, `Chemical`, `Slime`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `slime` and links any shared checks.
