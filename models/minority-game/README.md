# Minority Game

Agents select between two choices using remembered strategies and score the minority outcome. Strategy memory, crowd composition and payoff rules determine performance; winning does not establish a universally optimal trading strategy.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Minority Game`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/minority-game/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `501` | integer; ≥ 1; ≤ 1501 |
| `memory` | `6` | integer; ≥ 1; ≤ 12 |
| `strategiesPerAgent` | `5` | integer; ≥ 1; ≤ 10 |
| `colorBy` | `"success"` | `choice`, `success` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `diagnostic`, `fullHistory`, `minority`, `avgScore`, `stdevScore`, `zeroCount`, `agents`, `successHistogram`, `scoreHistory`.

The [UI binding](ui.ts) presents `Tick`, `History`, `Minority`, `Average score`, `Movement`, `Players`, `Scores`, `Success histogram`, `Success rate`, `Number picking zero` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `minority-game` and links any shared checks.
