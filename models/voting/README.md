# Voting

Do local majorities settle into stable regions of agreement? Every cell holds one of two votes. In each step, all cells look at their eight neighbors at the same time and adopt the local majority. Two switches change the rule: `changeVote` makes a cell facing a tie switch its vote, and `awardCloseCallsToLoser` gives narrow majorities to the losing side.

The update rule itself is deterministic; only the initial votes are random.

Things to try:

- Run with both switches off until the map stops changing, then turn on `awardCloseCallsToLoser`. What happens to the borders?
- Use `setVotes` to draw a fixed pattern and step through it.

## Use

Choose **Voting** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/voting/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `151` | integer; ≥ 1; ≤ 201 |
| `height` | `151` | integer; ≥ 1; ≤ 201 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `changeVote` | `false` | boolean |
| `awardCloseCallsToLoser` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setVotes`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `counts`.

## Sources and limits

Adapted from the NetLogo *Voting* model by Wilensky (1998). Attribution and adaptation notes are in the comments of [model.ts](model.ts) and the retained source notices; the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Local majority rules leave out electoral institutions and strategic voting. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `voting`.
