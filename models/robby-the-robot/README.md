# Robby the Robot

Can evolution find a good strategy that nobody programmed? Robby is a robot that collects cans on a grid. Its strategy is a lookup table that maps what it sees in its own and the four neighboring cells to an action. Each generation, every strategy is scored in 20 fresh environments of 100 actions each; better strategies are more likely to be crossed over, and offspring mutate with `mutationRate`.

Things to try:

- Follow the best fitness over `generationCount` generations with two seeds.
- Set `mutationRate` to 0. Does the population still improve?

## Use

Choose **Robby the Robot** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/robby-the-robot/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `populationSize` | `100` | integer; ≥ 20; ≤ 500 |
| `mutationRate` | `0.01` | number; ≥ 0; ≤ 1 |
| `generationCount` | `100` | integer; ≥ 1; ≤ 1000 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `advanceToLimit`, `setTrial`, `trialStep`, `showEnvironment`, `showStrategies`, `state`, `executeAction`, `randomAction`, `distributeCans`, `crossover`, `calculatePopulationFitnesses`, `createNextGeneration`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `bestChromosome`, `bestFitness`, `displayBestId`, `stepCounter`, `visuals`, `robot`, `cans`, `cells`, `population`, `fitnessSummary`, `output`, `trail`.

## Sources and limits

Adapted from the NetLogo *Robby the Robot* model by Mitchell, Tisue and Wilensky (2012). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

A score belongs to this evaluation budget and kind of environment; it does not guarantee performance elsewhere. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `robby-the-robot`.
