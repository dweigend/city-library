# Membrane Formation

Water and connected hydrophilic/hydrophobic lipid parts attract or repel through local movement rules. Aggregates illustrate self-organization, without a calibrated molecular force field or guarantee of thermodynamic equilibrium.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Membrane Formation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/membrane-formation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numWater` | `750` | integer; ≥ 0; ≤ 1000 |
| `numLipids` | `250` | integer; ≥ 1; ≤ 500 |
| `waterWaterForce` | `0.2` | number; ≥ 0; ≤ 2 |
| `waterOilForce` | `-0.7` | number; ≥ -2; ≤ 0 |
| `tooCloseForce` | `-0.3` | number; ≥ -2; ≤ 0 |
| `randomForce` | `0.1` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `setupMolecules`, `interactWithNeighbor`, `repelTooCloseNeighbor`, `interactWithPartner`, `hydrophobicIsolation`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `hydrophobicIsolation`, `agents`, `edges`.

The [UI binding](ui.ts) presents `Tick`, `Molecules`, `Lipids`, `Hydrophobic isolation`, `Membrane Formation`, `Ratio`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `membrane-formation` and links any shared checks.
