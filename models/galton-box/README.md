# Galton Box

Balls fall through staggered pegs, make probabilistic left/right choices and accumulate in counters or piles. Collision and pile-up rules make this a finite mechanical sampling example rather than an abstract unlimited sequence of coin flips.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Galton Box`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/galton-box/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `numberOfRows` | `11` | integer; ≥ 1; ≤ 15 |
| `numberOfBalls` | `75` | integer; ≥ 1; ≤ 1000 |
| `chanceOfBouncingRight` | `50` | integer; ≥ 0; ≤ 100 |
| `pileUp` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`, `grid`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `balls`, `particles`, `pegs`, `counters`, `full`.

The [UI binding](ui.ts) presents `Bounce right (%)`, `Tick`, `Balls`, `State`, `Galton box`, `Counters`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `galton-box` and links the retained checks.
