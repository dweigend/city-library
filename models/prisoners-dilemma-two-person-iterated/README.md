# Iterated Prisoner's Dilemma

Can cooperation last when the same two players meet again and again? Two players repeat the prisoner's dilemma. Each follows a strategy, for example `cooperate`, `defect`, `act-randomly` or `tit-for-tat`, and some strategies react to the opponent's earlier moves. Payoffs accumulate over the rounds.

Things to try:

- Play `tit-for-tat` against `act-randomly`, then against `defect`. Compare the scores.
- Let two reacting strategies play each other. Does cooperation hold?

## Use

Choose **Iterated Prisoner's Dilemma** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/prisoners-dilemma-two-person-iterated/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `humanStrategy` | `"act-randomly"` | `act-randomly`, `cooperate`, `defect`, `tit-for-tat`, `tit-for-two-tats`, `unforgiving`, `custom-strategy` |
| `computerStrategy` | `"tit-for-tat"` | `act-randomly`, `cooperate`, `defect`, `tit-for-tat`, `tit-for-two-tats`, `unforgiving`, `custom-strategy` |
| `selectComputerStrategy` | `true` | boolean |
| `displayHistory` | `true` | boolean |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `play`, `playARound`, `prepareNextRound`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `human`, `computer`, `hiddenStrategy`, `output`.

## Sources and limits

Adapted from the NetLogo *Prisoner's Dilemma Two Person Iterated* model by Wilensky (2002). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The result depends on the chosen pair and the number of rounds; beating one opponent is not general dominance. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `prisoners-dilemma-two-person-iterated`.
