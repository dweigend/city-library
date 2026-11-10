# CA 1D Elementary

Eight binary three-cell neighborhoods select the next bit, and successive rows display time. Single-seed, random-seed and continuation actions preserve the distinction between spatial width and the displayed generation history.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `CA 1D Elementary`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/ca-1d-elementary/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each progress step writes one generation as a new display row. At the bottom, the run pauses unless `autoContinue` is enabled; use Continue (`continueRun()`) to carry the last row into a fresh display. Show rules replaces the simulation display and blocks progression until Setup single or Setup random initializes it again.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `257` | integer; ≥ 3; ≤ 501 |
| `height` | `129` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialization` | `"single"` | `single`, `random` |
| `density` | `10` | number; ≥ 0; ≤ 100 |
| `rule` | `105` | integer; ≥ 0; ≤ 255 |
| `autoContinue` | `false` | boolean |
| `foreground` | `55` | number; ≥ 0; ≤ 139.9 |
| `background` | `0` | number; ≥ 0; ≤ 139.9 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setupSingle`, `setupRandom`, `continueRun`, `setRules`, `setRuleBit`, `showRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `row`, `rulesShown`, `rules`, `cells`.

The [UI binding](ui.ts) presents `Setup single`, `Setup random`, `Continue`, `Show rules`, `Tick`, `Row`, `Rows`, `Rule table`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `ca-1d-elementary` and links any shared checks.
