# Signaling Game

Can shared meaning arise without agreeing on it first? A sender sees one of `stateCount` states and sends one of `signalCount` signals; a receiver sees only the signal and guesses the state. Both draw from urns of counts, and a correct guess adds to the counts that were used, making the same choice more likely next time. The run stops once the chance of a correct guess passes 0.99.

Things to try:

- Use more signals than states. Do some signals stay unused?
- Use fewer signals than states. How high does the success rate get?

## Use

Choose **Signaling Game** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/signaling-game/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `stateCount` | `2` | integer; ≥ 2; ≤ 8 |
| `signalCount` | `2` | integer; ≥ 2; ≤ 8 |
| `printProbabilities` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `printProbabilities`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `probabilityOfSuccess`, `timesCorrect`, `timesWrong`, `successRate`, `lastRound`, `output`, `senderUrns`, `receiverUrns`, `senderProbabilities`, `receiverProbabilities`.

## Sources and limits

Adapted from the NetLogo *Signaling Game* model (© 2016 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The 0.99 stopping point is a model criterion, not an account of how human language began. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `signaling-game`.
