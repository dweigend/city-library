# Diffusion on a Directed Network

Can one-way links concentrate a quantity that starts out equal? Nodes sit on a grid and are connected by directed links (`edgeChance`). Each step, every node sends `diffusionRate` percent of its value, split equally over its outgoing links. The total value is conserved; only its distribution changes. `rewire` builds new links.

Things to try:

- Rewire a few times and compare which nodes end up holding the most.
- Lower `edgeChance`. How unequal does the distribution become?

## Use

Choose **Diffusion on a Directed Network** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/diffusion-on-a-directed-network/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `gridSize` | `9` | integer; ≥ 3; ≤ 19 |
| `edgeChance` | `50` | integer; ≥ 0; ≤ 100 |
| `diffusionRate` | `10` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `rewire`, `setValues`, `setActiveEdges`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `nodes`, `edges`, `counts`, `maxFlow`, `meanFlow`, `histogram`.

## Sources and limits

Adapted from the NetLogo *Diffusion on a Directed Network* model by Stonedahl and Wilensky (2008). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

This is a graph diffusion rule; it is separate from the public network-diffusion example. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `diffusion-on-a-directed-network`.
