# DNA Protein Synthesis

DNA strings are parsed into genes, transcribed into mRNA and translated through codons into protein chains. Sequence editing and instructional actions expose these steps, while folding, splicing and actual protein function remain outside the example.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `DNA Protein Synthesis`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/dna-protein-synthesis/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialDNAString` | `"1 long gene"` | 10 named choices; see `inputs.initialDNAString` |
| `userCreatedCode` | `"AAAAA"` | text |
| `nucleotidesAffected` | `1` | integer; ≥ 1; ≤ 6 |
| `mutationType` | `"substitution"` | `deletion`, `insertion`, `substitution` |
| `showGenes` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setupStartingDNA`, `setupDNAString`, `buildGenesFromDNA`, `makeANucleotideChainForDNAString`, `buildMRNAForEachGene`, `buildProteinFromMRNA`, `buildTRNAForThisTriplet`, `placeDNA`, `placeTRNAs`, `attachTag`, `visualizeAllGenes`, `hideGenes`, `hideMRNA`, `hideTRNA`, `showNextMRNA`, `showNextTRNA`, `displayUserMessageNoGenes`, `releaseNextProtein`, `makeProtein`, `releaseNextMRNAFromNucleus`, `moveMRNAMoleculesOutOfNucleus`, `resetCompletedEvents`, `transcribe`, `releaseMRNA`, `translate`, `releaseProtein`, `replicateDNA`, `makeDuplicateDNAString`, `randomBaseLetterDNA`, `replaceNonNucleotideCharacter`, `dnaStringWithNonNucleotideCharactersReplaced`, `complementaryMRNABase`, `mrnaStringFromDNAString`, `whichProteinForThisCodon`, `geneNumberForThisStrand`, `showInstruction`, `nextInstruction`, `previousInstruction`, `showProteinProduction`, `go`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `originalDNAString`, `duplicateDNAString`, `originalDisplayMRNACounter`, `duplicateDisplayMRNACounter`, `currentInstruction`, `instructionCount`, `message`, `completedEvents`, `triggeredEvents`, `originalGenes`, `duplicateGenes`, `mrnas`, `proteins`, `agents`, `cells`.

The [UI binding](ui.ts) presents `1. Transcribe`, `2. Release mRNA`, `3. Translate`, `4. Release protein`, `5. Replicate DNA`, `6. Transcribe copy`, `7. Release copy mRNA`, `8. Translate copy`, `9. Release copy protein`, `Protein output` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `dna-protein-synthesis` and links any shared checks.
