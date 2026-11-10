# Honeycomb

Circularly moving bees deposit a chemical whose diffusion and evaporation alter subsequent movement. These artificial feedback rules create honeycomb-like patterns without claiming that real bees use this construction mechanism.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Honeycomb`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/honeycomb/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `beeCount` | `250` | integer; ≥ 1; ≤ 500 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `go`, `hideBees`, `showBees`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `chemicalTotal`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Hide bees`, `Show bees`, `Tick`, `Bees`, `Chemical`, `Honeycomb`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `honeycomb` and links any shared checks.
