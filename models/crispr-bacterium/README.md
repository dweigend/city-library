# CRISPR Bacterium

How can a bacterium remember viruses it has met? Inside one cell, a CRISPR array stores short viral sequences called spacers. RNA polymerase transcribes guide RNAs from the array, guide RNAs combine with Cas proteins, and these complexes search the cell for matching viral DNA to cut. New spacers can be added when the cell survives an infection. `infect`, `randomInfection` and `commonInfection` start infections on purpose.

Things to try:

- Infect the cell repeatedly with the same virus (`commonInfection`). Does the cell respond faster later?
- Lower `crisprFunction` and compare the outcome of an infection.

## Use

Choose **CRISPR Bacterium** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/crispr-bacterium/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialArraySize` | `15` | integer; ≥ 1; ≤ 30 |
| `maxVirusTypeCount` | `30` | integer; ≥ 1; ≤ 100 |
| `guideUnbindChance` | `5` | number; ≥ 0; ≤ 10 |
| `processivity` | `80` | number; ≥ 0; ≤ 100 |
| `crisprFunction` | `20` | number; ≥ 0; ≤ 100 |
| `labels` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `go`, `setParameters`, `infect`, `randomInfection`, `commonInfection`, `transcribe`, `goRNAPs`, `goCas9s`, `goGuideRNAs`, `goCasDimers`, `goViruses`, `move`, `wallAhead`, `degrade`, `infected`, `dnaFields`, `updateLabels`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `array`, `virusEvent`, `infected`, `followingId`, `rnapCount`, `cas9Count`, `guideCount`, `dimerCount`, `virusCount`, `agents`, `cells`, `edges`, `guideSequences`.

## Sources and limits

Adapted from the NetLogo *CRISPR Bacterium* model by Woods and Wilensky (2019). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Molecular machinery is compressed into moving agents and fixed chances. The model teaches the mechanism; it is not a quantitative molecular simulation. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `crispr-bacterium`.
