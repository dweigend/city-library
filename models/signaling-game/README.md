# Signaling Game

Senders and receivers draw from count-based urns mapping states to signals and signals to guesses; successful guesses reinforce both mappings. The run stops above a 0.99 success probability, which is a model criterion rather than a general account of language origin.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Signaling Game`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/signaling-game/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `numberOfStates` | `2` | integer; ≥ 2; ≤ 8 |
| `numberOfSignals` | `2` | integer; ≥ 2; ≤ 8 |
| `printProbabilities` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `printProbabilities`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `probabilityOfSuccess`, `timesCorrect`, `timesWrong`, `successRate`, `lastRound`, `output`, `senderUrns`, `receiverUrns`, `senderProbabilities`, `receiverProbabilities`.

The [UI binding](ui.ts) presents `States`, `Signals`, `Print probabilities`, `Tick`, `Probability of success`, `Correct`, `Wrong`, `Success rate`, `Current signal`, `Sender` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `signaling-game` and links any shared checks.
