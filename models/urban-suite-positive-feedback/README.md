# Urban Suite - Positive Feedback

Activity is raised to a selected exponent, optionally after neighborhood averaging, and normalized by the global maximum. Normalization preserves relative comparison rather than a conserved population or economic quantity.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Positive Feedback`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-positive-feedback/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `alpha` | `1.1` | number; ≥ 0; ≤ 2 |
| `mooreNeighborhood` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setActivities`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `activityDistribution`.

The [UI binding](ui.ts) presents `Tick`, `Maximum activity`, `Total activity`, `Selected`, `Activity`, `Activity distribution · descending rank`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-positive-feedback` and links the retained checks.
