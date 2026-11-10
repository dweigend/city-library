# Baldwin Effect

Organisms try to learn a successful phenotype before selection and reproduction update their inherited genes. Random and smart learning are distinct procedures; acquired phenotypes are not simply copied into the genotype.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Baldwin Effect`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/baldwin-effect/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numPop` | `200` | integer; ≥ 1; ≤ 500 |
| `geneLength` | `30` | integer; ≥ 1; ≤ 100 |
| `plasticity` | `0.5` | number; ≥ 0; ≤ 1 |
| `numTrials` | `20` | integer; ≥ 1; ≤ 100 |
| `mutationRate` | `5` | number; ≥ 0; ≤ 10 |
| `smoothness` | `0.15` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `produceGene`, `initPhenotype`, `randomLearn`, `smartLearn`, `select`, `reproduce`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `targetPhenotype`, `nonLearners`, `randomLearners`, `smartLearners`.

The [UI binding](ui.ts) presents `Generation`, `Fitness and inherited matches`, `Plastic alleles (%)`, `Correct inherited alleles (%)`, `Mean fitness`, `Genotype and learned phenotype`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `baldwin-effect` and links any shared checks.
