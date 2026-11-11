# Lac Operon Genetic Switch

How can a cell switch a gene on only when it needs it? This model follows the lac operon in an E. coli-like cell. A repressor (LacI) blocks the gene; lactose can bind the repressor and free the gene, so RNA polymerase can produce LacZ and LacY. Glucose availability, energy and cell division are part of the picture, and you can switch `lactose` and `glucose` on or off.

Things to try:

- Switch `lactose` on and `glucose` off. How do the LacZ and LacY counts change?
- Raise `lacIBondLeakage`. Does the gene still stay off without lactose?

## Use

Choose **Lac Operon Genetic Switch** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/genevo-1-genetic-switch/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `lacICount` | `25` | integer; ≥ 1; ≤ 50 |
| `rnapCount` | `25` | integer; ≥ 0; ≤ 50 |
| `lactose` | `false` | boolean |
| `glucose` | `true` | boolean |
| `levelSpace` | `false` | boolean |
| `lacIBondLeakage` | `0.02` | number; ≥ 0; ≤ 0.1 |
| `lacILactoseBindingChance` | `0.99991` | number; ≥ 0.9999; ≤ 1 |
| `lacILactoseSeparationChance` | `0.001` | number; ≥ 0; ≤ 0.01 |
| `lacYDegradationChance` | `0.0004` | number; ≥ 0; ≤ 0.01 |
| `lacZDegradationChance` | `0.0001` | number; ≥ 0; ≤ 0.01 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `reset`, `drawCell`, `setCellColor`, `showSwitchColor`, `updateLactose`, `move`, `genXYInsideInside`, `genXYInsideOutside`, `dissociateFromOperator`, `goLacIs`, `goLacYs`, `goLacZs`, `goLactoses`, `goRNAPs`, `synthesizeProteins`, `divideCell`, `go`, `setParameters`, `setInitialVariables`, `sendVariablesList`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `message`, `energy`, `initialEnergy`, `divisionCount`, `cellDivisionTime`, `inhibited`, `lacZCount`, `lacYCount`, `lacICount`, `rnapCount`, `lactoseCount`, `pumpCount`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *GenEvo 1 Genetic Switch* model by Dabholkar, Bain and Wilensky (2016). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Binding chances and counts are constructed rules, not calibrated reaction kinetics. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `genevo-1-genetic-switch`.
