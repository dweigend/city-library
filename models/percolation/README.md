# Percolation

When can oil seep all the way through porous soil? Oil enters at the top and moves diagonally down between soil cells. Each cell it reaches takes oil with a chance set by `porosity`. The view scrolls down with the advancing front, so you can follow how deep the oil gets.

Things to try:

- Try `porosity` values around 50 to 70. When does the oil keep going?
- Compare several seeds at the same porosity.

## Use

Choose **Percolation** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/percolation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `150` | integer; ≥ 3; ≤ 300 |
| `height` | `221` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `porosity` | `60.5` | number; ≥ 0; ≤ 99 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setFront`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `currentRow`, `totalOil`, `counts`.

## Sources and limits

Adapted from the NetLogo *Percolation* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The finite grid and the entry geometry determine the result; this is not a groundwater flow model. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `percolation`.
