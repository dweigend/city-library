# Language Change

Networked speakers use individual copying, neighborhood thresholds or reward-based learning to change grammar use. The optional absorbing state and logistic response alter the dynamics; these interaction rules do not reconstruct an empirically fitted language history.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Language Change`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/language-change/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `numNodes` | `100` | integer; ≥ 2; ≤ 100 |
| `percentGrammar1` | `60` | number; ≥ 0; ≤ 100 |
| `updateAlgorithm` | `"individual"` | `individual`, `threshold`, `reward` |
| `thresholdVal` | `0.3` | number; ≥ 0; ≤ 1 |
| `sinkState1` | `true` | boolean |
| `logistic` | `true` | boolean |
| `alpha` | `0.025` | number; ≥ 0; ≤ 0.05 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `resetNodes`, `redistributeGrammars`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `nodes`, `edges`.

The [UI binding](ui.ts) presents `Language users`, `Grammar 1 on redistribution (%)`, `Learning rule`, `Threshold`, `Grammar 1 is a sink`, `Logistic speech bias`, `Reset states`, `Redistribute grammars`, `Tick`, `Mean grammar state` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `language-change` and links any shared checks.
