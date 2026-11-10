# Tumor

Self-renewing stem cells and limited-lived transitory cells divide under different rules, with explicit treatment actions. Persistence after removing one compartment is a consequence of those selected cell hierarchies, not a clinical prediction.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Tumor`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/tumor/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `leaveTrail` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `setStem`, `forwardCell`, `moveTransitionalCells`, `mitosis`, `death`, `evaluateParams`, `killOriginalStemCell`, `killMovingStemCell`, `killTransitoryCells`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cellCount`, `cells`, `trails`.

The [UI binding](ui.ts) presents `Kill transitory cells`, `Kill original stem cell`, `Kill moving stem cell`, `Tick`, `Cell count`, `Tumor`, `Living cells`, `Cells alive`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `tumor` and links any shared checks.
