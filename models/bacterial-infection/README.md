# Bacterial Infection

How does antibiotic treatment change which bacteria survive? Bacteria in two regions, A and B, differ in how many pores their membrane has; more pores let more antibiotic in. Bacteria reproduce into free space, and antibiotic particles kill bacteria they enter. Each region can be dosed on its own schedule (`doseAEvery`, `aDosage`, `autoDoseA`, and the same for B), including skipped doses, and an optional fever slows reproduction in crowded regions.

Things to try:

- Give region A a complete schedule and region B one with skipped doses. Which pore types remain?
- Start region A with only six-pore bacteria. How does the outcome compare?

## Use

Choose **Bacterial Infection** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/bacterial-infection/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `reproduce` | `true` | boolean |
| `reproduceEvery` | `2` | number; ≥ 0.5; ≤ 4 |
| `autoDoseA` | `"skip-dose-4"` | `skip-all-doses`, `take-all-doses`, `skip-dose-2`, `skip-dose-3`, `skip-dose-4` |
| `autoDoseB` | `"skip-dose-4"` | `skip-all-doses`, `take-all-doses`, `skip-dose-2`, `skip-dose-3`, `skip-dose-4` |
| `aDosage` | `50` | number; ≥ 50; ≤ 200 |
| `bDosage` | `50` | number; ≥ 50; ≤ 200 |
| `doseAEvery` | `4` | number; ≥ 4; ≤ 24 |
| `doseBEvery` | `4` | number; ≥ 4; ≤ 24 |
| `initialThreePoreBacteriumCountA` | `4` | integer; ≥ 0; ≤ 16 |
| `initialFourPoreBacteriumCountA` | `4` | integer; ≥ 0; ≤ 16 |
| `initialFivePoreBacteriumCountA` | `4` | integer; ≥ 0; ≤ 16 |
| `initialSixPoreBacteriumCountA` | `4` | integer; ≥ 0; ≤ 16 |
| `initialThreePoreBacteriumCountB` | `4` | integer; ≥ 0; ≤ 16 |
| `initialFourPoreBacteriumCountB` | `4` | integer; ≥ 0; ≤ 16 |
| `initialFivePoreBacteriumCountB` | `4` | integer; ≥ 0; ≤ 16 |
| `initialSixPoreBacteriumCountB` | `4` | integer; ≥ 0; ≤ 16 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setParameters`, `setFeverFactor`, `makeBacteria`, `canReproduce`, `reproduceBacteriaIntoAvailableSpace`, `moveBacteria`, `bacteriaDeath`, `doseRegion`, `autoDose`, `doseEachRegion`, `checkBounceOffWalls`, `killThisBacteria`, `checkAntibioticInteraction`, `moveAntibiotics`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `minutes`, `hours`, `days`, `antibioticFlowRate`, `feverFactor`, `doseCountA`, `doseCountB`, `aWipedOut`, `bWipedOut`, `bacteriaCountsRegionA`, `bacteriaCountsRegionB`, `bacteria`, `antibiotics`, `cells`.

## Sources and limits

Adapted from the NetLogo *Bacterial Infection* model by Novak, Quigley and Wilensky (2016). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Pore count is a teaching stand-in for resistance, and the model is not calibrated to any pathogen, drug or dosing regimen. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `bacterial-infection`.
