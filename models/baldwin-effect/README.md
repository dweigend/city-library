# Baldwin Effect

Can learning speed up evolution, even though learned traits are not inherited? Three groups share one population: non-learners, random learners and smart learners. Part of each organism's genes is fixed and part is left open for learning (`plasticity`). During its life, an organism gets `trialCount` attempts to find a good phenotype. Organisms that do well are more likely to reproduce, but they pass on only their genes, with `mutationRate`.

Things to try:

- Follow the counts of the three groups. Which group grows under the default settings, and does that change with `smoothness`?
- Set `plasticity` to 0 and compare how quickly the population improves.

## Use

Choose **Baldwin Effect** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/baldwin-effect/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `populationSize` | `200` | integer; ≥ 1; ≤ 500 |
| `geneLength` | `30` | integer; ≥ 1; ≤ 100 |
| `plasticity` | `0.5` | number; ≥ 0; ≤ 1 |
| `trialCount` | `20` | integer; ≥ 1; ≤ 100 |
| `mutationRate` | `5` | number; ≥ 0; ≤ 10 |
| `smoothness` | `0.15` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `produceGene`, `initPhenotype`, `randomLearn`, `smartLearn`, `select`, `reproduce`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `targetPhenotype`, `nonLearners`, `randomLearners`, `smartLearners`.

## Sources and limits

Adapted from the NetLogo *Baldwin Effect* model by Gurkan and Wilensky (2023). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Learned phenotypes are never copied into the genotype. The fitness landscape and learning rules are abstractions after a well-known computational study, not a model of a real species. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `baldwin-effect`.
