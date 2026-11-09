# Rumor Mill

Informed grid cells each select a neighbor to hear the rumor; a snapshot of senders prevents newly informed cells from transmitting immediately. Four- versus eight-neighbor contact and repeated exposures shape the wave, without a measured social network.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Rumor Mill`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/rumor-mill/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `setup` | `"one"` | `one`, `random` |
| `initClique` | `0.1` | number; ≥ 0; ≤ 10 |
| `eightMode` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `seedOne`, `seedRandom`, `hearAt`, `setColorMode`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `colorMode`, `cells`.

The [UI binding](ui.ts) presents `Initial sources`, `Initial clique (%)`, `Eight neighbors`, `Seed center`, `Seed random`, `Color: normal`, `Color: when heard`, `Color: times heard`, `Tick`, `Clique (%)` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `rumor-mill` and links any shared checks.
