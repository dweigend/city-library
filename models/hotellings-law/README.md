# Hotelling's Law

Consumers choose stores in a spatial market while stores adjust location or price according to the selected rule. Market share and revenue depend on these stipulated consumer choices, not a measured retail demand curve.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Hotelling's Law`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/hotellings-law/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numberOfStores` | `3` | integer; ≥ 2; ≤ 10 |
| `layout` | `"plane"` | `plane`, `line` |
| `rules` | `"normal"` | `normal`, `moving-only`, `pricing-only` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `chooseStoreAt`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `stores`, `consumers`.

The [UI binding](ui.ts) presents `Stores`, `Tick`, `Consumers`, `Stores and market areas`, `Market area history`, `Store ${i + 1}`, `Revenue history`, `Market shares`, `Store prices`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `hotellings-law` and links any shared checks.
