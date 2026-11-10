# Ethnocentrism

Agents cooperate differently with same- and different-group neighbors, then reproduce with inheritance and mutation alongside immigration. Payoffs and group labels are stipulated local rules rather than a causal explanation of human identity.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Ethnocentrism`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/ethnocentrism/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `setup` | `"empty"` | `empty`, `full` |
| `immigrantCountPerDay` | `1` | integer; ≥ 0; ≤ 100 |
| `initialPtr` | `0.12` | number; ≥ 0; ≤ 1 |
| `costOfGiving` | `0.01` | number; ≥ 0; ≤ 1 |
| `gainOfReceiving` | `0.03` | number; ≥ 0; ≤ 1 |
| `mutationRate` | `0.005` | number; ≥ 0; ≤ 1 |
| `deathRate` | `0.1` | number; ≥ 0; ≤ 1 |
| `immigrantChanceCooperateWithSame` | `0.5` | number; ≥ 0; ≤ 1 |
| `immigrantChanceCooperateWithDifferent` | `0.5` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setupEmpty`, `setupFull`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `agents`, `turn`, `cumulative`, `turnRatios`, `cumulativeRatios`, `last100Ratios`, `genotypes`, `genotypeMean`, `genotypePercent`, `last100`.

The [UI binding](ui.ts) presents `Initial population`, `Initial reproduction probability`, `Immigrant cooperation with same tag`, `Immigrant cooperation with different tag`, `Setup empty`, `Setup full`, `Tick`, `Population`, `Encounters`, `Cooperation` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `ethnocentrism` and links any shared checks.
