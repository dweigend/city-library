# Elementary Cellular Automaton

How much variety can come from the simplest possible rule? A row of cells holds 0s and 1s. Each cell's next value depends on itself and its two neighbors: eight possible neighborhoods, each mapped to 0 or 1. Those eight bits form the rule number from 0 to 255. Each new generation is drawn as the next row, so the picture shows space across and time down.

Things to try:

- Compare rules 30, 90 and 110 from a single seed.
- Start from random cells (`initialization`) with the same rule. What stays the same?

## Use

Choose **Elementary Cellular Automaton** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/ca-1d-elementary/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each progress step writes one generation as a new display row. At the bottom, the run pauses unless `autoContinue` is enabled; use Continue (`continueRun()`) to carry the last row into a fresh display. Show rules replaces the simulation display and blocks progression until Setup single or Setup random initializes it again.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `257` | integer; ≥ 3; ≤ 501 |
| `height` | `129` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialization` | `"single"` | `single`, `random` |
| `density` | `10` | number; ≥ 0; ≤ 100 |
| `rule` | `105` | integer; ≥ 0; ≤ 255 |
| `autoContinue` | `false` | boolean |
| `foreground` | `55` | number; ≥ 0; ≤ 139.9 |
| `background` | `0` | number; ≥ 0; ≤ 139.9 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setupSingle`, `setupRandom`, `continueRun`, `setRules`, `setRuleBit`, `showRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `row`, `rulesShown`, `rules`, `cells`.

## Sources and limits

Adapted from the NetLogo *CA 1D Elementary* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The display mixes space and time; a pattern in it is not a spatial pattern in a single moment. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `ca-1d-elementary`.
