# Membrane Formation

How can molecules organize themselves into a boundary without a template? Water particles and lipids move on a plane. Each lipid has a water-loving head and a water-avoiding tail. Water attracts water and pushes the tails away; particles that come too close repel; a little random force keeps everything moving.

From a random mix, lipids can collect into layers and closed shapes.

Things to try:

- Weaken `waterOilForce` toward 0. Do structures still form?
- Raise `randomForce` and see how stable the structures stay.

## Use

Choose **Membrane Formation** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/membrane-formation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `waterCount` | `750` | integer; ≥ 0; ≤ 1000 |
| `lipidCount` | `250` | integer; ≥ 1; ≤ 500 |
| `waterWaterForce` | `0.2` | number; ≥ 0; ≤ 2 |
| `waterOilForce` | `-0.7` | number; ≥ -2; ≤ 0 |
| `tooCloseForce` | `-0.3` | number; ≥ -2; ≤ 0 |
| `randomForce` | `0.1` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `setupMolecules`, `interactWithNeighbor`, `repelTooCloseNeighbor`, `interactWithPartner`, `hydrophobicIsolation`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `hydrophobicIsolation`, `agents`, `edges`.

## Sources and limits

Adapted from the NetLogo *Membrane Formation* model by Head and Wilensky (2013). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The forces are computational rules without calibrated units, not a molecular force field. A structure that looks like a membrane does not show thermodynamic equilibrium. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `membrane-formation`.
