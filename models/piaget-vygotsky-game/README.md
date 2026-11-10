# Piaget-Vygotsky Game

Do people learn better on their own, from others or both? Players roll a marble toward a target and adjust their throw after each attempt. A Piagetian player learns from their own results, a Vygotskian player from better-scoring neighbors within their zone of proximal development (`zpd`), and a combined player does both; a random strategy is the baseline. `moveError` adds noise to every throw.

Things to try:

- Compare the strategies with the same seed and `randomizeStrategyEachRun` off.
- Set `zpd` to 0. Does the Vygotskian strategy still help?

## Use

Choose **Piaget-Vygotsky Game** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/piaget-vygotsky-game/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

One `advance(1)` completes one movement attempt, including the players’ internal move loops. `attemptCountPerRun` groups these attempts into runs. If `stopAfterEachRun` is enabled, use Next run (an explicit `advance()` call) to resume after `stopped`; a stopped run is not an unfinished individual move.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `playerCount` | `30` | integer; ≥ 10; ≤ 50 |
| `attemptCountPerRun` | `30` | integer; ≥ 1; ≤ 100 |
| `strategy` | `"vygotskiian"` | `random`, `piagetian`, `vygotskiian`, `piaget-vygotsky` |
| `randomizeStrategyEachRun` | `true` | boolean |
| `stopAfterEachRun` | `false` | boolean |
| `trails` | `true` | boolean |
| `zpd` | `15` | number; ≥ 0; ≤ 60 |
| `vygotskiianNeighborCount` | `4` | integer; ≥ 2; ≤ 18 |
| `moveError` | `4` | number; ≥ 0; ≤ 30 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `attemptCount`, `strategy`, `meanScore`, `players`, `cells`, `strategyAverages`, `results`.

## Sources and limits

Adapted from the NetLogo *Piaget-Vygotsky Game* model (© 2005 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Scores compare constructed learning rules; they do not validate a psychological theory or a teaching method. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `piaget-vygotsky-game`.
