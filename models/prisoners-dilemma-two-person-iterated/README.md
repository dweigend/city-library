# Prisoner's Dilemma Two Person Iterated

Two strategies repeatedly choose cooperation or defection, retain memory and accumulate payoffs. The selected strategy pair and finite horizon determine the comparison; success against one opponent is not universal dominance.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Prisoner's Dilemma Two Person Iterated`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/prisoners-dilemma-two-person-iterated/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `humanStrategy` | `"act-randomly"` | `act-randomly`, `cooperate`, `defect`, `tit-for-tat`, `tit-for-two-tats`, `unforgiving`, `custom-strategy` |
| `computerStrategy` | `"tit-for-tat"` | `act-randomly`, `cooperate`, `defect`, `tit-for-tat`, `tit-for-two-tats`, `unforgiving`, `custom-strategy` |
| `selectComputerStrategy` | `true` | boolean |
| `displayHistory` | `true` | boolean |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `play`, `playARound`, `prepareNextRound`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `human`, `computer`, `hiddenStrategy`, `output`.

The [UI binding](ui.ts) presents `Play once`, `Round`, `Human score`, `Computer score`, `Players`, `Average score (includes initial 3)`, `Human`, `Computer`, `History`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `prisoners-dilemma-two-person-iterated` and links the retained checks.
