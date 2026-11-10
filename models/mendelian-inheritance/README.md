# Mendelian Inheritance

Selected parental mouse genotypes determine randomly sampled offspring alleles and coat colors. Expected dominant/recessive ratios apply across repeated births rather than to every small litter.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Mendelian Inheritance`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/mendelian-inheritance/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Use Make F1 generation (`makeF1Generation()`) for a litter trial; `advance(...)` repeats that action until the mouse-count stop condition is reached. Clear F1 generation (`clearF1Generation()`) removes offspring so another trial can be made with the parents; Setup starts again from the configured parent genotypes.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `maleGenotype` | `"Aa"` | `AA`, `Aa`, `aa` |
| `femaleGenotype` | `"Aa"` | `AA`, `Aa`, `aa` |
| `numberOfOffspring` | `6` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setParameters`, `makeF1Generation`, `clearF1Generation`, `displayGenotype`, `setLocation`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `trialNumber`, `mice`, `numberOfDarkOffspring`, `numberOfLightOffspring`, `previousNumberOfDarkOffspring`, `previousNumberOfLightOffspring`, `darkRatioValue`, `lightRatioValue`, `selectedGenotype`, `message`.

The [UI binding](ui.ts) presents `Male parent genotype`, `Female parent genotype`, `Offspring per trial`, `Make F1 generation`, `Clear F1 generation`, `Read genotype`, `Trial`, `Dark offspring`, `Light offspring`, `Dark ratio` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `mendelian-inheritance` and links any shared checks.
