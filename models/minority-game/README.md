# Minority Game

Can agents learn to avoid the crowd? In each round, every player chooses one of two sides, and those on the smaller side win. Each player has `strategiesPerAgent` strategies that map the last `memory` outcomes to a choice. Players use their best-scoring strategy and keep scoring all their strategies on what would have happened.

Things to try:

- Change `memory` and compare how much the attendance on each side fluctuates.
- Give each player only one strategy. What changes?

## Use

Choose **Minority Game** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/minority-game/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `playerCount` | `501` | integer; ≥ 1; ≤ 1501 |
| `memory` | `6` | integer; ≥ 1; ≤ 12 |
| `strategiesPerAgent` | `5` | integer; ≥ 1; ≤ 10 |
| `colorBy` | `"success"` | `choice`, `success` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `diagnostic`, `fullHistory`, `minority`, `avgScore`, `stdevScore`, `zeroCount`, `agents`, `successHistogram`, `scoreHistory`.

## Sources and limits

Adapted from the NetLogo *Minority Game* model (© 2004 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Winning here depends on memory, crowd and payoff rules; it does not identify a good trading strategy. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `minority-game`.
