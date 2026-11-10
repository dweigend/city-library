# Binomial Rabbits

Weighted hop choices accumulate into rabbit displacements and a distribution on a wrapping world. Multiple hop patterns and finite populations mean that not every configuration is a literal binomial experiment.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Binomial Rabbits`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/binomial-rabbits/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `rabbitCount` | `2400` | integer; ≥ 1; ≤ 4000 |
| `hopCount` | `20` | integer; ≥ 0; ≤ 99 |
| `xScaling` | `1` | integer; ≥ 1; ≤ 10 |
| `hop1` | `1` | integer; ≥ -5; ≤ 5 |
| `hop2` | `-1` | integer; ≥ -5; ≤ 5 |
| `hop3` | `0` | integer; ≥ -5; ≤ 5 |
| `ratio1` | `1` | integer; ≥ 0; ≤ 10 |
| `ratio2` | `1` | integer; ≥ 0; ≤ 10 |
| `ratio3` | `0` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `goOneHop`, `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`, `grid`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `rabbits`, `mean`, `xScale`, `yScale`, `distribution`.

The [UI binding](ui.ts) presents `Rabbits`, `Hop 1`, `Ratio 1`, `Hop 2`, `Ratio 2`, `Hop 3`, `Ratio 3`, `Go one hop`, `Tick`, `Mean` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `binomial-rabbits` and links the retained checks.
