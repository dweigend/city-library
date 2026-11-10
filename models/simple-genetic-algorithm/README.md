# Simple Genetic Algorithm

Tournament selection, single-point crossover and mutation evolve bit strings toward the ALL-ONES target. Fitness is known by construction, so improvements illustrate the optimizer rather than an inferred biological fitness landscape.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Simple Genetic Algorithm`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/simple-genetic-algorithm/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `width` | `100` | integer; ≥ 2; ≤ 1000 |
| `populationSize` | `100` | integer; ≥ 5; ≤ 200 |
| `crossoverRate` | `70` | integer; ≥ 0; ≤ 100 |
| `mutationRate` | `0` | number; ≥ 0; ≤ 10 |
| `plotDiversity` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `diversity`, `measurements`, `crossover`, `mutate`, `createNextGeneration`, `setParameters`, `setScenario`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `diversity`, `winner`, `population`.

The [UI binding](ui.ts) presents `Genome width`, `Crossover rate (%)`, `Mutation rate (%)`, `Generation`, `Best fitness`, `Mean fitness`, `Worst fitness`, `Diversity`, `Best genome`, `Fitness` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `simple-genetic-algorithm` and links any shared checks.
