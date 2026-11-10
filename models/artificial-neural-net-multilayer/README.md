# Multilayer Neural Network

A small hidden layer propagates sigmoid activations and changes weights by backpropagation against the selected Boolean target. Training error and a direct test are separate observations; fitting these few examples does not establish generalization.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Multilayer Neural Network`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/artificial-neural-net-multilayer/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `learningRate` | `0.5` | number; ≥ 0; ≤ 1 |
| `examplesPerEpoch` | `500` | integer; ≥ 1; ≤ 1000 |
| `targetFunction` | `"xor"` | `or`, `xor` |
| `input1` | `1` | integer; ≥ 0; ≤ 1 |
| `input2` | `0` | integer; ≥ 0; ≤ 1 |
| `showWeights` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `propagate`, `newActivation`, `backpropagate`, `trainExample`, `setParameters`, `setScenario`, `test`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `epochError`, `activations`, `errors`, `weights`, `nodes`, `edges`, `lastTest`.

The [UI binding](ui.ts) presents `Test`, `Input 1`, `Input 2`, `Epoch`, `Epoch error`, `Output activation`, `Neural network`, `${n.kind}: ${n.activation.toFixed(2)}`, `Error vs. epochs`, `Mean squared error` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `artificial-neural-net-multilayer` and links any shared checks.
