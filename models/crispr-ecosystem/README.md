# CRISPR Ecosystem

How does adaptive immunity in bacteria change their competition with viruses? Bacteria eat, reproduce and carry CRISPR arrays of remembered virus types. Viruses infect bacteria with `infectionChance`, replicate and can change type. A bacterium whose array matches a virus can defend itself; spacers can be lost with `spacerLossChance`. Switch `crispr` off to compare with bacteria that have only innate protection.

Things to try:

- Compare `crispr` on and off with the same seed. How do the bacteria counts differ?
- Raise `maxVirusTypeCount`. Does adaptive memory still help?

## Use

Choose **CRISPR Ecosystem** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/crispr-ecosystem/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialBacteriumCount` | `50` | integer; ≥ 0; ≤ 100 |
| `initialVirusCount` | `250` | integer; ≥ 0; ≤ 1000 |
| `maxVirusTypeCount` | `50` | integer; ≥ 1; ≤ 100 |
| `infectionChance` | `5` | number; ≥ 0; ≤ 10 |
| `spacerLossChance` | `1` | number; ≥ 0; ≤ 2 |
| `crispr` | `true` | boolean |
| `plottedVirus` | `35` | integer; ≥ 0; ≤ 99 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setupWorld`, `setupVirusPlot`, `updateVirusPlot`, `plotNewVirus`, `focalVirusPercent`, `focalArrayPercent`, `averageArrayLength`, `stdDevArrayLength`, `randomPosition`, `moveBacteria`, `bacteriaEatFood`, `reproduceBacteria`, `spacerLoss`, `bacteriaLive`, `moveVirus`, `infect`, `replicate`, `maybeDegrade`, `virusesLive`, `replenishFood`, `growFood`, `go`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `plotVirus`, `focalVirusPercent`, `focalArrayPercent`, `averageArrayLength`, `stdDevArrayLength`, `virusSequences`, `arraySequences`, `arrayLengths`, `bacteriaCount`, `virusCount`, `coevolutionHistory`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *CRISPR Ecosystem* model by Woods and Wilensky (2019). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Encounter rules and rates are chosen assumptions, not fitted to a real microbial community. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `crispr-ecosystem`.
