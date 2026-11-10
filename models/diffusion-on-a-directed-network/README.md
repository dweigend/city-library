# Diffusion on a Directed Network

Transport is staged through active directed edges before node quantities are committed. Conservation and flow reporters can be examined independently of rewiring; this is a graph diffusion rule, not the separate public network-diffusion example.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Diffusion on a Directed Network`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/diffusion-on-a-directed-network/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `gridSize` | `9` | integer; ≥ 3; ≤ 19 |
| `edgeChance` | `50` | integer; ≥ 0; ≤ 100 |
| `diffusionRate` | `10` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `rewire`, `setValues`, `setActiveEdges`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `nodes`, `edges`, `counts`, `maxFlow`, `meanFlow`, `histogram`.

The [UI binding](ui.ts) presents `Edge chance (%)`, `Rewire a link`, `Keep rewiring`, `Diffusion rate (%)`, `Tick`, `Nodes`, `Active edges`, `Total value`, `Max flow`, `Mean flow` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `diffusion-on-a-directed-network` and links any shared checks.
