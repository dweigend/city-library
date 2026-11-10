# Mendelian Inheritance

Why do offspring ratios look predictable over many births but surprising in a single litter? Choose a genotype for the male and the female mouse (`AA`, `Aa` or `aa`). Each offspring receives one randomly chosen allele from each parent, and its coat color follows from dominance. The model counts dark and light offspring per trial and over all trials.

Things to try:

- Cross two `Aa` parents several times. How far does a single litter stray from the expected ratio?
- Cross `AA` with `aa`. Can any light offspring appear?

## Use

Choose **Mendelian Inheritance** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/mendelian-inheritance/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Use Make F1 generation (`makeF1Generation()`) for a litter trial; `advance(...)` repeats that action until the mouse-count stop condition is reached. Clear F1 generation (`clearF1Generation()`) removes offspring so another trial can be made with the parents; Setup starts again from the configured parent genotypes.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `maleGenotype` | `"Aa"` | `AA`, `Aa`, `aa` |
| `femaleGenotype` | `"Aa"` | `AA`, `Aa`, `aa` |
| `offspringCount` | `6` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setParameters`, `makeF1Generation`, `clearF1Generation`, `displayGenotype`, `setLocation`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `trialNumber`, `mice`, `darkOffspringCount`, `lightOffspringCount`, `previousDarkOffspringCount`, `previousLightOffspringCount`, `darkRatioValue`, `lightRatioValue`, `selectedGenotype`, `message`.

## Sources and limits

Adapted from the NetLogo *Mendelian Inheritance* model by Dabholkar and Wilensky (2020). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

One gene with two alleles stands in for the much richer genetics of real coat color. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `mendelian-inheritance`.
