# Simple Genetic Algorithm

How do selection, crossover and mutation search for a solution? Each individual is a string of bits, and its fitness is the number of ones. Parents are picked by tournament, combined at one crossover point with `crossoverRate` and mutated with `mutationRate`. The target, all ones, is known in advance, so you can watch how fast the population gets there.

Things to try:

- Set `mutationRate` to 0 and then to a small value. Compare how diversity and best fitness develop.
- Raise `width`. How many more generations does the search need?

## Use

Choose **Simple Genetic Algorithm** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/simple-genetic-algorithm/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `width` | `100` | integer; ≥ 2; ≤ 1000 |
| `populationSize` | `100` | integer; ≥ 5; ≤ 200 |
| `crossoverRate` | `70` | integer; ≥ 0; ≤ 100 |
| `mutationRate` | `0` | number; ≥ 0; ≤ 10 |
| `plotDiversity` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `diversity`, `measurements`, `crossover`, `mutate`, `createNextGeneration`, `setParameters`, `setScenario`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `diversity`, `winner`, `population`.

## Sources and limits

Adapted from the NetLogo *Simple Genetic Algorithm* model by Stonedahl and Wilensky (2008). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Fitness is known by construction, so the model shows how the optimizer works, not a biological fitness landscape. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `simple-genetic-algorithm`.
