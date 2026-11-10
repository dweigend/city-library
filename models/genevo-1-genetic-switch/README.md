# GenEvo 1 Genetic Switch

Repressors, RNA polymerase, lactose and expressed proteins move and interact around the lac operon. Binding, transport, energy and division rules expose a constructed gene switch, without calibrated reaction kinetics.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `GenEvo 1 Genetic Switch`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/genevo-1-genetic-switch/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `lacINumber` | `25` | integer; ≥ 1; ≤ 50 |
| `rnapNumber` | `25` | integer; ≥ 0; ≤ 50 |
| `lactose` | `false` | boolean |
| `glucose` | `true` | boolean |
| `levelSpace` | `false` | boolean |
| `lacIBondLeakage` | `0.02` | number; ≥ 0; ≤ 0.1 |
| `lacILactoseBindingChance` | `0.99991` | number; ≥ 0.9999; ≤ 1 |
| `lacILactoseSeparationChance` | `0.001` | number; ≥ 0; ≤ 0.01 |
| `lacYDegradationChance` | `0.0004` | number; ≥ 0; ≤ 0.01 |
| `lacZDegradationChance` | `0.0001` | number; ≥ 0; ≤ 0.01 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `reset`, `drawCell`, `setCellColor`, `showSwitchColor`, `updateLactose`, `move`, `genXYInsideInside`, `genXYInsideOutside`, `dissociateFromOperator`, `goLacIs`, `goLacYs`, `goLacZs`, `goLactoses`, `goRNAPs`, `synthesizeProteins`, `divideCell`, `go`, `setParameters`, `setInitialVariables`, `sendVariablesList`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `message`, `energy`, `initialEnergy`, `divisionNumber`, `cellDivisionTime`, `inhibited`, `lacZCount`, `lacYCount`, `lacICount`, `rnapCount`, `lactoseCount`, `pumpCount`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Reset parameters`, `Tick`, `Energy`, `LacZ`, `LacY`, `Message`, `Divisions`, `GenEvo 1 Genetic Switch`, `History`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `genevo-1-genetic-switch` and links any shared checks.
