# Urban Suite - Cells

Cells activate from a snapshot of neighboring membership and age according to the source's strict time rule. Optional expiration changes growth form; the lattice contains no households, prices or transport demand.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Cells`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-cells/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `neighborhood` | `"von-neumann"` | `von-neumann`, `moore`, `displaced-von-n`, `h`, `moore-von-n` |
| `countRule` | `"= 1"` | `> 0`, `= 1`, `<= 2` |
| `probability` | `100` | integer; ≥ 0; ≤ 100 |
| `ageLimit` | `55` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `addRandomSeed`, `cycleColors`, `setCells`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `startingColor`, `cells`, `counts`.

The [UI binding](ui.ts) presents `40 steps`, `Random seed`, `Cycle colors`, `Keep cycling colors`, `Neighbor count`, `Activation probability (%)`, `Tick`, `On cells`, `Selected`, `Cells` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-cells` and links the retained checks.
