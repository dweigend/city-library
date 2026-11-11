# Perceptron

Which logical functions can a single artificial neuron learn? Two inputs and a bias feed one output unit with a threshold. For each training example, the unit compares its output with the chosen `targetFunction` and adjusts its weights by `learningRate`. The decision boundary is a single straight line.

Things to try:

- Train on `and` or `or`, then on `xor`. Compare the training error.
- Use `test` with your own `input1` and `input2` after training.

## Use

Choose **Perceptron** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/artificial-neural-net-perceptron/model.ts";

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
| `targetFunction` | `"xor"` | `or`, `xor`, `and`, `nor`, `nand` |
| `input1` | `1` | number; ≥ -1; ≤ 1 |
| `input2` | `1` | number; ≥ -1; ≤ 1 |
| `showWeights` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `computeActivation`, `updateWeights`, `trainExample`, `decisionBoundary`, `setParameters`, `setScenario`, `test`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `epochError`, `activations`, `weights`, `nodes`, `edges`, `boundary`, `truthPoints`, `lastTest`.

## Sources and limits

Adapted from the NetLogo *Artificial Neural Net - Perceptron* model by Rand and Wilensky (2006). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

A single linear boundary cannot represent XOR, however long training runs. The model demonstrates that limit; it says nothing about larger networks. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `artificial-neural-net-perceptron`.
