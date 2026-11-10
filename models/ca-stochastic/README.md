# CA Stochastic

The eight binary neighborhoods each select a Bernoulli activation probability for the next row. Zero and one give deterministic transitions; intermediate probabilities change trajectories even with the same starting field.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `CA Stochastic`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/ca-stochastic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each progress step writes a sampled generation into the next row. Continue (`continueRun()`) carries the last row into a new display when it fills; `autoContinue` does this automatically, with an additional stop for the model’s recognized absorbing cases. Setup random and Setup example replace the initial condition.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `161` | integer; ≥ 5; ≤ 501 |
| `height` | `161` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `density` | `25` | number; ≥ 0; ≤ 100 |
| `OOO` | `0` | number; ≥ 0; ≤ 100 |
| `OOI` | `50` | number; ≥ 0; ≤ 100 |
| `OIO` | `50` | number; ≥ 0; ≤ 100 |
| `OII` | `50` | number; ≥ 0; ≤ 100 |
| `IOO` | `50` | number; ≥ 0; ≤ 100 |
| `IOI` | `50` | number; ≥ 0; ≤ 100 |
| `IIO` | `50` | number; ≥ 0; ≤ 100 |
| `III` | `0` | number; ≥ 0; ≤ 100 |
| `autoContinue` | `false` | boolean |
| `autoClear` | `true` | boolean |
| `plot` | `true` | boolean |
| `onColor` | `95` | number; ≥ 0; ≤ 139.9 |
| `offColor` | `0` | number; ≥ 0; ≤ 139.9 |
| `example` | `1` | integer; ≥ 1; ≤ 5 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setupRandom`, `continueRun`, `setRules`, `setupExample`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `row`, `absorbing`, `probabilities`, `entropy`, `cells`.

The [UI binding](ui.ts) presents `Setup random`, `Setup example`, `Continue`, `Tick`, `Row`, `Metric entropy`, `Topological entropy`, `Rows`, `Entropy`, `Topological` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `ca-stochastic` and links any shared checks.
