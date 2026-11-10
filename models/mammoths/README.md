# Mammoths

What drives a large animal to extinction: hunting, a changing climate, or both? Mammoths and humans move, reproduce and die. Humans kill mammoths they meet with `oddsOfKilling`, and climate change turns land cells into changed terrain with `climateChangeDecayChance` per step. The model counts how many mammoths each cause has killed.

Things to try:

- Set `humanCount` to 0. Does climate change alone end the mammoths?
- Turn off climate change and compare how long the mammoths last under hunting alone.

## Use

Choose **Mammoths** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/mammoths/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `mammothCount` | `900` | integer; ≥ 0; ≤ 2000 |
| `humanCount` | `50` | integer; ≥ 0; ≤ 100 |
| `mammothBirthRate` | `2` | number; ≥ 0; ≤ 10 |
| `humanBirthRate` | `10` | number; ≥ 0; ≤ 20 |
| `mammothSpeed` | `0.2` | number; ≥ 0; ≤ 1 |
| `humanSpeed` | `0.3` | number; ≥ 0; ≤ 1 |
| `oddsOfKilling` | `12` | number; ≥ 1; ≤ 97 |
| `climateChangeDecayChance` | `0.003` | number; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `hasLandAhead`, `move`, `reproduce`, `density`, `climateChange`, `mammothsAct`, `humansAct`, `dieNaturally`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `years`, `humanKilledMammothCount`, `climateKilledMammothCount`, `mammoths`, `humans`, `cells`.

## Sources and limits

Adapted from the NetLogo *Mammoths* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Hunting and climate are stylized scenario mechanisms. Extinction in one run does not settle their historical contribution. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `mammoths`.
