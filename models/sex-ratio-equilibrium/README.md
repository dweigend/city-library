# Sex Ratio Equilibrium

Why do so many species have about as many males as females? Each individual inherits a tendency to produce male or female offspring. Adults look for partners, mate with `matingChance`, give birth after `gestationPeriod` and die around `meanLongevity`. Offspring sex is drawn from the parents' inherited tendencies.

The model starts deliberately unbalanced (`initialAdultSexRatio`, `initialAverageMaleChildChance`), so you can watch whether the population moves toward balance.

Things to try:

- Start with a strong male surplus. How does the average male-child chance change over time?
- Lower `matingChance`. Does that change the outcome?

## Use

Choose **Sex Ratio Equilibrium** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/sex-ratio-equilibrium/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialPopulationSize` | `500` | integer; ≥ 0; ≤ 1000 |
| `initialAdultSexRatio` | `35` | integer; ≥ 0; ≤ 100 |
| `initialAverageMaleChildChance` | `0.4` | number; ≥ 0; ≤ 1 |
| `meanLongevity` | `60` | number; ≥ 0; ≤ 150 |
| `gestationPeriod` | `5` | integer; ≥ 0; ≤ 20 |
| `maximumLitterSize` | `6` | integer; ≥ 1; ≤ 10 |
| `matingChance` | `0.85` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setParameters`, `makeIndividual`, `move`, `checkIfDead`, `searchForAnAdultPartner`, `reproduce`, `matingSuccess`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `adultAge`, `males`, `females`, `adultSexRatio`, `averageMaleChildChance`, `maleMatingSuccess`, `femaleMatingSuccess`, `adultSexRatioHistory`, `ageList`, `runningAverageAdultSexRatio`, `runningSdAdultSexRatio`.

## Sources and limits

Adapted from the NetLogo *Sex Ratio Equilibrium* model by Dabholkar, Lee and Wilensky (2020). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Adult sex counts and reproductive investment are distinct quantities. Any balance that appears depends on these inheritance and survival rules. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `sex-ratio-equilibrium`.
