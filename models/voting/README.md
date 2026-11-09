# Voting

All cells count the old eight-neighbor votes before committing a binary next state, with optional tie and narrow-majority reversals. These local deterministic decisions omit electoral institutions and strategic human voting.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Voting`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/voting/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `151` | integer; ≥ 1; ≤ 201 |
| `height` | `151` | integer; ≥ 1; ≤ 201 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `changeVote` | `false` | boolean |
| `awardCloseCallsToLoser` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setVotes`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `counts`.

The [UI binding](ui.ts) presents `Tick`, `Blue`, `Green`, `Change vote if tied`, `Selected`, `Votes`.

## Sources and acceptance

Attribution and rights: [adaptation comments](model.ts) and the retained source notices. Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `voting` and links any shared checks.
