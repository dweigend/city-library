# Repressilator

Can three genes that switch each other off produce a regular rhythm? Three kinds of transcription factor each block the gene of the next one in a ring. Genes produce mRNA, mRNA produces transcription factors, and both decay with fixed chances. Factors bind and unbind the DNA, and a signal can trap them.

Molecular noise comes from the random creation, binding and decay of individual molecules.

Things to try:

- Change `tfDecayProb`. Do the three counts still take turns?
- Set `maxTFSynergy` to 1 and compare the regularity of the cycles.

## Use

Choose **Repressilator** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/repressilator-1d/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialTf0Count` | `0` | integer; ≥ 0; ≤ 200 |
| `initialTf1Count` | `0` | integer; ≥ 0; ≤ 200 |
| `initialTf2Count` | `0` | integer; ≥ 0; ≤ 200 |
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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `go`, `setParameters`, `initializeTF`, `initializeMRNA`, `setTFPosition`, `bindTFs`, `bindTF`, `bindTFToSignal`, `moveTFs`, `unbindTFs`, `unbindTF`, `unbindTFFromSignal`, `degradeTFs`, `degradeMRNAs`, `produceMRNAs`, `produceTFs`, `updateSignal`, `shouldSignalBeOn`, `tfCanBindGeneHere`, `tfCanBindSignal`, `tfCanInhibitGeneHere`, `getDNATFInhibits`, `getTFDNAIsInhibitedBy`, `countOtherMRNAsSameField`, `countOtherTFsSameColorSameField`, `nMRNAsProduced`, `nTFsProduced`, `meanOnDuration`, `meanOffDuration`, `harmonicMean`, `onOffHarmonicMean`, `onOffOptimFcn22`, `onOffOptimFcn1`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `tfCounts`, `mrnaCounts`, `genes`, `agents`, `signalOn`, `signalBound`, `completedSignalOnLength`, `completedSignalOffLength`, `signalOnLengths`, `signalOffLengths`, `meanOnDuration`, `meanOffDuration`, `onOffHarmonicMean`.

## Sources and limits

Adapted from the NetLogo *Repressilator 1D* model by Brandes and Wilensky (2020). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Counts and chances are illustrative and do not specify calibrated gene-expression kinetics. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `repressilator-1d`.
