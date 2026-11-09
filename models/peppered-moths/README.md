# Peppered Moths

Changing backgrounds alter the predation probabilities of moth color variants over successive reproduction. The background and survival rules illustrate selection, without reproducing a historical abundance series or the full genetics of melanism.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Peppered Moths`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/peppered-moths/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numMoths` | `100` | integer; ≥ 0; ≤ 200 |
| `speed` | `41` | number; ≥ 1; ≤ 100 |
| `mutation` | `15` | number; ≥ 0; ≤ 100 |
| `selection` | `50` | number; ≥ 0; ≤ 100 |
| `cyclePollution` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `polluteWorld`, `cleanUpWorld`, `cyclePollution`, `mothsMate`, `mothsGrimReaper`, `mothsGetEaten`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `darkness`, `darkening`, `envColor`, `pollutionPercent`, `lightMoths`, `mediumMoths`, `darkMoths`, `moths`, `cells`.

The [UI binding](ui.ts) presents `Pollute`, `Clean up`, `Tick`, `Light`, `Medium`, `Dark`, `Pollution (%)`, `Moths and pollution`, `Color populations`, `Moth`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `peppered-moths` and links any shared checks.
