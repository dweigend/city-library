# Anisogamy

Adults produce gametes whose size affects encounters and survival; fusion produces zygotes, which mature under carrying-capacity limits. The model exposes separate production, maturation and fusion procedures, and uses a variable tick increment rather than assuming one whole tick per sweep.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Anisogamy`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/anisogamy/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

`advance(1)` is one population-update sweep, not necessarily one integer tick. Read `tickAdvanceAmount` and `wholeTick` alongside `tick` when comparing gamete encounters and adult changes; a depleted population can end progression.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `maxAdultCount` | `100` | integer; ≥ 10; ≤ 500 |
| `worldSize` | `65` | integer; ≥ 1; ≤ 97 |
| `zygoteFitnessThreshold` | `0.45` | number; ≥ 0; ≤ 0.5 |
| `gameteFitnessThreshold` | `0` | number; ≥ 0; ≤ 0.51 |
| `mutationSigma` | `0.025` | number; ≥ 0; ≤ 0.1 |
| `speedSizeCorrelation` | `false` | boolean |
| `allowAssortativeFusion` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setParameters`, `restoreDefaultParameters`, `produceGametes`, `becomeAdult`, `enforceCarryingCapacity`, `fuseIfTouchingAnotherGamete`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `tickAdvanceAmount`, `wholeTick`, `cells`, `traitDistribution`, `adults`, `gametes`, `zygotes`.

The [UI binding](ui.ts) presents `Restore default parameters`, `Tick`, `Adults`, `Gametes`, `Zygotes`, `Tick advance`, `Adults, gametes and zygotes`, `Adult mating types`, `Gamete mating types`, `Mean gamete mass trait` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `anisogamy` and links any shared checks.
