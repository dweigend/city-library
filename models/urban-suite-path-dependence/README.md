# Firm Location Path Dependence

Does history decide where firms cluster? Firms move around and settle with a probability that depends on the local quality of a region and on how many firms are already there (`increasingReturns`). Different random histories can favor different locations. `disturb` lets you shake up a settled pattern.

Things to try:

- Run the same settings with several seeds. Do firms cluster in the same place each time?
- Set `increasingReturns` to 0 and compare.

## Use

Choose **Firm Location Path Dependence** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-path-dependence/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialFirmCount` | `200` | integer; ≥ 0; ≤ 1000 |
| `distribute` | `false` | boolean |
| `regionSize` | `0` | integer; ≥ 0; ≤ 5 |
| `increasingReturns` | `0.5` | number; ≥ 0; ≤ 1 |
| `attemptCount` | `1` | integer; ≥ 1; ≤ 20 |
| `birth` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `disturb`, `setFirms`, `setQualities`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `firms`, `counts`, `largestFirmCount`, `maxOccupantCount`, `winningAreas`, `histogram`, `warnings`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Path Dependence* model by Rand and Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

One run cannot tell how often lock-in happens; that needs many runs. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-path-dependence`.
