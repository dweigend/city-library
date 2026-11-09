# Sex Ratio Equilibrium

Inherited reproductive tendencies change through biparental reproduction and demographic turnover. Adult sex counts and reproductive investment are distinct quantities; a near-balanced output is conditional on these inheritance and survival rules.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Sex Ratio Equilibrium`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/sex-ratio-equilibrium/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setParameters`, `makeIndividual`, `move`, `checkIfDead`, `searchForAnAdultPartner`, `reproduce`, `matingSuccess`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `adultAge`, `males`, `females`, `adultSexRatio`, `averageMaleChildChance`, `maleMatingSuccess`, `femaleMatingSuccess`, `adultSexRatioHistory`, `ageList`, `runningAverageAdultSexRatio`, `runningSdAdultSexRatio`.

The [UI binding](ui.ts) presents `Initial population`, `Initial male percentage`, `Initial male-child chance`, `Tick`, `Adult sex ratio (%)`, `Male-child chance`, `Running average`, `Running SD`, `Male mating success`, `Female mating success` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `sex-ratio-equilibrium` and links any shared checks.
