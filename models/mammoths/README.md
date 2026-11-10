# Mammoths

Mammoth populations interact with hunters and changing environmental conditions. Hunting and climate are controlled scenario mechanisms; extinction in one simulation does not settle their historical contribution.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Mammoths`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/mammoths/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numberOfMammoths` | `900` | integer; ≥ 0; ≤ 2000 |
| `numberOfHumans` | `50` | integer; ≥ 0; ≤ 100 |
| `mammothBirthRate` | `2` | number; ≥ 0; ≤ 10 |
| `humanBirthRate` | `10` | number; ≥ 0; ≤ 20 |
| `mammothSpeed` | `0.2` | number; ≥ 0; ≤ 1 |
| `humanSpeed` | `0.3` | number; ≥ 0; ≤ 1 |
| `oddsOfKilling` | `12` | number; ≥ 1; ≤ 97 |
| `climateChangeDecayChance` | `0.003` | number; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `landAhead`, `move`, `reproduce`, `density`, `climateChange`, `mammothsAct`, `humansAct`, `dieNaturally`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `years`, `mammothsKilledByHumans`, `mammothsKilledByClimateChange`, `mammoths`, `humans`, `cells`.

The [UI binding](ui.ts) presents `Months`, `Years`, `Mammoths`, `Humans`, `Hunting deaths`, `Climate deaths`, `Americas habitat`, `Populations`, `Cause of mammoth deaths`, `Resident`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `mammoths` and links any shared checks.
