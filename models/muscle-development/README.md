# Muscle Development

Lifting, sleep and simplified hormonal responses change modeled muscle through time. The hormone variables are explanatory abstractions and do not define a personalized training prescription.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Muscle Development`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/muscle-development/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `daysBetweenWorkouts` | `5` | integer; ≥ 1; ≤ 30 |
| `hoursOfSleep` | `8` | number; ≥ 0; ≤ 12 |
| `intensity` | `95` | number; ≥ 50; ≤ 100 |
| `lift` | `true` | boolean |
| `slowTwitchFibers` | `50` | number; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `newMuscleFibers`, `regulateHormones`, `regulateMuscleFibers`, `performDailyActivity`, `liftWeights`, `sleep`, `grow`, `developMuscle`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `muscleMass`, `fibers`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `Muscle mass`, `Muscle Development`, `Muscle development`, `Mass / 100`, `Hormones`, `Anabolic`, `Catabolic`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `muscle-development` and links any shared checks.
