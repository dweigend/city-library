# Piaget-Vygotsky Game

Players compare movement attempts under random, individual-improvement and neighbor-assisted strategies, with limits on error and the zone of proximal development. Scores compare these constructed learning rules rather than validate a psychological scale or educational intervention.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Piaget-Vygotsky Game`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/piaget-vygotsky-game/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

One `advance(1)` completes one movement attempt, including the players’ internal move loops. `attemptCountPerRun` groups these attempts into runs. If `stopAfterEachRun` is enabled, use Next run (an explicit `advance()` call) to resume after `stopped`; a stopped run is not an unfinished individual move.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `attempts`, `strategy`, `meanScore`, `players`, `cells`, `strategyAverages`, `results`.

The [UI binding](ui.ts) presents `Players`, `Next run`, `Tick`, `Attempt`, `Strategy`, `Mean distance`, `Target throws`, `Average distance from target`, `Strategy averages`, `Selected player`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `piaget-vygotsky-game` and links any shared checks.
