# Prisoner's Dilemma Basic

Why can two sensible choices lead to a bad result for both? You and a partner are questioned separately and each either stays silent or confesses. A fixed payoff table gives each of you a prison sentence for the four combinations. Choose your answer and the partner's (or let it be random when `partnerSilenceKnown` is off), then compare the sentences.

Things to try:

- Go through all four combinations. Which choice is better for you whatever the partner does?
- Compare that with the outcome when both stay silent.

## Use

Choose **Prisoner's Dilemma Basic** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/prisoners-dilemma-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

This is an answer-driven one-shot example. Set the silence choices and press Answer, or call `answer()`; `advance(n)` performs `n` answers. `tick` is the host’s answer counter (`roundCount`), while `nativeTick` is `null`. Repeated answers do not add strategy memory or make this the iterated-dilemma model.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `youSilent` | `true` | boolean |
| `partnerSilent` | `false` | boolean |
| `partnerSilenceKnown` | `true` | boolean |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `answer`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `roundCount`, `nativeTick`, `partnerIsSilent`, `years`, `face`, `message`.

## Sources and limits

Adapted from the NetLogo *Prisoner's Dilemma Basic* model by Wilensky (2002). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

This is a single round. There is no learning or memory here; the iterated version is a separate model. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `prisoners-dilemma-basic`.
