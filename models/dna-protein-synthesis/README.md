# DNA Protein Synthesis

How does a change in DNA change the protein a cell makes? A DNA string is split into genes, each gene is transcribed into mRNA, and the mRNA is translated codon by codon into a chain of amino acids. You can pick one of the prepared strands with `initialDNAString` or write your own in `userCreatedCode`, then mutate it by substitution, insertion or deletion and compare the resulting proteins.

Things to try:

- Apply an insertion of one nucleotide with `mutationType` and compare the protein with the original.
- Repeat with three nucleotides (`nucleotidesAffected`). How is the result different from one?

## Use

Choose **DNA Protein Synthesis** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/dna-protein-synthesis/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialDNAString` | `"one-long-gene"` | 10 named choices; see `inputs.initialDNAString` |
| `userCreatedCode` | `"AAAAA"` | text |
| `nucleotidesAffected` | `1` | integer; ≥ 1; ≤ 6 |
| `mutationType` | `"substitution"` | `deletion`, `insertion`, `substitution` |
| `showGenes` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setupStartingDNA`, `setupDNAString`, `buildGenesFromDNA`, `makeANucleotideChainForDNAString`, `buildMRNAForEachGene`, `buildProteinFromMRNA`, `buildTRNAForThisTriplet`, `placeDNA`, `placeTRNAs`, `attachTag`, `visualizeAllGenes`, `hideGenes`, `hideMRNA`, `hideTRNA`, `showNextMRNA`, `showNextTRNA`, `displayUserMessageNoGenes`, `releaseNextProtein`, `makeProtein`, `releaseNextMRNAFromNucleus`, `moveMRNAMoleculesOutOfNucleus`, `resetCompletedEvents`, `transcribe`, `releaseMRNA`, `translate`, `releaseProtein`, `replicateDNA`, `makeDuplicateDNAString`, `randomBaseLetterDNA`, `replaceNonNucleotideCharacter`, `dnaStringWithNonNucleotideCharactersReplaced`, `complementaryMRNABase`, `mrnaStringFromDNAString`, `whichProteinForThisCodon`, `geneNumberForThisStrand`, `showInstruction`, `nextInstruction`, `previousInstruction`, `showProteinProduction`, `go`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `originalDNAString`, `duplicateDNAString`, `originalDisplayMRNACounter`, `duplicateDisplayMRNACounter`, `currentInstruction`, `instructionCount`, `message`, `completedEvents`, `triggeredEvents`, `originalGenes`, `duplicateGenes`, `mrnas`, `proteins`, `agents`, `cells`.

## Sources and limits

Adapted from the NetLogo *DNA Protein Synthesis* model by Novak and Wilensky (2012). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

This is a teaching representation. Protein folding, splicing and protein function are outside the model. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `dna-protein-synthesis`.
