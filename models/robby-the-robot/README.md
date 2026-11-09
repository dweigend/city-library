# Robby the Robot

Robot genomes are evaluated in 20 fresh environments with 100 actions each before strategy selection and mutation. A score belongs to that evaluation budget and environment distribution, not an exhaustive guarantee of robot performance.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Robby the Robot`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/robby-the-robot/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `populationSize` | `100` | integer; ≥ 20; ≤ 500 |
| `mutationRate` | `0.01` | number; ≥ 0; ≤ 1 |
| `numberOfGenerations` | `100` | integer; ≥ 1; ≤ 1000 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `advanceToLimit`, `setTrial`, `trialStep`, `showEnvironment`, `showStrategies`, `state`, `executeAction`, `randomAction`, `distributeCans`, `crossover`, `calculatePopulationFitnesses`, `createNextGeneration`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `bestChromosome`, `bestFitness`, `displayBestId`, `stepCounter`, `visuals`, `robot`, `cans`, `cells`, `population`, `fitnessSummary`, `output`, `trail`.

The [UI binding](ui.ts) presents `Next population`, `Mutation probability`, `Generation limit`, `One generation to limit`, `Run to limit`, `View environment`, `Trial step`, `View strategies`, `Generation`, `Best fitness` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `robby-the-robot` and links any shared checks.
