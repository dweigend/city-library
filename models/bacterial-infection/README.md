# Bacterial Infection

Bacteria reproduce into available space, while moving antibiotic particles interact with membrane porosity. Regional dosing and fever controls change the constructed selection environment; porosity is a teaching abstraction for resistance.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Bacterial Infection`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/bacterial-infection/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `reproduce` | `true` | boolean |
| `reproduceEvery` | `2` | number; ≥ 0.5; ≤ 4 |
| `autoDoseA` | `"yes, but skip dose 4"` | `no, skip all dosing`, `yes, skip no doses`, `yes, but skip dose 2`, `yes, but skip dose 3`, `yes, but skip dose 4` |
| `autoDoseB` | `"yes, but skip dose 4"` | `no, skip all dosing`, `yes, skip no doses`, `yes, but skip dose 2`, `yes, but skip dose 3`, `yes, but skip dose 4` |
| `aDosage` | `50` | number; ≥ 50; ≤ 200 |
| `bDosage` | `50` | number; ≥ 50; ≤ 200 |
| `doseAEvery` | `4` | number; ≥ 4; ≤ 24 |
| `doseBEvery` | `4` | number; ≥ 4; ≤ 24 |
| `init3PoresA` | `4` | integer; ≥ 0; ≤ 16 |
| `init4PoresA` | `4` | integer; ≥ 0; ≤ 16 |
| `init5PoresA` | `4` | integer; ≥ 0; ≤ 16 |
| `init6PoresA` | `4` | integer; ≥ 0; ≤ 16 |
| `init3PoresB` | `4` | integer; ≥ 0; ≤ 16 |
| `init4PoresB` | `4` | integer; ≥ 0; ≤ 16 |
| `init5PoresB` | `4` | integer; ≥ 0; ≤ 16 |
| `init6PoresB` | `4` | integer; ≥ 0; ≤ 16 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setParameters`, `setFeverFactor`, `makeBacteria`, `canReproduce`, `reproduceBacteriaIntoAvailableSpace`, `moveBacteria`, `bacteriaDeath`, `doseRegion`, `autoDose`, `doseEachRegion`, `checkBounceOffWalls`, `killThisBacteria`, `checkAntibioticInteraction`, `moveAntibiotics`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `minutes`, `hours`, `days`, `antibioticFlowRate`, `feverFactor`, `dosesGivenToA`, `dosesGivenToB`, `aWipedOut`, `bWipedOut`, `bacteriaCountsRegionA`, `bacteriaCountsRegionB`, `bacteria`, `antibiotics`, `cells`.

The [UI binding](ui.ts) presents `Manual dose A`, `Manual dose B`, `Minutes`, `Hours`, `Days`, `Doses A`, `Doses B`, `Patients A and B`, `Patient ${region} pore counts`, `Population in ${region}` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `bacterial-infection` and links any shared checks.
