# Preferential Attachment

A new node chooses an existing node with probability proportional to degree and adds a link. Finite degree distributions illustrate cumulative attachment without demonstrating that a real network grew by this mechanism.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Preferential Attachment`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/preferential-attachment/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Model-specific `read()` fields include `nodeCount`, `edgeCount`, `nodes`, `edges`, `distribution`, `logDistribution`.

The [UI binding](ui.ts) presents `Tick`, `Nodes`, `Edges`, `Selected`, `Network`, `Degree distribution`, `Degree distribution · log₁₀`, `log count`.

## Sources and acceptance

Attribution and rights: [adaptation comments](model.ts) and the retained source notices. Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `preferential-attachment` and links any shared checks.
