# Prisoner's Dilemma Basic

Two one-shot choices select one of four configured payoff outcomes. The payoff ordering and player actions define the dilemma; there is no repeated-game learning hidden in this baseline.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Prisoner's Dilemma Basic`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/prisoners-dilemma-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

This is an answer-driven one-shot example. Set the silence choices and press Answer, or call `answer()`; `advance(n)` performs `n` answers. `tick` is the host’s answer counter (`rounds`), while `nativeTick` is `null`. Repeated answers do not add strategy memory or make this the iterated-dilemma model.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `youSilent` | `true` | boolean |
| `partnerSilent` | `false` | boolean |
| `partnerSilenceKnown` | `true` | boolean |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `answer`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `rounds`, `nativeTick`, `partnerIsSilent`, `years`, `face`, `message`.

The [UI binding](ui.ts) presents `Answer`, `Answers (no native clock)`, `Sentence (years)`, `Your jail time (years)`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `prisoners-dilemma-basic` and links the retained checks.
