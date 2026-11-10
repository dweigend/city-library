# Repressilator

Three transcription-factor types inhibit one another in a cyclic molecular system. Stochastic creation and degradation create the observed signal; these counts do not specify calibrated gene-expression kinetics.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Repressilator`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/repressilator-1d/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialTF0s` | `0` | integer; ≥ 0; ≤ 200 |
| `initialTF1s` | `0` | integer; ≥ 0; ≤ 200 |
| `initialTF2s` | `0` | integer; ≥ 0; ≤ 200 |
| `tfsPerMRNA` | `2` | number; ≥ 0; ≤ 10 |
| `maxTFSynergy` | `4` | number; ≥ 0; ≤ 4 |
| `mrnaDecayProb` | `0.25` | number; ≥ 0; ≤ 1 |
| `tfBindProb` | `0.975` | number; ≥ 0; ≤ 1 |
| `tfUnbindProb` | `0.355` | number; ≥ 0; ≤ 1 |
| `tfDecayProb` | `0.1` | number; ≥ 0; ≤ 1 |
| `signalTFBindProb` | `0.75` | number; ≥ 0; ≤ 1 |
| `signalTFUnbindProb` | `0.1` | number; ≥ 0; ≤ 1 |
| `signalDecayProb` | `0.2` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `go`, `setParameters`, `initializeTF`, `initializeMRNA`, `setTFPosition`, `bindTFs`, `bindTF`, `bindTFToSignal`, `moveTFs`, `unbindTFs`, `unbindTF`, `unbindTFFromSignal`, `degradeTFs`, `degradeMRNAs`, `produceMRNAs`, `produceTFs`, `updateSignal`, `shouldSignalBeOn`, `tfCanBindGeneHere`, `tfCanBindSignal`, `tfCanInhibitGeneHere`, `getDNATFInhibits`, `getTFDNAIsInhibitedBy`, `countOtherMRNAsSameField`, `countOtherTFsSameColorSameField`, `nMRNAsProduced`, `nTFsProduced`, `meanOnDuration`, `meanOffDuration`, `harmonicMean`, `onOffHarmonicMean`, `onOffOptimFcn22`, `onOffOptimFcn1`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `tfCounts`, `mrnaCounts`, `genes`, `agents`, `signalOn`, `signalBound`, `completedSignalOnLength`, `completedSignalOffLength`, `signalOnLengths`, `signalOffLengths`, `meanOnDuration`, `meanOffDuration`, `onOffHarmonicMean`.

The [UI binding](ui.ts) presents `Tick`, `Signal`, `Mean on duration`, `Mean off duration`, `Repressilator`, `Completed signal durations`, `History`, `On`, `Off`, `mRNA ${gene}` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `repressilator-1d` and links any shared checks.
