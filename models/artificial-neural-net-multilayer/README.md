# Multilayer Neural Network

What does a hidden layer add to a neural network? Two inputs pass through a small hidden layer with smooth (sigmoid) activations to one output. After each example, backpropagation adjusts all weights by `learningRate` to reduce the error against the chosen `targetFunction`.

Things to try:

- Train on `xor` and compare with the single-neuron Perceptron model.
- Change `learningRate`. How does the training error curve change?

## Use

Choose **Multilayer Neural Network** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/artificial-neural-net-multilayer/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `propagate`, `newActivation`, `backpropagate`, `trainExample`, `setParameters`, `setScenario`, `test`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `epochError`, `activations`, `errors`, `weights`, `nodes`, `edges`, `lastTest`.

## Sources and limits

Adapted from the NetLogo *Artificial Neural Net - Multilayer* model by Rand and Wilensky (2006). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Training error and a direct `test` are different observations. Fitting four examples does not show generalization. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `artificial-neural-net-multilayer`.
