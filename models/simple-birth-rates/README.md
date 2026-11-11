# Simple Birth Rates

How much does a small difference in fertility matter in a population with limited room? Red and blue individuals reproduce according to `redFertility` and `blueFertility`. Whenever the population exceeds `carryingCapacity`, every individual faces the same chance of dying, sized so that the population drops back to about that limit.

The question is how reliably the more fertile color takes over. In a finite population chance plays a part too, so a single run does not show a fixed outcome.

Things to try:

- Set `redFertility` one step above `blueFertility` and run several seeds. How many steps until one color disappears?
- Lower `carryingCapacity`. Does chance decide the winner more often in a small population?

## Use

Choose **Simple Birth Rates** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/simple-birth-rates/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `carryingCapacity` | `1000` | integer; ≥ 1; ≤ 4000 |
| `redFertility` | `2` | number; ≥ 0; ≤ 10 |
| `blueFertility` | `2` | number; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `advanceUntilRestart`, `initializePopulation`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `agents`, `output`.

## Sources and limits

Adapted from the NetLogo *Simple Birth Rates* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Colors are inherited types, not genes, and removal ignores age or condition. The model compares reproduction and random sampling; it is not a calibrated demographic forecast. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `simple-birth-rates`.
